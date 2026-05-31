# Technology Decisions

| Category | Chosen | Reasoning | Alternatives |
|----------|--------|-----------|-------------|
| frontend | **Next.js 16.2.6** | For a web-based sales and marketing ops platform (GTM stack), Next.js 16 is the optimal choice. It provides SSR/SSG for SEO-critical marketing pages, React Server Components for performance, and App Router for complex nested layouts needed in multi-tenant SaaS dashboards. v16 brings improved caching primitives, better partial prerendering, and enhanced TypeScript 6 support. Multi-tenancy is handled elegantly via middleware-based tenant routing. The full-stack capability reduces infrastructure complexity for GTM tooling like landing pages, campaign dashboards, and analytics views — all in one framework. | React SPA with Vite 6.x, Remix 2.17.4 |
| backend | **Node.js 26.2.0 LTS + NestJS 11.1.24** | NestJS on Node.js 26 LTS is ideal for a multi-tenant SaaS GTM platform requiring full coverage across CRM, marketing automation, analytics, and sales ops. NestJS provides a structured, opinionated architecture with built-in support for dependency injection, guards (critical for multi-tenant auth), interceptors, and modular design — essential when building a complex GTM stack with many connectors. Node.js 26 LTS brings V8 engine improvements, native fetch stability, and better ESM support. The connector-heavy architecture (pre-built connectors syncing within 1-5 minutes) benefits from NestJS's module system where each connector is an isolated module. TypeScript 6 support ensures type safety across the entire connector interface layer. | Node.js 26.2.0 + Fastify 5.8.5, Python 3.14.5 + FastAPI |
| database | **PostgreSQL 18.4** | PostgreSQL 18 is the definitive choice for a multi-tenant SaaS GTM platform. It supports row-level security (RLS) natively — critical for tenant data isolation without application-layer complexity. JSONB columns handle flexible GTM event schemas (different CRM fields, marketing attributes per tenant). PostgreSQL 18 introduces improved parallel query execution, better logical replication for read replicas, and enhanced JSONB indexing — all valuable for GTM analytics queries across large datasets. The ACID compliance ensures data integrity for sales pipeline and revenue attribution data. Multi-tenancy is implemented via schema-per-tenant or RLS-per-tenant patterns, both well-supported. Full-text search handles contact/account search without a separate search engine at early scale. | MongoDB 8.3.1, PlanetScale (MySQL 9.7.0 compatible) |
| cache | **Redis 8.8.0** | Redis 8 is essential for the 1-5 minute sync SLA requirement. It serves multiple roles: (1) connector sync state tracking — storing last-sync timestamps and cursor positions per tenant per connector, (2) rate limiting for third-party API calls to CRM/marketing platforms, (3) session caching for multi-tenant auth tokens, (4) pub/sub for real-time sync status updates to the frontend dashboard, and (5) BullMQ job queue backing. Redis 8 introduces improved memory efficiency, better cluster rebalancing, and enhanced persistence options. The multi-tenant architecture benefits from Redis key namespacing per tenant. The 1-5 minute sync window is achievable with Redis-backed job scheduling without expensive database polling. | Upstash Redis (serverless), Memcached 1.6.x |
| queue | **BullMQ 5.77.6** | BullMQ is the optimal queue for the 1-5 minute connector sync requirement in a Node.js/NestJS stack. It provides repeatable cron-style jobs per connector per tenant, priority queues (premium tenants get faster sync), job retry with exponential backoff for flaky third-party APIs (Salesforce, HubSpot, etc.), and a built-in UI (Bull Board) for ops visibility. v5 brings improved job deduplication — critical to prevent duplicate sync jobs when multiple triggers fire simultaneously. Since Redis is already in the stack, BullMQ adds zero infrastructure overhead. Each connector type (CRM sync, email sync, ad platform sync) gets its own named queue with independent concurrency settings to meet the 1-5 minute SLA. | AWS SQS + EventBridge, Temporal.io |
| auth | **Auth0 (Enterprise) / Clerk** | For a multi-tenant SaaS GTM platform, a managed auth provider is strongly recommended over custom JWT implementation. Auth0 or Clerk provides: (1) organization/tenant management built-in — each customer org is isolated, (2) SSO/SAML for enterprise GTM customers (Salesforce admins expect SSO), (3) role-based access control for sales reps vs managers vs admins, (4) MFA out of the box for compliance, (5) social login for self-serve onboarding. Clerk specifically has excellent Next.js integration with middleware-based tenant detection. The time saved vs building multi-tenant auth from scratch is significant. Both support JWT tokens compatible with NestJS guards for API authorization. | Keycloak 24.x (self-hosted), JWT + Refresh Tokens (custom) |
| connector-integration | **Nango (self-hosted or cloud)** | Since the requirement is pre-built connectors only for a full GTM stack, Nango is the purpose-built solution. It provides 200+ pre-built OAuth connectors covering the entire GTM stack: Salesforce, HubSpot, Marketo, Outreach, Salesloft, LinkedIn Ads, Google Ads, Facebook Ads, Segment, Mixpanel, Intercom, Zendesk, and more. Nango handles OAuth token refresh, rate limiting, and sync scheduling — directly addressing the 1-5 minute sync requirement. It integrates with NestJS via webhooks or polling. The self-hosted option ensures tenant data never leaves your infrastructure, critical for enterprise GTM customers with data residency requirements. Nango's sync engine supports incremental syncs, reducing API quota consumption. | Airbyte (self-hosted), Merge.dev API |
| data-warehouse | **ClickHouse Cloud** | A GTM platform with full-stack coverage (CRM, marketing, ads, sales) generates high-volume event and activity data that requires OLAP-style queries for attribution, funnel analysis, and revenue reporting. ClickHouse is the best-in-class columnar database for this use case, offering sub-second queries on billions of rows. ClickHouse Cloud removes operational overhead. For the 1-5 minute sync requirement, ClickHouse's real-time ingestion via the HTTP interface or Kafka connector allows near-real-time analytics. Multi-tenancy is handled via tenant_id partition keys. GTM analytics (campaign attribution, pipeline velocity, conversion rates) are 10-100x faster than PostgreSQL for aggregation queries. | BigQuery (Google Cloud), Snowflake |
| monitoring | **Datadog** | For a production-ready multi-tenant SaaS GTM platform, Datadog is the right choice. The connector sync SLA (1-5 minutes) requires real-time alerting when sync jobs fail or lag — Datadog's APM traces each sync job execution end-to-end. Multi-tenant observability is handled via custom tags (tenant_id, connector_type) enabling per-tenant SLA monitoring. Datadog's Log Management correlates connector errors with specific tenants and API responses. The GTM platform's reliability is business-critical (sales teams depend on fresh data), making Datadog's alerting and on-call integrations (PagerDuty) essential. Synthetic monitoring validates connector health proactively. | Prometheus 2.x + Grafana 11.x, New Relic |
| cdn | **Cloudflare** | Cloudflare is the optimal CDN for a multi-tenant SaaS GTM platform. Cloudflare Workers enable tenant-aware edge routing — resolving tenant subdomains (tenant.gtmplatform.com) at the edge without hitting origin servers. DDoS protection is critical for a platform that sales teams depend on during peak campaign periods. Cloudflare's Web Application Firewall protects the connector OAuth callback endpoints from abuse. The generous free tier covers static asset CDN, and paid plans add Workers for tenant routing logic. Cloudflare R2 (S3-compatible) can store connector sync logs and exports without egress fees. | AWS CloudFront, Vercel Edge Network |
| containerization | **Docker 29.5.2 + Kubernetes 1.36.1** | Multi-tenant SaaS with full GTM stack coverage requires Kubernetes for production-grade orchestration. Each connector type (CRM, marketing, ads) runs as an independent deployment with separate scaling policies — ad platform connectors may need 10x more workers during campaign launches. Kubernetes 1.36 brings improved pod scheduling, better resource quotas for tenant isolation, and enhanced HPA (Horizontal Pod Autoscaler) for sync worker scaling. The NestJS API, BullMQ workers, and Next.js frontend each get independent deployments. Kubernetes namespaces provide logical separation for staging/production environments. Managed Kubernetes (EKS, GKE, or DigitalOcean Kubernetes) removes control plane overhead. | Docker Compose + single VPS, AWS ECS + Fargate |
| ci-cd | **GitHub Actions** | GitHub Actions is the standard CI/CD choice for a modern SaaS GTM platform. It provides native integration with the codebase, matrix builds for testing connector integrations across multiple API versions, and environment-specific deployments (staging per PR, production on main). For a multi-tenant SaaS, GitHub Actions handles: (1) running integration tests against mock connector APIs, (2) building and pushing Docker images to a registry, (3) deploying to Kubernetes via kubectl or Helm, (4) running database migrations safely with approval gates. The marketplace has pre-built actions for Datadog deployment tracking, Cloudflare cache purging, and Slack notifications for deployment status. | GitLab CI/CD, ArgoCD |
| orm | **Prisma ORM 7.8.0** | Prisma 7 is the right ORM for a multi-tenant SaaS GTM platform built on NestJS + PostgreSQL. It provides type-safe database queries critical for complex GTM data models (contacts, accounts, opportunities, campaigns, activities). Prisma's migration system handles schema evolution safely across tenants. v7 brings improved query engine performance, better connection pooling via Prisma Accelerate, and enhanced multi-schema support — directly useful for schema-per-tenant multi-tenancy patterns. The Prisma Client generates TypeScript types from the schema, ensuring connector data mapping is type-safe. NestJS has first-class Prisma integration via community modules. | Drizzle ORM 0.45.2, TypeORM 0.3.x |
| cloud-infrastructure | **AWS (EKS + RDS + ElastiCache)** | AWS is the recommended cloud for a production-ready multi-tenant SaaS GTM platform. EKS manages the Kubernetes cluster for connector workers and API services. RDS PostgreSQL 18 provides managed database with automated backups, read replicas for analytics queries, and Multi-AZ for 99.99% uptime SLA. ElastiCache Redis 8 handles the BullMQ queue and caching layer. AWS's compliance certifications (SOC2, HIPAA, GDPR) are essential for enterprise GTM customers. The GTM ecosystem (Salesforce, HubSpot, Marketo) has AWS-native integrations. AWS PrivateLink enables secure connector API calls without public internet exposure. The breadth of managed services reduces operational overhead for a SaaS team focused on product. | Google Cloud Platform (GKE + Cloud SQL), DigitalOcean (DOKS + Managed PostgreSQL) |

