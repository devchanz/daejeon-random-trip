-- Supabase Migration: Create shared_routes table
-- Conforms to docs/DATA_MODEL.md section 3.2

CREATE TABLE IF NOT EXISTS shared_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_code VARCHAR(16) NOT NULL UNIQUE,
  source_route_id VARCHAR(64) NOT NULL UNIQUE,
  zone_id VARCHAR(32) NOT NULL,
  duration_type VARCHAR(16) NOT NULL,
  preference_type VARCHAR(16) NOT NULL,
  title VARCHAR(100) NOT NULL,
  stops JSONB NOT NULL,
  mission VARCHAR(255),
  estimated_total_minutes INT NOT NULL,
  schema_version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Explicitly enable Row Level Security (RLS)
-- Server-only access via SUPABASE_SERVICE_ROLE_KEY bypasses RLS; no public anon/authenticated policies
ALTER TABLE shared_routes ENABLE ROW LEVEL SECURITY;
