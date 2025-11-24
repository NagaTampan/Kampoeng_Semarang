-- Migration: Add is_featured column to events table
-- Run this in Supabase SQL Editor if you haven't already

-- Check if column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'events' 
        AND column_name = 'is_featured'
    ) THEN
        ALTER TABLE public.events 
        ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
        
        RAISE NOTICE 'Column is_featured added to events table';
    ELSE
        RAISE NOTICE 'Column is_featured already exists';
    END IF;
END $$;

-- Optional: Set some events as featured for testing
-- UPDATE public.events SET is_featured = true WHERE id IN (
--     SELECT id FROM public.events LIMIT 2
-- );