## Switch-To Conditions

### frontend (Next.js 16.2.6)
- If the team pivots to a pure SPA internal tool with no public-facing marketing pages, switch to React SPA + Vite for simplicity
- If Vercel costs become prohibitive at scale and self-hosting Next.js proves complex, evaluate Remix on a Node server
- If the frontend becomes a micro-frontend architecture with multiple teams, consider Module Federation with Webpack 5

### backend (Node.js 26.2.0 LTS + NestJS 11.1.24)
- If connector data transformation becomes CPU-intensive (e.g., ML-based lead scoring), introduce a Python FastAPI microservice alongside NestJS
- If the team is small and prefers less boilerplate, switch to Fastify with a custom plugin architecture
- If Go expertise exists on the team and connector throughput becomes a bottleneck, migrate high-frequency sync services to Go 1.26

### database (PostgreSQL 18.4)
- If event volume exceeds 100M rows/day and analytical queries slow down, introduce ClickHouse as a separate OLAP store alongside PostgreSQL
- If schema flexibility for connector data becomes a bottleneck, add MongoDB as a secondary store for raw connector payloads
- If global multi-region writes are required, evaluate CockroachDB (PostgreSQL-compatible) for distributed ACID transactions

### cache (Redis 8.8.0)
- If operational overhead of self-hosted Redis becomes a burden for a small team, migrate to Upstash or Redis Cloud managed service
- If sync state data grows beyond Redis memory limits, move cursor/state tracking to PostgreSQL and keep Redis for hot-path caching only
- If multi-region active-active is required, evaluate Redis Enterprise with geo-replication

