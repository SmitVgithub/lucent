# Technology Decisions

| Category | Chosen | Reasoning | Alternatives |
|----------|--------|-----------|-------------|
| backend | **Node.js + Fastify** | For lucent's API Server serving general users at production scale, Fastify offers superior performance over Express with built-in schema validation, serialization, and excellent TypeScript support. The shared JavaScript/TypeScript ecosystem with the frontend enables code sharing (types, validation schemas) and easier hiring. Fastify's plugin architecture scales well for production workloads while maintaining simplicity for initial development. | Node.js + Express, Python + FastAPI |
| frontend | **Next.js 14** | For lucent's Frontend App targeting general users, Next.js 14 provides the optimal balance of SEO capabilities (critical for user acquisition), performance through server components, and developer experience. The App Router enables streaming and partial rendering for better perceived performance. Since this is production-ready targeting general users, SEO and initial load performance are crucial differentiators that Next.js handles out-of-the-box. | React SPA (Vite), Vue 3 + Nuxt 3 |
| mobile | **React Native + Expo** | For lucent's Mobile App, React Native with Expo maximizes code sharing with the Next.js frontend (shared TypeScript types, validation logic, API clients, and potentially UI components via shared design system). Expo's managed workflow dramatically reduces native development complexity while EAS Build handles CI/CD. For general users requiring both iOS and Android, this provides the fastest path to production with a single codebase. | Flutter, Native (Swift + Kotlin) |
| database | **PostgreSQL 16** | For a production-ready application serving general users, PostgreSQL provides the reliability, ACID compliance, and feature richness needed. JSONB columns allow schema flexibility for evolving features without sacrificing relational integrity for core data. Full-text search capabilities reduce the need for separate search infrastructure initially. Row-level security can support multi-tenant patterns if needed. Excellent support across all cloud providers ensures no vendor lock-in. | MongoDB, PlanetScale (MySQL) |
| cache | **Redis 7** | Redis provides essential caching for production workloads serving general users, reducing database load and improving response times. Beyond simple caching, Redis supports session storage (if needed), rate limiting (critical for public APIs), and pub/sub for real-time features. The rich data structures (sorted sets, streams) enable features like leaderboards or activity feeds without additional infrastructure. Managed options (ElastiCache, Upstash) reduce operational burden. | In-memory (Node.js cache), Memcached |
| auth | **Clerk** | For lucent targeting general users at production scale, Clerk provides the fastest path to secure, feature-complete authentication. It includes social logins, MFA, user management UI, and handles security best practices (token rotation, breach detection). The React/Next.js SDK integrates seamlessly with the chosen frontend. For a production app, the security expertise and compliance features (SOC 2) of a managed provider outweigh the cost, especially pre-product-market-fit when development speed matters most. | Auth0, JWT + Refresh Tokens (self-built) |
| queue | **BullMQ (Redis-backed)** | Since Redis is already in the stack for caching, BullMQ provides job queuing without additional infrastructure. It handles background tasks like email sending, image processing, and async operations essential for production apps. The Bull Board UI aids debugging, and the Node.js-native integration works seamlessly with Fastify. For initial production scale, this is simpler than managing separate queue infrastructure. | AWS SQS, RabbitMQ |
| cdn | **Cloudflare** | For a production app serving general users globally, Cloudflare provides excellent CDN performance with industry-leading DDoS protection included. The generous free tier covers significant traffic, and Workers enable edge logic if needed. Unlike Vercel's CDN which only works optimally with Vercel hosting, Cloudflare works regardless of hosting choice, providing flexibility. The DNS and SSL management simplify operations. | Vercel Edge Network, CloudFront |
| observability | **Datadog** | For production-ready deployment serving general users, comprehensive observability is critical. Datadog provides unified logs, metrics, traces, and APM in one platform with excellent Node.js and Next.js integration. The ability to correlate frontend errors with backend traces accelerates debugging. While more expensive than self-hosted alternatives, the reduced operational burden and faster incident resolution justify the cost for a production system where downtime impacts real users. | Prometheus + Grafana + Loki, CloudWatch + X-Ray |
| ci-cd | **GitHub Actions** | GitHub Actions provides integrated CI/CD with the likely GitHub repository, eliminating context switching. The marketplace offers pre-built actions for Node.js, Next.js, React Native (via Expo EAS), and deployment to various platforms. Matrix builds handle testing across Node versions, and caching significantly speeds up builds. The free tier is generous for private repos, and the YAML syntax is widely understood. | GitLab CI, CircleCI |
| containerization | **Docker + AWS ECS Fargate** | Docker containers ensure consistency across development and production. ECS Fargate provides serverless container orchestration without managing EC2 instances or Kubernetes clusters, ideal for a production-ready app without dedicated DevOps. Auto-scaling handles traffic spikes for general users, and integration with ALB, CloudWatch, and other AWS services is seamless. This balances operational simplicity with production requirements. | Kubernetes (EKS), Vercel + Railway |
| iac | **AWS CDK** | With a TypeScript-based stack (Next.js, Fastify, React Native), AWS CDK allows infrastructure definition in the same language, enabling type-safe infrastructure and shared constants. The Constructs library provides high-level abstractions for common patterns (API Gateway + Lambda, ECS services). For an AWS-focused deployment (ECS Fargate, RDS, ElastiCache), CDK provides the best developer experience without multi-cloud requirements. | Terraform, Pulumi |
| api-documentation | **OpenAPI 3.1 + Scalar** | Fastify has excellent OpenAPI schema generation via @fastify/swagger. OpenAPI 3.1 provides the industry-standard API specification that enables auto-generated TypeScript clients for the frontend and mobile apps, ensuring type safety across the stack. Scalar provides a modern, interactive documentation UI superior to Swagger UI. This creates a single source of truth for API contracts. | Swagger UI, GraphQL + GraphQL Playground |
| testing | **Vitest + Playwright + React Native Testing Library** | Vitest provides fast unit and integration testing with native ESM support and Jest compatibility, working seamlessly with the TypeScript stack. Playwright handles E2E testing for the Next.js frontend with excellent cross-browser support. React Native Testing Library covers mobile component testing. This combination provides comprehensive coverage across all three application components with consistent patterns. | Jest + Cypress, Jest + Detox (for mobile) |

