# Cost Breakdown

> Prices as of 2026-05-30. ±15-25% variance expected.

## Recommended Cloud: **GCP**
Best balance of cost, HIPAA compliance, and managed services for document search workloads

## Monthly Cost Summary

| Cloud | Monthly (USD) |
|-------|---------------|
| AWS | $278.44 |
| GCP | $257.86 |
| AZURE | $335.50 |
| HETZNER | $1785.95 |

## Line Items by Cloud

### AWS

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| web-app | EC2 t3.small (Web App) | $0.0208/hour | 730.00 | $15.18 |
| search-service | EC2 t3.medium (Search Service) | $0.0416/hour | 730.00 | $30.37 |
| database | RDS PostgreSQL db.t3.small | $0.034/hour | 730.00 | $24.82 |
| database | RDS Storage (50GB) | $0.115/GB-month | 50.00 | $5.75 |
| document-search | OpenSearch t3.small.search | $0.036/hour | 730.00 | $26.28 |
| document-storage | S3 Storage (100GB docs) | $0.023/GB-month | 100.00 | $2.30 |
| load-balancer | ALB | $0.008/hour | 730.00 | $5.84 |
| networking | Data Transfer Out (50GB) | $0.09/GB-egress | 50.00 | $4.50 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | NAT Gateway (HIPAA requires private subnets) | $32.4 |
| networking | Cross-AZ data transfer (HA requirement) | $8 |
| storage | RDS automated backups & snapshots | $5 |
| compliance | CloudTrail, Config, GuardDuty (HIPAA) | $15 |
| security | KMS keys for encryption at rest | $3 |
| support | Business Support (HIPAA BAA requirement) | $100 |

### GCP

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| web-app | GCE e2-medium (Web App) | $0.0188/hour | 730.00 | $13.72 |
| search-service | GCE e2-standard-2 (Search) | $0.0376/hour | 730.00 | $27.45 |
| database | Cloud SQL PostgreSQL db-g1-small | $0.03/hour | 730.00 | $21.90 |
| database | Cloud SQL Storage (50GB) | $0.17/GB-month | 50.00 | $8.50 |
| document-search | Elasticsearch on GKE (e2-medium) | $0.0376/hour | 730.00 | $27.45 |
| document-storage | Cloud Storage (100GB) | $0.02/GB-month | 100.00 | $2.00 |
| load-balancer | Cloud Load Balancing | $0.008/hour | 730.00 | $5.84 |
| networking | Network Egress (50GB) | $0.08/GB-egress | 50.00 | $4.00 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | Cloud NAT for private instances | $28 |
| compliance | Cloud Audit Logs, Security Command Center | $12 |
| storage | Automated backups retention | $4 |
| security | Cloud KMS encryption keys | $3 |
| support | Enhanced Support (HIPAA BAA) | $100 |

### AZURE

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| web-app | VM B2s (Web App) | $0.0228/hour | 730.00 | $16.64 |
| search-service | VM B2ms (Search Service) | $0.0456/hour | 730.00 | $33.29 |
| database | Azure DB PostgreSQL Flexible B2s | $0.036/hour | 730.00 | $26.28 |
| database | PostgreSQL Storage (50GB) | $0.115/GB-month | 50.00 | $5.75 |
| document-search | Azure Cognitive Search (Basic) | $75.14/month | 1.00 | $75.14 |
| document-storage | Blob Storage LRS (100GB) | $0.018/GB-month | 100.00 | $1.80 |
| load-balancer | Load Balancer Standard | $0.025/hour | 730.00 | $18.25 |
| networking | Bandwidth Out (50GB) | $0.087/GB-egress | 50.00 | $4.35 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| networking | NAT Gateway for private subnets | $32 |
| compliance | Azure Policy, Defender for Cloud | $15 |
| storage | Backup vault & retention | $5 |
| security | Key Vault operations | $2 |
| support | Professional Direct (HIPAA BAA) | $100 |

### HETZNER

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| web-app | CX21 (Web App) | $0.001/hour | 730.00 | $0.73 |
| search-service | CX31 (Search + App) | $0.0018/hour | 730.00 | $1.31 |
| database | CX21 (PostgreSQL self-managed) | $0.001/hour | 730.00 | $0.73 |
| document-search | CX31 (Elasticsearch self-managed) | $0.0018/hour | 730.00 | $1.31 |
| document-storage | Object Storage (100GB) | $0.0057/GB-month | 100.00 | $0.57 |
| load-balancer | Load Balancer LB11 | $0.0083/hour | 730.00 | $6.06 |
| block-storage | Volume Storage (100GB) | $0.0524/GB-month | 100.00 | $5.24 |
| networking | Data Transfer | $0/GB-egress | 50.00 | $0.00 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| devops | Self-managed DB, search, security (20+ hrs/mo) | $1500 |
| compliance | HIPAA compliance tooling (self-implemented) | $200 |
| security | Third-party encryption, audit logging tools | $50 |
| backup | Self-managed backup solution | $20 |
| compliance | NO HIPAA BAA available - DISQUALIFIED | $0 |

