# Technology Decisions

| Category | Chosen | Reasoning | Alternatives |
|----------|--------|-----------|-------------|
| frontend | **Next.js 14** | For end consumers on a medium budget under $1000/month, Next.js provides the best balance of SEO capabilities (critical for consumer acquisition), fast development with React ecosystem, and cost-effective deployment on Vercel's free/hobby tier or self-hosted. The App Router enables server components reducing client bundle size, improving performance for general users on varying devices and connections. | React SPA (Vite), Vue 3 + Nuxt 3 |
| backend | **Node.js + Fastify** | Fastify offers excellent performance for I/O-bound consumer applications while sharing the JavaScript/TypeScript ecosystem with Next.js frontend, reducing context switching and enabling code sharing. Its low overhead keeps hosting costs within the $1000/month budget. Built-in schema validation and auto-generated OpenAPI docs accelerate development for small teams. | Node.js + Express, Python + FastAPI |
| database | **PostgreSQL 16** | PostgreSQL provides ACID compliance essential for consumer data integrity, JSONB for flexible schema evolution without migrations for certain features, and excellent performance. Managed options like Supabase ($25/month), Railway, or Render keep costs well under budget while eliminating operational overhead. Full-text search capabilities reduce need for separate search infrastructure. | MySQL 8, PlanetScale (MySQL) |
| cache | **Redis (Upstash Serverless)** | Upstash provides serverless Redis with a generous free tier (10K commands/day free, then pay-per-request), perfect for the budget constraint. Handles session storage, rate limiting, and caching without managing infrastructure. Pay-per-use model means costs scale with actual usage rather than fixed provisioning. | In-memory (Node.js with node-cache), Redis (Self-hosted on VPS) |
| queue | **BullMQ (Redis-backed via Upstash)** | Since Redis is already in the stack via Upstash, BullMQ adds job queue capabilities with zero additional infrastructure cost. Handles background tasks like email sending, notifications, and async processing. Built-in retry logic, delayed jobs, and a free UI (Bull Board) for monitoring. | Quirrel (Serverless), PostgreSQL-based (pg-boss) |
| auth | **JWT + Refresh Tokens (self-implemented)** | For a consumer app under $1000/month budget, self-implemented JWT auth avoids per-MAU costs of managed services that can quickly exceed budget at scale. Using libraries like jose for JWT handling and bcrypt for passwords provides security without vendor lock-in. Refresh token rotation adds security for consumer sessions. | Clerk, Supabase Auth |
| hosting | **Vercel (Frontend) + Railway (Backend + DB)** | Vercel's free tier handles Next.js frontend with excellent performance and zero config. Railway offers $5/month credit free, then predictable pricing for backend services and PostgreSQL (~$5-20/month for small-medium workloads). Combined cost stays well under $100/month for medium traffic, leaving budget headroom for growth. | Render, Hetzner VPS + Coolify |
| cdn | **Cloudflare (Free Tier)** | Cloudflare's free tier provides enterprise-grade CDN, DDoS protection, and SSL with zero cost. Essential for consumer-facing apps where performance and security matter. Works with any hosting provider, avoiding lock-in. Free Workers (100K requests/day) enable edge logic if needed. | Vercel Edge Network, Bunny CDN |
| monitoring | **Sentry (Error Tracking) + Better Stack (Logs/Uptime)** | Sentry's free tier (5K errors/month) catches frontend and backend errors with excellent stack traces and user context. Better Stack (formerly Logtail) offers free tier for logs and uptime monitoring. Combined provides production-ready observability at zero cost for medium-scale consumer apps. | Axiom, Grafana Cloud Free |
| ci-cd | **GitHub Actions** | GitHub Actions provides 2,000 free minutes/month for private repos, sufficient for a medium-scale project. Native integration with GitHub repos, extensive marketplace of actions, and matrix builds for testing. Vercel and Railway both offer automatic deployments from GitHub, reducing CI/CD complexity. | GitLab CI, Railway/Vercel Auto-Deploy |
| containerization | **Docker (for local dev) + Platform-native deployment** | Docker ensures consistent local development environments and enables easy migration between platforms. However, for under $1000/month budget, using platform-native deployment (Vercel for Next.js, Railway's native Node.js) is more cost-effective than running containers. Avoids Kubernetes complexity entirely. | Docker Compose + VPS, No containers (native runtimes) |
| email | **Resend** | Resend offers 3,000 free emails/month with excellent developer experience and React Email integration for templating. Perfect for transactional emails (welcome, password reset, notifications) for consumer apps. Simple API, good deliverability, and stays free for medium-scale usage. | SendGrid, AWS SES |
| file-storage | **Cloudflare R2** | R2 offers S3-compatible storage with zero egress fees, critical for consumer apps serving images/files. 10GB free storage and 1M free requests/month. Integrates with Cloudflare CDN for fast delivery. Dramatically cheaper than S3 for read-heavy consumer workloads. | AWS S3, Supabase Storage |
| search | **PostgreSQL Full-Text Search** | PostgreSQL's built-in full-text search handles most consumer app search needs without additional infrastructure or cost. Supports ranking, stemming, and fuzzy matching. Keeps architecture simple and budget-friendly. Only add dedicated search if PostgreSQL proves insufficient. | Meilisearch (Cloud), Algolia |
| analytics | **Plausible Analytics (Self-hosted) or Umami** | Privacy-friendly analytics that don't require cookie consent banners, improving UX for consumers. Umami is free and self-hostable on Railway/Vercel. Plausible self-hosted is also free. Provides essential metrics (pageviews, referrers, devices) without Google Analytics complexity or privacy concerns. | Google Analytics 4, PostHog |

## Switch-To Conditions

### frontend (Next.js 14)
- Switch to React SPA if the app is purely authenticated/dashboard with no public SEO needs
- Switch to Vue/Nuxt if team has existing Vue expertise and faster onboarding is priority

### backend (Node.js + Fastify)
- Switch to FastAPI if adding ML/AI features like recommendations or content analysis
- Switch to Express if hiring constraints favor developers with Express-only experience

### database (PostgreSQL 16)
- Switch to PlanetScale if expecting unpredictable traffic spikes requiring serverless scaling
- Switch to MongoDB if schema is highly dynamic and document-oriented with minimal relational needs

### cache (Redis (Upstash Serverless))
- Switch to in-memory caching if running single instance and cache loss on restart is acceptable
- Switch to self-hosted Redis if request volume exceeds Upstash cost-effectiveness (~$50+/month)

### queue (BullMQ (Redis-backed via Upstash))
- Switch to pg-boss if eliminating Redis dependency is priority and queue volume is low
- Switch to managed queue (AWS SQS) if migrating to AWS and need guaranteed delivery at scale

### auth (JWT + Refresh Tokens (self-implemented))
- Switch to Clerk if time-to-market is critical and user count will stay under 10K
- Switch to Supabase Auth if already using Supabase for database to reduce integration complexity

### hosting (Vercel (Frontend) + Railway (Backend + DB))
- Switch to Hetzner + Coolify if monthly costs exceed $200 and team can handle DevOps
- Switch to Render if preferring single vendor for all services

### cdn (Cloudflare (Free Tier))
- Switch to Bunny CDN if serving large media files where per-GB pricing is more economical
- Rely solely on Vercel Edge if frontend-only app with no separate backend CDN needs

### monitoring (Sentry (Error Tracking) + Better Stack (Logs/Uptime))
- Switch to Grafana Cloud if needing custom metrics dashboards and team has Prometheus experience
- Switch to Datadog if budget increases and need unified APM with traces

### ci-cd (GitHub Actions)
- Switch to GitLab CI if migrating to GitLab for other reasons
- Rely on auto-deploy only if test suite is minimal and manual QA is acceptable

### containerization (Docker (for local dev) + Platform-native deployment)
- Switch to Docker Compose + VPS if costs exceed $300/month and team can manage infrastructure
- Adopt Kubernetes only if scaling to multiple services requiring orchestration (unlikely under $1000/month)

### email (Resend)
- Switch to AWS SES if email volume exceeds 10K/month where cost savings justify setup
- Switch to SendGrid if needing marketing email features alongside transactional

### file-storage (Cloudflare R2)
- Switch to Supabase Storage if already using Supabase for auth/database for unified platform
- Switch to S3 if needing advanced features like S3 Object Lambda or Glacier archival

### search (PostgreSQL Full-Text Search)
- Switch to Meilisearch if search is core feature and PostgreSQL FTS quality is insufficient
- Switch to Algolia if search directly drives revenue and budget allows premium tooling

### analytics (Plausible Analytics (Self-hosted) or Umami)
- Switch to PostHog if needing session replay and funnel analysis for conversion optimization
- Switch to GA4 if stakeholders require GA4 specifically for reporting compatibility

