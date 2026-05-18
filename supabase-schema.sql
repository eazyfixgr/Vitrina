-- Vitrina CMS Database Schema
-- Run this SQL in your Supabase SQL Editor

-- ============ CATEGORIES TABLE ============
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ PRODUCTS TABLE ============
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  price DECIMAL(10, 2),
  description TEXT,
  features TEXT,
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ SETTINGS TABLE ============
CREATE TABLE settings (
  id BIGINT PRIMARY KEY DEFAULT 1,
  site_name TEXT DEFAULT 'Το Κατάστημά μου',
  site_description TEXT DEFAULT 'Καλώς ήρθατε στο κατάστημά μας',
  logo_url TEXT,
  primary_color TEXT DEFAULT '#1e40af',
  secondary_color TEXT DEFAULT '#f59e0b',
  layout TEXT DEFAULT 'classic',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  address TEXT DEFAULT '',
  hero_title TEXT DEFAULT 'Καλώς ήρθατε',
  hero_subtitle TEXT DEFAULT 'Ανακαλύψτε τα προϊόντα μας',
  hero_image_url TEXT,
  show_hero BOOLEAN DEFAULT true,
  show_categories_on_home BOOLEAN DEFAULT true,
  facebook_url TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ INDEXES ============
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_code ON products(code);
CREATE INDEX idx_categories_slug ON categories(slug);

-- ============ AUTO-UPDATE UPDATED_AT ============
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============ INSERT DEFAULT SETTINGS ============
INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ============ STORAGE BUCKET ============
-- Run this in Supabase Dashboard > Storage:
-- Create a new bucket called 'images' (public bucket)

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
