# Technology Decisions

| Category | Chosen | Reasoning | Alternatives |
|----------|--------|-----------|-------------|
| frontend | **React SPA (Vite)** | For a web-only consumer application with a $50-70 monthly budget, React SPA with Vite offers the best balance of developer productivity, fast builds, and zero hosting costs when deployed to free static hosting. Since this is end-consumer facing but web-only (no SSR requirement mentioned), a client-side rendered SPA keeps infrastructure costs minimal while providing excellent UX. Vite's fast HMR accelerates development for small teams. | Vue 3 + Vite, Next.js (Static Export) |
| mobile | **Progressive Web App (PWA)** | User explicitly stated 'Only web-based application support' - no native mobile apps required. A PWA approach allows the React SPA to be installable on mobile devices, work offline, and send push notifications without the cost and complexity of native app development or app store fees. This perfectly fits the $50-70 budget constraint while still providing mobile-like experience. | Responsive Web Only, Capacitor (if native needed later) |
| backend | **Node.js + Express** | For a budget of $50-70/month targeting end consumers, Express provides the simplest, most cost-effective backend. It has minimal learning curve, huge community support, and can run on the cheapest VPS options. The unopinionated nature means less boilerplate for a small consumer app. Shared JavaScript with React frontend reduces context switching and allows code sharing (validation schemas, types). | Node.js + Fastify, Python + FastAPI |
| database | **PostgreSQL (Supabase Free Tier or Railway)** | PostgreSQL offers ACID compliance, excellent JSON support for flexible consumer data, and full-text search built-in. For the $50-70 budget, Supabase offers a generous free tier (500MB, 2 projects) or Railway offers $5/month for small databases. This avoids self-managed database overhead while providing enterprise-grade reliability for consumer data. | SQLite (with Litestream backup), PlanetScale (MySQL) |
| cache | **In-memory (Node.js) with node-cache** | For a budget-constrained consumer app, adding Redis infrastructure is unnecessary overhead initially. Node-cache provides simple in-memory caching with TTL support, zero additional cost, and zero latency. At the expected scale for a $50-70/month app, a single Node.js instance with in-memory cache handles typical consumer traffic patterns efficiently. | Upstash Redis (Free Tier), No caching initially |
| auth | **JWT + Refresh Tokens (self-implemented)** | For end consumers on a tight budget, self-implemented JWT auth avoids per-user costs of managed auth services. Simple JWT with refresh tokens provides stateless authentication suitable for consumer apps. Libraries like jsonwebtoken and bcrypt make implementation straightforward. This approach costs nothing and scales with the app without pricing tiers. | Supabase Auth (if using Supabase), Clerk (Free Tier) |
| hosting | **Railway or Render (Starter Plans)** | For $50-70/month budget, Railway ($5-20/month) or Render ($7-25/month) provide the best balance of simplicity, cost, and features. Both offer easy deployment from Git, automatic HTTPS, and managed PostgreSQL. Unlike Hetzner VPS, these platforms eliminate DevOps overhead - critical for small teams. The slight premium over raw VPS is worth the reduced operational burden. | Hetzner VPS (CX11), Fly.io |
| cdn | **Cloudflare (Free Tier)** | Cloudflare's free tier provides enterprise-grade CDN, DDoS protection, and SSL for $0. For a consumer-facing web app, this is essential for performance and security. The free tier includes unlimited bandwidth, making it perfect for the $50-70 budget. Static assets from the React SPA are cached globally, reducing load on the origin server. | Vercel (for frontend only), No CDN (direct serving) |
| ci-cd | **GitHub Actions (Free Tier)** | GitHub Actions provides 2000 minutes/month free for private repos, more than sufficient for a small consumer app. Native GitHub integration means no additional services to manage. Simple workflows for testing, building, and deploying to Railway/Render can be set up in under an hour. Zero cost fits the tight budget perfectly. | Railway/Render Auto-Deploy, GitLab CI (if using GitLab) |
| containerization | **Docker (single container) with docker-compose for local dev** | For a simple consumer app on a $50-70 budget, Kubernetes is massive overkill. A single Docker container deployed to Railway/Render provides all needed isolation and reproducibility. docker-compose locally enables easy development with database and app together. This approach costs nothing extra and simplifies deployment significantly. | No containerization (direct Node.js), Podman |
| monitoring | **Betterstack (Free Tier) + Sentry (Free Tier)** | For a $50-70 budget, paid observability tools like Datadog are out of reach. Betterstack (formerly Logtail) offers free log aggregation and uptime monitoring. Sentry's free tier provides error tracking with 5K events/month. Together, these cover the essential monitoring needs for a consumer app at zero cost. Both integrate easily with Node.js. | Prometheus + Grafana (self-hosted), Railway/Render built-in logs + UptimeRobot |
| email | **Resend (Free Tier)** | Consumer apps need transactional email for signup verification, password resets, and notifications. Resend offers 3000 emails/month free with excellent developer experience and React Email support for templating. This fits perfectly within the budget while providing reliable delivery. Modern API is simpler than legacy providers like SendGrid. | SendGrid (Free Tier), AWS SES |
| file-storage | **Cloudflare R2 (Free Tier)** | If the consumer app needs file uploads (profile pictures, user content), Cloudflare R2 offers 10GB storage and zero egress fees on the free tier. S3-compatible API means easy migration if needed. Zero egress costs are crucial for consumer apps where users frequently download content. Integrates seamlessly with existing Cloudflare CDN. | Supabase Storage, Local filesystem (if minimal storage) |

