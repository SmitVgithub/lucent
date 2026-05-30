# Scalability Roadmap

## Stage: 0-1K MAU - Foundation Stage

**Users:** 0 - 1,000 MAU
**Estimated Cost:** $45/month

### Architecture Changes
- Deploy single Hetzner CX31 instance (4 vCPU, 8GB RAM) running monolithic application with Nginx reverse proxy
- Implement SQLite or single PostgreSQL instance for data persistence with daily automated backups to Hetzner Storage Box
- Configure basic rate limiting at Nginx level (100 req/min per IP) to prevent abuse
- Set up application-level caching using in-memory cache (Redis single instance or application memory)
- Implement structured logging with log rotation and basic alerting via uptime monitoring service

### New Components
- Hetzner CX31 compute instance as primary application server
- Hetzner Storage Box (100GB) for backups and static asset storage
- Cloudflare Free tier for DNS, basic DDoS protection, and CDN for static assets
- Basic monitoring stack: Uptime Robot or similar for availability checks

### Key Metrics
- **p95ResponseTime:** <200ms
- **throughput:** 50 requests/second sustained
- **availability:** 99.0% uptime
- **errorRate:** <1%
- **databaseConnections:** <50 concurrent
- **cpuUtilization:** <60% average

## Stage: 1K-50K MAU - Growth Stage

**Users:** 1,000 - 50,000 MAU
**Estimated Cost:** $185/month

### Architecture Changes
- Migrate from single instance to 2x Hetzner CX41 (8 vCPU, 16GB RAM) behind Hetzner Load Balancer for horizontal scaling
- Extract database to dedicated Hetzner CX31 running PostgreSQL with streaming replication to read replica
- Implement dedicated Redis cluster (2 nodes) for session management, caching, and rate limiting
- Deploy application as containerized services using Docker Compose with health checks and auto-restart
- Implement CDN-first architecture with Cloudflare Pro for dynamic content caching and image optimization
- Add background job processing with dedicated worker instance to offload async tasks from web servers

### New Components
- Hetzner Load Balancer (LB11) for traffic distribution across application instances
- Dedicated database server (CX31) with automated failover configuration
- Redis dedicated instance (CX21) for caching and session storage
- Background worker instance (CX21) for async job processing
- Cloudflare Pro ($20/month) for enhanced performance and security features
- Centralized logging with Grafana Loki on dedicated small instance
- Prometheus + Grafana monitoring stack for metrics and alerting

### Key Metrics
- **p95ResponseTime:** <150ms
- **throughput:** 500 requests/second sustained
- **availability:** 99.5% uptime
- **errorRate:** <0.5%
- **databaseConnections:** <200 concurrent
- **cacheHitRate:** >85%
- **cpuUtilization:** <70% average across instances
- **backgroundJobLatency:** <30 seconds for 95th percentile

## Stage: 50K-500K MAU - Scale Stage

**Users:** 50,000 - 500,000 MAU
**Estimated Cost:** $650/month

### Architecture Changes
- Migrate to Kubernetes cluster (3x Hetzner CX51 nodes) with auto-scaling pods based on CPU/memory metrics
- Implement database sharding strategy with PgBouncer connection pooling and read replica fleet (3+ replicas)
- Deploy multi-region CDN strategy with Cloudflare Business for advanced caching rules and Argo Smart Routing
- Implement event-driven architecture with message queue (RabbitMQ/NATS cluster) for service decoupling
- Add dedicated search infrastructure with Elasticsearch/Meilisearch cluster for complex queries
- Implement blue-green deployment pipeline with automated rollback capabilities
- Deploy API gateway layer for rate limiting, authentication, and request routing across microservices

### New Components
- Kubernetes cluster: 3x CX51 (16 vCPU, 32GB RAM) worker nodes with autoscaling to 6 nodes
- PostgreSQL cluster with 1 primary + 3 read replicas across availability zones
- Redis Sentinel cluster (3 nodes) for high-availability caching
- Message queue cluster (RabbitMQ 3-node) for async processing
- Search cluster (2x CX31) running Meilisearch for full-text search
- Object storage migration to Hetzner Object Storage for user uploads and media
- Cloudflare Business tier ($200/month) for advanced security and performance
- Dedicated CI/CD infrastructure with GitLab Runner or GitHub Actions self-hosted
- APM solution (self-hosted Jaeger) for distributed tracing
- Incident management integration (PagerDuty/Opsgenie) for on-call alerting

### Key Metrics
- **p95ResponseTime:** <100ms
- **p99ResponseTime:** <250ms
- **throughput:** 5000 requests/second sustained
- **availability:** 99.9% uptime
- **errorRate:** <0.1%
- **databaseConnections:** <1000 concurrent with pooling
- **cacheHitRate:** >92%
- **cpuUtilization:** <65% average with headroom for spikes
- **autoScaleResponseTime:** <2 minutes to scale up
- **deploymentFrequency:** Multiple deploys per day with zero downtime
- **meanTimeToRecovery:** <15 minutes

## Inflection Points

| Timing | Trigger | Action | Cost Delta |
|--------|---------|--------|------------|
| Typically at 2,000-5,000 MAU depending on application complexity | Single server CPU consistently saturated during peak hours | Add second application server behind Hetzner Load Balancer, implement session externalization to Redis | +$45/month (additional CX41 instance + LB11 load balancer) |
| Typically at 10,000-20,000 MAU when read-heavy workloads dominate | Database becomes bottleneck with slow queries and connection exhaustion | Migrate to dedicated database server, implement read replicas, add PgBouncer connection pooling | +$35/month (dedicated CX31 for PostgreSQL + backup storage increase) |
| Typically at 15,000-25,000 MAU with content-heavy applications | Cache misses causing database overload and inconsistent response times | Deploy dedicated Redis cluster, implement cache-aside pattern for hot data, add cache warming strategies | +$25/month (dedicated CX21 Redis instance with persistence) |
| Typically at 40,000-60,000 MAU when operational overhead becomes significant | Deployment complexity and scaling limitations of Docker Compose | Migrate to Kubernetes cluster with Helm charts, implement HPA for auto-scaling, set up GitOps workflow | +$200/month (3x CX51 Kubernetes nodes replacing smaller instances, net increase) |
| Typically at 75,000-100,000 MAU with notification/email heavy features | Synchronous processing causing request timeouts and poor user experience | Implement message queue cluster (RabbitMQ), decompose into event-driven microservices, add dedicated worker fleet | +$60/month (3-node RabbitMQ cluster on CX21 instances) |
| Typically at 100,000-150,000 MAU for content-rich applications | Search functionality degrading application performance | Deploy dedicated search cluster (Meilisearch/Elasticsearch), implement search indexing pipeline, offload all search from primary database | +$70/month (2x CX31 search cluster nodes) |
| Typically at 300,000-400,000 MAU approaching budget limits | Approaching budget ceiling while needing additional capacity | Implement aggressive caching strategies, optimize database queries, consider reserved instances, evaluate hybrid cloud for burst capacity | Cost optimization target: -15% through efficiency gains, or evaluate budget increase for continued growth |
