# Scalability Roadmap

## Stage: 0-1K MAU - Foundation Stage

**Users:** 0 - 1,000 MAU
**Estimated Cost:** $27.1/month

### Architecture Changes
- Deploy Frontend App on single Hetzner CX21 VPS (2 vCPU, 4GB RAM) with Nginx serving static assets and reverse proxy
- Remove Mobile App component - focus exclusively on web-based application as per requirements (PWA approach for mobile users)
- Implement basic CDN caching via Cloudflare free tier for Frontend App static assets
- Configure automated daily backups to Hetzner Storage Box for Frontend App data persistence

### New Components
- PostgreSQL database on same VPS instance for user data and application state
- Redis instance (shared memory) for session management and basic caching
- Cloudflare free tier for DNS, SSL termination, and DDoS protection

### Key Metrics
- **p95ResponseTime:** <200ms
- **throughput:** 50 requests/second
- **availability:** 99.0%
- **concurrentUsers:** 100
- **errorRate:** <1%
- **pageLoadTime:** <3 seconds

## Stage: 1K-50K MAU - Growth Stage

**Users:** 1,000 - 50,000 MAU
**Estimated Cost:** $68.5/month

### Architecture Changes
- Migrate Frontend App to Hetzner CX41 (4 vCPU, 16GB RAM) with containerized deployment using Docker Compose
- Separate PostgreSQL to dedicated Hetzner CX31 instance (2 vCPU, 8GB RAM) with connection pooling via PgBouncer
- Implement horizontal scaling readiness with stateless Frontend App design and externalized session storage
- Add application-level caching layer with Redis dedicated instance for API response caching and rate limiting
- Implement database read replicas preparation with streaming replication configuration

### New Components
- Dedicated Redis server on Hetzner CX21 for distributed caching and session storage
- Hetzner Load Balancer for traffic distribution and health checks
- Monitoring stack: Prometheus + Grafana on separate CX21 instance for Frontend App metrics
- Automated backup system with Hetzner Storage Box (100GB) for database point-in-time recovery

### Key Metrics
- **p95ResponseTime:** <150ms
- **throughput:** 500 requests/second
- **availability:** 99.5%
- **concurrentUsers:** 1000
- **errorRate:** <0.5%
- **pageLoadTime:** <2 seconds
- **databaseQueryTime:** <50ms p95

## Stage: 50K-500K MAU - Scale Stage

**Users:** 50,000 - 500,000 MAU
**Estimated Cost:** $285/month

### Architecture Changes
- Deploy Frontend App across 3 Hetzner CX41 instances behind load balancer with auto-healing configuration
- Implement PostgreSQL primary-replica cluster with 1 primary + 2 read replicas for query distribution
- Migrate to Kubernetes (k3s) on Hetzner dedicated servers for orchestration and auto-scaling of Frontend App
- Implement CDN edge caching with Cloudflare Pro for global static asset distribution
- Add database connection pooling cluster with PgBouncer in transaction mode across multiple nodes
- Implement queue-based architecture with Redis Streams for background job processing

### New Components
- Redis Sentinel cluster (3 nodes) for high-availability caching and session management
- Elasticsearch instance on CX41 for full-text search and log aggregation
- Object storage via Hetzner Storage Box (1TB) for user uploads and static assets
- Centralized logging with Loki + Grafana for distributed Frontend App tracing
- WAF implementation via Cloudflare Pro for enhanced security at scale

### Key Metrics
- **p95ResponseTime:** <100ms
- **throughput:** 5000 requests/second
- **availability:** 99.9%
- **concurrentUsers:** 10000
- **errorRate:** <0.1%
- **pageLoadTime:** <1.5 seconds
- **databaseQueryTime:** <30ms p95
- **cacheHitRate:** >90%
- **timeToRecovery:** <5 minutes

## Inflection Points

| Timing | Trigger | Action | Cost Delta |
|--------|---------|--------|------------|
| Around 3K-5K MAU mark | Database connection exhaustion on single PostgreSQL instance | Migrate PostgreSQL to dedicated Hetzner CX31 instance and implement PgBouncer connection pooling | +$15.90/month for dedicated database server |
| Around 8K-12K MAU mark | Frontend App CPU saturation during peak traffic | Upgrade from CX21 to CX41 instance and add Hetzner Load Balancer for future horizontal scaling | +$20.40/month (CX41 upgrade: +$11.90, Load Balancer: +$8.50) |
| Around 15K-25K MAU mark | Session storage and cache memory pressure | Deploy dedicated Redis instance on separate CX21 server with persistence enabled | +$7.95/month for dedicated Redis server |
| Around 40K-60K MAU mark | Single point of failure causing availability drops | Implement multi-instance Frontend App deployment with load balancer health checks and database read replica | +$45.00/month for redundant infrastructure (additional app server + DB replica) |
| Around 100K-150K MAU mark | Manual scaling operations becoming unsustainable | Migrate to k3s Kubernetes cluster on Hetzner dedicated servers with GitOps deployment pipeline | +$120.00/month for dedicated servers and orchestration overhead |
| Around 200K-300K MAU mark | Global user base experiencing latency issues | Upgrade to Cloudflare Pro with advanced caching rules and consider edge deployment strategy | +$20.00/month for Cloudflare Pro subscription |
