-- Create hero section table
CREATE TABLE public.hero_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create about/services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create certifications table
CREATE TABLE public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create education table
CREATE TABLE public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  year TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create portfolio/projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  live_url TEXT,
  github_url TEXT,
  tags TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'All',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create blog posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  category TEXT DEFAULT 'Development',
  read_time TEXT DEFAULT '5 min read',
  published_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create contact info table
CREATE TABLE public.contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  map_latitude DECIMAL(10, 8),
  map_longitude DECIMAL(11, 8),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- Create policies (public read, no authentication needed for viewing)
CREATE POLICY "Allow public read access to hero" ON public.hero_section FOR SELECT USING (true);
CREATE POLICY "Allow public read access to services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow public read access to certifications" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Allow public read access to education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Allow public read access to projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access to blog_posts" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read access to contact_info" ON public.contact_info FOR SELECT USING (true);

-- Admin can do everything (we'll use service role for admin operations from edge functions)
CREATE POLICY "Allow all operations on hero" ON public.hero_section FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on services" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on certifications" ON public.certifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on education" ON public.education FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on blog_posts" ON public.blog_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on contact_info" ON public.contact_info FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_hero_section_updated_at BEFORE UPDATE ON public.hero_section
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON public.contact_info
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data
INSERT INTO public.hero_section (title, subtitle, description) VALUES
('Turning Vision Into Reality With Code And Design.', 'Full-Stack Developer', 'As a skilled full-stack developer, I am dedicated to turning ideas into innovative web applications. Explore my latest projects and articles, showcasing my expertise in React.js and web development.');

INSERT INTO public.services (title, description, icon, order_index) VALUES
('Web Development', 'Building responsive and performant web applications using modern technologies and best practices.', 'Code', 1),
('UI/UX Design', 'Creating intuitive and beautiful user interfaces that provide excellent user experiences.', 'Palette', 2),
('Backend Development', 'Developing robust server-side applications and APIs with scalable architecture.', 'Server', 3),
('Database Design', 'Designing efficient database schemas and optimizing query performance.', 'Database', 4);

INSERT INTO public.education (degree, institution, year, description, order_index) VALUES
('B.Tech in Computer Science', 'Marri Laxman Reddy Institute of Technology and Management', '2022-2026', 'Specializing in Software Engineering and Full-Stack Development', 1);

INSERT INTO public.contact_info (email, phone, location, map_latitude, map_longitude) VALUES
('rohithannam81215@gmail.com', '+91 9121549560', 'Hyderabad, Telangana, India', 17.385044, 78.486671);

-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-images', 'portfolio-images', true);

-- Storage policies
CREATE POLICY "Public can view portfolio images" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-images');
CREATE POLICY "Anyone can upload portfolio images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-images');
CREATE POLICY "Anyone can update portfolio images" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio-images');
CREATE POLICY "Anyone can delete portfolio images" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio-images');