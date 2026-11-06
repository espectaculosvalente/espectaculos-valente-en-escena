CREATE POLICY "Team reads media" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'media' AND public.is_team(auth.uid()));