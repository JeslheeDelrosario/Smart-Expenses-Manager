-- Run this in your Supabase SQL Editor to add the new columns for income tracking
-- This adds support for:
-- 1. is_monthly: To distinguish regular monthly income from sideline/one-time income
-- 2. is_pending: To track income that's incoming but not yet received

ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS is_monthly BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_pending BOOLEAN DEFAULT false;

-- Update existing income entries to have proper defaults
UPDATE expenses 
SET is_monthly = false, is_pending = false 
WHERE category = 'Income' AND (is_monthly IS NULL OR is_pending IS NULL);