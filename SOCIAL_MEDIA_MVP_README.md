# Social Media Automation MVP

A comprehensive platform for managing and automating content across multiple social media channels: **Instagram**, **Facebook**, and **TikTok**. This MVP enables users to create, schedule, and analyze posts from a unified web dashboard.

---

## 📋 Table of Contents

1. [System Architecture](#system-architecture)
2. [Project Structure](#project-structure)
3. [Components Overview](#components-overview)
4. [Platform Integration](#platform-integration)
5. [Setup & Installation](#setup--installation)
6. [Configuration](#configuration)
7. [API Endpoints](#api-endpoints)
8. [Database Schema](#database-schema)
9. [Deployment](#deployment)
10. [Development Guide](#development-guide)

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend (Web Dashboard)                    │
│  - Create/Schedule Posts | Manage Accounts | View Analytics      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                    REST API / WebSocket
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    Backend API (Node.js/Express)                 │
│  - Authentication | User Management | Post Management           │
│  - Analytics Aggregation | Platform API Orchestration            │
└────────────────┬─────────────────────────────────┬──────────────┘
                 │                                  │
      ┌──────────▼──────────┐         ┌────────────▼──────────┐
      │   PostgreSQL DB     │         │   Message Queue        │
      │  - Users            │         │   (Redis/Bull)         │
      │  - Accounts         │         │  - Job Scheduling      │
      │  - Posts            │         │  - Async Processing    │
      │  - Analytics        │         └────────────┬───────────┘
      └────────────────────┘                       │
                                         ┌─────────▼──────────┐
                                         │  Scheduler/Worker   │
                                         │  - Execute Posts    │
                                         │  - Fetch Analytics  │
                                         └─────────┬───────────┘
                                                   │
              ┌────────────────────────────────────┼──────────────────────┐
              │                                    │                       │
    ┌─────────▼─────────┐          ┌──────────────▼────────┐   ┌─────────▼────────┐
    │  Facebook API     │          │  Instagram API        │   │  TikTok API      │
    │  - Graph API v18  │          │  - Graph API v18      │   │  - Business API  │
    │  - OAuth 2.0      │          │  - OAuth 2.0          │   │  - OAuth 2.0     │
    └───────────────────┘          └───────────────────────┘   └──────────────────┘
    
    ┌─────────────────────────────────────────────────────────────┐
    │              Payment Gateway (Stripe)                        │
    │  - Subscription Management | Billing | Payment Processing   │
    └─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
social-media-automation-mvp/
│
├── frontend/                          # React TypeScript Dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/               # Button, Modal, Input, etc.
│   │   │   ├── layout/               # Header, Sidebar, MainLayout
│   │   │   ├── features/
│   │   │   │   ├── Dashboard/        # Main dashboard view
│   │   │   │   ├── PostScheduler/    # Post creation & scheduling
│   │   │   │   ├── ContentCalendar/  # Calendar view of posts
│   │   │   │   ├── Analytics/        # Analytics dashboard
│   │   │   │   └── AccountManager/   # Link/manage accounts
│   │   │   └── index.ts
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── PostsPage.tsx
│   │   │   ├── AnalyticsPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   └── LoginPage.tsx
│   │   ├── services/
│   │   │   ├── api/
│   │   │   │   ├── client.ts         # API client
│   │   │   │   ├── posts.service.ts  # Post APIs
│   │   │   │   ├── accounts.service.ts
│   │   │   │   ├── analytics.service.ts
│   │   │   │   └── auth.service.ts
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useAsync.ts
│   │   │   ├── useAuth.ts
│   │   │   ├── usePosts.ts
│   │   │   └── index.ts
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   └── AppContext.tsx
│   │   ├── types/
│   │   │   ├── auth.types.ts
│   │   │   ├── post.types.ts
│   │   │   ├── account.types.ts
│   │   │   ├── analytics.types.ts
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── helpers/
│   │   │   ├── constants/
│   │   │   └── formatters/
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   └── variables.css
│   │   ├── config/
│   │   │   └── environment.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                           # Node.js/Express API Server
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── postsController.ts
│   │   │   ├── accountsController.ts
│   │   │   ├── analyticsController.ts
│   │   │   └── webhookController.ts
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── postService.ts
│   │   │   ├── accountService.ts
│   │   │   ├── analyticsService.ts
│   │   │   ├── platformServices/
│   │   │   │   ├── facebookService.ts
│   │   │   │   ├── instagramService.ts
│   │   │   │   ├── tiktokService.ts
│   │   │   │   └── index.ts
│   │   │   ├── schedulerService.ts
│   │   │   ├── paymentService.ts
│   │   │   └── index.ts
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── logger.ts
│   │   │   └── validation.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── posts.routes.ts
│   │   │   ├── accounts.routes.ts
│   │   │   ├── analytics.routes.ts
│   │   │   ├── webhooks.routes.ts
│   │   │   └── index.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Account.ts
│   │   │   ├── Post.ts
│   │   │   ├── Analytics.ts
│   │   │   └── Subscription.ts
│   │   ├── jobs/
│   │   │   ├── postSchedulerJob.ts
│   │   │   ├── analyticsJob.ts
│   │   │   └── index.ts
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   ├── environment.ts
│   │   │   ├── queues.ts
│   │   │   └── oauth.ts
│   │   ├── utils/
│   │   │   ├── helpers.ts
│   │   │   ├── validators.ts
│   │   │   └── errorHandler.ts
│   │   ├── types/
│   │   │   ├── index.ts
│   │   │   └── api.types.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── migrations/
│   │   ├── 001_create_users.ts
│   │   ├── 002_create_accounts.ts
│   │   ├── 003_create_posts.ts
│   │   └── 004_create_analytics.ts
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── workers/                           # Background Job Processing
│   ├── src/
│   │   ├── jobs/
│   │   │   ├── postPublisherJob.ts
│   │   │   ├── analyticsCollectorJob.ts
│   │   │   └── index.ts
│   │   ├── queues/
│   │   │   ├── postQueue.ts
│   │   │   └── analyticsQueue.ts
│   │   ├── config/
│   │   │   └── queue.config.ts
│   │   └── index.ts
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml                 # Local development setup
├── .github/
│   └── workflows/
│       ├── ci.yml                     # CI/CD pipeline
│       └── deploy.yml
├── README.md
└── CONTRIBUTING.md
```

---

## 🔧 Components Overview

### 1. **Frontend (Web Dashboard)**

**Technology Stack:** React, TypeScript, Vite

**Key Features:**
- ✅ User authentication & account management
- ✅ Post creation with rich text editor
- ✅ Schedule posts across multiple platforms
- ✅ Content calendar view
- ✅ Real-time analytics dashboard
- ✅ Account linking & management
- ✅ Settings & subscription management

**Main Pages:**
- **Dashboard** - Overview of scheduled posts & analytics
- **Posts** - Create, edit, schedule posts
- **Analytics** - View performance metrics
- **Accounts** - Link/manage social media accounts
- **Settings** - User preferences & billing

---

### 2. **Backend API**

**Technology Stack:** Node.js, Express, TypeScript, PostgreSQL

**Key Responsibilities:**
- User authentication & authorization (JWT)
- API gateway for platform integrations
- Post management & scheduling
- Analytics aggregation
- Webhook handling for real-time updates
- Subscription & payment processing

**Core Modules:**
```
POST /auth/login                          → User login
POST /auth/register                       → User registration
POST /auth/refresh-token                  → Refresh JWT token

GET  /accounts                            → List user accounts
POST /accounts/link                       → Link new account
DELETE /accounts/:id                      → Unlink account

POST /posts                               → Create post
GET  /posts                               → List posts
PUT  /posts/:id                           → Update post
DELETE /posts/:id                         → Delete post
POST /posts/:id/publish                   → Publish immediately

GET  /analytics                           → Get analytics
GET  /analytics/:accountId                → Account-specific analytics

POST /webhooks/facebook                   → Facebook webhooks
POST /webhooks/instagram                  → Instagram webhooks
POST /webhooks/tiktok                     → TikTok webhooks
```

---

### 3. **Database (PostgreSQL)**

**Core Tables:**

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  subscription_tier ENUM ('free', 'pro', 'enterprise'),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Accounts Table (linked social media accounts)
CREATE TABLE accounts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform ENUM ('facebook', 'instagram', 'tiktok') NOT NULL,
  platform_id VARCHAR(255) UNIQUE NOT NULL,
  access_token VARCHAR(2048),
  refresh_token VARCHAR(2048),
  token_expires_at TIMESTAMP,
  account_name VARCHAR(255),
  account_handle VARCHAR(255),
  profile_picture_url TEXT,
  is_business_account BOOLEAN DEFAULT FALSE,
  connected_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, platform_id)
);

-- Posts Table
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  title VARCHAR(255),
  content TEXT NOT NULL,
  media_urls TEXT[], -- JSON array of image/video URLs
  scheduled_at TIMESTAMP,
  published_at TIMESTAMP,
  status ENUM ('draft', 'scheduled', 'published', 'failed') DEFAULT 'draft',
  platform_post_ids JSONB, -- {facebook: "123", instagram: "456", tiktok: "789"}
  hashtags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Analytics Table
CREATE TABLE analytics (
  id UUID PRIMARY KEY,
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  platform ENUM ('facebook', 'instagram', 'tiktok'),
  metric_type ENUM ('impressions', 'reach', 'likes', 'comments', 'shares', 'clicks'),
  metric_value INTEGER,
  collected_at TIMESTAMP DEFAULT NOW(),
  INDEX(account_id, collected_at),
  INDEX(post_id, collected_at)
);

-- Subscriptions Table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  plan ENUM ('free', 'pro', 'enterprise'),
  status ENUM ('active', 'paused', 'cancelled'),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🌐 Platform Integration

### **Facebook & Instagram (Meta Graph API)**

**Authentication:** OAuth 2.0

**Flow:**
1. User clicks "Link Instagram Account"
2. Redirected to Facebook Login Dialog
3. User grants permissions for Instagram Business Account
4. Receives `access_token` (long-lived, ~60 days)
5. Store token in database

**Key Endpoints:**
```
POST /me/ig_hashtag_search                    → Search hashtags
POST /ig_hashtag_id/recent_media              → Get media
POST /ig_user_id/media                        → Create media
POST /ig_container_id/status                  → Check status

GET /page_id/feed                             → Facebook feed
POST /page_id/feed                            → Publish to page
GET /page_id/insights                         → Page analytics
```

**Restrictions:**
- 200 posts/day per account
- Rate limit: 200 calls/person/hour
- Access tokens refresh needed every 60 days
- Business accounts required for scheduling

---

### **TikTok (TikTok for Developers)**

**Authentication:** OAuth 2.0 with special workflow

**Flow:**
1. User requests authorization
2. Redirected to TikTok OAuth endpoint
3. User grants permissions
4. Receives `access_token` (valid for 30 days) + `refresh_token`
5. Refresh token before expiration

**Key Endpoints:**
```
POST /v1/oauth/token                          → Get/refresh tokens
POST /v1/video/upload                         → Upload video
GET /v1/video/query                           → Query video status
POST /v1/video/publish                        → Publish video
GET /v1/video/list                            → List videos
GET /v1/user/info                             → Get user info
```

**Restrictions & Workflow:**
- ⚠️ **Critical:** TikTok requires **human verification** for posting
- Must use `upload_id` → `upload_token` → `publish` workflow
- Video size limit: 5GB
- Supported formats: MP4, MOV, WEBM, AVI
- Must wait for upload completion before publishing
- Rate limit: 5 uploads per user per day (for new accounts)
- Publishing requires 15+ followers on TikTok account

**TikTok Special Considerations:**
```
// TikTok Upload Workflow
1. Initialize upload (get upload_token)
   POST /v1/video/upload/init
   
2. Upload video chunks
   POST /v1/video/upload/parts
   
3. Complete upload
   POST /v1/video/upload/finish
   
4. Publish video
   POST /v1/video/publish
   
5. Poll status
   GET /v1/video/status/fetch
```

---

## ⏰ Scheduler / Worker

**Technology:** Node.js with Bull Queue + Redis

**Responsibilities:**
1. **Post Publishing** - Execute scheduled posts at specified time
2. **Analytics Collection** - Fetch metrics from platforms
3. **Token Refresh** - Refresh expiring OAuth tokens
4. **Webhook Processing** - Handle platform webhooks

**Job Types:**
```typescript
// Post Publishing Job
{
  jobId: 'post-publish-123',
  type: 'publish_post',
  data: {
    postId: 'uuid',
    accountId: 'uuid',
    platform: 'instagram'
  },
  scheduledTime: new Date('2024-03-20 14:00:00'),
  retries: 3,
  backoff: 'exponential'
}

// Analytics Collection Job
{
  jobId: 'analytics-456',
  type: 'collect_analytics',
  data: {
    accountId: 'uuid',
    platform: 'facebook'
  },
  cron: '0 */6 * * *', // Every 6 hours
  retries: 3
}

// Token Refresh Job
{
  jobId: 'token-refresh-789',
  type: 'refresh_token',
  data: {
    accountId: 'uuid'
  },
  // Run when token expires in 7 days
  scheduledTime: tokenExpiresAt - 7 * 24 * 60 * 60 * 1000
}
```

---

## 💳 Payment Gateway (Stripe)

**Integration Points:**
- Subscription management
- Billing & invoicing
- Payment processing
- Usage-based billing

**Pricing Plans:**
```
Free Plan:
  - 3 posts/month
  - 1 social account
  - Basic analytics

Pro Plan ($9.99/month):
  - Unlimited posts
  - 5 social accounts
  - Advanced analytics
  - Post templates

Enterprise Plan (custom):
  - Custom limits
  - Priority support
  - API access
  - Dedicated account manager
```

**Webhook Events:**
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- Docker & Docker Compose (optional)

### Local Development Setup

**1. Clone Repository**
```bash
git clone https://github.com/yourusername/social-media-automation-mvp.git
cd social-media-automation-mvp
```

**2. Setup Backend**
```bash
cd backend
npm install
cp .env.example .env.local
```

**3. Setup Frontend**
```bash
cd ../frontend
npm install
cp .env.example .env.local
```

**4. Setup Database**
```bash
# Create PostgreSQL database
createdb social_media_mvp

# Run migrations
cd backend
npm run migrate:up
```

**5. Start Services**
```bash
# Terminal 1: Backend API
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Workers
cd workers
npm run dev

# Terminal 4: Redis (if not using Docker)
redis-server
```

**Using Docker Compose:**
```bash
docker-compose up -d
```

---

## ⚙️ Configuration

### Backend Environment Variables

```bash
# .env.local (Backend)

# Server
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/social_media_mvp
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Facebook / Instagram (Meta)
FACEBOOK_APP_ID=your-app-id
FACEBOOK_APP_SECRET=your-app-secret
FACEBOOK_REDIRECT_URI=http://localhost:5000/auth/facebook/callback
INSTAGRAM_GRAPH_API_VERSION=v18.0

# TikTok
TIKTOK_CLIENT_KEY=your-client-key
TIKTOK_CLIENT_SECRET=your-client-secret
TIKTOK_REDIRECT_URI=http://localhost:5000/auth/tiktok/callback

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (for notifications)
SENDGRID_API_KEY=SG....

# Logging
LOG_LEVEL=debug
```

### Frontend Environment Variables

```bash
# .env.local (Frontend)

VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000
VITE_ENVIRONMENT=development

# OAuth Redirect URIs
VITE_FACEBOOK_APP_ID=your-app-id
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/me
```

### Accounts (Social Media)
```
GET    /api/accounts
POST   /api/accounts/link/:platform
DELETE /api/accounts/:accountId
GET    /api/accounts/:accountId
```

### Posts
```
GET    /api/posts                    # List posts
POST   /api/posts                    # Create post
GET    /api/posts/:postId           # Get post
PUT    /api/posts/:postId           # Update post
DELETE /api/posts/:postId           # Delete post
POST   /api/posts/:postId/schedule   # Schedule post
POST   /api/posts/:postId/publish    # Publish now
GET    /api/posts/calendar           # Calendar view
```

### Analytics
```
GET    /api/analytics                # User-level analytics
GET    /api/analytics/:accountId     # Account analytics
GET    /api/analytics/posts/:postId  # Post-level metrics
```

### Webhooks
```
POST   /api/webhooks/facebook
POST   /api/webhooks/instagram
POST   /api/webhooks/tiktok
POST   /api/webhooks/stripe
```

---

## 🗄️ Database Schema

See detailed schema in [Database Schema](#database-schema-details) section above.

### Migrations
```bash
# Create migration
npm run migrate:create <name>

# Run migrations
npm run migrate:up

# Rollback
npm run migrate:down

# Check status
npm run migrate:status
```

---

## 🐳 Deployment

### Docker Setup

**Build Images:**
```bash
docker-compose build
```

**Run Services:**
```bash
docker-compose up -d
```

### Production Deployment

**AWS Deployment Strategy:**
- **Frontend:** CloudFront + S3
- **Backend:** ECS + RDS (PostgreSQL)
- **Redis:** ElastiCache
- **Workers:** ECS Tasks
- **Payments:** Stripe

**Environment Configuration:**
```bash
# Use AWS Secrets Manager
aws secretsmanager create-secret --name social-media-mvp/backend
aws secretsmanager create-secret --name social-media-mvp/frontend
```

**CI/CD Pipeline:** (GitHub Actions)
```yaml
# .github/workflows/deploy.yml
- Lint & Test
- Build Docker images
- Push to ECR
- Deploy to ECS
- Run migrations
- Health checks
```

---

## 👨‍💻 Development Guide

### Project Setup Checklist
- [ ] Clone repository
- [ ] Install dependencies (backend & frontend)
- [ ] Configure `.env.local` files
- [ ] Create PostgreSQL database
- [ ] Run database migrations
- [ ] Register OAuth apps (Facebook, TikTok)
- [ ] Start development servers
- [ ] Verify API health: `http://localhost:5000/health`
- [ ] Verify Frontend: `http://localhost:5173`

### Code Style & Standards
- **Linting:** ESLint + Prettier
- **Testing:** Jest + React Testing Library
- **Type Safety:** Strict TypeScript configuration
- **Git Hooks:** Husky + lint-staged

### Common Development Tasks

**Running Tests:**
```bash
# Backend
cd backend
npm run test
npm run test:coverage

# Frontend
cd frontend
npm run test
npm run test:e2e
```

**Debugging:**
```bash
# Backend with Node Inspector
node --inspect-brk dist/server.js

# Frontend DevTools in VS Code
```

**Database:**
```bash
# Connect to database
psql social_media_mvp

# View migrations
npm run migrate:status

# Reset database (development only)
npm run db:reset
```

### Adding New Features

**1. Create API Endpoint:**
```typescript
// backend/src/routes/example.routes.ts
// backend/src/controllers/exampleController.ts
// backend/src/services/exampleService.ts
```

**2. Update Database Schema:**
```typescript
// backend/migrations/XXX_create_example_table.ts
```

**3. Create Frontend Service:**
```typescript
// frontend/src/services/api/example.service.ts
```

**4. Build UI Components:**
```typescript
// frontend/src/components/features/Example/
```

---

## 📊 Architecture Decision Records

### Why PostgreSQL?
- Robust relational data modeling
- JSONB support for flexible data
- Strong ACID compliance
- Cost-effective

### Why React + TypeScript?
- Type safety reduces bugs
- Component reusability
- Large ecosystem
- Strong developer experience

### Why Bull Queue + Redis?
- Reliable job scheduling
- Retry mechanisms
- Horizontal scalability
- Real-time processing

### Why Stripe?
- PCI compliance handled
- Webhook reliability
- Comprehensive API
- Excellent documentation

---

## 🔐 Security Considerations

1. **OAuth Token Storage:** Encrypted in database
2. **JWT Tokens:** Short-lived (15m), refresh token (7d)
3. **Rate Limiting:** 100 requests/minute per user
4. **Input Validation:** Sanitize all user inputs
5. **HTTPS Only:** Required in production
6. **CORS:** Whitelist allowed origins
7. **API Keys:** Rotate regularly
8. **Webhook Verification:** Validate webhook signatures

---

## 📝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📚 Additional Resources

- [Facebook Graph API Docs](https://developers.facebook.com/docs/graph-api)
- [Instagram API Docs](https://developers.facebook.com/docs/instagram-api)
- [TikTok for Developers](https://developers.tiktok.com/)
- [Stripe API Docs](https://stripe.com/docs/api)
- [Bull Queue Docs](https://docs.bullmq.io/)

---

## 📄 License

MIT License - See LICENSE file for details

---

## 💬 Support

- **Email:** support@example.com
- **Discord:** [Community Server](https://discord.gg/example)
- **Docs:** [Full Documentation](https://docs.example.com)
- **Issues:** [GitHub Issues](https://github.com/yourusername/social-media-automation-mvp/issues)

---

## 🎯 Roadmap

**Phase 1 (Current):**
- ✅ Core post scheduling
- ✅ Multi-platform support (Facebook, Instagram, TikTok)
- ✅ Basic analytics
- ✅ Subscription management

**Phase 2:**
- 🔜 Pinterest integration
- 🔜 LinkedIn support
- 🔜 AI-powered content suggestions
- 🔜 Advanced analytics & reporting

**Phase 3:**
- 🔜 Team collaboration
- 🔜 Content library & templates
- 🔜 Influencer outreach tools
- 🔜 Mobile apps (iOS/Android)

---

**Last Updated:** March 2026  
**Version:** 1.0.0-MVP
