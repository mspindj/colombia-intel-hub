The table and seed data already exist (per supabase-tables context and prior migrations). The remaining work is the auto-publish refactor + IG Reels fix + cron simplification. Let me check the current auto-publish state.

Looking at the current `supabase/functions/auto-publish/index.ts` shown in context — it still uses the hardcoded `CONTENT_QUEUE` object. The previous refactor attempt was cancelled before completion. So I need to fully refactor it.

## Plan

### 1. Verify state (already done)

- `content_queue` table exists with correct schema and RLS
- Seed data for `day4`, `day5`, `day8-phrases`, `day10-gringo-prices`, `day13-redflag` already inserted
- `META_PAGE_TOKEN`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` secrets configured
- Storage bucket `content` is public

### 2. Refactor `supabase/functions/auto-publish/index.ts`

Replace the entire file. New behavior:

**Input modes (both supported):**

- `{ "postId": "day4-phone-tip" }` → publish that specific row
- `{}` or no body → auto-pick next unpublished row ordered by `publish_date ASC NULLS LAST, day ASC` (this is what cron will use — no more rotating postIds manually)

**Flow:**

1. Init Supabase client with service role key
2. Fetch row from `content_queue` (by id OR next unpublished where `published = false`)
3. Skip if already `published = true` (return 200 with `{skipped: true}`)
4. Build media URL based on `type`:
  - `image` → `…/content/posts/{image_file}`
  - `video` → `…/content/reels/{video_file}`
  - `text` → no media
5. Publish per platform in `platforms[]`:
  - **Facebook image** → `/{PAGE_ID}/photos` with `url` + `caption`
  - **Facebook video** (Reels) → `/{PAGE_ID}/videos` with `file_url`, `description`
  - **Facebook text** → `/{PAGE_ID}/feed` with `message`
  - **Instagram image** → 2-step: `/media` (image_url) → poll status → `/media_publish`
  - **Instagram Reels (FIX)** → `/media` with `media_type=REELS` + `video_url` + `caption` + `share_to_feed=true`, then **poll** `GET /{containerId}?fields=status_code` until `FINISHED` (max ~60s, 5s intervals — videos need processing time, the 5s fixed sleep is what was broken), then `/media_publish`
6. Update DB row with results:
  - On success: `published=true`, `published_at=now()`, `fb_post_id`, `ig_post_id`
  - On failure: `error` field set with consolidated message; leave `published=false` so it can be retried/skipped manually

**Returns:** `{ success, postId, results: { facebook?: {...}, instagram?: {...} } }`

### 3. Update cron (instructional SQL for user to run)

Since cron jobs were already created with hardcoded `postId` per day, the user should drop those and replace with a single cron that calls auto-publish with empty body — the function will pick the next pending post automatically. Provide SQL for them to run in SQL editor:

```sql
-- Remove old per-day jobs
SELECT cron.unschedule('auto-publish-mon');
-- (and any other auto-publish-* jobs)

-- Single rotating job, 4×/week (Mon/Wed/Fri/Sun 14:00 UTC)
SELECT cron.schedule(
  'auto-publish-rotate',
  '0 14 * * 1,3,5,0',
  $$ SELECT net.http_post(
    url := 'https://uocwxwvcrnkfnnoyjzyb.supabase.co/functions/v1/auto-publish',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  ); $$
);
```

### 4. Test

Invoke `auto-publish` with `{"postId":"day4-phone-tip"}` (already has image in storage). Verify FB+IG post IDs returned and DB row updated.

### Files touched

- `supabase/functions/auto-publish/index.ts` — full rewrite (DB-driven + IG Reels polling fix)

### Files NOT touched

- DB migration (table + seed already done)
- `supabase/functions/meta-publish/index.ts` (separate function, unchanged)

-- Marcar los ya publicados para que el cron no los vuelva a publicar

UPDATE content_queue SET

  published = true,

  published_at = NOW(),

  fb_post_id = '122107384046983680',

  ig_post_id = '17911529208367006'

WHERE id = 'day4-phone-tip';

UPDATE content_queue SET

  published = true,

  published_at = NOW(),

  fb_post_id = '1068628786330276_122107384124983680',

  error = 'IG failed on original publish - fixed in new version'

WHERE id = 'reel-02-frontseat';