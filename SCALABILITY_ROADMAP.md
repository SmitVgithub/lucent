# Scalability Roadmap

## Stage: 0-1K MAU

**Users:** 0 - 1,000 MAU
**Estimated Cost:** $340.15/month

### Architecture Changes
- Deploy single-region DigitalOcean Droplet (4vCPU/8GB) running monolithic GTM stack with all pre-built connectors (CRM, MAP, SEO, ad platforms) co-located to minimize inter-service latency and operational overhead
- Implement a lightweight job queue (Redis-backed Bull or BullMQ) on the same host to handle connector sync jobs with 1-5 minute polling intervals, avoiding over-engineering at this stage
- Configure a managed PostgreSQL (DO Managed DB, 1 primary node) as the single source of truth for tenant configs, connector credentials, and sync state — enabling multi-tenancy via row-level tenant_id partitioning from day one
- Set up a basic nginx reverse proxy with SSL termination and rate limiting (100 req/s per tenant) to protect the GTM API layer from noisy tenants

### New Components
- DigitalOcean Managed PostgreSQL (Basic, 1GB RAM) — tenant registry, connector config store, sync job state
- Redis 7 Droplet (1GB) — job queue for connector sync scheduling and short-lived session cache
- DigitalOcean Spaces (S3-compatible) — raw connector payload storage and audit log archival for GTM event data
- Basic health-check monitoring via DigitalOcean Monitoring + UptimeRobot for API and sync worker uptime

### Key Metrics
- **apiResponseTime:** < 500ms p95 for GTM API endpoints
- **connectorSyncLatency:** < 5 minutes end-to-end for all pre-built connectors
- **availability:** 99.5% (single-region, planned maintenance windows acceptable)
- **throughput:** < 50 concurrent API requests
- **tenantCount:** Up to 50 active tenants
- **syncJobThroughput:** < 500 sync jobs/hour across all tenants
- **dataIngestionRate:** < 10K GTM events/hour

## Stage: 1K-50K MAU

**Users:** 1,000 - 50,000 MAU
**Estimated Cost:** $890/month

### Architecture Changes
- Decompose the monolith into three focused services: (1) GTM API Gateway handling tenant auth and routing, (2) Connector Sync Engine managing pre-built connector polling and webhook ingestion, (3) Data Transformation Service normalizing GTM payloads — deploy each as separate DigitalOcean Droplets (4vCPU/8GB each) behind a DO Load Balancer
- Migrate Redis job queue to a dedicated DigitalOcean Managed Redis cluster (2 nodes) with separate queues per connector type (CRM, MAP, ads, SEO) to enable per-connector throughput tuning and prevent one slow connector from starving others
- Upgrade PostgreSQL to a 3-node managed cluster (primary + 2 read replicas) and introduce tenant-level database connection pooling via PgBouncer to handle the multi-tenant connection explosion — partition sync_jobs and gtm_events tables by tenant_id
- Implement a dedicated tenant isolation layer: enforce per-tenant rate limits (requests/min and sync jobs/hour) at the API Gateway using Redis sliding window counters, preventing noisy large tenants from degrading SMB tenant experience
- Add DigitalOcean Spaces CDN in front of static GTM dashboard assets and connector documentation to offload bandwidth from application servers
- Introduce structured logging pipeline: ship all connector sync logs and API access logs to a centralized log aggregator (self-hosted Loki on a dedicated Droplet or DO Managed OpenSearch) to enable per-tenant sync debugging at scale

### New Components
- DigitalOcean Load Balancer — distributes traffic across GTM API Gateway instances with sticky sessions for WebSocket-based real-time sync status updates
- Dedicated Connector Sync Engine Droplets (2x 4vCPU/8GB) — horizontally scalable workers processing pre-built connector jobs independently from the API layer
- DigitalOcean Managed Redis Cluster (2 nodes, 2GB each) — replaces single Redis instance, adds persistence and failover for job queue durability
- PgBouncer connection pooler (co-located on DB subnet Droplet) — manages PostgreSQL connection limits under multi-tenant load
- Loki + Grafana stack on dedicated Droplet (4vCPU/8GB) — centralized observability for connector sync health, per-tenant error rates, and API latency histograms
- DigitalOcean Spaces CDN — static asset delivery for GTM dashboard UI

