-- Portfolio Website Database Schema

-- Create database (run this first)
-- CREATE DATABASE portfolio_db;

-- Connect to the database and run the following:

-- Users table for authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profile table
CREATE TABLE profile (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(200),
    bio TEXT,
    email VARCHAR(100),
    github VARCHAR(255),
    linkedin VARCHAR(255),
    twitter VARCHAR(255),
    resume_url VARCHAR(255),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    long_description TEXT,
    tech_stack TEXT[],
    image_url VARCHAR(255),
    github_url VARCHAR(255),
    live_url VARCHAR(255),
    featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    proficiency INTEGER DEFAULT 0 CHECK (proficiency >= 0 AND proficiency <= 100),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts table
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    tags TEXT[],
    read_time INTEGER DEFAULT 5,
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages table
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default profile
INSERT INTO profile (name, title, bio, email, github, linkedin) VALUES (
    'Your Name',
    'Full Stack Developer',
    'Passionate about building beautiful, functional web applications that solve real-world problems.',
    'your.email@example.com',
    'https://github.com',
    'https://linkedin.com'
);

-- Insert sample projects
INSERT INTO projects (title, description, tech_stack, featured, display_order) VALUES
('E-Commerce Platform', 'A full-stack e-commerce solution with real-time inventory management and payment processing.', ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe'], true, 1),
('Task Management App', 'Collaborative task management tool with real-time updates and team analytics.', ARRAY['React', 'Express', 'Socket.io', 'MongoDB'], true, 2),
('AI Content Generator', 'AI-powered content generation tool using OpenAI API for creative writing assistance.', ARRAY['Next.js', 'Python', 'FastAPI', 'OpenAI'], false, 3);

-- Insert sample skills
INSERT INTO skills (name, category, proficiency, display_order) VALUES
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
INSERT INTO blog_posts (title, slug, excerpt, content, tags, published, featured) VALUES
('Building Scalable React Applications', 'building-scalable-react-apps', 'Learn the best practices for building large-scale React applications...', 'Full blog post content here...', ARRAY['React', 'JavaScript', 'Architecture'], true, true),
('PostgreSQL Performance Optimization', 'postgresql-performance', 'Deep dive into PostgreSQL query optimization and indexing strategies...', 'Full blog post content here...', ARRAY['PostgreSQL', 'Database', 'Performance'], true, false);

-- Create indexes for better performance
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_display_order ON projects(display_order);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_contact_messages_read ON contact_messages(read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profile_updated_at BEFORE UPDATE ON profile FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
