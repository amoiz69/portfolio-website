# Portfolio Website

A modern, responsive portfolio website built with React frontend and Node.js backend.

## Features

- **Frontend**: React with Tailwind CSS for styling
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with comprehensive schema
- **Authentication**: JWT-based user authentication
- **File Uploads**: Image upload support for projects
- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: Live data from database

## Project Structure

```
Portfolio website/
├── App.jsx                 # Main React component
├── server.js              # Backend server
├── database.sql           # Database schema
├── package.json           # Frontend dependencies
├── vite.config.js         # Vite configuration
├── index.html             # HTML entry point
├── src/
│   ├── main.jsx          # React entry point
│   └── index.css         # Global styles
├── tailwind.config.js     # Tailwind configuration
└── postcss.config.js      # PostCSS configuration
```

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### 1. Frontend Setup

Install frontend dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 2. Backend Setup

Install backend dependencies:
```bash
npm install express cors helmet morgan dotenv pg bcryptjs jsonwebtoken multer
```

Create a `.env` file in the root directory with the following variables:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=portfolio_db
JWT_SECRET=your-super-secret-jwt-key
```

### 3. Database Setup

1. Install PostgreSQL if you haven't already
2. Create a new database:
   ```sql
   CREATE DATABASE portfolio_db;
   ```
3. Run the database schema:
   ```bash
   psql -d portfolio_db -f database.sql
   ```

### 4. Start the Backend Server

```bash
node server.js
```

The backend API will be available at `http://localhost:5000/api`

## API Endpoints

### Public Endpoints
- `GET /api/profile` - Get profile information
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get specific project
- `GET /api/skills` - Get all skills
- `GET /api/blog` - Get published blog posts
- `GET /api/blog/:slug` - Get specific blog post
- `POST /api/contact` - Send contact message
- `GET /api/health` - Health check

### Protected Endpoints (require authentication)
- `PUT /api/profile` - Update profile
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/skills` - Create new skill
- `POST /api/blog` - Create new blog post
- `PUT /api/blog/:id` - Update blog post
- `DELETE /api/blog/:id` - Delete blog post
- `GET /api/contact` - Get contact messages

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

## Database Tables

- **users** - User authentication
- **profile** - Portfolio profile information
- **projects** - Portfolio projects
- **skills** - Technical skills
- **blog_posts** - Blog articles
- **contact_messages** - Contact form submissions

## Customization

### Update Profile
Edit the profile information in the database or use the API endpoint.

### Add Projects
Use the `/api/projects` endpoint to add new projects with images.

### Modify Skills
Update skills through the `/api/skills` endpoint.

### Blog Posts
Create and manage blog posts through the blog API endpoints.

## Development

### Frontend Development
- The React app uses Vite for fast development
- Tailwind CSS for styling
- Hot module replacement enabled

### Backend Development
- Express.js server with middleware
- PostgreSQL database with connection pooling
- JWT authentication
- File upload support

## Production Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Set production environment variables
3. Use a process manager like PM2
4. Set up reverse proxy (nginx)
5. Configure SSL certificates

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check PostgreSQL is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing processes using the port

3. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration

4. **File Upload Errors**
   - Ensure `uploads/` directory exists
   - Check file size limits
   - Verify file types

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or issues, please open an issue on GitHub or contact the maintainer.
