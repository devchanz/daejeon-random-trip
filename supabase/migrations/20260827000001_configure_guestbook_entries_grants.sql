-- Supabase Migration: Configure table grants for guestbook_entries
-- Revokes all public access (anon, authenticated) and grants narrow SELECT, INSERT to service_role.

REVOKE ALL ON TABLE public.guestbook_entries FROM anon, authenticated;

GRANT SELECT, INSERT
ON TABLE public.guestbook_entries
TO service_role;