### queue (BullMQ 5.77.6)
- If connector sync workflows become multi-step sagas (e.g., fetch → transform → enrich → write → notify), migrate to Temporal for durable workflow orchestration
- If the team moves to AWS-native infrastructure and wants zero queue management, switch to SQS + Lambda
- If sync job volume exceeds Redis memory capacity, evaluate Kafka for high-throughput event streaming with persistent log

### auth (Auth0 (Enterprise) / Clerk)
- If Auth0/Clerk per-MAU costs exceed $2000/month, evaluate self-hosted Keycloak with a dedicated DevOps resource
- If enterprise customers require on-premise auth data residency, implement Keycloak in customer VPCs
- If the product pivots to a developer-facing API platform, consider WorkOS for enterprise SSO with simpler pricing

### connector-integration (Nango (self-hosted or cloud))
- If a required GTM connector is not available in Nango, evaluate Merge.dev for CRM/sales tools or build a custom connector using the Nango SDK
- If data volume requires warehouse-style batch processing (e.g., nightly full syncs to data warehouse), add Airbyte alongside Nango for batch ETL
- If the team wants to build proprietary connector IP as a competitive moat, migrate away from Nango to a custom connector framework

### data-warehouse (ClickHouse Cloud)
- If the team already has a Google Cloud commitment, use BigQuery instead of ClickHouse Cloud
- If customers require self-service SQL access to their GTM data, Snowflake's data sharing features become compelling
- If data volume stays below 10M rows/month, PostgreSQL with proper indexing is sufficient and ClickHouse can be deferred

