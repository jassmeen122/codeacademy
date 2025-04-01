
-- This SQL file is for manual execution in the Supabase dashboard
-- Create a bucket for post images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('post_images', 'post_images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow authenticated users to upload to this bucket
CREATE POLICY "Allow authenticated users to upload post images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'post_images')
ON CONFLICT DO NOTHING;

-- Create policy to allow public to view images
CREATE POLICY "Allow public to view post images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'post_images')
ON CONFLICT DO NOTHING;

-- Create policy to allow users to delete their own images
CREATE POLICY "Allow users to delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'post_images' AND (storage.foldername(name))[1] = auth.uid()::text)
ON CONFLICT DO NOTHING;
