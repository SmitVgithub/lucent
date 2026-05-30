# Cost Breakdown

> Prices as of 2026-05-30. ±15-25% variance expected.

## Recommended Cloud: **HETZNER**
For a medium-scale consumer app under $1000/month budget, Hetzner offers 40-70% cost savings over hyperscalers while providing sufficient performance for production workloads.

## Monthly Cost Summary

| Cloud | Monthly (USD) |
|-------|---------------|
| AWS | $105.69 |
| GCP | $92.36 |
| AZURE | $118.07 |
| HETZNER | $69.13 |

## Line Items by Cloud

### AWS

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| web-server | EC2 t3.small (web server) | $0.0208/hour | 730.00 | $15.18 |
| database | RDS PostgreSQL db.t3.small | $0.034/hour | 730.00 | $24.82 |
| database | RDS Storage (20GB) | $0.115/GB-month | 20.00 | $2.30 |
| storage | S3 Storage (50GB) | $0.023/GB-month | 50.00 | $1.15 |
| load-balancer | ALB | $0.008/hour | 730.00 | $5.84 |
| egress | Data Transfer Out (100GB) | $0.09/GB | 100.00 | $9.00 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | NAT Gateway (if using private subnets) | $32.4 |
| networking | ALB LCU charges (request processing) | $8 |
| storage | RDS automated backups & snapshots | $2 |
| monitoring | CloudWatch logs & metrics | $5 |

### GCP

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| web-server | Compute Engine e2-medium | $0.0188/hour | 730.00 | $13.72 |
| database | Cloud SQL PostgreSQL db-g1-small | $0.03/hour | 730.00 | $21.90 |
| database | Cloud SQL Storage (20GB) | $0.17/GB-month | 20.00 | $3.40 |
| storage | Cloud Storage (50GB) | $0.02/GB-month | 50.00 | $1.00 |
| load-balancer | Cloud Load Balancing | $0.008/hour | 730.00 | $5.84 |
| egress | Network Egress (100GB) | $0.08/GB | 100.00 | $8.00 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | Cloud NAT (if using private VPC) | $28 |
| networking | LB forwarding rules & data processing | $6 |
| storage | Cloud SQL backups | $1.5 |
| monitoring | Cloud Logging & Monitoring | $3 |

### AZURE

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| web-server | VM B2s | $0.0228/hour | 730.00 | $16.64 |
| database | Azure DB PostgreSQL Flexible B2s | $0.036/hour | 730.00 | $26.28 |
| database | PostgreSQL Storage (20GB) | $0.115/GB-month | 20.00 | $2.30 |
| storage | Blob Storage LRS (50GB) | $0.018/GB-month | 50.00 | $0.90 |
| load-balancer | Load Balancer Standard | $0.025/hour | 730.00 | $18.25 |
| egress | Bandwidth Out (100GB) | $0.087/GB | 100.00 | $8.70 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | NAT Gateway | $32 |
| networking | LB data processing charges | $5 |
| storage | Database backups (geo-redundant) | $3 |
| monitoring | Azure Monitor & Log Analytics | $5 |

### HETZNER

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| web-server | CX21 (web server) | $0.001/hour | 730.00 | $4.49 |
| database | CX21 (database server) | $0.001/hour | 730.00 | $4.49 |
| storage | Volume Storage (50GB) | $0.052/GB-month | 50.00 | $2.60 |
| object-storage | Object Storage (50GB) | $0.0057/GB-month | 50.00 | $0.29 |
| load-balancer | Load Balancer LB11 | $0.0083/hour | 730.00 | $6.06 |
| egress | Data Transfer (100GB) | $0/GB | 100.00 | $0.00 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| operations | Self-managed PostgreSQL setup & maintenance (DevOps time ~2hrs/mo) | $50 |
| storage | Manual backup solution (Hetzner Backup) | $1.2 |
| monitoring | Self-hosted monitoring (Prometheus/Grafana on same server) | $0 |
| security | SSL certificates (Let's Encrypt - free) | $0 |

