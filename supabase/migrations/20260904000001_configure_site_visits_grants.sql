-- Supabase Migration: Configure table grants for site_visits
-- Revokes all public access (anon, authenticated) and grants narrow SELECT, INSERT to service_role.

REVOKE ALL ON TABLE public.site_visits FROM anon, authenticated;

GRANT SELECT, INSERT
ON TABLE public.site_visits
TO service_role;
