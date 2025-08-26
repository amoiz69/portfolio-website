# 🚀 Deploying Portfolio Website with Supabase

This guide will help you deploy your portfolio website using Supabase for the backend (database, authentication, and storage) and Netlify/Vercel for the frontend.

## 📋 **What Supabase Provides**

- ✅ **PostgreSQL Database** - Store your portfolio data
- ✅ **Authentication** - User login/registration system
- ✅ **Storage** - Image uploads for projects
- ✅ **Real-time Subscriptions** - Live updates
- ✅ **Row Level Security** - Data protection
- ✅ **API Generation** - Automatic REST API

## 🎯 **Deployment Strategy**

1. **Frontend**: Deploy to Netlify/Vercel (React app)
2. **Backend**: Use Supabase (database + API)
3. **Storage**: Supabase Storage for images
4. **Authentication**: Supabase Auth

---

## 🌐 **Step 1: Set Up Supabase Project**

### **1.1 Create Supabase Account**
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub or email
3. Click "New Project"

### **1.2 Create New Project**
1. **Organization**: Choose or create an organization
2. **Name**: `portfolio-website` (or your preferred name)
3. **Database Password**: Create a strong password (save this!)
4. **Region**: Choose closest to your users
5. **Pricing Plan**: Start with Free tier
6. Click "Create new project"

### **1.3 Wait for Setup**
- Database setup takes 2-3 minutes
- You'll see "Project is ready" when complete

---

## 🗄️ **Step 2: Set Up Database Schema**

### **2.1 Access SQL Editor**
1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**

### **2.2 Run Migration**
1. Copy the contents of `supabase/migrations/001_initial_schema.sql`
2. Paste into the SQL Editor
3. Click **Run** to execute

### **2.3 Verify Tables**
Go to **Table Editor** to confirm:
- ✅ `profile` table
- ✅ `projects` table  
- ✅ `skills` table
- ✅ `blog_posts` table
- ✅ `contact_messages` table
- ✅ `profiles` table

---

## 🔐 **Step 3: Configure Authentication**

### **3.1 Go to Authentication Settings**
1. In Supabase dashboard, go to **Authentication** → **Settings**
2. **Site URL**: Set to your frontend URL (e.g., `https://yourdomain.netlify.app`)
3. **Redirect URLs**: Add your frontend URLs:
   - `https://yourdomain.netlify.app`
   - `https://yourdomain.vercel.app`
   - `http://localhost:3000` (for development)

### **3.2 Configure Email Templates (Optional)**
1. Go to **Authentication** → **Templates**
2. Customize email templates for:
   - Confirm signup
   - Magic link
   - Change email address
   - Reset password

---

## 📁 **Step 4: Set Up Storage**

### **4.1 Create Storage Bucket**
1. Go to **Storage** → **Buckets**
2. Click **New Bucket**
3. **Name**: `portfolio-images`
4. **Public bucket**: ✅ Check this
5. **File size limit**: `50MB`
6. Click **Create bucket**

### **4.2 Configure Storage Policies**
1. Click on your `portfolio-images` bucket
2. Go to **Policies** tab
3. Click **New Policy**
4. **Policy Name**: `Public Read Access`
5. **Allowed operation**: `SELECT`
6. **Target roles**: `anon, authenticated`
7. **Policy definition**: `true`
8. Click **Review** then **Save policy**

---

## 🔑 **Step 5: Get API Keys**

### **5.1 Copy API Keys**
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### **5.2 Create Environment File**
Create a `.env.local` file in your project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 🚀 **Step 6: Deploy Frontend**

### **6.1 Update Configuration**
Your `src/config.js` should now use Supabase:
```javascript
const config = {
  development: {
    API_URL: 'http://localhost:5000/api', // Local backend
    UPLOAD_URL: 'http://localhost:5000/uploads'
  },
  production: {
    API_URL: 'https://your-project-id.supabase.co/rest/v1', // Supabase
    UPLOAD_URL: 'https://your-project-id.supabase.co/storage/v1/object/public/portfolio-images'
  }
};
```

