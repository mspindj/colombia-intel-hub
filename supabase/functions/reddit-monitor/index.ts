import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const KEYWORDS = [
  "colombia travel", "colombia first time", "visiting colombia",
  "bogota tips", "medellin tips", "cartagena tourist",
  "colombia solo travel", "colombia safety", "colombia digital nomad",
  "moving to colombia", "colombia vacation",
];

interface RedditPost {
  title: string;
  url: string;
  subreddit: string;
  score: number;
  num_comments: number;
  created_utc: number;
  selftext: string;
  permalink: string;
}

async function getRedditToken(): Promise<string> {
  const clientId = Deno.env.get("REDDIT_CLIENT_ID")!;
  const clientSecret = Deno.env.get("REDDIT_CLIENT_SECRET")!;
  const username = Deno.env.get("REDDIT_USERNAME")!;
  const password = Deno.env.get("REDDIT_PASSWORD")!;
  const auth = btoa(`${clientId}:${clientSecret}`);
  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "MeGustaColombiaMonitor/1.0",
    },
    body: `grant_type=password&username=${username}&password=${password}`,
  });
  const data = await res.json();
  return data.access_token;
}

async function searchReddit(token: string, query: string): Promise<RedditPost[]> {
  const res = await fetch(
    `https://oauth.reddit.com/search?q=${encodeURIComponent(query)}&sort=new&t=day&limit=10`,
    {
      headers: {
        "Authorization": `Bearer ${token}`,
        "User-Agent": "MeGustaColombiaMonitor/1.0",
      },
    }
  );
  const data = await res.json();
  if (!data.data?.children) return [];
  return data.data.children.map((child: any) => ({
    title: child.data.title,
    url: `https://reddit.com${child.data.permalink}`,
    subreddit: child.data.subreddit_name_prefixed,
    score: child.data.score,
    num_comments: child.data.num_comments,
    created_utc: child.data.created_utc,
    selftext: child.data.selftext?.substring(0, 200) || "",
    permalink: child.data.permalink,
  }));
}

async function saveToNotion(posts: RedditPost[]): Promise<number> {
  const notionKey = Deno.env.get("NOTION_API_KEY")!;
  const databaseId = Deno.env.get("NOTION_REDDIT_DB_ID")!;
  let saved = 0;
  for (const post of posts) {
    const subredditMap: Record<string, string> = {
      "r/colombia": "r/colombia", "r/travel": "r/travel", "r/solotravel": "r/solotravel",
      "r/digitalnomad": "r/digitalnomad", "r/bogota": "r/bogota", "r/medellin": "r/medellin",
    };
    const subredditValue = subredditMap[post.subreddit] || post.subreddit;
    try {
      const res = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${notionKey}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({
          parent: { database_id: databaseId },
          properties: {
            "Title": { title: [{ text: { content: post.title.substring(0, 200) } }] },
            "URL": { url: post.url },
            "Subreddit": { select: { name: subredditValue } },
            "Score": { number: post.score },
            "Comments": { number: post.num_comments },
            "Found": { date: { start: new Date().toISOString().split("T")[0] } },
            "Responded": { checkbox: false },
            "Notes": { rich_text: [{ text: { content: post.selftext.substring(0, 200) } }] },
          },
        }),
      });
      if (res.ok) saved++;
    } catch (err) {
      console.error(`Failed to save post: ${post.title}`, err);
    }
  }
  return saved;
}

async function sendNotification(posts: RedditPost[]): Promise<void> {
  const brevoKey = Deno.env.get("BREVO_API_KEY");
  const notifyEmail = Deno.env.get("NOTIFY_EMAIL") || "hola@megusta.com.co";
  if (!brevoKey || posts.length === 0) return;
  const postList = posts
    .map((p) => `[${p.score} up ${p.num_comments} comments] ${p.subreddit}: ${p.title}\n  ${p.url}`)
    .join("\n\n");
  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "api-key": brevoKey,
    },
    body: JSON.stringify({
      sender: { name: "Me Gusta Bot", email: notifyEmail },
      to: [{ email: notifyEmail }],
      subject: `${posts.length} Reddit opportunities found`,
      textContent: `Reddit Monitor found ${posts.length} relevant posts:\n\n${postList}\n\nRespond to these at megusta.com.co`,
    }),
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  try {
    const token = await getRedditToken();
    const allPosts: RedditPost[] = [];
    const seenUrls = new Set<string>();
    for (const keyword of KEYWORDS) {
      const posts = await searchReddit(token, keyword);
      for (const post of posts) {
        if (!seenUrls.has(post.url) && post.score >= 2) {
          seenUrls.add(post.url);
          allPosts.push(post);
        }
      }
      await new Promise((r) => setTimeout(r, 200));
    }
    allPosts.sort((a, b) => b.score - a.score);
    const topPosts = allPosts.slice(0, 20);
    const saved = await saveToNotion(topPosts);
    await sendNotification(topPosts);
    return new Response(
      JSON.stringify({ success: true, found: allPosts.length, saved, top: topPosts.slice(0, 5).map((p) => ({ title: p.title, score: p.score, subreddit: p.subreddit })) }),
      { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Reddit monitor error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Monitor failed" }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
});
