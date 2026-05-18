
-- ============ ENABLE RLS ON TABLES ============
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ============ RLS POLICIES FOR CATEGORIES ============
-- Allow public to view categories
CREATE POLICY "Allow public to view categories"
ON categories
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert categories
CREATE POLICY "Allow authenticated to insert categories"
ON categories
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update categories
CREATE POLICY "Allow authenticated to update categories"
ON categories
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete categories
CREATE POLICY "Allow authenticated to delete categories"
ON categories
FOR DELETE
TO authenticated
USING (true);

-- ============ RLS POLICIES FOR PRODUCTS ============
-- Allow public to view products
CREATE POLICY "Allow public to view products"
ON products
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert products
CREATE POLICY "Allow authenticated to insert products"
ON products
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update products
CREATE POLICY "Allow authenticated to update products"
ON products
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete products
CREATE POLICY "Allow authenticated to delete products"
ON products
FOR DELETE
TO authenticated
USING (true);

-- ============ RLS POLICIES FOR SETTINGS ============
-- Allow public to view settings
CREATE POLICY "Allow public to view settings"
ON settings
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert/update settings
CREATE POLICY "Allow authenticated to upsert settings"
ON settings
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated to update settings"
ON settings
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete settings
CREATE POLICY "Allow authenticated to delete settings"
ON settings
FOR DELETE
TO authenticated
USING (true);

-- ============ RLS POLICIES FOR STORAGE ============
-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Allow public to view images
CREATE POLICY "Allow public to view images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images');

-- Allow authenticated users to delete their images
CREATE POLICY "Allow authenticated deletes"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'images');
