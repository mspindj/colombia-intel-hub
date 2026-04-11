
INSERT INTO storage.buckets (id, name, public) VALUES ('content', 'content', true);

CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'content');

CREATE POLICY "Service role upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'content');

CREATE POLICY "Service role update" ON storage.objects FOR UPDATE USING (bucket_id = 'content');
