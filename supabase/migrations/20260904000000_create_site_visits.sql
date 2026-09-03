-- Supabase Migration: Create site_visits table
-- Append-only event log: one row per counted visit (one browser tab-session).
-- TOTAL VISIT = row count; TODAY = row count filtered by created_at (KST).

CREATE TABLE IF NOT EXISTS site_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast "since <timestamp>" counts (TODAY).
CREATE INDEX IF NOT EXISTS idx_site_visits_created_at
  ON site_visits (created_at);

-- Explicitly enable Row Level Security (RLS)
-- Server-only access via SUPABASE_SERVICE_ROLE_KEY bypasses RLS; no public anon/authenticated policies
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;
