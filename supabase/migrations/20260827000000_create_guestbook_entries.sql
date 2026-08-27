-- Supabase Migration: Create guestbook_entries table
-- Conforms to docs/DATA_MODEL.md section 3.1

CREATE TABLE IF NOT EXISTS guestbook_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  avatar_id VARCHAR(32) NOT NULL,
  nickname VARCHAR(12) NOT NULL,
  message VARCHAR(50) NOT NULL,
  route_id VARCHAR(64) NOT NULL,
  zone_id VARCHAR(32) NOT NULL,
  duration_type VARCHAR(16) NOT NULL,
  preference_type VARCHAR(16) NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'visible',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast retrieval of recent visible visitor log entries
CREATE INDEX IF NOT EXISTS idx_guestbook_entries_recent
  ON guestbook_entries (status, created_at DESC);

-- Explicitly enable Row Level Security (RLS)
-- Server-only access via SUPABASE_SERVICE_ROLE_KEY bypasses RLS; no public anon/authenticated policies
ALTER TABLE guestbook_entries ENABLE ROW LEVEL SECURITY;
