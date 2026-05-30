# Cost Breakdown

> Prices as of N/A. Catalog v1. ±15-25% variance expected.

## Recommended Cloud: **HETZNER**
For a single-location pizza restaurant iOS app with moderate traffic, Hetzner offers 75-80% cost savings while providing sufficient performance. The app's simple architecture (API + Frontend + DB) doesn't require complex managed services.

## Monthly Cost Summary

| Cloud | Monthly (USD) |
|-------|---------------|
| AWS | $102.69 |
| GCP | $89.72 |
| AZURE | $120.60 |
| HETZNER | $24.58 |

## Line Items by Cloud

### AWS

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| api-server | EC2 t3.small (API Server) | $0.0208/hour | 730.00 | $15.18 |
| frontend-app | EC2 t3.micro (Frontend) | $0.0104/hour | 730.00 | $7.59 |
| api-server | RDS PostgreSQL db.t3.small | $0.034/hour | 730.00 | $24.82 |
| frontend-app | Application Load Balancer | $0.008/hour | 730.00 | $5.84 |
| api-server | S3 Storage (20GB) | $0.023/GB-month | 20.00 | $0.46 |
| api-server | Data Transfer Out (50GB) | $0.09/GB-egress | 50.00 | $4.50 |
| api-server | RDS Storage (20GB SSD) | $0.115/GB-month | 20.00 | $2.30 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | NAT Gateway for private subnets | $32.4 |
| networking | Cross-AZ data transfer (10GB) | $1 |
| storage | RDS automated backups & snapshots | $2 |
| monitoring | CloudWatch logs & metrics | $5 |
| security | AWS Secrets Manager | $1.6 |

### GCP

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| api-server | Compute e2-medium (API Server) | $0.0188/hour | 730.00 | $13.72 |
| frontend-app | Compute e2-small (Frontend) | $0.0094/hour | 730.00 | $6.86 |
| api-server | Cloud SQL PostgreSQL db-g1-small | $0.03/hour | 730.00 | $21.90 |
| frontend-app | Cloud Load Balancing | $0.008/hour | 730.00 | $5.84 |
| api-server | Cloud Storage (20GB) | $0.02/GB-month | 20.00 | $0.40 |
| api-server | Network Egress (50GB) | $0.08/GB-egress | 50.00 | $4.00 |
| api-server | Cloud SQL Storage (20GB SSD) | $0.17/GB-month | 20.00 | $3.40 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | Cloud NAT for private instances | $28 |
| networking | LB data processing (50GB) | $0.4 |
| storage | Cloud SQL automated backups | $1.6 |
| monitoring | Cloud Logging & Monitoring | $3 |
| security | Secret Manager | $0.6 |

### AZURE

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| api-server | VM B2s (API Server) | $0.0228/hour | 730.00 | $16.64 |
| frontend-app | VM B1ms (Frontend) | $0.0114/hour | 730.00 | $8.32 |
| api-server | Azure DB PostgreSQL Flexible B2s | $0.036/hour | 730.00 | $26.28 |
| frontend-app | Azure Load Balancer Standard | $0.025/hour | 730.00 | $18.25 |
| api-server | Blob Storage LRS (20GB) | $0.018/GB-month | 20.00 | $0.36 |
| api-server | Bandwidth Out (50GB) | $0.087/GB-egress | 50.00 | $4.35 |
| api-server | PostgreSQL Storage (20GB) | $0.115/GB-month | 20.00 | $2.30 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | NAT Gateway | $32.85 |
| networking | LB data processed (50GB) | $0.25 |
| storage | PostgreSQL backup storage | $2 |
| monitoring | Azure Monitor & Log Analytics | $8 |
| security | Key Vault operations | $1 |

### HETZNER

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| api-server | CX21 (API Server) | $0.001/hour | 730.00 | $0.73 |
| frontend-app | CX11 (Frontend) | $0.0006/hour | 730.00 | $0.44 |
| api-server | Managed PostgreSQL (Basic) | $15/month | 1.00 | $15.00 |
| frontend-app | Load Balancer LB11 | $0.0083/hour | 730.00 | $6.06 |
| api-server | Object Storage (20GB) | $0.0057/GB-month | 20.00 | $0.11 |
| api-server | Data Transfer Out | $0/GB-egress | 50.00 | $0.00 |
| api-server | Volume Storage (20GB SSD) | $0.052/GB-month | 20.00 | $1.04 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | No NAT Gateway needed (public IPs included) | $0 |
| storage | Manual backup snapshots | $1.2 |
| monitoring | External monitoring (self-managed) | $0 |
| operations | Self-managed DB ops overhead (time cost) | $0 |
| security | Firewall (included free) | $0 |