### Key Metrics
- **apiResponseTime:** < 300ms p95 for GTM API, < 200ms p50
- **connectorSyncLatency:** < 2 minutes p95 for all pre-built connectors under normal load
- **availability:** 99.9% (load-balanced API tier, managed DB failover < 60s)
- **throughput:** 500-2000 concurrent API requests
- **tenantCount:** Up to 2,000 active tenants
- **syncJobThroughput:** Up to 50K sync jobs/hour across all tenants
- **dataIngestionRate:** Up to 500K GTM events/hour
- **perTenantRateLimit:** 1,000 API req/min, 500 sync jobs/hour per tenant
- **dbConnectionPoolUtilization:** < 80% of PgBouncer pool capacity

## Stage: 50K-500K MAU

**Users:** 50,000 - 500,000 MAU
**Estimated Cost:** $3200/month

### Architecture Changes
- Introduce Kafka (self-managed on DigitalOcean Droplets or Confluent Cloud) as the central event bus between the Connector Sync Engine and downstream GTM processing — decouple connector ingestion from transformation and delivery, enabling the 1-5 minute SLA to be met even under burst loads from large enterprise tenants running full GTM stack syncs simultaneously
- Shard the PostgreSQL tenant data across multiple database clusters by tenant tier (enterprise tenants on dedicated clusters, SMB tenants on shared clusters) — implement a tenant routing service that maps tenant_id to the correct DB cluster, preventing enterprise tenant query patterns from impacting SMB tenants
- Deploy the Connector Sync Engine as auto-scaling worker pools on DigitalOcean Kubernetes (DOKS) with HPA configured per connector type — CRM connectors (Salesforce, HubSpot) scale independently from ad platform connectors (Google Ads, Meta) based on queue depth metrics exported from Redis to Prometheus
- Implement a dedicated GTM Data Warehouse layer using DigitalOcean Managed PostgreSQL with TimescaleDB extension (or migrate to a columnar store) for historical GTM analytics queries — separate OLAP workloads from OLTP sync state management to prevent analytics queries from degrading real-time sync performance
- Add a multi-region active-passive failover setup: primary region (NYC) handles all writes, secondary region (AMS or SFO) maintains a warm standby with < 30s replication lag — critical for enterprise GTM customers with SLA requirements
- Introduce a dedicated Tenant Onboarding Service that pre-provisions connector configurations, validates OAuth credentials, and runs initial historical sync jobs in isolated queues — prevents new large tenant onboarding from saturating shared sync worker capacity
- Deploy a GraphQL or REST API gateway layer (Kong or custom on DOKS) with per-tenant API key management, OAuth2 flows for connector authorization, request/response caching for frequently-polled GTM data endpoints, and circuit breakers for each pre-built connector's upstream API

### New Components
- DigitalOcean Kubernetes (DOKS, 3-node production cluster + auto-scaling node pools) — hosts Connector Sync Engine workers, Transformation Service, and Tenant Onboarding Service as independently scalable deployments
- Apache Kafka cluster (3 brokers on 8vCPU/16GB Droplets) — event streaming backbone for GTM data pipeline, enabling replay, fan-out to multiple consumers, and decoupled connector ingestion
- TimescaleDB or ClickHouse instance (dedicated 8vCPU/32GB Droplet) — columnar storage for GTM analytics queries (attribution, funnel analysis, campaign performance) without impacting sync OLTP workloads
- Kong API Gateway on DOKS — centralized auth, rate limiting, circuit breaking, and observability for all pre-built connector API calls and tenant-facing GTM API
- Prometheus + Grafana stack on DOKS — full metrics pipeline with per-tenant dashboards, connector sync SLA tracking, Kafka consumer lag alerting, and DB replication lag monitoring
- DigitalOcean Managed Redis Cluster (scaled to 4 nodes, 4GB each) — handles distributed rate limiting, connector OAuth token caching, and real-time sync status pub/sub across DOKS pods
- Tenant Router Service (DOKS deployment) — maps tenant_id to correct DB shard, connector queue partition, and feature flag configuration

