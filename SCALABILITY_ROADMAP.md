# Scalability Roadmap

## Stage: 0-1K MAU - Single Location Launch

**Users:** 0 - 1,000 MAU
**Estimated Cost:** $24.58/month

### Architecture Changes
- Deploy API Server as single instance on Hetzner CX21 (2 vCPU, 4GB RAM) with PM2 process manager for Node.js reliability
- Configure PostgreSQL on same server with daily automated backups to Hetzner Storage Box
- Implement basic rate limiting (100 requests/min per IP) on API Server to prevent abuse during peak pizza hours
- Set up Nginx reverse proxy with SSL termination and static asset caching for Frontend App
- Configure iOS Mobile App with local SQLite cache for menu items to reduce API calls

### New Components
- PostgreSQL Database - Single instance for orders, menu items, and customer data
- Hetzner Storage Box (100GB) - For database backups and order receipt storage
- Uptime monitoring via UptimeRobot - Free tier for basic availability alerting

### Key Metrics
- **apiResponseTime:** < 200ms p95
- **orderThroughput:** 50 concurrent orders/hour
- **availability:** 99.0% uptime
- **databaseConnections:** < 20 concurrent
- **peakHourCapacity:** 100 orders (Friday/Saturday 6-9 PM)
- **appCrashRate:** < 1%

## Stage: 1K-50K MAU - Regional Popularity Growth

**Users:** 1,000 - 50,000 MAU
**Estimated Cost:** $89.5/month

### Architecture Changes
- Migrate API Server to 2x Hetzner CX31 instances (2 vCPU, 8GB RAM each) behind Hetzner Load Balancer for horizontal scaling
- Separate PostgreSQL to dedicated Hetzner CX41 (4 vCPU, 16GB RAM) with read replica for order history queries
- Implement Redis cache layer for menu items, pricing, and wait time estimates - reducing database load by 60%
- Add queue-based order processing with BullMQ to handle peak dinner rush without API timeouts
- Implement CDN (Cloudflare Free) for Frontend App static assets and menu images
- Add structured logging with Grafana Loki for debugging order flow issues
- Implement database connection pooling with PgBouncer (max 100 connections)

### New Components
- Hetzner Load Balancer - Distribute traffic across API Server instances with health checks
- Redis Cache (Hetzner CX11) - Cache menu, pricing, estimated wait times
- PostgreSQL Read Replica - Offload order history and analytics queries
- Grafana + Prometheus Stack - Monitor order completion rates, API latency, kitchen queue depth
- BullMQ Job Queue - Async order confirmation emails and receipt generation

### Key Metrics
- **apiResponseTime:** < 150ms p95
- **orderThroughput:** 500 concurrent orders/hour
- **availability:** 99.5% uptime
- **databaseConnections:** < 80 concurrent
- **cacheHitRate:** > 85% for menu queries
- **orderConfirmationTime:** < 3 seconds
- **peakHourCapacity:** 1000 orders (weekend evenings)
- **appCrashRate:** < 0.5%

## Stage: 50K-500K MAU - Multi-Location Franchise Scale

**Users:** 50,000 - 500,000 MAU
**Estimated Cost:** $285/month

### Architecture Changes
- Migrate to Kubernetes cluster (3x Hetzner CX41 nodes) for auto-scaling API Server pods based on order queue depth
- Implement PostgreSQL with Patroni for automatic failover and 2 read replicas for analytics
- Add Redis Sentinel cluster (3 nodes) for high-availability caching with automatic failover
- Implement API versioning to support multiple Mobile App versions during iOS updates
- Add GraphQL layer for efficient mobile data fetching - reduce payload size by 40%
- Implement event-driven architecture with NATS for real-time order status updates to Mobile App
- Add database sharding strategy by location_id for multi-restaurant support
- Implement blue-green deployments for zero-downtime releases during peak hours

### New Components
- Kubernetes Cluster (k3s on Hetzner) - Container orchestration with HPA for API Server
- NATS Messaging - Real-time order status push notifications to iOS app
- TimescaleDB Extension - Time-series data for order analytics and demand forecasting
- Sentry Error Tracking - Proactive Mobile App crash detection and API error monitoring
- Kong API Gateway - Rate limiting, authentication, and API analytics per location
- MinIO Object Storage - Scalable storage for receipts, menu images across locations
- PgBouncer Pool (dedicated) - Handle 500+ concurrent database connections

### Key Metrics
- **apiResponseTime:** < 100ms p95
- **orderThroughput:** 5000 concurrent orders/hour
- **availability:** 99.9% uptime
- **databaseConnections:** < 400 concurrent
- **cacheHitRate:** > 95% for menu queries
- **orderConfirmationTime:** < 2 seconds
- **pushNotificationDelivery:** < 500ms
- **autoScaleResponseTime:** < 60 seconds
- **crossLocationSyncLatency:** < 1 second
- **appCrashRate:** < 0.1%

## Inflection Points

| Timing | Trigger | Action | Cost Delta |
|--------|---------|--------|------------|
| 2K-5K MAU (typically month 3-6 after launch) | Friday/Saturday dinner rush causing order timeouts and failed submissions | Add second API Server instance behind load balancer and implement Redis caching for menu data | +$35/month (second CX31 instance + load balancer) |
| 8K-15K MAU (typically month 6-9) | Database CPU consistently high during peak hours causing slow order queries | Migrate database to dedicated server and add read replica for order history/analytics queries | +$25/month (dedicated CX41 for PostgreSQL + replica) |
| 10K-20K MAU (typically month 8-12) | Order confirmation delays causing customer complaints and abandoned orders | Implement BullMQ job queue for async order processing - immediate acknowledgment, background processing | +$5/month (Redis instance for queue) + development effort |
| 15K-25K MAU (typically month 10-14) | Single server failure would cause complete service outage during business hours | Implement multi-instance API deployment with health checks and automatic failover | +$20/month for redundant infrastructure |
| 30K-50K MAU (typically month 12-18) | Franchise expansion requiring multi-location support with separate menus and pricing | Implement location-based data partitioning, add location_id to all queries, deploy Kong API Gateway for per-location rate limiting | +$80/month (Kubernetes cluster + API gateway + additional database capacity) |
| 50K-100K MAU (typically month 15-24) | Manual scaling cannot keep up with unpredictable demand spikes (events, promotions) | Migrate to Kubernetes with Horizontal Pod Autoscaler triggered by order queue depth and API latency | +$120/month (k3s cluster overhead) but improved resource efficiency |
| 40K-80K MAU (typically month 14-20) | iOS app users complaining about stale order status - not knowing when pizza is ready | Implement NATS messaging for real-time push notifications - order received, preparing, ready for pickup | +$15/month (NATS cluster) + iOS push notification service costs |
