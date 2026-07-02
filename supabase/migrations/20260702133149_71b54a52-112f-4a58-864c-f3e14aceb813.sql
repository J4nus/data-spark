CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.connected_platform AS ENUM ('instagram', 'facebook', 'youtube');
CREATE TYPE public.account_status AS ENUM ('draft', 'connected', 'expired', 'revoked', 'error');
CREATE TYPE public.content_status AS ENUM ('idea', 'draft', 'scheduled', 'published', 'archived');
CREATE TYPE public.media_kind AS ENUM ('image', 'video', 'audio', 'document', 'other');

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  display_name text,
  avatar_url text,
  handle text,
  timezone text NOT NULL DEFAULT 'Europe/Prague',
  language text NOT NULL DEFAULT 'cs',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);
CREATE POLICY "Users can create their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = id);
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

CREATE TABLE public.connected_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  platform public.connected_platform NOT NULL,
  external_account_id text,
  account_name text NOT NULL,
  account_handle text,
  status public.account_status NOT NULL DEFAULT 'draft',
  scopes text[] NOT NULL DEFAULT '{}',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  connected_at timestamptz,
  expires_at timestamptz,
  last_synced_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, platform, external_account_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.connected_accounts TO authenticated;
GRANT ALL ON public.connected_accounts TO service_role;
ALTER TABLE public.connected_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own connected accounts"
ON public.connected_accounts
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_connected_accounts_updated_at
BEFORE UPDATE ON public.connected_accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.manual_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  body text,
  tags text[] NOT NULL DEFAULT '{}',
  note_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.manual_notes TO authenticated;
GRANT ALL ON public.manual_notes TO service_role;
ALTER TABLE public.manual_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own manual notes"
ON public.manual_notes
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_manual_notes_updated_at
BEFORE UPDATE ON public.manual_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  kind public.media_kind NOT NULL DEFAULT 'other',
  title text NOT NULL,
  storage_path text,
  external_url text,
  mime_type text,
  size_bytes bigint,
  width integer,
  height integer,
  duration_seconds numeric,
  tags text[] NOT NULL DEFAULT '{}',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (storage_path IS NOT NULL OR external_url IS NOT NULL)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own media assets"
ON public.media_assets
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_media_assets_updated_at
BEFORE UPDATE ON public.media_assets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  connected_account_id uuid REFERENCES public.connected_accounts(id) ON DELETE SET NULL,
  media_asset_id uuid REFERENCES public.media_assets(id) ON DELETE SET NULL,
  platform public.connected_platform,
  status public.content_status NOT NULL DEFAULT 'idea',
  title text NOT NULL,
  caption text,
  scheduled_for timestamptz,
  published_at timestamptz,
  external_post_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_items TO authenticated;
GRANT ALL ON public.content_items TO service_role;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own content items"
ON public.content_items
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_content_items_updated_at
BEFORE UPDATE ON public.content_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX connected_accounts_user_platform_idx ON public.connected_accounts (user_id, platform);
CREATE INDEX manual_notes_user_note_date_idx ON public.manual_notes (user_id, note_date DESC);
CREATE INDEX media_assets_user_kind_idx ON public.media_assets (user_id, kind);
CREATE INDEX content_items_user_status_idx ON public.content_items (user_id, status);
CREATE INDEX content_items_user_scheduled_for_idx ON public.content_items (user_id, scheduled_for);