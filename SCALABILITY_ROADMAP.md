# Scalability Roadmap

## Stage: 0-1K MAU (Launch Phase: 500 drivers, 50 dispatchers, 10 warehouses)

**Users:** 0 - 1,000 MAU
**Estimated Cost:** $127.78/month

### Architecture Changes
- Deploy single Cloud Run instance for TrackFleet API with 2 vCPU/4GB RAM, autoscaling 1-3 instances for GPS ingestion from 500 drivers
- Configure Cloud SQL PostgreSQL db-f1-micro with PostGIS extension for geospatial queries, 10GB SSD storage with daily automated backups
- Implement Firebase Realtime Database for live vehicle position updates to dispatcher dashboard with 100 concurrent connections
- Set up Cloud Pub/Sub topic for GPS event streaming with single subscription for real-time processing pipeline
- Configure Mapbox GL JS for web dashboard with 50,000 free map loads/month, implement tile caching in browser localStorage
- Integrate Twilio SMS with pooled phone number for delivery alerts, budget 2,000 messages/month at $0.0079/message

### New Components
- Cloud Memorystore Redis (basic tier, 1GB) for driver session caching and geofence boundary lookups
- Cloud Storage bucket for offline GPS sync queue from Android driver app with resumable uploads
- Cloud Scheduler for hourly invoice generation jobs and daily fleet utilization reports via Stripe API

### Key Metrics
- **gpsIngestionLatency:** <500ms from driver app to dashboard
- **apiResponseTime:** p95 <200ms for dispatcher queries
- **mapTileLoadTime:** <1s for initial viewport render
- **offlineSyncSuccess:** >99% GPS points synced within 5 minutes of connectivity
- **availability:** 99.5% uptime SLA
- **concurrentWebSockets:** 60 simultaneous dispatcher connections
- **databaseConnections:** 25 max concurrent connections

## Stage: 1K-50K MAU (Regional Expansion: 5,000 drivers, 500 dispatchers, 100 warehouses)

**Users:** 1,000 - 50,000 MAU
**Estimated Cost:** $890/month

### Architecture Changes
- Migrate to Cloud Run with min 3 instances across 2 regions (us-central1, us-east1) with Cloud Load Balancing for dispatcher proximity routing
- Upgrade Cloud SQL to db-custom-4-16384 (4 vCPU/16GB) with read replica for dashboard queries, separate write primary for GPS ingestion
- Implement dedicated GPS ingestion microservice on Cloud Run with horizontal scaling 5-20 instances based on Pub/Sub backlog depth
- Replace Firebase Realtime Database with self-managed Redis Cluster (3 nodes) on Compute Engine for 5,000 concurrent vehicle position subscriptions
- Add Cloud CDN in front of static dashboard assets and Mapbox tile proxy to reduce origin requests by 70%
- Implement event-driven architecture with Cloud Pub/Sub fan-out: separate topics for GPS events, alerts, and analytics pipeline

### New Components
- BigQuery for historical GPS analytics with streaming inserts, partitioned by date for cost-effective fleet utilization queries
- Cloud Functions for Twilio webhook handlers and Stripe payment event processing with automatic retry logic
- Dedicated geofencing service on Cloud Run with in-memory R-tree index for 10,000 active geofences
- Cloud Armor WAF rules for API protection against GPS spoofing and rate limiting per driver device
- Artifact Registry for Android APK distribution and iOS enterprise app signing workflow

### Key Metrics
- **gpsIngestionLatency:** <200ms p99 for 5,000 concurrent drivers
- **apiResponseTime:** p95 <150ms, p99 <300ms
- **mapUpdateFrequency:** 2-second position refresh for active vehicles
- **geofenceAlertLatency:** <3 seconds from boundary crossing to SMS delivery
- **availability:** 99.9% uptime with multi-region failover
- **pubsubThroughput:** 50,000 GPS events/minute sustained
- **databaseQPS:** 500 read queries/second on replica

## Stage: 50K-500K MAU (National Scale: 50,000 drivers, 5,000 dispatchers, 1,000 warehouses)

**Users:** 50,000 - 500,000 MAU
**Estimated Cost:** $8500/month

### Architecture Changes
- Migrate GPS ingestion to Cloud Dataflow streaming pipeline for exactly-once processing of 500K events/minute with auto-scaling workers
- Implement Cloud Spanner for global GPS position storage with multi-region replication (3 nodes minimum) replacing Cloud SQL for write-heavy workloads
- Deploy GKE Autopilot cluster for microservices orchestration: API gateway, GPS processor, geofencing, notifications, billing services
- Implement CQRS pattern: separate read models in Redis Cluster (6 nodes) for real-time dashboard, write models in Spanner for durability
- Add Cloud Bigtable for time-series GPS history with 90-day hot storage, automatic tiering to Cloud Storage for compliance archival
- Deploy Apigee API Gateway for partner integrations, rate limiting, and monetization of fleet data APIs

