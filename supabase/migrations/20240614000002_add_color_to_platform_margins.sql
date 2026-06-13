-- Add color_code column to platform_margins table
ALTER TABLE public.platform_margins 
ADD COLUMN IF NOT EXISTS color_code TEXT NOT NULL DEFAULT '#E2E8F0';
