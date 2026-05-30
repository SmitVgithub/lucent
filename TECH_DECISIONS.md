# Technology Decisions

| Category | Chosen | Reasoning | Alternatives |
|----------|--------|-----------|-------------|
| frontend | **React SPA with TypeScript** | For a web app embedded on an existing website, a React SPA is ideal because it can be bundled as a widget/iframe with minimal footprint. Since this is a document search tool (not a marketing site), SEO is irrelevant. React's ecosystem has excellent document viewer libraries and search UI components. The standalone nature means it needs to be self-contained and easily embeddable without conflicting with the host website's stack. | Vue 3 SPA, Web Components (Lit) |
| backend | **Node.js + Fastify** | Fastify provides excellent performance for search API endpoints and has strong TypeScript support matching the frontend. For HIPAA compliance, Fastify's plugin architecture makes it easy to add audit logging, request validation, and security headers. The standalone requirement means we need a self-contained server that can run anywhere without cloud-specific dependencies. Fastify's schema validation helps ensure PHI data handling is strictly controlled. | Python + FastAPI, Node.js + Express |
| database | **PostgreSQL 16** | PostgreSQL is essential for HIPAA/ISO 27001 compliance due to its robust ACID compliance, row-level security, and comprehensive audit logging capabilities. Its full-text search (tsvector/tsquery) handles document search natively without additional infrastructure. JSONB support allows flexible document metadata storage. For standalone deployment, PostgreSQL can run on any infrastructure without cloud lock-in, and pg_audit extension provides the audit trails required for compliance. | MongoDB, SQLite with Litestream |
| search-engine | **PostgreSQL Full-Text Search** | For a standalone HIPAA-compliant document search system, keeping search within PostgreSQL eliminates additional infrastructure and reduces the attack surface for PHI. PostgreSQL's tsvector provides ranking, stemming, and phrase search. This simplifies compliance auditing since all data stays in one encrypted, auditable database. For moderate document volumes (up to hundreds of thousands), this performs adequately without the operational overhead of a separate search cluster. | Elasticsearch/OpenSearch, Meilisearch |
| cache | **Redis 7** | Redis provides session management for authenticated users, caches frequent search queries, and can store document access tokens with automatic expiration. For HIPAA compliance, Redis supports TLS encryption and ACLs. The standalone requirement is met since Redis can be deployed alongside the application on any infrastructure. Redis also enables rate limiting to prevent abuse of the search API. | In-memory (Node.js cache), KeyDB |
| auth | **JWT + Refresh Tokens with custom implementation** | For HIPAA compliance, we need full control over authentication audit trails, token revocation, and session management. A custom JWT implementation allows logging every authentication event, implementing break-the-glass procedures, and ensuring PHI access is properly authorized and audited. Standalone deployment rules out cloud-dependent auth providers. Short-lived access tokens (15 min) with refresh tokens stored in PostgreSQL provide security with revocation capability. | Keycloak (self-hosted), Auth0/Clerk |
| document-storage | **Local filesystem with encryption at rest** | For standalone HIPAA-compliant deployment, storing documents on encrypted local/attached storage avoids cloud dependencies and keeps PHI within controlled infrastructure. Using AES-256 encryption with keys managed separately (environment variables or HSM) meets HIPAA encryption requirements. The application handles access control, and PostgreSQL stores document metadata and access logs. | MinIO (S3-compatible), PostgreSQL Large Objects |
| containerization | **Docker Compose** | For a standalone application, Docker Compose provides the right balance of containerization benefits (reproducible deployments, isolation) without Kubernetes complexity. A single docker-compose.yml can define the app, PostgreSQL, and Redis services with proper networking and volume encryption. This meets ISO 27001 requirements for documented, repeatable deployments while remaining simple enough for on-premise installation. | Kubernetes (K3s), Bare metal/VM deployment |
| observability | **Prometheus + Grafana (self-hosted)** | For standalone HIPAA/ISO 27001 compliant deployment, self-hosted observability keeps all logs and metrics on-premise without sending data to third parties. Prometheus collects metrics, Grafana provides dashboards, and Loki handles log aggregation. This stack is open-source, well-documented, and can be included in the Docker Compose deployment. Audit logs for compliance are stored in PostgreSQL separately. | OpenTelemetry + Jaeger, Application-level logging only |
| ci-cd | **GitHub Actions** | GitHub Actions provides CI/CD without additional infrastructure, with built-in secrets management for handling credentials securely. For ISO 27001, it offers audit trails of all deployments. The pipeline builds Docker images, runs security scans (SAST/DAST), executes tests, and produces versioned release artifacts. Self-hosted runners can be used if code cannot leave customer infrastructure. | GitLab CI (self-hosted), Jenkins |
| security-scanning | **Trivy + OWASP Dependency Check** | HIPAA and ISO 27001 require vulnerability management. Trivy scans Docker images for OS and application vulnerabilities, while OWASP Dependency Check identifies vulnerable npm/Node.js dependencies. Both are open-source and can run in CI/CD without sending data externally. This combination covers container security and supply chain security requirements. | Snyk, Grype + Syft |
| encryption | **Application-level encryption with libsodium** | For HIPAA compliance, PHI must be encrypted at rest and in transit. Using libsodium (via sodium-native npm package) provides modern, audited cryptographic primitives. Documents are encrypted before storage using AES-256-GCM, with encryption keys derived from a master key using proper KDF. This provides defense-in-depth beyond database/filesystem encryption and ensures PHI is protected even if storage is compromised. | Node.js native crypto, HashiCorp Vault |
| api-documentation | **OpenAPI 3.1 with Fastify Swagger** | ISO 27001 requires documented interfaces. Fastify's swagger plugin auto-generates OpenAPI specs from route schemas, ensuring documentation stays in sync with code. This provides interactive API documentation for integration purposes and supports compliance audits by documenting all data flows and endpoints that handle PHI. | Manual OpenAPI specification, GraphQL with generated docs |
| testing | **Vitest + Playwright** | Vitest provides fast unit and integration testing with native TypeScript support, matching the frontend/backend stack. Playwright handles E2E testing of the embedded widget across browsers. For HIPAA/ISO 27001, comprehensive testing demonstrates due diligence in software quality. Both tools can run in CI/CD without external dependencies. | Jest + Cypress, Node.js native test runner |
| backup-recovery | **pg_dump with encrypted offsite backup** | HIPAA requires data backup and disaster recovery capabilities. PostgreSQL's pg_dump provides consistent backups that are encrypted using GPG before storage. For standalone deployment, backups can be stored on attached storage or synced to customer-controlled offsite location. Automated daily backups with 30-day retention meet typical compliance requirements. | pgBackRest, Barman |
| reverse-proxy | **Caddy** | Caddy provides automatic HTTPS with Let's Encrypt, which is essential for HIPAA's encryption-in-transit requirement. It's simpler to configure than Nginx for standalone deployment, handles TLS certificate renewal automatically, and includes security headers by default. For an embedded widget, Caddy can handle CORS configuration and serve the static frontend while proxying API requests. | Nginx, Traefik |