## Switch-To Conditions

### backend (Node.js + Fastify)
- If ML/AI features become core to the product, switch to Python + FastAPI for native ML library support
- If the team has stronger Python expertise and struggles with Node.js async patterns
- If CPU-intensive processing becomes a bottleneck, consider Go or Rust for specific microservices

### frontend (Next.js 14)
- If the app becomes purely authenticated (dashboard-only) with no public pages, switch to React SPA for simplicity
- If Vercel costs become prohibitive at scale, consider self-hosted Remix or plain React SPA
- If the team strongly prefers Vue's composition API and options API flexibility

### mobile (React Native + Expo)
- If the app requires heavy native features (AR, complex Bluetooth, background processing), consider native development
- If performance issues arise with complex animations or large lists, evaluate Flutter
- If the mobile app diverges significantly from web functionality, native apps may provide better UX

### database (PostgreSQL 16)
- If document-heavy workloads dominate (CMS, catalogs), consider MongoDB for natural data modeling
- If serverless scaling becomes critical and connection pooling is problematic, evaluate PlanetScale or Neon
- If global distribution with low latency is required, consider CockroachDB or distributed databases

### cache (Redis 7)
- If running single instance only and cache persistence isn't needed, in-memory caching is sufficient
- If only simple key-value caching is needed at extreme scale, Memcached may be more efficient
- If serverless deployment is chosen, consider Upstash Redis for connection-friendly access

### auth (Clerk)
- If enterprise SSO/SAML becomes a requirement, evaluate Auth0 for better B2B features
- If monthly active users exceed 10K and costs become significant, consider self-built JWT auth
- If specific auth flows are needed that managed providers don't support, build custom solution

### queue (BullMQ (Redis-backed))
- If job durability becomes critical (financial transactions), switch to SQS for better guarantees
- If complex routing patterns emerge (multiple consumers, topic-based), consider RabbitMQ
- If moving to serverless architecture, SQS integrates better with Lambda

### cdn (Cloudflare)
- If fully committed to Vercel hosting, use Vercel Edge Network for simplest setup
- If deeply invested in AWS ecosystem, CloudFront provides better integration
- If edge computing becomes critical, evaluate based on specific runtime needs

### observability (Datadog)
- If costs exceed budget significantly, migrate to self-hosted Prometheus/Grafana stack
- If fully committed to AWS and team is small, CloudWatch may be sufficient initially
- If specific compliance requires data residency, evaluate self-hosted or regional options

### ci-cd (GitHub Actions)
- If build times become a bottleneck, evaluate CircleCI for performance-critical pipelines
- If migrating to GitLab for other reasons, use GitLab CI for integration
- If complex pipeline orchestration is needed, consider dedicated CI platforms

### containerization (Docker + AWS ECS Fargate)
- If team grows and needs advanced deployment patterns (canary, blue-green), consider EKS
- If simplicity is paramount and costs are acceptable, Vercel for frontend + Railway for API
- If multi-cloud becomes a requirement, Kubernetes provides portability

### iac (AWS CDK)
- If multi-cloud deployment becomes necessary, switch to Terraform or Pulumi
- If team prefers declarative over imperative IaC, Terraform may be preferred
- If complex cross-cloud networking is needed, Terraform has better multi-provider support

### api-documentation (OpenAPI 3.1 + Scalar)
- If frontend needs become complex with many varied queries, consider GraphQL
- If mobile app has significantly different data needs than web, GraphQL flexibility helps
- If external API consumers prefer GraphQL, consider offering both REST and GraphQL

### testing (Vitest + Playwright + React Native Testing Library)
- If E2E mobile testing becomes critical, add Detox for comprehensive mobile coverage
- If team is more familiar with Jest, the migration cost may not be worth Vitest's speed gains
- If visual regression testing is needed, add Chromatic or Percy to the pipeline

