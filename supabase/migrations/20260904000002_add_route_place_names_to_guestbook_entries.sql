-- Supabase Migration: Add route_place_names to guestbook_entries
-- Additive, backward-compatible column: an immutable snapshot of the generated
-- route's place names (max 4), captured at submission time so a Memory Log
-- entry visibly differs from another entry with identical duration/preference.
-- Nullable -- existing rows are untouched (no backfill, none is possible: the
-- source RouteResult for historical entries was never persisted anywhere).

ALTER TABLE guestbook_entries
  ADD COLUMN IF NOT EXISTS route_place_names TEXT[] NULL;
