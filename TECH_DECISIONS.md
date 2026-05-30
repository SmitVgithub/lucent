# Technology Decisions

| Category | Chosen | Reasoning | Alternatives |
|----------|--------|-----------|-------------|
| backend | **Node.js + Fastify** | For lucent's API Server serving general users at production scale, Fastify offers superior performance over Express with built-in schema validation, serialization, and TypeScript support. The architecture shows a simple frontend→api-server data flow which Fastify handles efficiently. Its plugin system allows clean separation of concerns as the API grows, and the large Node.js ecosystem ensures easy hiring and library availability for a production-ready system. | Node.js + Express, Python + FastAPI |
| frontend | **Next.js 14** | For lucent's Frontend App targeting general users, Next.js 14 provides the SEO benefits crucial for user acquisition, server-side rendering for fast initial loads, and the App Router for modern React patterns. The production-ready requirement aligns with Next.js's built-in optimizations (image optimization, code splitting, prefetching). Sharing TypeScript with the Fastify backend enables type sharing and reduces cognitive overhead. | React SPA (Vite), Vue 3 + Nuxt 3 |
| mobile | **React Native** | For lucent's Mobile App, React Native maximizes code sharing with the Next.js frontend through shared TypeScript types, utilities, and potentially UI components via a monorepo. General users expect both iOS and Android support, and React Native delivers near-native performance for typical app interactions. The team can leverage existing React knowledge, reducing ramp-up time for a production-ready mobile experience. | Flutter, Native (Swift + Kotlin) |
| database | **PostgreSQL 16** | For a production-ready system serving general users, PostgreSQL provides the ACID compliance needed for data integrity, excellent query performance, and JSONB support for flexible schema evolution as lucent's requirements mature. The frontend→api-server flow suggests standard CRUD operations where PostgreSQL excels. Its mature ecosystem includes excellent ORMs (Prisma, Drizzle) that integrate well with the Node.js/TypeScript stack. | MongoDB, PlanetScale (MySQL) |
| cache | **Redis 7** | For production-ready scaling, Redis provides essential caching for API responses, session management, and rate limiting that general users will trigger. Its pub/sub capabilities enable real-time features if lucent adds notifications or live updates. Redis's data structures (sorted sets, hashes) support common patterns like leaderboards or user activity tracking that general-user apps often need. | In-memory (Node.js), Memcached |
| queue | **BullMQ (Redis-backed)** | Since Redis is already chosen for caching, BullMQ leverages the same infrastructure for background job processing without additional operational overhead. For lucent's production needs, BullMQ handles email sending, image processing, and async tasks that general-user apps require. Its built-in UI (Bull Board) provides job monitoring, and the Node.js-native API integrates seamlessly with Fastify. | AWS SQS, RabbitMQ |
| auth | **Auth0** | For general users at production scale, Auth0 provides battle-tested authentication with social logins (Google, Apple, Facebook) that reduce signup friction. The mobile app requirement makes Auth0's native SDKs valuable for secure token handling. Auth0's MFA, brute-force protection, and compliance certifications (SOC2, GDPR) are essential for production-ready user-facing apps without building security infrastructure from scratch. | Clerk, JWT + Refresh Tokens (self-built) |
| cdn | **Cloudflare** | For general users globally, Cloudflare provides excellent CDN performance with the added benefit of DDoS protection crucial for production apps. Its generous free tier covers most startup needs, and Workers enable edge logic for A/B testing or personalization. The multi-cloud nature avoids lock-in, important since lucent's stack isn't AWS-specific. | Vercel Edge Network, CloudFront |
| observability | **Datadog** | For production-ready monitoring of API Server, Frontend, and Mobile App, Datadog provides unified APM, logs, and metrics across all three components. General users expect reliability, and Datadog's alerting, error tracking, and distributed tracing help maintain SLAs. The mobile SDK provides crash reporting and user session tracking essential for mobile app quality. | Grafana Cloud + Sentry, CloudWatch + X-Ray |
| ci-cd | **GitHub Actions** | For a production-ready system with three components (API, Frontend, Mobile), GitHub Actions provides unified CI/CD with excellent monorepo support. The marketplace has actions for Node.js testing, Next.js deployment, and React Native builds. Native GitHub integration means PR checks, deployments, and code review are seamlessly connected without additional tooling. | GitLab CI, CircleCI |
| containerization | **Docker + Docker Compose** | For local development consistency across API Server and Frontend, Docker ensures environment parity. Docker Compose orchestrates the multi-service setup (API, PostgreSQL, Redis) for development. For production, containers enable deployment to any platform (AWS ECS, Google Cloud Run, Railway) without lock-in, supporting the production-ready requirement. | Kubernetes, Serverless (No containers) |
| iac | **Pulumi** | With a TypeScript-based stack (Fastify, Next.js, React Native), Pulumi allows infrastructure definition in the same language, enabling type sharing and reducing context switching. For production-ready infrastructure, Pulumi's testing support ensures infrastructure changes are validated before deployment. Its multi-cloud support avoids lock-in while providing better abstractions than raw Terraform HCL. | Terraform, AWS CDK |
| hosting | **Vercel + Railway** | For lucent's production deployment, Vercel provides optimal Next.js hosting with automatic optimizations, preview deployments, and edge functions. Railway hosts the Fastify API with PostgreSQL and Redis as managed services, offering simple scaling and automatic SSL. This split leverages each platform's strengths while keeping operational overhead minimal for a production-ready system. | AWS (ECS + RDS + ElastiCache), Render |

