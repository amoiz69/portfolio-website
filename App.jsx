import React, { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Mail, ExternalLink, Calendar, Tag, ChevronDown } from 'lucide-react';
import { API_URL } from './src/config.js';

const Portfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [skills, setSkills] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  // Fetch data from backend
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Simulated data for now - will be replaced with actual API calls
      setProfile({
        name: 'Your Name',
        title: 'Full Stack Developer',
        bio: 'Passionate about building beautiful, functional web applications that solve real-world problems.',
        email: 'your.email@example.com',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        image: '/api/placeholder/200/200'
      });

      setProjects([
        {
          id: 1,
          title: 'E-Commerce Platform',
          description: 'A full-stack e-commerce solution with real-time inventory management and payment processing.',
          tech_stack: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
          image_url: '/api/placeholder/400/250',
          github_url: 'https://github.com',
          live_url: 'https://example.com',
          featured: true
        },
        {
          id: 2,
          title: 'Task Management App',
          description: 'Collaborative task management tool with real-time updates and team analytics.',
          tech_stack: ['React', 'Express', 'Socket.io', 'MongoDB'],
          image_url: '/api/placeholder/400/250',
          github_url: 'https://github.com',
          live_url: 'https://example.com',
          featured: true
        },
        {
          id: 3,
          title: 'AI Content Generator',
          description: 'AI-powered content generation tool using OpenAI API for creative writing assistance.',
          tech_stack: ['Next.js', 'Python', 'FastAPI', 'OpenAI'],
          image_url: '/api/placeholder/400/250',
          github_url: 'https://github.com',
          live_url: 'https://example.com',
          featured: false
        }
      ]);

      setBlogPosts([
        {
          id: 1,
          title: 'Building Scalable React Applications',
          slug: 'building-scalable-react-apps',
          excerpt: 'Learn the best practices for building large-scale React applications...',
          published_at: '2024-01-15',
          read_time: 5,
          tags: ['React', 'JavaScript', 'Architecture']
        },
        {
          id: 2,
          title: 'PostgreSQL Performance Optimization',
          slug: 'postgresql-performance',
          excerpt: 'Deep dive into PostgreSQL query optimization and indexing strategies...',
          published_at: '2024-01-10',
          read_time: 8,
          tags: ['PostgreSQL', 'Database', 'Performance']
        }
      ]);

      setSkills([
        { category: 'Frontend', items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'] },
        { category: 'Backend', items: ['Node.js', 'Express', 'Python', 'FastAPI'] },
        { category: 'Database', items: ['PostgreSQL', 'MongoDB', 'Redis'] },
        { category: 'DevOps', items: ['Docker', 'AWS', 'CI/CD', 'Kubernetes'] }
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'blog', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/90 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                {profile?.name?.split(' ')[0]}
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {['home', 'about', 'projects', 'blog', 'contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className={`capitalize transition-colors ${
                      activeSection === item
                        ? 'text-purple-400'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800 border-b border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {['home', 'about', 'projects', 'blog', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="capitalize block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-3xl mx-auto mt-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient">
            {profile?.name}
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 mb-6">{profile?.title}</p>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">{profile?.bio}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => scrollToSection('projects')}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all transform hover:-translate-y-1"
            >
              View My Work
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-8 py-3 border-2 border-purple-500 rounded-lg font-semibold hover:bg-purple-500/20 transition-all"
            >
              Get In Touch
            </button>
          </div>
          <div className="mt-12 animate-bounce">
            <ChevronDown size={32} className="mx-auto text-gray-400" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            About Me
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/api/placeholder/400/400"
                alt={profile?.name}
                className="rounded-2xl shadow-2xl shadow-purple-500/20"
              />
            </div>
            <div>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                I'm a passionate full-stack developer with expertise in building modern web applications. 
                I love turning complex problems into simple, beautiful, and intuitive solutions.
              </p>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                When I'm not coding, you can find me exploring new technologies, contributing to open-source 
                projects, or sharing my knowledge through blog posts and tutorials.
              </p>
              
              {/* Skills */}
              <div className="space-y-6">
                {skills.map((skillGroup) => (
                  <div key={skillGroup.category}>
                    <h3 className="text-xl font-semibold mb-3 text-purple-400">{skillGroup.category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-gray-800 rounded-full text-sm border border-gray-700 hover:border-purple-500 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.filter(p => p.featured).map((project) => (
              <div
                key={project.id}
                className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition-all transform hover:-translate-y-2"
              >
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Github size={20} />
                      Code
                    </a>
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <ExternalLink size={20} />
                      Live Demo
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Recent Blog Posts
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-gray-800 rounded-xl p-6 hover:shadow-2xl hover:shadow-purple-500/20 transition-all"
              >
                <h3 className="text-xl font-semibold mb-2 hover:text-purple-400 transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    {new Date(post.published_at).toLocaleDateString()}
                  </span>
                  <span>{post.read_time} min read</span>
                </div>
                <p className="text-gray-300 mb-4">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded text-sm"
                    >
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gray-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Let's Connect
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            I'm always interested in hearing about new opportunities and exciting projects.
            Feel free to reach out if you'd like to work together!
          </p>
          <div className="flex justify-center gap-6">
            <a
              href={`mailto:${profile?.email}`}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Mail size={20} />
              Email
            </a>
            <a
              href={profile?.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Github size={20} />
              GitHub
            </a>
            <a
              href={profile?.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Linkedin size={20} />
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="text-center text-gray-400">
          <p>&copy; 2024 {profile?.name}. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-size: 200% 200%; background-position: right center; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;