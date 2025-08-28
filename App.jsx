import React, { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Mail, ExternalLink, Calendar, Tag, ChevronDown } from 'lucide-react';
import { portfolioAPI } from './src/lib/supabase.js';

const Portfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [skills, setSkills] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  const toExternalUrl = (url) => {
    if (!url || typeof url !== 'string') return '#';
    const trimmed = url.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed.replace(/^\/*/, '')}`;
  };

  // Fetch data from backend
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileData, projectsData, postsData, skillsData] = await Promise.all([
        portfolioAPI.getProfile(),
        portfolioAPI.getProjects(),
        portfolioAPI.getBlogPosts(),
        portfolioAPI.getSkills()
      ]);

      setProfile(profileData);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setBlogPosts(Array.isArray(postsData) ? postsData : []);

      // Group flat skills into { category, items: [] }
      const groupedSkillsMap = new Map();
      (Array.isArray(skillsData) ? skillsData : []).forEach((s) => {
        const key = s.category || 'Other';
        if (!groupedSkillsMap.has(key)) groupedSkillsMap.set(key, []);
        groupedSkillsMap.get(key).push(s.name);
      });
      const groupedSkills = Array.from(groupedSkillsMap.entries()).map(([category, items]) => ({ category, items }));
      setSkills(groupedSkills);

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
      const sections = ['home', 'works', 'story', 'process', 'connect'];
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
      <nav className="fixed top-0 w-full bg-transparent z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="relative flex items-center justify-center h-16">
              {/* Desktop Navigation - Daniel Sun Style */}
              <div className="hidden md:flex">
                <div className="px-6 py-2 rounded-[80px] bg-black/75 backdrop-blur-md shadow-lg">
                                  <div className="flex items-center space-x-8">
                  {/* Sun Icon/Logo */}
                  <a 
                    href="#home" 
                    onClick={() => scrollToSection('home')}
                    className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-white/65"
                    >
                      <path 
                        d="M 7.081 18.931 C 15.273 19.853 19.843 13.955 17.88 10.023 C 12.609 -0.53 -1.763 19.87 11.928 17.902 M 2.754 12.66 L 2.737 12.66 C 2.555 12.66 1.857 12.66 1.034 12.727 M 4.545 18.931 C 4.162 19.13 2.673 20.281 2.346 20.5 M 11.503 22 L 11.212 23 M 14.294 1.224 C 14.053 2.28 13.894 3.229 13.894 3.486 M 18.545 6.727 C 18.744 6.529 21.062 4.617 22.648 3.486 M 21.379 11.313 C 21.379 11.313 21.952 11.202 22.648 11.105 M 18.545 17.902 C 19.272 18.273 20.483 19.363 20.996 20.009 M 2.09 2.091 C 4.908 3.486 6.727 5.545 7.454 6.909" 
                        fill="transparent" 
                        strokeWidth="1.64" 
                        stroke="currentColor" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>

                  {/* Navigation Links */}
                  {[
                    { id: 'story', label: 'Story' },
                    { id: 'works', label: 'Work' },
                    { id: 'process', label: 'Process' },
                    { id: 'connect', label: 'Connect' }
                  ].map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(item.id);
                      }}
                      className="text-white/60 hover:text-white transition-colors font-medium text-xl font-inter-display"
                    >
                      {item.label}
                    </a>
                  ))}

                  {/* Start Project Button */}
                  <a
                    href={`mailto:${profile?.email || 'hello@example.com'}`}
                    className="px-5 py-2 rounded-[32px] bg-purple-500/15 border border-purple-500/20 hover:bg-purple-500/25 transition-colors"
                  >
                    <span className="text-purple-400 font-medium text-xl font-inter">
                      Start project
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden absolute right-0">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-200 hover:text-white"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900/80 backdrop-blur border-b border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {[
                { id: 'home', label: 'Home' },
                { id: 'story', label: 'Story' },
                { id: 'works', label: 'Work' },
                { id: 'process', label: 'Process' },
                { id: 'connect', label: 'Connect' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-3 py-2 rounded text-gray-200 hover:text-white hover:bg-gray-800 transition-colors`}
                >
                  {item.label}
                </button>
              ))}
              <a
                href={`mailto:${profile?.email || 'hello@example.com'}`}
                className="block w-full text-left px-3 py-2 rounded text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors"
              >
                Start project
              </a>
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
              onClick={() => scrollToSection('works')}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all transform hover:-translate-y-1"
            >
              View My Work
            </button>
            <button
              onClick={() => scrollToSection('connect')}
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

      {/* Story Section */}
      <section id="story" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            My Story
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={profile?.image_url || 'https://placehold.co/400x400?text=Profile'}
                alt={profile?.name || 'Profile'}
                className="rounded-2xl shadow-2xl shadow-purple-500/20 object-cover w-full h-auto"
                loading="lazy"
              />
            </div>
            <div>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                My journey in technology began with curiosity and has evolved into a passion for creating 
                digital experiences that make a difference. I believe in the power of thoughtful design and 
                clean code to solve real-world problems.
              </p>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                From my early days tinkering with HTML to building complex applications, I've learned that 
                great software comes from understanding people first, then technology. Every project is an 
                opportunity to learn, grow, and create something meaningful.
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

      {/* Works Section */}
      <section id="works" className="py-20 px-4 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            My Work
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
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

      {/* Process Section */}
      <section id="process" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            My Process
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Discovery & Research",
                description: "I start by understanding your goals, target audience, and project requirements through comprehensive research and stakeholder interviews.",
                icon: "🔍"
              },
              {
                title: "Design & Planning",
                description: "Creating wireframes, prototypes, and detailed technical specifications to ensure the solution meets your needs perfectly.",
                icon: "✏️"
              },
              {
                title: "Development & Testing",
                description: "Building your project with clean, maintainable code while conducting thorough testing to ensure quality and performance.",
                icon: "⚡"
              },
              {
                title: "Deployment & Launch",
                description: "Smooth deployment to production with monitoring, optimization, and ongoing support to ensure your project's success.",
                icon: "🚀"
              },
              {
                title: "Iteration & Growth",
                description: "Continuous improvement based on user feedback and analytics to keep your project evolving and competitive.",
                icon: "📈"
              },
              {
                title: "Maintenance & Support",
                description: "Ongoing technical support, updates, and maintenance to keep your project running smoothly and securely.",
                icon: "🛠️"
              }
            ].map((step, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-6 hover:shadow-2xl hover:shadow-purple-500/20 transition-all text-center"
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-purple-400">
                  {step.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section id="connect" className="py-20 px-4 bg-gray-800/50">
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
              href={toExternalUrl(profile?.github)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Github size={20} />
              GitHub
            </a>
            <a
              href={toExternalUrl(profile?.linkedin)}
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
          <p>&copy; 2025 {profile?.name}. All rights reserved.</p>
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