### **6.2 Deploy to Netlify**
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. **New site from Git** → **GitHub**
4. Select your repository
5. **Build command**: `npm run build`
6. **Publish directory**: `dist`
7. **Environment variables**:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### **6.3 Deploy to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. **New Project** → **Import Git Repository**
3. Select your repository
4. **Framework Preset**: Vite
5. **Environment Variables**:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

---

## 🔧 **Step 7: Test Your Deployment**

### **7.1 Test Database Connection**
1. Visit your deployed frontend
2. Check browser console for errors
3. Verify data is loading from Supabase

### **7.2 Test Authentication**
1. Try to sign up/login
2. Check if user profiles are created
3. Verify protected routes work

### **7.3 Test Image Uploads**
1. Try uploading a project image
2. Verify it appears in Supabase Storage
3. Check if images display correctly

---

## 🎨 **Step 8: Customize Your Portfolio**

### **8.1 Update Profile**
1. Go to **Table Editor** → **profile**
2. Click **Edit** on your profile row
3. Update:
   - Name
   - Title
   - Bio
   - Social links
   - Profile image

### **8.2 Add Projects**
1. Go to **Table Editor** → **projects**
2. Click **Insert row**
3. Fill in:
   - Title
   - Description
   - Tech stack (as array: `["React", "Node.js"]`)
   - GitHub/Live URLs
   - Featured status

### **8.3 Manage Skills**
1. Go to **Table Editor** → **skills**
2. Add/remove skills
3. Set proficiency levels (0-100)
4. Organize by categories

---

## 🚨 **Troubleshooting**

### **Common Issues**

1. **CORS Errors**
   - Check Supabase Auth settings
   - Verify redirect URLs are correct

2. **Authentication Not Working**
   - Check environment variables
   - Verify Supabase URL and keys

3. **Database Connection Issues**
   - Check if migration ran successfully
   - Verify table names match your code

4. **Image Upload Failures**
   - Check storage bucket policies
   - Verify bucket name matches code

### **Debug Steps**
1. Check browser console for errors
2. Verify environment variables are set
3. Check Supabase dashboard for errors
4. Test API endpoints in Supabase dashboard

---

## 🔒 **Security Best Practices**

### **Row Level Security (RLS)**
- ✅ Already configured in migration
- Users can only access their own data
- Public data is readable by everyone

### **API Key Security**
- ✅ Never commit `.env` files
- Use environment variables in deployment
- Rotate keys if compromised

### **Storage Security**
- ✅ Public bucket for portfolio images
- Private buckets for sensitive files
- File type restrictions

---

## 📈 **Scaling & Performance**

### **Free Tier Limits**
- **Database**: 500MB
- **Storage**: 1GB
- **Bandwidth**: 2GB/month
- **API calls**: 50,000/month

### **Upgrade When Needed**
- **Pro Plan**: $25/month
- **Team Plan**: $599/month
- **Enterprise**: Custom pricing

---

## 🎯 **Next Steps**

1. **Set up monitoring** with Supabase Analytics
2. **Configure backups** for your database
3. **Set up webhooks** for real-time updates
4. **Add custom domains** to Supabase
5. **Implement edge functions** for complex logic

---

## 📞 **Need Help?**

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Supabase Discord**: [discord.gg/supabase](https://discord.gg/supabase)
- **GitHub Issues**: Create an issue in your repository

---

## 🎉 **Congratulations!**

You now have a fully deployed portfolio website with:
- ✅ **Modern React Frontend**
- ✅ **Supabase Backend**
- ✅ **PostgreSQL Database**
- ✅ **User Authentication**
- ✅ **Image Storage**
- ✅ **Real-time Updates**

**Your portfolio is live and ready to impress! 🚀**
