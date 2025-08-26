-- Initial schema for Portfolio Website
-- This migration creates all the necessary tables and initial data

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for authentication (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profile table
CREATE TABLE public.profile (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    bio TEXT,
    email TEXT,
    github TEXT,
    linkedin TEXT,
    twitter TEXT,
    resume_url TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE public.projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    long_description TEXT,
    tech_stack TEXT[],
    image_url TEXT,
    github_url TEXT,
    live_url TEXT,
    featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills table
CREATE TABLE public.skills (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    proficiency INTEGER DEFAULT 0 CHECK (proficiency >= 0 AND proficiency <= 100),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE public.blog_posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    tags TEXT[],
    read_time INTEGER DEFAULT 5,
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE public.contact_messages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default profile
INSERT INTO public.profile (name, title, bio, email, github, linkedin) VALUES (
    'Your Name',
    'Full Stack Developer',
    'Passionate about building beautiful, functional web applications that solve real-world problems.',
    'your.email@example.com',
    'https://github.com',
    'https://linkedin.com'
);

-- Insert sample projects
INSERT INTO public.projects (title, description, tech_stack, featured, display_order) VALUES
('E-Commerce Platform', 'A full-stack e-commerce solution with real-time inventory management and payment processing.', ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe'], true, 1),
('Task Management App', 'Collaborative task management tool with real-time updates and team analytics.', ARRAY['React', 'Express', 'Socket.io', 'MongoDB'], true, 2),
('AI Content Generator', 'AI-powered content generation tool using OpenAI API for creative writing assistance.', ARRAY['Next.js', 'Python', 'FastAPI', 'OpenAI'], false, 3);

-- Insert sample skills
INSERT INTO public.skills (name, category, proficiency, display_order) VALUES
('React', 'Frontend', 90, 1),
('TypeScript', 'Frontend', 85, 2),
('Next.js', 'Frontend', 80, 3),
('Node.js', 'Backend', 88, 1),
('Express', 'Backend', 85, 2),
('Python', 'Backend', 75, 3),
('PostgreSQL', 'Database', 80, 1),
('MongoDB', 'Database', 75, 2),
('Redis', 'Database', 70, 3),
('Docker', 'DevOps', 75, 1),
('AWS', 'DevOps', 70, 2),
('CI/CD', 'DevOps', 65, 3);

-- Insert sample blog posts
INSERT INTO public.blog_posts (title, slug, excerpt, content, tags, published, featured) VALUES
('Building Scalable React Applications', 'building-scalable-react-apps', 'Learn the best practices for building large-scale React applications...', 'Full blog post content here...', ARRAY['React', 'JavaScript', 'Architecture'], true, true),
('PostgreSQL Performance Optimization', 'postgresql-performance', 'Deep dive into PostgreSQL query optimization and indexing strategies...', 'Full blog post content here...', ARRAY['PostgreSQL', 'Database', 'Performance'], true, false);

-- Create indexes for better performance
CREATE INDEX idx_projects_featured ON public.projects(featured);
CREATE INDEX idx_projects_display_order ON public.projects(display_order);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_skills_category ON public.skills(category);
CREATE INDEX idx_contact_messages_read ON public.contact_messages(read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profile_updated_at BEFORE UPDATE ON public.profile FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles: Users can only see their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Profile: Public read, authenticated write
CREATE POLICY "Profile is viewable by everyone" ON public.profile
    FOR SELECT USING (true);

CREATE POLICY "Profile is editable by authenticated users" ON public.profile
    FOR ALL USING (auth.role() = 'authenticated');

-- Projects: Public read, authenticated write
CREATE POLICY "Projects are viewable by everyone" ON public.projects
    FOR SELECT USING (true);

CREATE POLICY "Projects are editable by authenticated users" ON public.projects
    FOR ALL USING (auth.role() = 'authenticated');

-- Skills: Public read, authenticated write
CREATE POLICY "Skills are viewable by everyone" ON public.skills
    FOR SELECT USING (true);

CREATE POLICY "Skills are editable by authenticated users" ON public.skills
    FOR ALL USING (auth.role() = 'authenticated');

-- Blog posts: Public read, authenticated write
CREATE POLICY "Blog posts are viewable by everyone" ON public.blog_posts
    FOR SELECT USING (true);

CREATE POLICY "Blog posts are editable by authenticated users" ON public.blog_posts
    FOR ALL USING (auth.role() = 'authenticated');

-- Contact messages: Public insert, authenticated read
CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Contact messages are viewable by authenticated users" ON public.contact_messages
    FOR SELECT USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
