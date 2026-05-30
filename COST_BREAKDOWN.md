# Cost Breakdown

> Prices as of N/A. Catalog v1. ±15-25% variance expected.

## Recommended Cloud: **HETZNER**
Best cost-to-value ratio for a single-location pizza ordering app with predictable traffic patterns. At ~$27/month vs $93-122/month for hyperscalers, Hetzner offers 75% savings while providing adequate performance for a restaurant iOS app.

## Monthly Cost Summary

| Cloud | Monthly (USD) |
|-------|---------------|
| AWS | $101.67 |
| GCP | $93.34 |
| AZURE | $121.89 |
| HETZNER | $26.62 |

## Line Items by Cloud

### AWS

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| api-server | EC2 t3.small (API Server) | $0.0208/hour | 730.00 | $15.18 |
| frontend-app | EC2 t3.micro (Frontend) | $0.0104/hour | 730.00 | $7.59 |
| api-server | RDS PostgreSQL db.t3.small | $0.034/hour | 730.00 | $24.82 |
| api-server | RDS Storage (20GB) | $0.115/GB-month | 20.00 | $2.30 |
| frontend-app | Application Load Balancer | $0.008/hour | 730.00 | $5.84 |
| api-server | S3 Storage (10GB) | $0.023/GB-month | 10.00 | $0.23 |
| frontend-app | Data Transfer Out (50GB) | $0.09/GB-egress | 49.00 | $4.41 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | NAT Gateway for private subnets | $32.4 |
| networking | Cross-AZ data transfer (10GB) | $0.2 |
| storage | EBS snapshots and backups | $2.5 |
| monitoring | CloudWatch logs and metrics | $5 |
| security | AWS Secrets Manager | $1.2 |

### GCP

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| api-server | Compute e2-medium (API Server) | $0.0188/hour | 730.00 | $13.72 |
| frontend-app | Compute e2-small (Frontend) | $0.0094/hour | 730.00 | $6.86 |
| api-server | Cloud SQL PostgreSQL db-g1-small | $0.03/hour | 730.00 | $21.90 |
| api-server | Cloud SQL Storage (20GB) | $0.17/GB-month | 20.00 | $3.40 |
| frontend-app | Cloud Load Balancing | $0.008/hour | 730.00 | $5.84 |
| api-server | Cloud Storage (10GB) | $0.02/GB-month | 10.00 | $0.20 |
| frontend-app | Network Egress (50GB) | $0.08/GB-egress | 49.00 | $3.92 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | Cloud NAT for private instances | $28 |
| networking | LB data processing fees | $4 |
| storage | Automated backups retention | $2 |
| monitoring | Cloud Logging and Monitoring | $3.5 |

### AZURE

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| api-server | VM B2s (API Server) | $0.0228/hour | 730.00 | $16.64 |
| frontend-app | VM B1ms (Frontend) | $0.0114/hour | 730.00 | $8.32 |
| api-server | Azure DB PostgreSQL Flexible B2s | $0.036/hour | 730.00 | $26.28 |
| api-server | PostgreSQL Storage (20GB) | $0.115/GB-month | 20.00 | $2.30 |
| frontend-app | Azure Load Balancer Standard | $0.025/hour | 730.00 | $18.25 |
| api-server | Blob Storage LRS (10GB) | $0.018/GB-month | 10.00 | $0.18 |
| frontend-app | Bandwidth Out (50GB) | $0.087/GB-egress | 45.00 | $3.92 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | NAT Gateway for VNet | $32 |
| networking | LB data processing rules | $5 |
| storage | Managed disk snapshots | $2.5 |
| monitoring | Azure Monitor and Log Analytics | $6 |
| security | Key Vault operations | $0.5 |

### HETZNER

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| api-server | CX21 (API Server) | $0.001/hour | 730.00 | $4.49 |
| frontend-app | CX11 (Frontend) | $0.0006/hour | 730.00 | $2.99 |
| api-server | Managed PostgreSQL (Basic) | $9.9/month | 1.00 | $9.90 |
| frontend-app | Load Balancer LB11 | $0.0083/hour | 730.00 | $6.06 |
| api-server | Object Storage (10GB) | $0.0057/GB-month | 10.00 | $0.06 |
| frontend-app | Data Transfer Out | $0/GB-egress | 50.00 | $0.00 |
| api-server | Volume Storage (40GB) | $0.052/GB-month | 40.00 | $2.08 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | No NAT Gateway needed - public IPs included | $0 |
| storage | Snapshot storage (20GB) | $1.04 |
| monitoring | External monitoring (self-managed) | $0 |
| security | SSL certificates (Let's Encrypt free) | $0 |

