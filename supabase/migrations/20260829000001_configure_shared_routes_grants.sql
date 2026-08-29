-- Supabase Migration: Configure table grants for shared_routes
-- Revokes all public access (anon, authenticated) and grants narrow SELECT, INSERT to service_role.

REVOKE ALL ON TABLE public.shared_routes FROM anon, authenticated;

GRANT SELECT, INSERT
ON TABLE public.shared_routes
TO service_role;
