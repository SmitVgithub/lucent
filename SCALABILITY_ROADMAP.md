# Scalability Roadmap

## Stage: 0-1K MAU - Single Location Launch

**Users:** 0 - 1,000 MAU
**Estimated Cost:** $26.62/month

### Architecture Changes
- Deploy API Server as single Hetzner CX21 instance (2 vCPU, 4GB RAM) with Node.js/Express handling order processing, menu management, and payment integration
- Configure Frontend App as static assets served via Hetzner Object Storage with CloudFlare free tier CDN for the restaurant's web ordering interface
- Implement SQLite or single PostgreSQL instance on same server for order data, menu items, and customer preferences
- Set up basic health checks and uptime monitoring via UptimeRobot free tier for API Server availability
- Configure iOS Mobile App to communicate directly with API Server using REST endpoints with JWT authentication

### New Components
- PostgreSQL Database - Single instance on Hetzner CX11 (2 vCPU, 2GB RAM) for persistent storage of orders, menu items, and customer data
- Redis Cache - Small instance for session management and order queue status caching
- CloudFlare Free CDN - For static asset delivery and basic DDoS protection

### Key Metrics
- **apiResponseTime:** < 200ms p95
- **orderThroughput:** 50 orders/hour peak capacity
- **availability:** 99.0% uptime SLA
- **concurrentUsers:** 25 simultaneous app users
- **databaseConnections:** < 20 active connections
- **errorRate:** < 1% failed order submissions

## Stage: 1K-50K MAU - Regional Growth & Multi-Shift Operations

**Users:** 1,000 - 50,000 MAU
**Estimated Cost:** $78.5/month

### Architecture Changes
- Upgrade API Server to Hetzner CX31 (4 vCPU, 8GB RAM) with PM2 cluster mode running 4 Node.js workers for parallel order processing
- Migrate PostgreSQL to dedicated Hetzner CX21 instance with automated daily backups to Hetzner Storage Box
- Implement connection pooling via PgBouncer to handle increased database connections from Mobile App and Frontend App
- Add application-level rate limiting on API Server to prevent order spam during peak lunch/dinner hours
- Introduce queue-based order processing using BullMQ with Redis to handle order bursts without blocking API responses
- Implement horizontal read replicas consideration with master-slave PostgreSQL setup for menu queries vs order writes

### New Components
- BullMQ Order Queue - Redis-backed job queue for asynchronous order processing and kitchen ticket generation
- Hetzner Storage Box - 100GB for database backups, order receipts, and audit logs
- Sentry Error Tracking - Application performance monitoring for API Server and Mobile App crash reporting
- Kitchen Display System API - New endpoint module for real-time order status updates to in-restaurant displays

### Key Metrics
- **apiResponseTime:** < 150ms p95
- **orderThroughput:** 500 orders/hour peak capacity
- **availability:** 99.5% uptime SLA
- **concurrentUsers:** 200 simultaneous app users
- **databaseConnections:** < 100 pooled connections
- **orderQueueLatency:** < 5 seconds from submission to kitchen
- **errorRate:** < 0.5% failed order submissions

## Stage: 50K-500K MAU - Franchise/Multi-Location Scale

**Users:** 50,000 - 500,000 MAU
**Estimated Cost:** $285/month

### Architecture Changes
- Migrate API Server to Hetzner Cloud Load Balancer with 3x CX31 instances in auto-scaling group for horizontal scaling during peak hours
- Upgrade PostgreSQL to Hetzner dedicated server (AX41-NVMe) with 64GB RAM and NVMe storage for high-throughput order processing
- Implement read replica architecture with 2 PostgreSQL replicas handling menu queries while master handles order writes
- Deploy Redis Sentinel cluster (3 nodes) for high-availability caching and session management across multiple API Server instances
- Introduce API versioning on API Server to support older Mobile App versions during iOS app store update cycles
- Implement multi-tenant architecture in API Server to support multiple Sam's Pizza franchise locations with isolated data
- Add GraphQL layer for Mobile App to reduce over-fetching and optimize bandwidth for menu and order status queries

### New Components
- Hetzner Load Balancer - Layer 4/7 load balancing across API Server instances with health checks
- PostgreSQL Read Replicas (2x) - Dedicated read instances for menu browsing and order history queries
- Redis Sentinel Cluster - 3-node HA setup for session persistence and distributed caching
- Centralized Logging Stack - Loki + Grafana on dedicated CX21 for aggregated logs from all API Server instances
- Location Management Service - New microservice for franchise location data, hours, and menu variations

### Key Metrics
- **apiResponseTime:** < 100ms p95
- **orderThroughput:** 5000 orders/hour peak capacity
- **availability:** 99.9% uptime SLA
- **concurrentUsers:** 2000 simultaneous app users
- **databaseConnections:** < 500 pooled connections across replicas
- **orderQueueLatency:** < 3 seconds from submission to kitchen
- **errorRate:** < 0.1% failed order submissions
- **loadBalancerLatency:** < 10ms added latency
- **cacheHitRate:** > 85% for menu and location data

## Inflection Points

| Timing | Trigger | Action | Cost Delta |
|--------|---------|--------|------------|
| 500-800 MAU, typically 2-3 months after launch | Peak hour order failures during lunch rush (11am-1pm) or dinner rush (5pm-8pm) | Upgrade API Server from CX21 to CX31 and implement PM2 cluster mode with 4 workers; add Redis-backed order queue to decouple order submission from processing | +$18/month (from $26.62 to ~$45) for server upgrade and Redis instance |
| 2K-5K MAU, typically 4-6 months post-launch | Database connection exhaustion during concurrent Mobile App usage | Deploy PgBouncer connection pooler and migrate PostgreSQL to dedicated instance; implement connection pooling in API Server database driver | +$12/month for dedicated PostgreSQL CX21 instance |
| 15K-25K MAU, typically 8-12 months post-launch | Single server becomes single point of failure affecting restaurant operations | Implement Hetzner Load Balancer with 2 API Server instances; configure PostgreSQL streaming replication to standby; deploy Redis Sentinel for cache HA | +$85/month (Load Balancer $5 + additional API Server $15 + PostgreSQL replica $15 + Redis Sentinel nodes $50) |
| 30K-50K MAU, typically 12-18 months post-launch | Franchise expansion requiring multi-location support in Mobile App | Implement multi-tenant data architecture with location_id partitioning; add Location Management Service microservice; update Mobile App to support location selection and location-specific menus | +$45/month for Location Management Service instance and increased database storage |
| 75K-100K MAU, typically 18-24 months post-launch | Mobile App performance degradation from over-fetching menu and order data | Implement GraphQL layer on API Server for Mobile App queries; add DataLoader for batching database queries; implement response compression and field selection | +$0-15/month (primarily development effort; minimal infrastructure cost if using existing API Server capacity) |
| 300K-500K MAU, typically 24-36 months post-launch | Cost optimization threshold where Hetzner limitations impact growth | Evaluate migration to GCP/AWS for managed services (Cloud Run, RDS, ElastiCache); implement Terraform IaC for multi-cloud portability; consider hybrid approach with Hetzner for compute and hyperscaler for managed databases | +150-200% cost increase (from ~$285 to $700-850/month) offset by reduced operational overhead and improved reliability |
