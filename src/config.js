// Environment configuration
const config = {
  development: {
    API_URL: 'http://localhost:5000/api',
    UPLOAD_URL: 'http://localhost:5000/uploads'
  },
  production: {
    // Update these URLs with your actual backend deployment URLs
    API_URL: process.env.REACT_APP_API_URL || 'https://your-backend-domain.com/api',
    UPLOAD_URL: process.env.REACT_APP_UPLOAD_URL || 'https://your-backend-domain.com/uploads'
  }
};

const environment = process.env.NODE_ENV || 'development';
export const { API_URL, UPLOAD_URL } = config[environment];

export default config[environment];
