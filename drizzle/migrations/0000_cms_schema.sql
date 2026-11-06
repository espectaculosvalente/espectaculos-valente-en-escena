-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_team(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id)
$$;

CREATE POLICY "Users read own roles, admins read all" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- updated_at helper
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- Site texts (overrides of the built-in texts, per language)
CREATE TABLE public.site_texts (
  key text NOT NULL,
  lang text NOT NULL CHECK (lang IN ('gl','es','en')),
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (key, lang)
);
GRANT SELECT ON public.site_texts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_texts TO authenticated;
GRANT ALL ON public.site_texts TO service_role;
ALTER TABLE public.site_texts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads texts" ON public.site_texts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Team inserts texts" ON public.site_texts FOR INSERT TO authenticated WITH CHECK (public.is_team(auth.uid()));
CREATE POLICY "Team updates texts" ON public.site_texts FOR UPDATE TO authenticated USING (public.is_team(auth.uid())) WITH CHECK (public.is_team(auth.uid()));
CREATE POLICY "Team deletes texts" ON public.site_texts FOR DELETE TO authenticated USING (public.is_team(auth.uid()));
CREATE TRIGGER site_texts_touch BEFORE UPDATE ON public.site_texts FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Site images (photo slots)
CREATE TABLE public.site_images (
  key text PRIMARY KEY,
  url text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_images TO authenticated;
GRANT ALL ON public.site_images TO service_role;
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads images" ON public.site_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Team inserts images" ON public.site_images FOR INSERT TO authenticated WITH CHECK (public.is_team(auth.uid()));
CREATE POLICY "Team updates images" ON public.site_images FOR UPDATE TO authenticated USING (public.is_team(auth.uid())) WITH CHECK (public.is_team(auth.uid()));
CREATE POLICY "Team deletes images" ON public.site_images FOR DELETE TO authenticated USING (public.is_team(auth.uid()));
CREATE TRIGGER site_images_touch BEFORE UPDATE ON public.site_images FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Site settings (contact data, social links)
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Team inserts settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.is_team(auth.uid()));
CREATE POLICY "Team updates settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.is_team(auth.uid())) WITH CHECK (public.is_team(auth.uid()));
CREATE POLICY "Team deletes settings" ON public.site_settings FOR DELETE TO authenticated USING (public.is_team(auth.uid()));
CREATE TRIGGER site_settings_touch BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Shows (own productions, Música Valente, VALCONSA)
CREATE TABLE public.shows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('propia','musica','valconsa')),
  slug text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  category text,
  artist text,
  image_url text,
  gallery text[] NOT NULL DEFAULT '{}',
  video_url text,
  dossier_url text,
  press_url text,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kind, slug)
);
GRANT SELECT ON public.shows TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shows TO authenticated;
GRANT ALL ON public.shows TO service_role;
ALTER TABLE public.shows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published shows" ON public.shows FOR SELECT TO anon, authenticated USING (status = 'published' OR public.is_team(auth.uid()));
CREATE POLICY "Team inserts shows" ON public.shows FOR INSERT TO authenticated WITH CHECK (public.is_team(auth.uid()));
CREATE POLICY "Team updates shows" ON public.shows FOR UPDATE TO authenticated USING (public.is_team(auth.uid())) WITH CHECK (public.is_team(auth.uid()));
CREATE POLICY "Team deletes shows" ON public.shows FOR DELETE TO authenticated USING (public.is_team(auth.uid()));
CREATE TRIGGER shows_touch BEFORE UPDATE ON public.shows FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- People (Traxectorias)
CREATE TABLE public.people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  sort_order integer NOT NULL DEFAULT 0,
  photo_url text,
  links text,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.people TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.people TO authenticated;
GRANT ALL ON public.people TO service_role;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published people" ON public.people FOR SELECT TO anon, authenticated USING (status = 'published' OR public.is_team(auth.uid()));
CREATE POLICY "Team inserts people" ON public.people FOR INSERT TO authenticated WITH CHECK (public.is_team(auth.uid()));
CREATE POLICY "Team updates people" ON public.people FOR UPDATE TO authenticated USING (public.is_team(auth.uid())) WITH CHECK (public.is_team(auth.uid()));
CREATE POLICY "Team deletes people" ON public.people FOR DELETE TO authenticated USING (public.is_team(auth.uid()));
CREATE TRIGGER people_touch BEFORE UPDATE ON public.people FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Videos
CREATE TABLE public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  sort_order integer NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'trailer',
  url text,
  cover_url text,
  show_id uuid REFERENCES public.shows(id) ON DELETE SET NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.videos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.videos TO authenticated;
GRANT ALL ON public.videos TO service_role;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published videos" ON public.videos FOR SELECT TO anon, authenticated USING (status = 'published' OR public.is_team(auth.uid()));
CREATE POLICY "Team inserts videos" ON public.videos FOR INSERT TO authenticated WITH CHECK (public.is_team(auth.uid()));
CREATE POLICY "Team updates videos" ON public.videos FOR UPDATE TO authenticated USING (public.is_team(auth.uid())) WITH CHECK (public.is_team(auth.uid()));
CREATE POLICY "Team deletes videos" ON public.videos FOR DELETE TO authenticated USING (public.is_team(auth.uid()));
CREATE TRIGGER videos_touch BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Materials (dossiers, riders, press)
CREATE TABLE public.materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  sort_order integer NOT NULL DEFAULT 0,
  type text NOT NULL DEFAULT 'dossier',
  section text NOT NULL DEFAULT 'propia' CHECK (section IN ('propia','musica','valconsa')),
  show_id uuid REFERENCES public.shows(id) ON DELETE SET NULL,
  file_url text,
  cover_url text,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.materials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.materials TO authenticated;
GRANT ALL ON public.materials TO service_role;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published materials" ON public.materials FOR SELECT TO anon, authenticated USING (status = 'published' OR public.is_team(auth.uid()));
CREATE POLICY "Team inserts materials" ON public.materials FOR INSERT TO authenticated WITH CHECK (public.is_team(auth.uid()));
CREATE POLICY "Team updates materials" ON public.materials FOR UPDATE TO authenticated USING (public.is_team(auth.uid())) WITH CHECK (public.is_team(auth.uid()));
CREATE POLICY "Team deletes materials" ON public.materials FOR DELETE TO authenticated USING (public.is_team(auth.uid()));
CREATE TRIGGER materials_touch BEFORE UPDATE ON public.materials FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Contact messages
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  entity text CHECK (entity IS NULL OR char_length(entity) <= 160),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 200 AND email LIKE '%_@_%'),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 40),
  show_name text CHECK (show_name IS NULL OR char_length(show_name) <= 200),
  message text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 3000),
  lang text NOT NULL DEFAULT 'gl' CHECK (lang IN ('gl','es','en')),
  is_read boolean NOT NULL DEFAULT false
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone sends a message" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (is_read = false);
CREATE POLICY "Team reads messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.is_team(auth.uid()));
CREATE POLICY "Team updates messages" ON public.contact_messages FOR UPDATE TO authenticated USING (public.is_team(auth.uid())) WITH CHECK (public.is_team(auth.uid()));
CREATE POLICY "Team deletes messages" ON public.contact_messages FOR DELETE TO authenticated USING (public.is_team(auth.uid()));

-- Storage policies for the media bucket (bucket created separately)
CREATE POLICY "Team uploads media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.is_team(auth.uid()));
CREATE POLICY "Team updates media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.is_team(auth.uid()));
CREATE POLICY "Team deletes media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.is_team(auth.uid()));