## Switch-To Conditions

### frontend (React SPA with TypeScript)
- If the host website uses Vue and wants tighter integration, switch to Vue 3
- If multiple websites with different frameworks need to embed this, switch to Web Components
- If bundle size becomes critical (<50KB requirement), consider Preact or Svelte

### backend (Node.js + Fastify)
- If implementing semantic/vector search with ML models, switch to Python + FastAPI
- If team has stronger Python expertise, switch to FastAPI
- If needing to integrate with existing Python document processing pipelines, switch to FastAPI

### database (PostgreSQL 16)
- If deploying as a single-tenant appliance with minimal infrastructure, consider SQLite
- If document structure is highly variable and schema flexibility is paramount, consider MongoDB Enterprise
- If scaling to millions of documents with complex search, add Elasticsearch alongside PostgreSQL

### search-engine (PostgreSQL Full-Text Search)
- If document volume exceeds 500K documents or search latency requirements are <50ms, add Elasticsearch
- If requiring semantic/vector search for AI-powered results, add pgvector extension or dedicated vector DB
- If search relevance tuning becomes critical, switch to Elasticsearch with custom analyzers

### cache (Redis 7)
- If deploying as absolute minimal single-instance, use in-memory caching
- If Redis licensing concerns arise, switch to KeyDB or Dragonfly
- If only caching search results (no sessions), consider in-memory with periodic persistence

### auth (JWT + Refresh Tokens with custom implementation)
- If enterprise SSO (SAML/OIDC) integration is required, add Keycloak
- If the standalone requirement is relaxed and BAA can be signed, consider Auth0 for faster implementation
- If deploying in healthcare enterprise environment, integrate with existing identity provider via OIDC

### document-storage (Local filesystem with encryption at rest)
- If document volume exceeds storage capacity of single server, switch to MinIO cluster
- If needing S3-compatible API for integration purposes, add MinIO
- If documents are small (<1MB) and transactional consistency is critical, consider PostgreSQL Large Objects

### containerization (Docker Compose)
- If deploying multiple instances with load balancing needs, consider K3s
- If customer requires non-containerized deployment, provide VM/bare-metal installation scripts
- If scaling beyond single-node, implement Docker Swarm or K3s

### observability (Prometheus + Grafana (self-hosted))
- If customer has existing monitoring infrastructure, integrate via OpenTelemetry exporters
- If minimal deployment is priority, use structured logging to files with log rotation
- If debugging complex search performance issues, add Jaeger for tracing

### ci-cd (GitHub Actions)
- If code cannot be on GitHub (regulatory requirement), switch to self-hosted GitLab
- If customer requires fully air-gapped CI/CD, use GitLab CI or Drone
- If integrating with existing Jenkins infrastructure, provide Jenkinsfile

### security-scanning (Trivy + OWASP Dependency Check)
- If needing SBOM generation for compliance, add Syft alongside Trivy
- If customer requires specific vulnerability database (NVD, etc.), ensure tooling supports it
- If developer experience is priority and SaaS is acceptable, consider Snyk

### encryption (Application-level encryption with libsodium)
- If enterprise key management is required, integrate HashiCorp Vault
- If customer has existing HSM infrastructure, integrate for key storage
- If deploying in cloud environment, consider cloud KMS (AWS KMS, etc.) for key management

### api-documentation (OpenAPI 3.1 with Fastify Swagger)
- If API consumers need flexible querying of document metadata, consider GraphQL
- If integrating with enterprise API gateways, ensure OpenAPI spec compatibility
- If design-first approach is mandated, switch to manual OpenAPI with code generation

### testing (Vitest + Playwright)
- If team is more familiar with Jest, use Jest instead of Vitest
- If testing embedded widget in specific customer environments, add BrowserStack integration
- If compliance requires specific test coverage tools, integrate with SonarQube

### backup-recovery (pg_dump with encrypted offsite backup)
- If database size exceeds 100GB, switch to pgBackRest for incremental backups
- If point-in-time recovery is required, implement WAL archiving with pgBackRest
- If customer has existing backup infrastructure, integrate via standard interfaces

### reverse-proxy (Caddy)
- If customer provides their own TLS certificates, Nginx may be preferred for familiarity
- If deploying behind existing load balancer/reverse proxy, may not need Caddy
- If requiring advanced traffic management, consider Traefik

