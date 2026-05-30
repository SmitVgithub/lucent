# Scalability Roadmap

## Stage: 0-1K MAU - Foundation & Compliance

**Users:** 0 - 1,000 MAU
**Estimated Cost:** $257.86/month

### Architecture Changes
- Deploy single GCP Cloud Run instance with auto-scaling 0-2 instances for web app serving
- Implement Cloud SQL PostgreSQL (db-f1-micro) with automated backups and encryption at rest for document metadata
- Configure Cloud Storage with CMEK encryption for document storage with lifecycle policies
- Enable Cloud Armor WAF with OWASP Top 10 rules for HIPAA-compliant perimeter security
- Implement Elasticsearch on single Compute Engine n1-standard-2 for document search indexing
- Configure Cloud KMS for encryption key management and audit logging
- Enable Cloud Audit Logs and export to Cloud Storage for ISO 27001 compliance trail

### New Components
- Cloud Identity-Aware Proxy (IAP) for zero-trust access control
- Secret Manager for credential and API key management
- Cloud Monitoring with custom HIPAA compliance dashboards
- VPC Service Controls for data exfiltration prevention

### Key Metrics
- **p95ResponseTime:** <500ms
- **searchLatency:** <200ms
- **availability:** 99.5%
- **concurrentUsers:** 50
- **documentsIndexed:** 10,000
- **dailySearchQueries:** 5,000
- **auditLogRetention:** 365 days

## Stage: 1K-50K MAU - Growth & Performance

**Users:** 1,000 - 50,000 MAU
**Estimated Cost:** $1450/month

### Architecture Changes
- Scale Cloud Run to 2-10 instances with CPU-based autoscaling and min instances for cold start elimination
- Upgrade Cloud SQL to db-custom-4-16384 with read replica for search query offloading
- Migrate Elasticsearch to GCP-managed Elastic Cloud (2-node cluster) for HA and automated patching
- Implement Cloud CDN for static assets and cached search results with 15-minute TTL
- Add Redis Memorystore (basic tier, 5GB) for session management and search result caching
- Configure Cloud Load Balancer with SSL termination and health checks across regions
- Implement document processing pipeline using Cloud Functions for async indexing
- Enable Cloud SQL Insights for query performance optimization

### New Components
- Cloud Tasks for async document processing queue management
- Pub/Sub for event-driven document indexing pipeline
- Cloud Scheduler for automated compliance report generation
- BigQuery for search analytics and usage pattern analysis
- Cloud DLP API for automated PHI detection in uploaded documents

### Key Metrics
- **p95ResponseTime:** <300ms
- **searchLatency:** <150ms
- **availability:** 99.9%
- **concurrentUsers:** 500
- **documentsIndexed:** 500,000
- **dailySearchQueries:** 250,000
- **indexingThroughput:** 100 docs/minute
- **cacheHitRate:** >70%

## Stage: 50K-500K MAU - Scale & Resilience

**Users:** 50,000 - 500,000 MAU
**Estimated Cost:** $8500/month

### Architecture Changes
- Deploy multi-region Cloud Run with Global Load Balancer for geographic distribution (us-central1, us-east1, europe-west1)
- Upgrade Cloud SQL to regional HA configuration with automatic failover and 3 read replicas
- Scale Elastic Cloud to 5-node cluster with dedicated master nodes and hot-warm-cold architecture
- Implement Cloud Spanner for globally consistent document metadata if multi-region writes required
- Upgrade Memorystore to Standard tier (25GB) with automatic failover
- Implement sharded document storage across multiple Cloud Storage buckets by tenant/document type
- Deploy Cloud Armor Adaptive Protection for ML-based DDoS mitigation
- Implement custom search ranking microservice on GKE Autopilot for personalized results

### New Components
- GKE Autopilot cluster for containerized microservices (search ranking, document processing)
- Cloud Dataflow for real-time search analytics and indexing pipeline
- Apigee API Gateway for rate limiting, API versioning, and partner integrations
- Chronicle SIEM for advanced security monitoring and HIPAA incident response
- Cloud Composer (Airflow) for complex document processing workflow orchestration
- Vertex AI for ML-powered search relevance and document classification

### Key Metrics
- **p95ResponseTime:** <200ms
- **searchLatency:** <100ms
- **availability:** 99.95%
- **concurrentUsers:** 5,000
- **documentsIndexed:** 10,000,000
- **dailySearchQueries:** 5,000,000
- **indexingThroughput:** 1,000 docs/minute
- **cacheHitRate:** >85%
- **crossRegionReplicationLag:** <5 seconds
- **RPO:** 1 hour
- **RTO:** 15 minutes

## Inflection Points

| Timing | Trigger | Action | Cost Delta |
|--------|---------|--------|------------|
| 5K-10K MAU (Month 4-6) | Search latency degradation due to single Elasticsearch node resource exhaustion | Migrate from self-managed Elasticsearch to Elastic Cloud managed service with 2-node HA cluster and implement search result caching in Memorystore | +$400/month (Elastic Cloud $350 + Memorystore $50 vs self-managed $80) |
| 15K-25K MAU (Month 8-12) | Database connection pool exhaustion from concurrent search and write operations | Upgrade Cloud SQL instance tier and add read replica for search query offloading, implement connection pooling via Cloud SQL Proxy | +$350/month (db-custom-4-16384 $280 + read replica $180 vs db-f1-micro $30) |
| 20K-30K MAU (Month 10-14) | Document indexing backlog causing stale search results | Implement async document processing pipeline with Cloud Tasks and Pub/Sub, deploy dedicated Cloud Functions for parallel indexing workers | +$200/month (Cloud Tasks $20 + Pub/Sub $30 + Cloud Functions $150) |
| 40K-60K MAU (Month 14-18) | Single region availability incident impacting SLA commitments | Deploy multi-region architecture with Global Load Balancer, regional Cloud Run deployments, and Cloud SQL regional HA with cross-region read replicas | +$2,500/month (multi-region compute $1,200 + regional SQL HA $800 + cross-region networking $500) |
| 100K-200K MAU (Month 18-24) | Search relevance degradation as document corpus grows beyond simple keyword matching | Deploy ML-powered search ranking microservice on GKE Autopilot using Vertex AI for semantic search and personalized ranking | +$1,800/month (GKE Autopilot $600 + Vertex AI $800 + additional Elastic Cloud resources $400) |
| 75K-150K MAU (Month 16-22) | HIPAA audit findings requiring enhanced security monitoring and incident response | Deploy Chronicle SIEM for centralized security monitoring, implement automated incident response playbooks, enhance Cloud DLP scanning coverage | +$1,200/month (Chronicle SIEM $800 + enhanced Cloud DLP $300 + additional logging $100) |
