# Cost Breakdown

> Prices as of N/A. Catalog v1. ±15-25% variance expected.

## Recommended Cloud: **AWS**
Best balance of managed services, real-time capabilities, and ecosystem for ride-sharing apps with AWS Location Service integration

## Monthly Cost Summary

| Cloud | Monthly (USD) |
|-------|---------------|
| AWS | $361.07 |
| GCP | $459.27 |
| AZURE | $414.77 |
| HETZNER | $725.98 |

## Line Items by Cloud

### AWS

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| mobile-app-backend | EC2 t3.medium (API Server x2) | $0.0416/hour | 1460.00 | $60.74 |
| realtime-service | EC2 t3.small (WebSocket Server x2) | $0.0208/hour | 1460.00 | $30.37 |
| database | RDS PostgreSQL db.t3.medium | $0.068/hour | 730.00 | $49.64 |
| realtime-cache | ElastiCache Redis cache.t3.small | $0.034/hour | 730.00 | $24.82 |
| load-balancer | Application Load Balancer | $0.008/hour | 730.00 | $5.84 |
| storage | S3 Storage (50GB) | $0.023/GB-month | 50.00 | $1.15 |
| egress | Data Transfer Out (500GB) | $0.09/GB-egress | 499.00 | $44.91 |
| queue | SQS (10M requests) | $0.4/million-requests | 9.00 | $3.60 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | NAT Gateway (2 AZ) + data processing | $65 |
| networking | Cross-AZ data transfer (100GB) | $2 |
| storage | RDS automated backups & snapshots | $8 |
| monitoring | CloudWatch logs & metrics | $15 |
| location | AWS Location Service (geolocation/routing) | $50 |

### GCP

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| mobile-app-backend | GCE e2-standard-2 (API Server x2) | $0.0376/hour | 1460.00 | $54.90 |
| realtime-service | GCE e2-medium (WebSocket Server x2) | $0.0188/hour | 1460.00 | $27.45 |
| database | Cloud SQL PostgreSQL db-n1-standard-1 | $0.06/hour | 730.00 | $43.80 |
| realtime-cache | Memorystore Redis 2GB | $0.032/hour | 730.00 | $23.36 |
| load-balancer | Cloud Load Balancing | $0.008/hour | 730.00 | $5.84 |
| storage | Cloud Storage (50GB) | $0.02/GB-month | 50.00 | $1.00 |
| egress | Network Egress (500GB) | $0.08/GB-egress | 499.00 | $39.92 |
| queue | Cloud Pub/Sub (10M requests) | $0.4/million-requests | 0.00 | $0.00 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | Cloud NAT gateway + processing | $45 |
| storage | Cloud SQL backups & storage | $6 |
| monitoring | Cloud Logging & Monitoring | $12 |
| maps | Google Maps Platform (Routes/Places API) | $200 |
| firebase | Firebase Cloud Messaging (push notifications) | $0 |

### AZURE

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| mobile-app-backend | VM B2ms (API Server x2) | $0.0456/hour | 1460.00 | $66.58 |
| realtime-service | VM B2s (WebSocket Server x2) | $0.0228/hour | 1460.00 | $33.29 |
| database | Azure DB PostgreSQL Flexible D2s_v3 | $0.072/hour | 730.00 | $52.56 |
| realtime-cache | Azure Cache Redis C1 | $0.044/hour | 730.00 | $32.12 |
| load-balancer | Azure Load Balancer Standard | $0.025/hour | 730.00 | $18.25 |
| storage | Blob Storage LRS (50GB) | $0.018/GB-month | 50.00 | $0.90 |
| egress | Bandwidth Out (500GB) | $0.087/GB-egress | 495.00 | $43.07 |
| queue | Service Bus (10M requests) | $0.05/million-requests | 0.00 | $0.00 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | NAT Gateway + data processing | $55 |
| storage | Database backups & geo-redundancy | $10 |
| monitoring | Azure Monitor & Log Analytics | $18 |
| maps | Azure Maps (routing/geolocation) | $75 |
| notifications | Azure Notification Hubs | $10 |

### HETZNER

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| mobile-app-backend | CX41 (API Server x2) | $0.0034/hour | 1460.00 | $4.96 |
| realtime-service | CX31 (WebSocket Server x2) | $0.0018/hour | 1460.00 | $2.63 |
| database | CX31 (PostgreSQL self-managed) | $0.0018/hour | 730.00 | $1.31 |
| realtime-cache | CX21 (Redis self-managed) | $0.001/hour | 730.00 | $0.73 |
| load-balancer | Load Balancer LB11 | $0.0083/hour | 730.00 | $6.06 |
| storage | Object Storage (50GB) | $0.0057/GB-month | 50.00 | $0.29 |
| egress | Data Transfer Out (500GB) | $0/GB-egress | 500.00 | $0.00 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| operations | Self-managed DB backup solution | $5 |
| operations | DevOps time for self-managed services (est. 10hrs @ $50/hr) | $500 |
| external | Third-party maps API (Mapbox/Google) | $150 |
| external | Push notification service (Firebase/OneSignal) | $25 |
| monitoring | External monitoring (Datadog/Grafana Cloud) | $30 |

