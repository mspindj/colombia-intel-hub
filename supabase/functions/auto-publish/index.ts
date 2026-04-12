import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PAGE_ID = "1068628786330276";
const IG_ACCOUNT_ID = "17841480006391349";
const STORAGE_BASE = "https://uocwxwvcrnkfnnoyjzyb.supabase.co/storage/v1/object/public/content/posts";

interface ContentPost {
  platforms: string[];
  imageFile: string | null;
  caption: string;
}

const CONTENT_QUEUE: Record<string, ContentPost> = {
  "day2-taxi-image": {
    platforms: ["facebook", "instagram"],
    imageFile: "C2-02-Taxi.png",
    caption: "Airport taxi in Bogota.\n\nTourists pay $40.\nLocals pay $8.\n\nSame ride. Different knowledge.\n\nFree Arrival Cheat Sheet: megusta.com.co\n\n#ColombiaTravel #VisitColombia #BogotaTravel #MeGustaColombia #NoDarPapaya #TravelScam #AirportTaxi #ColombiaGuide #SoloTravelColombia #TravelSafety",
  },
  "day3-taxi-story": {
    platforms: ["facebook"],
    imageFile: null,
    caption: "It happens every single day at El Dorado airport.\n\nA tired traveler walks out of arrivals. A friendly guy says \"Taxi, amigo?\" and grabs their suitcase. Twenty minutes later, they're paying $40 for a ride that should cost $8.\n\nThe worst part? They don't even know they got scammed until a local tells them days later.\n\nThis is just ONE of 50+ situations we cover in the full 72-hour guide.\n\nFree Arrival Cheat Sheet: megusta.com.co",
  },
  "day4-phone-tip": {
    platforms: ["facebook", "instagram"],
    imageFile: "C4-04-Phone.png",
    caption: "Lost your phone in Colombia?\n\nDon't panic. Walk into any high-end hotel.\nAsk the lobby to call you a taxi.\n\nDo NOT flag one on the street while distressed.\n\nMore emergency intel in the full survival guide.\n\nmegusta.com.co\n\n#ColombiaTravel #TravelSafety #EmergencyTips #MeGustaColombia #BogotaTravel #MedellinTravel #CartagenaTravel #SoloTravelColombia",
  },
  "day5-bogota-face": {
    platforms: ["instagram"],
    imageFile: "C1-03-Eyes.png",
    caption: "The Bogota Face Protocol.\n\nRule 01: Eyes forward.\nNot scanning the ceiling. Not looking lost.\n\nBogota doesn't punish tourists for being foreign. It punishes them for being distracted.\n\nThis is from Chapter 1 of the Bogota Survival Vault.\n\nmegusta.com.co\n\n#BogotaTravel #ColombiaTravel #MeGustaColombia #NoDarPapaya #TravelTips #ColombiaGuide #SoloTravelColombia #DigitalNomadColombia",
  },
  "day6-reddit": {
    platforms: ["facebook"],
    imageFile: null,
    caption: "Reddit has 200 threads from 2019 about traveling to Colombia.\n\nWe have 9 chapters of current, city-specific intel.\n\nThe difference: Reddit is a research project. This is a briefing.\n\nRead it on your phone on the plane. No app, no internet needed.\n\n$17 per city. $37 for the Explorer Bundle (3 cities, save 27%).\n\nmegusta.com.co",
  },
  "day8-frontseat": {
    platforms: ["facebook", "instagram"],
    imageFile: "C3-03-Script.png",
    caption: "The Front Seat Script.\n\nIn Colombia, always sit in the front of the Uber.\n\nFist bump. Say \"Que mas, bien o que?\"\n\nSitting in back = \"I am a foreign client.\"\nSitting in front = \"I am a friend.\"\n\nmegusta.com.co\n\n#ColombiaTravel #MeGustaColombia #TravelHack #UberColombia #MedellinTravel #BogotaTravel #CartagenaTravel #NoDarPapaya #SoloTravelColombia",
  },
  "day10-gringo-food": {
    platforms: ["facebook", "instagram"],
    imageFile: "C2-03-Food.png",
    caption: "Lunch in El Poblado, Medellin.\n\nTourist pays: $22\nLocal pays: $8\n\nSame quality. Different neighborhood.\n\nFree Arrival Cheat Sheet with real prices: megusta.com.co\n\n#MedellinTravel #ColombiaTravel #GringoPrices #MeGustaColombia #FoodColombia #TravelBudget #DigitalNomadColombia #ElPoblado #SoloTravelColombia",
  },
  "day13-robbed": {
    platforms: ["facebook", "instagram"],
    imageFile: "C4-03-Robbed.png",
    caption: "If you are robbed in Colombia:\n\nDo not chase.\nDo not fight.\n\nAssets are replaceable.\nYou are not.\n\nFull emergency intel in every city guide.\n\nmegusta.com.co\n\n#ColombiaTravel #TravelSafety #EmergencyTips #MeGustaColombia #NoDarPapaya #SoloTravelColombia #BogotaTravel #MedellinTravel #CartagenaTravel",
  },
};

async function publishToFacebook(token: string, message: string, imageUrl?: string): Promise<{ id: string }> {
  let url: string;
  let body: Record<string, string>;
  if (imageUrl) {
    url = `https://graph.facebook.com/v21.0/${PAGE_ID}/photos`;
    body = { url: imageUrl, caption: message, access_token: token };
  } else {
    url = `https://graph.facebook.com/v21.0/${PAGE_ID}/feed`;
    body = { message, access_token: token };
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

async function publishToInstagram(token: string, caption: string, imageUrl: string): Promise<{ id: string }> {
  const containerRes = await fetch(
    `https://graph.facebook.com/v21.0/${IG_ACCOUNT_ID}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_url: imageUrl, caption, access_token: token }),
    }
  );
  const containerData = await containerRes.json();
  if (containerData.error) throw new Error(`IG container: ${containerData.error.message}`);
  const containerId = containerData.id;
  await new Promise((r) => setTimeout(r, 5000));
  const publishRes = await fetch(
    `https://graph.facebook.com/v21.0/${IG_ACCOUNT_ID}/media_publish`,
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
    if (!token) {
      return new Response(JSON.stringify({ error: "META_PAGE_TOKEN not configured" }), {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const { postId } = await req.json();
    if (!postId || !CONTENT_QUEUE[postId]) {
      return new Response(
        JSON.stringify({ error: `Unknown postId: ${postId}`, available: Object.keys(CONTENT_QUEUE) }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const post = CONTENT_QUEUE[postId];
    const imageUrl = post.imageFile ? `${STORAGE_BASE}/${post.imageFile}` : undefined;
    const results: Record<string, { success: boolean; id?: string; error?: string }> = {};

    if (post.platforms.includes("facebook")) {
      try {
        const fb = await publishToFacebook(token, post.caption, imageUrl);
        results.facebook = { success: true, id: fb.id };
      } catch (err) {
        results.facebook = { success: false, error: err.message };
      }
    }

    if (post.platforms.includes("instagram")) {
      if (!imageUrl) {
        results.instagram = { success: false, error: "Instagram requires an image" };
      } else {
        try {
          const ig = await publishToInstagram(token, post.caption, imageUrl);
          results.instagram = { success: true, id: ig.id };
        } catch (err) {
          results.instagram = { success: false, error: err.message };
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, postId, results }),
      { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Auto-publish failed" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