## Switch-To Conditions

### backend (Node.js + Fastify)
- Switch to FastAPI if lucent adds ML/AI features requiring Python libraries like TensorFlow or PyTorch
- Switch to Express if team has extensive Express experience and performance benchmarks show Fastify gains are negligible for actual workload
- Switch to Go/Rust if API becomes CPU-intensive with heavy computation requirements

### frontend (Next.js 14)
- Switch to React SPA if lucent becomes a B2B dashboard where SEO is irrelevant and users are authenticated
- Switch to Vue/Nuxt if team has strong Vue expertise and hiring Vue developers is easier in your market
- Switch to Remix if data mutations become complex and you need better progressive enhancement

### mobile (React Native)
- Switch to Flutter if app requires complex custom animations or graphics-heavy features where React Native struggles
- Switch to Native if app needs deep OS integration (AR, health sensors, background processing) that React Native bridges poorly
- Switch to PWA if mobile app is primarily content consumption and installation friction is a concern

### database (PostgreSQL 16)
- Switch to MongoDB if data model becomes heavily document-oriented with deeply nested structures that don't fit relational patterns
- Switch to PlanetScale if connection pooling becomes problematic in serverless deployment or schema migrations cause downtime
- Switch to CockroachDB if global distribution with strong consistency becomes a requirement

### cache (Redis 7)
- Switch to in-memory caching if running single instance and cache misses are acceptable during deploys
- Switch to Memcached if cache workload is purely key-value strings and Redis features are unused
- Switch to KeyDB if Redis becomes a bottleneck and drop-in multi-threaded alternative is needed

### queue (BullMQ (Redis-backed))
- Switch to SQS if deploying on AWS and want zero queue infrastructure management
- Switch to RabbitMQ if complex routing patterns emerge (topic-based, fanout to multiple consumers)
- Switch to Kafka if event sourcing or stream processing becomes a core architectural pattern

### auth (Auth0)
- Switch to Clerk if developer experience becomes priority and Auth0's complexity slows development
- Switch to self-built JWT if user count makes Auth0 costs prohibitive (typically 50K+ MAU)
- Switch to Keycloak if on-premise deployment or air-gapped environments are required

### cdn (Cloudflare)
- Switch to Vercel Edge if deploying Next.js on Vercel and want zero CDN configuration
- Switch to CloudFront if rest of infrastructure moves to AWS and native integration is valuable
- Switch to Fastly if real-time cache purging becomes critical (sub-second invalidation)

### observability (Datadog)
- Switch to Grafana Cloud + Sentry if Datadog costs exceed budget and team can manage multiple tools
- Switch to CloudWatch if fully committed to AWS and cost optimization is critical
- Switch to self-hosted Prometheus + Grafana if running Kubernetes and have DevOps expertise

### ci-cd (GitHub Actions)
- Switch to CircleCI if mobile builds become slow and need better macOS runner performance
- Switch to GitLab CI if moving to GitLab for source control or need self-hosted runners
- Switch to Buildkite if build times become critical and need maximum parallelization control

### containerization (Docker + Docker Compose)
- Switch to Kubernetes if scaling beyond 10+ services or need advanced deployment patterns (canary, blue-green)
- Switch to serverless if traffic is highly variable with long idle periods and cold starts are acceptable
- Switch to Podman if Docker licensing becomes a concern for enterprise deployment

### iac (Pulumi)
- Switch to Terraform if hiring DevOps engineers who know Terraform but not Pulumi
- Switch to AWS CDK if fully committed to AWS and want tightest integration
- Switch to SST if building serverless-first on AWS and want opinionated framework

### hosting (Vercel + Railway)
- Switch to AWS if compliance requirements mandate specific certifications or data residency
- Switch to Render if want single platform for everything and Vercel costs become prohibitive
- Switch to Google Cloud Run if team has GCP expertise or need specific GCP services

