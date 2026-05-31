# Cost Breakdown

> Prices as of 2026-05-31. ±15-25% variance expected.

## Recommended Cloud: **GCP**
Best balance of managed services, cost ($128/mo), and real-time capabilities for fleet tracking within $300 budget

## Monthly Cost Summary

| Cloud | Monthly (USD) |
|-------|---------------|
| AWS | $186.60 |
| GCP | $127.78 |
| AZURE | $193.13 |
| HETZNER | $222.15 |

## Line Items by Cloud

### AWS

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| api-server | EC2 t3.small (API Server) | $0.0208/hour | 730.00 | $15.18 |
| websocket-server | EC2 t3.micro (WebSocket Server) | $0.0104/hour | 730.00 | $7.59 |
| database | RDS PostgreSQL db.t3.micro | $0.018/hour | 730.00 | $13.14 |
| cache-realtime | ElastiCache Redis t3.micro | $0.017/hour | 730.00 | $12.41 |
| storage | S3 Storage (50GB) | $0.023/GB-month | 50.00 | $1.15 |
| load-balancer | ALB | $0.0225/hour | 730.00 | $16.43 |
| message-queue | SQS (GPS queue 50M msgs) | $0.4/million-requests | 50.00 | $20.00 |
| egress-free-tier | Data Transfer Out (100GB) | $0.09/GB-egress | 100.00 | $0.00 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | NAT Gateway (2 AZ) | $65.7 |
| networking | Cross-AZ data transfer | $10 |
| storage | RDS automated backups & snapshots | $5 |
| monitoring | CloudWatch logs & metrics | $8 |
| networking | ALB LCU charges (GPS traffic) | $12 |

### GCP

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| api-server | e2-small (API Server) | $0.0168/hour | 730.00 | $12.26 |
| websocket-server | e2-micro (WebSocket Server) | $0.0084/hour | 730.00 | $6.13 |
| database | Cloud SQL PostgreSQL db-f1-micro | $0.015/hour | 730.00 | $10.95 |
| cache-realtime | Memorystore Redis 1GB | $0.016/hour | 730.00 | $11.68 |
| storage | Cloud Storage (50GB) | $0.02/GB-month | 50.00 | $1.00 |
| load-balancer | Cloud Load Balancing | $0.008/hour | 730.00 | $5.84 |
| message-queue | Pub/Sub (50M msgs) | $0.4/million-requests | 40.00 | $16.00 |
| egress | Network Egress (150GB) | $0.08/GB-egress | 149.00 | $11.92 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | Cloud NAT gateway + processing | $35 |
| storage | Cloud SQL storage & backups (20GB) | $4 |
| networking | LB data processing fees | $8 |
| monitoring | Cloud Logging ingestion | $5 |

### AZURE

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| api-server | Standard_B2s (API Server) | $0.0416/hour | 730.00 | $30.37 |
| websocket-server | Standard_B1ms (WebSocket) | $0.0207/hour | 730.00 | $15.11 |
| database | Azure Database PostgreSQL Basic | $0.034/hour | 730.00 | $24.82 |
| cache-realtime | Azure Cache Redis C0 | $0.022/hour | 730.00 | $16.06 |
| storage | Blob Storage LRS (50GB) | $0.018/GB-month | 50.00 | $0.90 |
| load-balancer | Load Balancer Standard | $0.025/hour | 730.00 | $18.25 |
| message-queue | Service Bus (50M msgs) | $0.05/million-requests | 40.00 | $2.00 |
| egress | Bandwidth Out (150GB) | $0.087/GB-egress | 145.00 | $12.62 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | NAT Gateway + data processing | $45 |
| storage | DB storage & geo-redundant backups | $8 |
| networking | LB data processing & rules | $10 |
| monitoring | Azure Monitor & Log Analytics | $10 |

### HETZNER

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| api-server | CX21 (API + WebSocket) | $5.39/month | 1.00 | $5.39 |
| worker | CX11 (Worker/Queue processor) | $3.29/month | 1.00 | $3.29 |
| database | PostgreSQL (self-managed on CX21) | $5.39/month | 1.00 | $5.39 |
| cache-colocated | Redis (self-managed on app server) | $0/month | 1.00 | $0.00 |
| storage | Object Storage (50GB) | $0.0057/GB-month | 50.00 | $0.29 |
| load-balancer | Load Balancer LB11 | $5.39/month | 1.00 | $5.39 |
| optional-managed-db | Managed PostgreSQL (alternative) | $0/month | 0.00 | $0.00 |
| egress | Egress (included 20TB) | $0/GB-egress | 500.00 | $0.00 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| operations | DevOps overhead (self-managed DB, Redis, backups) - 4hrs/mo @ $50/hr | $200 |
| storage | Snapshot backups (100GB) | $2.4 |
| networking | Private networking (free) | $0 |
| reliability | No SLA guarantees vs hyperscalers | $0 |