### Key Metrics
- **apiResponseTime:** < 200ms p95, < 100ms p50 for GTM API endpoints
- **connectorSyncLatency:** < 1 minute p95 for all pre-built connectors, < 3 minutes p99 under peak load
- **availability:** 99.95% (multi-AZ DOKS, managed DB with automatic failover, Kafka replication factor 3)
- **throughput:** 5,000-20,000 concurrent API requests
- **tenantCount:** Up to 20,000 active tenants
- **syncJobThroughput:** Up to 2M sync jobs/hour across all tenants
- **dataIngestionRate:** Up to 10M GTM events/hour
- **kafkaConsumerLag:** < 10,000 messages per connector topic partition
- **dbShardUtilization:** < 70% CPU/storage per shard cluster
- **kubernetesNodeAutoscaleTime:** < 3 minutes to provision new sync worker nodes under burst load
- **multiRegionRPO:** < 30 seconds data loss in failover scenario
- **multiRegionRTO:** < 5 minutes to promote secondary region

## Inflection Points

| Timing | Trigger | Action | Cost Delta |
|--------|---------|--------|------------|
| ~200-400 MAU or ~100 active tenants, typically months 3-6 post-launch | Connector sync queue depth exceeds Redis memory capacity and single sync worker CPU saturates above 80% during business hours as tenant count grows past 50 and each tenant runs full GTM stack syncs every 1-5 minutes | Decompose monolith into separate API Gateway and Connector Sync Engine services, upgrade to DigitalOcean Managed Redis cluster, and add a second sync worker Droplet — this is the Stage 1 to Stage 2 transition | +$450-550/month (from $340 to ~$890) — driven by additional Droplets for decomposed services, managed Redis cluster upgrade, and load balancer addition |
| ~1,000-2,000 MAU or ~500 active tenants, typically months 6-12 | PostgreSQL primary node CPU exceeds 70% during peak sync windows as multi-tenant write contention grows — specifically when large enterprise tenants running Salesforce + HubSpot + Google Ads simultaneous syncs create write storms on the sync_jobs and gtm_events tables | Upgrade PostgreSQL to 3-node cluster with read replicas, implement PgBouncer connection pooling, and partition sync_jobs table by tenant_id — route all analytics/reporting queries to read replicas immediately | +$150-200/month for managed PostgreSQL cluster upgrade and PgBouncer Droplet |
| ~10,000-20,000 MAU or ~3,000-5,000 active tenants, typically months 12-18 | Per-tenant sync SLA breaches begin occurring — the 1-5 minute sync guarantee is missed for > 1% of sync jobs as total sync job throughput approaches 50K jobs/hour and Redis queue processing becomes the bottleneck rather than connector API rate limits | Introduce Kafka as the event streaming backbone to replace Redis queues for high-throughput connector ingestion, migrate Connector Sync Engine to DOKS with HPA auto-scaling, and implement per-connector-type worker pools — this is the Stage 2 to Stage 3 transition | +$1,800-2,500/month (from ~$890 to ~$3,200) — Kafka cluster ($400-600), DOKS node pools ($600-900), and TimescaleDB analytics layer ($300-400) are the primary cost drivers |
| ~30,000-50,000 MAU or when first 10+ enterprise tenants (>500 seats) are onboarded | Enterprise GTM customers (running full stack: CRM + MAP + 3+ ad platforms + SEO tools) begin experiencing degraded sync performance caused by SMB tenant noisy-neighbor effects on shared connector worker pools — specifically Salesforce and HubSpot connectors with complex OAuth refresh flows consuming disproportionate worker threads | Implement tenant-tier isolation: provision dedicated Kafka topic partitions and dedicated DOKS node pools for enterprise tenants, introduce the Tenant Router Service to enforce routing rules, and shard PostgreSQL by tenant tier | +$400-600/month for dedicated enterprise node pools and additional DB shard cluster |
| ~50,000-100,000 MAU or when ARR exceeds $500K and enterprise segment exceeds 20% of revenue | DigitalOcean single-region architecture becomes a sales blocker for enterprise GTM customers requiring 99.9%+ uptime SLAs and data residency guarantees — typically triggered by first Fortune 1000 prospect or first EU customer requiring GDPR data residency | Deploy active-passive multi-region setup on DigitalOcean (NYC primary + AMS secondary for EU, or SFO secondary for US-West) with PostgreSQL streaming replication, Kafka MirrorMaker2 for topic replication, and automated DNS failover via DO DNS TTL reduction | +$800-1,200/month for secondary region infrastructure (warm standby DB replica, Kafka mirror, minimal compute for failover readiness) |
