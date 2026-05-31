# Cost Breakdown

> Prices as of 2026-05-31. ±15-25% variance expected.

## Recommended Cloud: **DIGITALOCEAN**
Best value for pure static landing page with Spaces minimum $5/mo including CDN and 1TB bandwidth

## Monthly Cost Summary

| Cloud | Monthly (USD) |
|-------|---------------|
| AWS | $9.46 |
| GCP | $8.67 |
| AZURE | $9.66 |
| DIGITALOCEAN | $5.00 |

## Line Items by Cloud

### AWS

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| static-landing-page | S3 Static Website Hosting | $0.023/GB-month | 1.00 | $0.02 |
| cdn-distribution | CloudFront CDN (1TB transfer) | $0.085/GB | 100.00 | $8.50 |
| dns | Route 53 Hosted Zone | $0.5/zone-month | 1.00 | $0.50 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| requests | S3 GET requests (~100K/mo) | $0.04 |
| dns | Route 53 queries (~1M/mo) | $0.4 |

### GCP

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| static-landing-page | Cloud Storage Static Hosting | $0.02/GB-month | 1.00 | $0.02 |
| cdn-distribution | Cloud CDN (100GB egress) | $0.08/GB | 100.00 | $8.00 |
| dns | Cloud DNS Managed Zone | $0.2/zone-month | 1.00 | $0.20 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| requests | Class A operations (~100K/mo) | $0.05 |
| dns | DNS queries (~1M/mo) | $0.4 |

### AZURE

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| static-landing-page | Blob Storage Static Website | $0.018/GB-month | 1.00 | $0.02 |
| cdn-distribution | Azure CDN Standard (100GB) | $0.087/GB | 100.00 | $8.70 |
| dns | Azure DNS Zone | $0.5/zone-month | 1.00 | $0.50 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| requests | Blob read operations (~100K/mo) | $0.04 |
| dns | DNS queries (~1M/mo) | $0.4 |

### DIGITALOCEAN

| Component | Service | Unit Cost | Quantity | Monthly USD |
|-----------|---------|-----------|----------|-------------|
| static-landing-page | Spaces Object Storage | $0.02/GB-month | 1.00 | $5.00 |
| cdn-distribution | Spaces CDN (included bandwidth) | $0/GB | 100.00 | $0.00 |

#### ⚠️ Hidden Costs

| Category | Description | Est. Monthly USD |
|----------|-------------|------------------|
| bandwidth | Overage beyond 1TB included | $0 |
| dns | External DNS (Cloudflare free tier) | $0 |

