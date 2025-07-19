# StreamPlay - OTT Platform

A comprehensive OTT (Over-The-Top) streaming platform built with Next.js, MongoDB, and YouTube integration.

## Features

- 🎬 **Content Management**: Movies and series with YouTube integration
- 👤 **User Authentication**: Static credentials for testing
- 📱 **Responsive Design**: Works on desktop and mobile
- 🎥 **Video Player**: YouTube iframe with analytics tracking
- 📊 **Admin Dashboard**: Content management and analytics
- 🔍 **Search & Filter**: Find content by title, genre, and type
- ❤️ **Watchlist**: Save content for later
- 📈 **Analytics**: Track views and watch time

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: MongoDB
- **Video**: YouTube iframe API
- **Authentication**: Static credentials (for demo)

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd streamplay-ott
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Edit `.env.local` and add your MongoDB connection string:
\`\`\`
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/streamplay?retryWrites=true&w=majority
NEXT_PUBLIC_BASE_URL=http://localhost:3000
\`\`\`

4. Seed the database:
\`\`\`bash
npm run seed
\`\`\`

5. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Test Credentials

### User Account
- Email: `user@example.com`
- Password: `Test@123`

### Admin Account
- Email: `admin@example.com`
- Password: `Admin@123`

## Project Structure

\`\`\`
streamplay-ott/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── dashboard/         # User dashboard
│   ├── login/             # Authentication
│   ├── movies/            # Movies page
│   ├── series/            # Series page
│   ├── watch/             # Video player
│   └── profile/           # User profile
├── components/            # Reusable components
├── lib/                   # Utilities and database
├── scripts/               # Database seeding
└── public/               # Static assets
\`\`\`

## Features Overview

### User Features
- Browse movies and series
- Search and filter content
- Watch trailers and content
- Manage watchlist
- Track viewing history
- Responsive design

### Admin Features
- Add/edit/delete content
- View analytics dashboard
- Manage content publishing
- Track user engagement

### Technical Features
- Server-side rendering with Next.js
- MongoDB integration
- YouTube iframe player
- Analytics tracking
- Responsive UI with Tailwind CSS
- TypeScript for type safety

## API Endpoints

- `GET /api/content` - Get all content
- `GET /api/content/[id]` - Get specific content
- `POST /api/content` - Create content (admin)
- `PUT /api/content/[id]` - Update content (admin)
- `DELETE /api/content/[id]` - Delete content (admin)
- `GET /api/analytics` - Get analytics data
- `POST /api/analytics/log` - Log user actions

## Database Schema

### Content Collection
\`\`\`javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  genre: [String],
  thumbnailUrl: String,
  youtubeUrl: String,
  type: "movie" | "series",
  createdAt: Date,
  updatedAt: Date,
  views: Number,
  watchTime: Number,
  published: Boolean
}
\`\`\`

### Analytics Collection
\`\`\`javascript
{
  _id: ObjectId,
  contentId: ObjectId,
  userId: String,
  action: "view" | "play" | "pause" | "complete",
  timestamp: Date,
  watchTime: Number
}
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. Please ensure you have proper licensing for any content you add to the platform.
