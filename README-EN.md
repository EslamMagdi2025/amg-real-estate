# AMG Real Estate

Modern real estate website built with Next.js, TypeScript, and Tailwind CSS.

## 🌟 Features

- 🏡 **Portfolio showcase** for AMG's real estate projects
- 🏢 **Multi-service platform** (real estate sales, marketing, construction, furniture, kitchens)
- 👤 **User registration and authentication** system
- 📝 **User-generated listings** - registered users can add their own property listings
- 🎨 **Modern responsive design** inspired by industry-leading real estate websites

## 🛠 Tech Stack

- **Frontend**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Animations**: Framer Motion
- **Language**: TypeScript

## 🚀 Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Setup environment variables (see `.env.example`)
4. Setup database: `npx prisma db push`
5. Start development server: `npm run dev`

## 🔧 Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
DATABASE_URL="your-database-url"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="your-domain-url"
```

## 🌐 Deployment

This project is optimized for deployment on:

- **Vercel** (recommended)
- **Netlify**
- **Railway**

## 📝 License

© 2025 AMG Real Estate. All rights reserved.