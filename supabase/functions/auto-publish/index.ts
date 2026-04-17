import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PAGE_ID = "1068628786330276";
const IG_ACCOUNT_ID = "17841480006391349";
const STORAGE_BASE = "https://uocwxwvcrnkfnnoyjzyb.supabase.co/storage/v1/object/public/content";
const GRAPH_VERSION = "v21.0";

interface ContentRow {
  id: string;
  day: number;
  publish_date: string | null;
  platforms: string[];
  type: string; // 'image' | 'video' | 'text'
  image_file: string | null;
  video_file: string | null;
  caption: string;
  published: boolean | null;
  fb_post_id: string | null;
  ig_post_id: string | null;
}

type PlatformResult = { success: boolean; id?: string; error?: string };

function buildMediaUrl(row: ContentRow): string | undefined {
  if (row.type === "image" && row.image_file) {
    return `${STORAGE_BASE}/posts/${row.image_file}`;
  }
  if (row.type === "video" && row.video_file) {
    return `${STORAGE_BASE}/reels/${row.video_file}`;
  }
  return undefined;
}

async function publishToFacebook(
  token: string,
  row: ContentRow,
  mediaUrl: string | undefined
): Promise<{ id: string }> {
  let url: string;
  let body: Record<string, string>;

  if (row.type === "image" && mediaUrl) {
    url = `https://graph.facebook.com/${GRAPH_VERSION}/${PAGE_ID}/photos`;
    body = { url: mediaUrl, caption: row.caption, access_token: token };
  } else if (row.type === "video" && mediaUrl) {
    url = `https://graph.facebook.com/${GRAPH_VERSION}/${PAGE_ID}/videos`;
    body = { file_url: mediaUrl, description: row.caption, access_token: token };
  } else {
    url = `https://graph.facebook.com/${GRAPH_VERSION}/${PAGE_ID}/feed`;
    body = { message: row.caption, access_token: token };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (data.error) throw new Error(`FB: ${data.error.message}`);
  return { id: data.id || data.post_id };
}

async function pollIgContainerStatus(
  containerId: string,
  token: string,
  maxAttempts = 24,
  intervalMs = 5000
): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, intervalMs));
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${containerId}?fields=status_code,status&access_token=${token}`
    );
    const data = await res.json();
    if (data.error) throw new Error(`IG status: ${data.error.message}`);
    const code = data.status_code;
    if (code === "FINISHED") return;
    if (code === "ERROR" || code === "EXPIRED") {
      throw new Error(`IG container ${code}: ${data.status || "unknown"}`);
    }
    // IN_PROGRESS or PUBLISHED — keep polling
  }
  throw new Error("IG container timed out (max 120s)");
}

async function publishToInstagram(
  token: string,
  row: ContentRow,
  mediaUrl: string
): Promise<{ id: string }> {
  let containerBody: Record<string, string>;

  if (row.type === "video") {
    containerBody = {
      media_type: "REELS",
      video_url: mediaUrl,
      caption: row.caption,
      share_to_feed: "true",
      access_token: token,
    };
  } else {
    containerBody = {
      image_url: mediaUrl,
      caption: row.caption,
      access_token: token,
    };
  }

  const containerRes = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${IG_ACCOUNT_ID}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(containerBody),
    }
  );
  const containerData = await containerRes.json();
  if (containerData.error) throw new Error(`IG container: ${containerData.error.message}`);
  const containerId = containerData.id;

  // Poll for processing — required for Reels, harmless for images
  await pollIgContainerStatus(containerId, token);

  const publishRes = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${IG_ACCOUNT_ID}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creation_id: containerId, access_token: token }),
    }
  );
  const publishData = await publishRes.json();
  if (publishData.error) throw new Error(`IG publish: ${publishData.error.message}`);
  return { id: publishData.id };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST only" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  try {
    const token = Deno.env.get("META_PAGE_TOKEN");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!token || !supabaseUrl || !serviceKey) {
      return new Response(
        JSON.stringify({ error: "Missing required secrets (META_PAGE_TOKEN / SUPABASE_*)" }),
        { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // Parse body — support empty body for cron
    let body: { postId?: string } = {};
    try {
      const text = await req.text();
      if (text) body = JSON.parse(text);
    } catch {
      // ignore — treat as empty
    }

    // Fetch row: by id, or next unpublished
    let row: ContentRow | null = null;
    if (body.postId) {
      const { data, error } = await supabase
        .from("content_queue")
        .select("*")
        .eq("id", body.postId)
        .maybeSingle();
      if (error) throw new Error(`DB fetch: ${error.message}`);
      row = data as ContentRow | null;
      if (!row) {
        return new Response(
          JSON.stringify({ error: `Unknown postId: ${body.postId}` }),
          { status: 404, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
        );
      }
    } else {
      const { data, error } = await supabase
        .from("content_queue")
        .select("*")
        .eq("published", false)
        .order("publish_date", { ascending: true, nullsFirst: false })
        .order("day", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (error) throw new Error(`DB fetch: ${error.message}`);
      row = data as ContentRow | null;
      if (!row) {
        return new Response(
          JSON.stringify({ success: true, message: "Queue empty — nothing to publish" }),
          { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
        );
      }
    }

    if (row.published) {
      return new Response(
        JSON.stringify({ success: true, skipped: true, postId: row.id, reason: "already published" }),
        { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const mediaUrl = buildMediaUrl(row);
    const results: Record<string, PlatformResult> = {};

    if (row.platforms.includes("facebook")) {
      try {
        const fb = await publishToFacebook(token, row, mediaUrl);
        results.facebook = { success: true, id: fb.id };
      } catch (err) {
        results.facebook = { success: false, error: (err as Error).message };
      }
    }

    if (row.platforms.includes("instagram")) {
      if (!mediaUrl) {
        results.instagram = { success: false, error: "Instagram requires image or video" };
      } else {
        try {
          const ig = await publishToInstagram(token, row, mediaUrl);
          results.instagram = { success: true, id: ig.id };
        } catch (err) {
          results.instagram = { success: false, error: (err as Error).message };
        }
      }
    }

    // Determine overall success: every requested platform must have succeeded
    const requested = row.platforms.filter((p) => p === "facebook" || p === "instagram");
    const allOk = requested.every((p) => results[p]?.success);

    const fbId = results.facebook?.success ? results.facebook.id : null;
    const igId = results.instagram?.success ? results.instagram.id : null;
    const errorMsg = requested
      .filter((p) => !results[p]?.success)
      .map((p) => `${p}: ${results[p]?.error}`)
      .join(" | ") || null;

    const update: Record<string, unknown> = {};
    if (fbId) update.fb_post_id = fbId;
    if (igId) update.ig_post_id = igId;
    if (allOk) {
      update.published = true;
      update.published_at = new Date().toISOString();
      update.error = null;
    } else if (errorMsg) {
      update.error = errorMsg;
    }

    if (Object.keys(update).length > 0) {
      const { error: updateErr } = await supabase
        .from("content_queue")
        .update(update)
        .eq("id", row.id);
      if (updateErr) console.error("DB update failed:", updateErr.message);
    }

    return new Response(
      JSON.stringify({ success: allOk, postId: row.id, results }),
      { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message || "Auto-publish failed" }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
});
