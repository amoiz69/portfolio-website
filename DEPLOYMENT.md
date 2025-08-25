# 🚀 Deployment Guide

This guide will help you deploy your portfolio website to Netlify or Vercel.

## 📋 Prerequisites

- GitHub account with your portfolio repository
- Netlify or Vercel account
- Backend API deployed (for production)

## 🌐 **Option 1: Deploy to Netlify**

### **Step 1: Push to GitHub**
```bash
git init
git add .
git commit -m "Initial portfolio website commit"
git branch -M main
git remote add origin https://github.com/yourusername/portfolio-website.git
git push -u origin main
```

### **Step 2: Deploy on Netlify**

1. **Go to [netlify.com](https://netlify.com)** and sign up/login
2. **Click "New site from Git"**
3. **Choose GitHub** and authorize Netlify
4. **Select your portfolio repository**
5. **Configure build settings:**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18` (or your preferred version)
6. **Click "Deploy site"**

### **Step 3: Configure Environment Variables**
In your Netlify dashboard:
1. Go to **Site settings** → **Environment variables**
2. Add:
   ```
   REACT_APP_API_URL=https://your-backend-domain.com/api
   REACT_APP_UPLOAD_URL=https://your-backend-domain.com/uploads
   ```

### **Step 4: Custom Domain (Optional)**
1. Go to **Domain management**
2. Click **Add custom domain**
3. Follow the DNS configuration instructions

---

## ⚡ **Option 2: Deploy to Vercel**

### **Step 1: Push to GitHub** (same as above)

### **Step 2: Deploy on Vercel**

1. **Go to [vercel.com](https://vercel.com)** and sign up/login
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure project:**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. **Click "Deploy"**

### **Step 3: Configure Environment Variables**
In your Vercel dashboard:
1. Go to **Project Settings** → **Environment Variables**
2. Add:
   ```
   REACT_APP_API_URL=https://your-backend-domain.com/api
   REACT_APP_UPLOAD_URL=https://your-backend-domain.com/uploads
   ```

---

## 🔧 **Backend Deployment Options**

Since your portfolio has a backend API, you'll need to deploy it separately:

### **Option A: Railway**
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy your `server.js` file
4. Get your production API URL

### **Option B: Render**
1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `npm install`
5. Set start command: `node server.js`

### **Option C: Heroku**
1. Go to [heroku.com](https://heroku.com)
2. Create a new app
3. Connect your GitHub repository
4. Deploy your backend

### **Option D: DigitalOcean App Platform**
1. Go to [digitalocean.com](https://digitalocean.com)
2. Create a new app
3. Connect your GitHub repository
4. Deploy your backend

---

## 🗄️ **Database Setup for Production**

### **Option A: Railway PostgreSQL**
1. Create a PostgreSQL database on Railway
2. Get connection string
3. Update your backend environment variables

### **Option B: Supabase**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get connection string
4. Update your backend environment variables

### **Option C: Neon**
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Get connection string
4. Update your backend environment variables

---

## 🔄 **Automatic Deployments**

Both Netlify and Vercel offer automatic deployments:

- **Every push to main branch** = automatic deployment
- **Preview deployments** for pull requests
- **Branch deployments** for testing

---

## 📱 **Testing Your Deployment**

1. **Check your live site** at the provided URL
2. **Test all functionality** (navigation, sections, etc.)
3. **Verify API connections** (if backend is deployed)
4. **Test on mobile devices**
5. **Check performance** using Lighthouse

---

## 🚨 **Common Issues & Solutions**

### **Build Failures**
- Check Node.js version compatibility
- Verify all dependencies are in `package.json`
- Check for syntax errors in your code

### **API Connection Issues**
- Verify environment variables are set correctly
- Check CORS settings on your backend
- Ensure backend is accessible from frontend domain

### **Routing Issues**
- Verify SPA redirects are configured
- Check for 404 errors on page refresh

---

## 🎯 **Next Steps After Deployment**

1. **Set up analytics** (Google Analytics, Plausible)
2. **Configure monitoring** (UptimeRobot, Pingdom)
3. **Set up backups** for your database
4. **Configure SSL certificates** (automatic on Netlify/Vercel)
5. **Set up custom domain** with SSL

---

## 📞 **Need Help?**

- **Netlify Support**: [docs.netlify.com](https://docs.netlify.com)
- **Vercel Support**: [vercel.com/docs](https://vercel.com/docs)
- **GitHub Issues**: Create an issue in your repository

---

**Happy Deploying! 🎉**
