CREATE TABLE public.content_queue (
  id TEXT PRIMARY KEY,
  day INTEGER NOT NULL,
  publish_date DATE,
  platforms TEXT[] NOT NULL,
  type TEXT NOT NULL,
  image_file TEXT,
  video_file TEXT,
  caption TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  fb_post_id TEXT,
  ig_post_id TEXT,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.content_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON public.content_queue
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Public read access" ON public.content_queue
  FOR SELECT USING (true);