### monitoring (Datadog)
- If Datadog costs exceed $5000/month, migrate metrics to Prometheus + Grafana and keep only APM traces in Datadog
- If the team is cost-sensitive at early stage, start with New Relic's free tier (100GB/month) and migrate to Datadog at Series A
- If the infrastructure moves fully to AWS, evaluate CloudWatch + X-Ray for cost reduction on simpler workloads

### cdn (Cloudflare)
- If the infrastructure is fully AWS-native and the team wants unified billing, switch to CloudFront
- If Next.js is deployed on Vercel, use Vercel Edge Network for the frontend and Cloudflare for API/connector endpoints
- If enterprise customers require dedicated IP ranges or custom WAF rules, evaluate Cloudflare Enterprise or AWS Shield Advanced

### containerization (Docker 29.5.2 + Kubernetes 1.36.1)
- If the team lacks Kubernetes expertise, use AWS ECS Fargate or Google Cloud Run for managed container orchestration
- If the platform is early-stage with <10 tenants, use Docker Compose on a single VPS and defer Kubernetes until product-market fit
- If serverless becomes viable for connector workers, migrate sync jobs to AWS Lambda or Google Cloud Functions

### ci-cd (GitHub Actions)
- If GitOps becomes the deployment standard, add ArgoCD alongside GitHub Actions (CI in GHA, CD in ArgoCD)
- If the team moves to GitLab for compliance/self-hosting requirements, migrate to GitLab CI/CD
- If build times exceed 15 minutes, evaluate Depot.dev for faster Docker builds or self-hosted GitHub Actions runners

### orm (Prisma ORM 7.8.0)
- If raw SQL performance becomes critical for complex GTM analytics queries, switch to Drizzle ORM for its SQL-first approach
- If the team prefers Active Record patterns familiar from Rails/Django, TypeORM is a reasonable alternative
- If Prisma Accelerate connection pooling costs are high, self-host PgBouncer and use Drizzle for direct connection management

### cloud-infrastructure (AWS (EKS + RDS + ElastiCache))
- If the team has existing GCP credits or BigQuery is the analytics warehouse of choice, migrate to GCP
- If cost is the primary constraint at early stage, start on DigitalOcean and migrate to AWS at Series A when enterprise compliance is required
- If customers require Azure-hosted data residency, add Azure as a secondary region with Azure Kubernetes Service