### New Components
- Vertex AI for predictive ETA modeling and route optimization using historical GPS patterns
- Cloud Composer (Airflow) for complex ETL workflows: daily settlement with Stripe, weekly fleet analytics reports
- Global Cloud Load Balancer with anycast IPs for <50ms latency to nearest region across 4 GCP regions
- Cloud Monitoring custom dashboards with SLO burn rate alerts, PagerDuty integration for on-call rotation
- Dedicated Twilio messaging service with 10DLC registration for 100K+ SMS/month compliance
- Cloud KMS for encryption key management, VPC Service Controls for data residency compliance

### Key Metrics
- **gpsIngestionLatency:** <100ms p99 globally for 50,000 concurrent drivers
- **apiResponseTime:** p50 <50ms, p95 <100ms, p99 <200ms
- **mapUpdateFrequency:** 1-second position refresh with delta compression
- **geofenceAlertLatency:** <1 second end-to-end
- **availability:** 99.99% with zero-downtime deployments
- **dataflowThroughput:** 500,000 GPS events/minute with <5 second watermark lag
- **spannerWriteLatency:** p99 <10ms for GPS inserts
- **globalFailoverTime:** <30 seconds RTO for region failure

## Inflection Points

| Timing | Trigger | Action | Cost Delta |
|--------|---------|--------|------------|
| 1,500-2,000 active drivers (Month 4-6) | GPS ingestion queue depth exceeds processing capacity causing stale vehicle positions on dispatcher dashboard | Deploy dedicated GPS ingestion microservice with independent autoscaling policy (scale on subscription/num_undelivered_messages), separate from main API service | +$150-200/month for additional Cloud Run instances and Pub/Sub throughput |
| 200+ concurrent dispatchers (Month 6-9) | Cloud SQL connection pool exhaustion from concurrent dispatcher dashboard queries and GPS writes | Add Cloud SQL read replica for all dashboard SELECT queries, implement PgBouncer connection pooling sidecar, separate write traffic to primary | +$180/month for read replica (db-custom-2-8192), +$30/month for connection pooler on Cloud Run |
| 3,000-5,000 active drivers (Month 9-12) | Firebase Realtime Database concurrent connection limit (100K) and bandwidth costs become prohibitive for live map updates | Migrate to self-managed Redis Cluster on Compute Engine with Socket.io adapter for vehicle position pub/sub, implement binary protocol for position updates | +$250/month for 3-node Redis cluster on e2-standard-2 instances, -$100/month Firebase savings = +$150 net |
| 300+ daily active dispatchers (Month 8-10) | Mapbox API costs exceed budget as map loads scale with dispatcher count and refresh frequency | Implement Mapbox tile caching proxy on Cloud CDN with 24-hour TTL, batch vehicle position updates client-side to reduce API calls by 60% | +$50/month Cloud CDN, -$150/month Mapbox overage = -$100 net savings |
| National expansion to 3+ time zones (Month 12-18) | Single-region deployment causes unacceptable latency for geographically distributed dispatchers and drivers | Deploy multi-region Cloud Run services with Global Load Balancer, implement Cloud SQL cross-region read replicas, configure Pub/Sub message ordering by region | +$400/month for secondary region compute, +$200/month for cross-region replication = +$600/month |
| 20,000+ active drivers (Month 18-24) | PostgreSQL write throughput bottleneck from high-frequency GPS inserts causing replication lag | Migrate GPS position data to Cloud Spanner with automatic sharding, retain PostgreSQL for transactional data (invoices, users, routes) | +$2,500/month for 3-node Spanner regional configuration, -$300/month Cloud SQL downsizing = +$2,200 net |
| Engineering team >5 developers (Month 15-20) | Monolithic API service deployment velocity slows due to coupling between GPS, billing, and notification logic | Decompose into microservices on GKE Autopilot: GPS ingestion, geofencing, notifications, billing, fleet-api gateway with service mesh | +$800/month for GKE Autopilot cluster, +$200/month for service mesh overhead = +$1,000/month |
| 30,000+ drivers with 6+ months history (Month 20-24) | Historical GPS data volume exceeds cost-effective PostgreSQL/Spanner storage for analytics queries | Implement data tiering: hot data (7 days) in Spanner, warm data (90 days) in Cloud Bigtable, cold data in BigQuery with Cloud Storage archival | +$400/month Bigtable (1 node), +$100/month BigQuery streaming = +$500/month, -$300/month Spanner storage savings = +$200 net |
