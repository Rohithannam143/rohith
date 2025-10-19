-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Policy for user_roles table (admins can manage roles)
CREATE POLICY "Admins can manage roles" ON public.user_roles
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Drop existing permissive policies on all tables
DROP POLICY IF EXISTS "Allow all operations on blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow public read access to blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow all operations on certifications" ON public.certifications;
DROP POLICY IF EXISTS "Allow public read access to certifications" ON public.certifications;
DROP POLICY IF EXISTS "Allow all operations on contact_info" ON public.contact_info;
DROP POLICY IF EXISTS "Allow public read access to contact_info" ON public.contact_info;
DROP POLICY IF EXISTS "Allow all operations on education" ON public.education;
DROP POLICY IF EXISTS "Allow public read access to education" ON public.education;
DROP POLICY IF EXISTS "Allow all operations on hero" ON public.hero_section;
DROP POLICY IF EXISTS "Allow public read access to hero" ON public.hero_section;
DROP POLICY IF EXISTS "Allow all operations on projects" ON public.projects;
DROP POLICY IF EXISTS "Allow public read access to projects" ON public.projects;
DROP POLICY IF EXISTS "Allow all operations on services" ON public.services;
DROP POLICY IF EXISTS "Allow public read access to services" ON public.services;

-- Create secure policies: Public read, admin-only write
-- Blog posts
CREATE POLICY "Public read blog_posts" ON public.blog_posts
FOR SELECT USING (true);

CREATE POLICY "Admin write blog_posts" ON public.blog_posts
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Certifications
CREATE POLICY "Public read certifications" ON public.certifications
FOR SELECT USING (true);

CREATE POLICY "Admin write certifications" ON public.certifications
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Contact info
CREATE POLICY "Public read contact_info" ON public.contact_info
FOR SELECT USING (true);

CREATE POLICY "Admin write contact_info" ON public.contact_info
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Education
CREATE POLICY "Public read education" ON public.education
FOR SELECT USING (true);

CREATE POLICY "Admin write education" ON public.education
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Hero section
CREATE POLICY "Public read hero_section" ON public.hero_section
FOR SELECT USING (true);

CREATE POLICY "Admin write hero_section" ON public.hero_section
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Projects
CREATE POLICY "Public read projects" ON public.projects
FOR SELECT USING (true);

CREATE POLICY "Admin write projects" ON public.projects
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Services
CREATE POLICY "Public read services" ON public.services
FOR SELECT USING (true);

CREATE POLICY "Admin write services" ON public.services
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Secure storage bucket policies
-- Public read access for portfolio images
CREATE POLICY "Public read portfolio-images" ON storage.objects
FOR SELECT USING (bucket_id = 'portfolio-images');

-- Admin-only upload access
CREATE POLICY "Admin upload portfolio-images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'portfolio-images' AND
  public.has_role(auth.uid(), 'admin')
);

-- Admin-only update access
CREATE POLICY "Admin update portfolio-images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'portfolio-images' AND
  public.has_role(auth.uid(), 'admin')
);

-- Admin-only delete access
CREATE POLICY "Admin delete portfolio-images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'portfolio-images' AND
  public.has_role(auth.uid(), 'admin')
);