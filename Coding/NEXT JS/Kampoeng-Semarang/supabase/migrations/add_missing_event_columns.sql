-- Migration: Add missing columns to events table
-- Run this in Supabase SQL Editor

-- Add category column
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Add location column
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS location TEXT;

-- Add start_time column
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS start_time TEXT;

-- Verify columns were added
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'events'
AND column_name IN ('category', 'location', 'start_time', 'is_featured')
ORDER BY column_name;
