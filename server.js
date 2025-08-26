// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Database connection
// Prefer DATABASE_URL when available (e.g., Railway/Render/Heroku), otherwise use discrete env vars
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'portfolio_db',
    });

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error connecting to the database:', err.stack);
  }
  console.log('Successfully connected to PostgreSQL database');
  release();
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ============= API ROUTES =============

// Profile Routes
app.get('/api/profile', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM profile WHERE id = 1');
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Profile not found' });
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/profile', authenticateToken, async (req, res) => {
  const { name, title, bio, email, github, linkedin, twitter, resume_url } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE profile 
       SET name = $1, title = $2, bio = $3, email = $4, 
           github = $5, linkedin = $6, twitter = $7, resume_url = $8, 
           updated_at = NOW()
       WHERE id = 1
       RETURNING *`,
      [name, title, bio, email, github, linkedin, twitter, resume_url]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Projects Routes
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM projects ORDER BY display_order, created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/projects', authenticateToken, upload.single('image'), async (req, res) => {
  const { title, description, long_description, tech_stack, github_url, live_url, featured, display_order } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;
  
  try {
    const result = await pool.query(
      `INSERT INTO projects (title, description, long_description, tech_stack, image_url, github_url, live_url, featured, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [title, description, long_description, tech_stack ? tech_stack.split(',') : [], image_url, github_url, live_url, featured || false, display_order || 0]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/projects/:id', authenticateToken, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { title, description, long_description, tech_stack, github_url, live_url, featured, display_order } = req.body;
  
  try {
    let query, values;
    
    if (req.file) {
      const image_url = `/uploads/${req.file.filename}`;
      query = `UPDATE projects 
               SET title = $1, description = $2, long_description = $3, tech_stack = $4, 
                   image_url = $5, github_url = $6, live_url = $7, featured = $8, 
                   display_order = $9, updated_at = NOW()
               WHERE id = $10
               RETURNING *`;
      values = [title, description, long_description, tech_stack ? tech_stack.split(',') : [], image_url, github_url, live_url, featured || false, display_order || 0, id];
    } else {
      query = `UPDATE projects 
               SET title = $1, description = $2, long_description = $3, tech_stack = $4, 
                   github_url = $5, live_url = $6, featured = $7, display_order = $8, 
                   updated_at = NOW()
               WHERE id = $9
               RETURNING *`;
      values = [title, description, long_description, tech_stack ? tech_stack.split(',') : [], github_url, live_url, featured || false, display_order || 0, id];
    }
    
    const result = await pool.query(query, values);
    
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length > 0) {
      res.json({ message: 'Project deleted successfully' });
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Skills Routes
app.get('/api/skills', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM skills ORDER BY category, display_order');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/skills', authenticateToken, async (req, res) => {
  const { name, category, proficiency, display_order } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO skills (name, category, proficiency, display_order)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, category, proficiency || 0, display_order || 0]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Blog Routes
app.get('/api/blog', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, slug, excerpt, tags, published_at, read_time, featured
       FROM blog_posts 
       WHERE published = true 
       ORDER BY published_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/blog/:slug', async (req, res) => {
  const { slug } = req.params;
  
  try {
    const result = await pool.query(
      'SELECT * FROM blog_posts WHERE slug = $1 AND published = true',
      [slug]
    );
    
    if (result.rows.length > 0) {
      // Increment view count
      await pool.query(
        'UPDATE blog_posts SET view_count = view_count + 1 WHERE id = $1',
        [result.rows[0].id]
      );
      
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Blog post not found' });
    }
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/blog', authenticateToken, async (req, res) => {
  const { title, slug, excerpt, content, tags, read_time, featured, published } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO blog_posts (title, slug, excerpt, content, tags, read_time, featured, published, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING *`,
      [title, slug, excerpt, content, tags || [], read_time || 5, featured || false, published || false]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/blog/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, slug, excerpt, content, tags, read_time, featured, published } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE blog_posts 
       SET title = $1, slug = $2, excerpt = $3, content = $4, tags = $5, 
           read_time = $6, featured = $7, published = $8, updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [title, slug, excerpt, content, tags || [], read_time || 5, featured || false, published || false, id]
    );
    
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Blog post not found' });
    }
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/blog/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM blog_posts WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length > 0) {
      res.json({ message: 'Blog post deleted successfully' });
    } else {
      res.status(404).json({ error: 'Blog post not found' });
    }
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Contact Routes
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO contact_messages (name, email, subject, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, email, subject, message]
    );
    
    // Here you could add email notification logic
    // For now, just save to database
    
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/contact', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Authentication Routes
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    
    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email`,
      [username, email, passwordHash]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  pool.end();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  pool.end();
  process.exit(0);
});