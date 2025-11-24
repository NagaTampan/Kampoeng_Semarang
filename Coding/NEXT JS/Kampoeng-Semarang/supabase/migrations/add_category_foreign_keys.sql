-- Migration: Add category_id foreign key to products and events tables
-- This allows proper relational database structure instead of storing category as text

-- Step 1: Add category_id column to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

-- Step 2: Add category_id column to events table
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

-- Step 3: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_events_category_id ON public.events(category_id);

-- Step 4: Migrate existing data (optional - map text categories to category_id)
-- This will try to match existing category text with category names

-- For products
UPDATE public.products p
SET category_id = c.id
FROM public.categories c
WHERE LOWER(p.category) = LOWER(c.name)
AND c.type IN ('product', 'both')
AND p.category_id IS NULL;

-- For events
UPDATE public.events e
SET category_id = c.id
FROM public.categories c
WHERE LOWER(e.category) = LOWER(c.name)
AND c.type IN ('event', 'both')
AND e.category_id IS NULL;

-- Step 5: Keep the old category column for backward compatibility
-- You can drop it later after confirming everything works:
-- ALTER TABLE public.products DROP COLUMN IF EXISTS category;
-- ALTER TABLE public.events DROP COLUMN IF EXISTS category;

-- Verify the changes
SELECT 
    'products' as table_name,
    COUNT(*) as total_rows,
    COUNT(category_id) as rows_with_category_id,
    COUNT(*) - COUNT(category_id) as rows_without_category_id
FROM public.products
UNION ALL
SELECT 
    'events' as table_name,
    COUNT(*) as total_rows,
    COUNT(category_id) as rows_with_category_id,
    COUNT(*) - COUNT(category_id) as rows_without_category_id
FROM public.events;
