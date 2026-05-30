# Cost Breakdown

> Prices as of 2026-05-30. ±15-25% variance expected.

## Recommended Cloud: **HETZNER**
At $27/month, Hetzner fits well within your $50-70 budget while providing ample resources for a medium-scale web application. The included 20TB egress eliminates bandwidth costs that add up on hyperscalers.

## Monthly Cost Summary

| Cloud | Monthly (USD) |
|-------|---------------|
| AWS | $72.90 |
| GCP | $57.48 |
| AZURE | $83.99 |
| HETZNER | $27.10 |

## Line Items by Cloud

### AWS

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| frontend-app | EC2 t3.micro (Frontend) | $0.0104/hour | 730.00 | $7.59 |
| mobile-app | EC2 t3.micro (Mobile API) | $0.0104/hour | 730.00 | $7.59 |
| shared | Application Load Balancer | $0.008/hour | 730.00 | $5.84 |
| shared | ALB LCU (estimated) | $0.008/hour | 730.00 | $5.84 |
| shared | S3 Storage (10GB) | $0.023/GB-month | 10.00 | $0.23 |
| shared | Data Transfer Out (50GB) | $0.09/GB | 49.00 | $4.41 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | NAT Gateway (if using private subnets) | $32.4 |
| networking | Cross-AZ data transfer | $2 |
| storage | EBS volumes (20GB x 2 instances) | $4 |
| monitoring | CloudWatch basic metrics & logs | $3 |

### GCP

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| frontend-app | e2-small (Frontend) | $0.0094/hour | 730.00 | $6.86 |
| mobile-app | e2-small (Mobile API) | $0.0094/hour | 730.00 | $6.86 |
| shared | Cloud Load Balancer | $0.008/hour | 730.00 | $5.84 |
| shared | LB Data Processing (50GB) | $0.008/GB | 50.00 | $0.40 |
| shared | Cloud Storage (10GB) | $0.02/GB-month | 10.00 | $0.20 |
| shared | Network Egress (50GB) | $0.08/GB | 49.00 | $3.92 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | Cloud NAT (if using private VPC) | $28 |
| storage | Persistent disk (20GB x 2) | $3.4 |
| monitoring | Cloud Logging & Monitoring | $2 |

### AZURE

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| frontend-app | B1ms VM (Frontend) | $0.0114/hour | 730.00 | $8.32 |
| mobile-app | B1ms VM (Mobile API) | $0.0114/hour | 730.00 | $8.32 |
| shared | Load Balancer Standard | $0.025/hour | 730.00 | $18.25 |
| shared | Blob Storage (10GB) | $0.018/GB-month | 10.00 | $0.18 |
| shared | Bandwidth Out (50GB) | $0.087/GB | 45.00 | $3.92 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | NAT Gateway | $32 |
| storage | Managed disks (32GB x 2) | $5 |
| monitoring | Azure Monitor basic | $3 |
| networking | LB data processing rules | $5 |

### HETZNER

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| frontend-app | CX21 (Frontend) | $0.001/hour | 730.00 | $4.49 |
| mobile-app | CX21 (Mobile API) | $0.001/hour | 730.00 | $4.49 |
| shared | Load Balancer LB11 | $0.0083/hour | 730.00 | $6.06 |
| shared | Object Storage (10GB) | $0.0057/GB-month | 10.00 | $0.06 |
| shared | Data Transfer (50GB) | $0/GB | 50.00 | $0.00 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| operations | Self-managed DevOps overhead (SSL, updates, monitoring setup) | $10 |
| storage | Backup storage (snapshots) | $2 |
| monitoring | External monitoring service (UptimeRobot/similar) | $0 |

