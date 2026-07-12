-- Onboarding now collects first/last name and country of residence for
-- every account (not just organizations, which already have `country` on
-- `organizations`). `profiles.full_name` stays in sync for display purposes;
-- first_name/last_name are the new source of truth written by the
-- onboarding Identity step.
alter table "public"."profiles"
  add column if not exists "first_name" text,
  add column if not exists "last_name" text,
  add column if not exists "country" text;
