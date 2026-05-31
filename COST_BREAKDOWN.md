# Cost Breakdown

> Prices as of 2026-05-31. ±15-25% variance expected.

## Recommended Cloud: **DIGITALOCEAN**
Best cost-to-value ratio for a multi-tenant SaaS GTM stack at production scale, with simpler management and predictable pricing

## Monthly Cost Summary

| Cloud | Monthly (USD) |
|-------|---------------|
| AWS | $397.59 |
| GCP | $441.78 |
| AZURE | $366.37 |
| DIGITALOCEAN | $340.15 |

## Line Items by Cloud

### AWS

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| web-api-tier | EC2 - API/Web Servers (t3.medium x2) | $0.0416/hour | 1460.00 | $60.74 |
| sync-engine | EC2 - Sync Workers (t3.large x2) | $0.0832/hour | 1460.00 | $121.47 |
| primary-database | RDS PostgreSQL (db.m6i.large) | $0.171/hour | 730.00 | $124.83 |
| cache-queue | ElastiCache Redis (cache.t3.small) | $0.034/hour | 730.00 | $24.82 |
| load-balancer | Application Load Balancer | $0.0225/hour | 730.00 | $16.43 |
| object-storage | S3 Storage (100GB) | $0.023/GB-month | 100.00 | $2.30 |
| message-queue | SQS (10M requests) | $0.4/million-requests | 10.00 | $4.00 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | Data egress (200GB estimated) | $18 |
| storage | RDS storage (100GB) + snapshots | $15 |
| networking | ALB LCU charges (variable traffic) | $10 |

### GCP

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| web-api-tier | Compute Engine - API/Web (e2-standard-2 x2) | $0.06701/hour | 1460.00 | $97.83 |
| sync-engine | Compute Engine - Sync Workers (e2-standard-4 x2) | $0.13402/hour | 1460.00 | $195.67 |
| primary-database | Cloud SQL PostgreSQL (2vCPU/8GB) | $0.095/hour | 730.00 | $69.35 |
| cache-queue | Memorystore Redis (1GB) | $0.016/hour | 730.00 | $11.68 |
| load-balancer | Cloud Load Balancing | $0.025/hour | 730.00 | $18.25 |
| object-storage | Cloud Storage (100GB) | $0.02/GB-month | 100.00 | $2.00 |
| message-queue | Pub/Sub (10M messages) | $0.4/million-messages | 10.00 | $4.00 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | Network egress (200GB) | $16 |
| storage | Cloud SQL storage (100GB) | $17 |
| operations | Cloud Logging/Monitoring | $10 |

### AZURE

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| web-api-tier | VM - API/Web (D2s_v5 x2) | $0.096/hour | 1460.00 | $140.16 |
| sync-engine | VM - Sync Workers (D4s_v5 x2) | $0.0384/hour | 1460.00 | $56.06 |
| primary-database | Azure Database PostgreSQL (2vCPU) | $0.096/hour | 730.00 | $70.08 |
| cache-queue | Azure Cache Redis (C1) | $0.044/hour | 730.00 | $32.12 |
| load-balancer | Azure Load Balancer Standard | $0.025/hour | 730.00 | $18.25 |
| object-storage | Blob Storage Hot (100GB) | $0.018/GB-month | 100.00 | $1.80 |
| message-queue | Service Bus (10M ops) | $0.05/million-ops | 10.00 | $0.50 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | Data egress (200GB) | $17.4 |
| storage | Managed disk + DB storage | $20 |
| operations | Azure Monitor basic | $10 |

### DIGITALOCEAN

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| web-api-tier | Droplet - API/Web (g-2vcpu-8gb x2) | $0.094/hour | 1460.00 | $137.24 |
| sync-engine | Droplet - Sync Workers (s-4vcpu-8gb x2) | $0.071/hour | 1460.00 | $103.66 |
| primary-database | Managed PostgreSQL (2vCPU/4GB) | $0.088/hour | 730.00 | $64.24 |
| cache-queue | Managed Redis (1GB) | $0.022/hour | 730.00 | $16.06 |
| load-balancer | Load Balancer | $0.015/hour | 730.00 | $10.95 |
| object-storage | Spaces Storage (100GB) | $0.02/GB-month | 100.00 | $2.00 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | Bandwidth overage (100GB beyond free) | $1 |
| storage | Additional DB storage | $5 |
| limitations | No native message queue - use Redis or external | $0 |

