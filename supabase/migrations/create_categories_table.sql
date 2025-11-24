-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('product', 'event', 'both')),
    icon VARCHAR(50), -- Optional: icon name for UI
    color VARCHAR(20), -- Optional: color hex code for UI
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_categories_type ON public.categories(type);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to categories"
    ON public.categories FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated users to insert categories"
    ON public.categories FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update categories"
    ON public.categories FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete categories"
    ON public.categories FOR DELETE
    USING (auth.role() = 'authenticated');

-- Insert default categories for products
INSERT INTO public.categories (name, slug, description, type, icon, color) VALUES
    ('Fashion', 'fashion', 'Pakaian dan aksesoris tradisional', 'product', 'Shirt', '#EC4899'),
    ('Food', 'food', 'Makanan dan minuman khas', 'product', 'UtensilsCrossed', '#F59E0B'),
    ('Craft', 'craft', 'Kerajinan tangan dan seni', 'product', 'Palette', '#8B5CF6'),
    ('Souvenir', 'souvenir', 'Oleh-oleh dan cendera mata', 'product', 'Gift', '#10B981')
ON CONFLICT (slug) DO NOTHING;

-- Insert default categories for events
INSERT INTO public.categories (name, slug, description, type, icon, color) VALUES
    ('Festival', 'festival', 'Festival budaya dan seni', 'event', 'PartyPopper', '#EF4444'),
    ('Exhibition', 'exhibition', 'Pameran dan galeri', 'event', 'Image', '#3B82F6'),
    ('Workshop', 'workshop', 'Workshop dan pelatihan', 'event', 'GraduationCap', '#06B6D4'),
    ('Performance', 'performance', 'Pertunjukan seni dan musik', 'event', 'Music', '#A855F7')
ON CONFLICT (slug) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verify table was created
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'categories'
ORDER BY ordinal_position;
