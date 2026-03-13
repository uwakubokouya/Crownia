-- Migration: Calendar & Favorites
-- 1. Add `is_favorite` to `customers` table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE;

-- 2. Create `calendar_events` table for manual calendar events
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for calendar_events
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can CRUD own calendar_events" ON calendar_events FOR ALL USING (auth.uid() = user_id);

-- Also update schema.sql to reflect this change