## Switch-To Conditions

### frontend (React SPA (Vite))
- Switch to Next.js if SEO becomes critical for user acquisition
- Switch to Vue if team has stronger Vue expertise
- Switch to Next.js SSR if content-heavy pages need server rendering for performance

### mobile (Progressive Web App (PWA))
- Switch to native apps only if business requirements explicitly change to require app store presence
- Switch to Capacitor wrapper if native device features (camera, contacts) become essential
- Stay with responsive-only if PWA service worker complexity causes issues

### backend (Node.js + Express)
- Switch to Fastify if benchmarks show Express is bottleneck at scale
- Switch to FastAPI if ML/AI features become core to the product
- Switch to serverless functions if traffic is highly variable and unpredictable

### database (PostgreSQL (Supabase Free Tier or Railway))
- Switch to SQLite if staying under 1000 concurrent users and want zero database costs
- Switch to PlanetScale if MySQL compatibility is needed or team prefers MySQL
- Switch to managed PostgreSQL (Railway/Render) if Supabase free tier limits are hit

### cache (In-memory (Node.js) with node-cache)
- Switch to Upstash Redis if running multiple Node.js instances (horizontal scaling)
- Switch to Redis if session sharing across instances is needed
- Switch to Redis if pub/sub or real-time features require shared state

### auth (JWT + Refresh Tokens (self-implemented))
- Switch to Supabase Auth if already using Supabase for database
- Switch to Clerk if social login and MFA are critical and team is small
- Switch to Auth0 if enterprise SSO (SAML) becomes a requirement

### hosting (Railway or Render (Starter Plans))
- Switch to Hetzner VPS if DevOps expertise is available and want maximum cost savings
- Switch to Fly.io if global edge deployment becomes important for latency
- Switch to AWS/GCP if enterprise compliance requirements emerge

### cdn (Cloudflare (Free Tier))
- Switch to Cloudflare Pro if advanced WAF rules needed
- Switch to Vercel if deploying frontend separately and want zero-config
- Consider Bunny CDN if Cloudflare's proxy model causes issues with specific features

### ci-cd (GitHub Actions (Free Tier))
- Switch to platform auto-deploy if CI/CD complexity isn't needed
- Switch to GitLab CI if team moves to GitLab for other reasons
- Switch to CircleCI if GitHub Actions minutes become insufficient

### containerization (Docker (single container) with docker-compose for local dev)
- Switch to no containerization if deployment platform handles everything (Render native)
- Switch to Kubernetes only if scaling to multiple services with complex orchestration needs
- Consider Podman if security requirements mandate rootless containers

### monitoring (Betterstack (Free Tier) + Sentry (Free Tier))
- Switch to platform built-in logs if Betterstack setup is too complex
- Switch to Datadog if budget increases and need APM tracing
- Switch to self-hosted Grafana stack if running on Hetzner VPS with spare resources

### email (Resend (Free Tier))
- Switch to SendGrid if Resend has deliverability issues
- Switch to AWS SES if email volume exceeds free tiers significantly
- Switch to Postmark if transactional email deliverability becomes critical

### file-storage (Cloudflare R2 (Free Tier))
- Switch to Supabase Storage if already heavily invested in Supabase ecosystem
- Switch to AWS S3 if need advanced features like S3 Select or Glacier
- Use local filesystem only for development or if storage needs are truly minimal

