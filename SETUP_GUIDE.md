# 🚀 StreamPlay Setup Guide

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier available)
- Git installed

## 🔧 Step-by-Step Setup

### 1️⃣ Clone & Install

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd streamplay-ott

# Install dependencies
npm install
\`\`\`

### 2️⃣ Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free account

2. **Create Cluster**:
   - Click "Create Cluster"
   - Choose FREE tier (M0)
   - Select region closest to you
   - Click "Create Cluster"

3. **Create Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `streamplay_user`
   - Password: `MySecurePassword123` (or generate strong password)
   - Select "Read and write to any database"

4. **Whitelist IP Address**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (for development)
   - Or add your specific IP

5. **Get Connection String**:
   - Go to "Clusters"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

### 3️⃣ Environment Configuration

1. **Create Environment File**:
\`\`\`bash
# Copy example file
cp .env.local.example .env.local
\`\`\`

2. **Edit .env.local**:
\`\`\`env
# Required - Replace with your MongoDB connection string
MONGODB_URI=mongodb+srv://streamplay_user:MySecurePassword123@cluster0.abc123.mongodb.net/streamplay?retryWrites=true&w=majority

# Required - Your app URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
\`\`\`

### 4️⃣ Database Seeding

\`\`\`bash
# Populate database with sample content
npm run seed
\`\`\`

**Expected Output**:
\`\`\`
Connected to MongoDB
Cleared existing content
Inserted 15 content items
Seeding completed successfully!
\`\`\`

### 5️⃣ Start Development Server

\`\`\`bash
# Start the application
npm run dev
\`\`\`

**Open**: [http://localhost:3000](http://localhost:3000)

## 🔑 Test Credentials

### User Account
- **Email**: `user@example.com`
- **Password**: `Test@123`

### Admin Account  
- **Email**: `admin@example.com`
- **Password**: `Admin@123`

## 🎯 Quick Test Checklist

- [ ] Homepage loads with sample content
- [ ] Login works with test credentials
- [ ] Movies page shows content grid
- [ ] Video player opens YouTube trailers
- [ ] Admin panel accessible (admin login)
- [ ] Can add new content via CMS

## 🚨 Common Issues & Solutions

### Issue: "Failed to connect to MongoDB"
**Solution**: 
- Check MONGODB_URI in .env.local
- Verify database user credentials
- Ensure IP is whitelisted in MongoDB Atlas

### Issue: "Content not loading"
**Solution**:
- Run seed script: `npm run seed`
- Check MongoDB connection
- Verify API routes are working

### Issue: "YouTube videos not playing"
**Solution**:
- Check YouTube URLs in database
- Ensure videos are public/embeddable
- Check browser console for errors

## 📱 Mobile Testing

\`\`\`bash
# Get your local IP
ipconfig getifaddr en0  # Mac
ipconfig | findstr IPv4  # Windows

# Update .env.local
NEXT_PUBLIC_BASE_URL=http://YOUR_LOCAL_IP:3000

# Restart server
npm run dev
\`\`\`

## 🚀 Production Deployment

### Vercel Deployment
1. Push code to GitHub
2. Connect GitHub to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production:
\`\`\`env
MONGODB_URI=your-production-mongodb-uri
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
NODE_ENV=production
\`\`\`

## 📞 Support

If you encounter any issues:
1. Check this setup guide
2. Verify all environment variables
3. Check browser console for errors
4. Ensure MongoDB Atlas is properly configured

Happy Streaming! 🎬✨
