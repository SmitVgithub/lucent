# System Architecture Document

## Project Overview
**Repository:** SmitVgithub/lucent
**Language:** unknown
**Request:** Answer: 
1. This is purely based on the web-based for sales and marketing ops.
2. All of the above - full GTM stack coverage
3. Sync data across connectors within 1-5 mintues
4. Multi-tenant SaaS
5. Pre-built connectors only.

## Architecture Diagram

```mermaid
flowchart TD
  subgraph Frontend["Frontend Layer - Web Browser"]
    WEB["Web App SPA\nSales & Marketing Ops"]
    DASH["GTM Dashboard\nAnalytics & Reporting"]
  end

  subgraph Backend["Backend Layer - Multi-Tenant SaaS"]
    API["API Gateway\nREST / GraphQL"]
    AUTH["Auth Service\nSSO / OAuth2"]
    SYNC["Sync Engine\n1-5 Min Intervals"]
    TENANT["Tenant Manager\nIsolation & Config"]
    QUEUE["Message Queue\nEvent Bus"]
  end

  subgraph Data["Data Layer"]
    DB[("Primary DB\nPostgreSQL")]
    CACHE[("Cache\nRedis")]
    WAREHOUSE[("Data Warehouse\nSnowflake")]
  end

  subgraph Connectors["Pre-Built GTM Connectors"]
    CRM["CRM\nSalesforce / HubSpot"]
    MAP["Marketing Automation\nMarketo / Pardot"]
    ADS["Ad Platforms\nGoogle Ads / LinkedIn"]
    EMAIL["Email\nOutreach / Salesloft"]
    ANAL["Analytics\nSegment / Amplitude"]
    ENRICH["Enrichment\nClearbit / ZoomInfo"]
  end

  WEB --> API
  DASH --> API
  API --> AUTH
  API --> TENANT
  API --> SYNC
  SYNC --> QUEUE
  QUEUE --> CRM
  QUEUE --> MAP
  QUEUE --> ADS
  QUEUE --> EMAIL
  QUEUE --> ANAL
  QUEUE --> ENRICH
  API --> DB
  API --> CACHE
  SYNC --> WAREHOUSE
  TENANT --> DB
```

### Request Flow

```mermaid
sequenceDiagram
  actor User as Sales/Marketing User
  participant WEB as Web App
  participant API as API Gateway
  participant AUTH as Auth Service
  participant TENANT as Tenant Manager
  participant SYNC as Sync Engine
  participant CRM as CRM Connector
  participant MAP as Marketing Connector
  participant DB as Database

  Note over User,DB: Flow 1 - Authentication & Tenant Init
  User->>WEB: Login with SSO
  WEB->>AUTH: OAuth2 Token Request
  AUTH-->>WEB: JWT Token + Tenant ID
  WEB->>API: GET /tenant/config
  API->>TENANT: Resolve Tenant Context
  TENANT->>DB: Fetch Tenant Settings
  DB-->>TENANT: Config & Connector List
  TENANT-->>API: Tenant Context
  API-->>WEB: Dashboard Config

  Note over User,DB: Flow 2 - Connect Pre-Built Connector
  User->>WEB: Add Salesforce Connector
  WEB->>API: POST /connectors/salesforce
  API->>TENANT: Validate Tenant Quota
  TENANT-->>API: Approved
  API->>CRM: Authenticate & Validate Credentials
  CRM-->>API: Connection Confirmed
  API->>DB: Save Connector Config
  API->>SYNC: Schedule Sync Job
  SYNC-->>API: Job Scheduled
  API-->>WEB: Connector Active

  Note over User,DB: Flow 3 - Real-Time Data Sync
  SYNC->>CRM: Pull Updated Records
  activate SYNC
  CRM-->>SYNC: Contact & Deal Data
  SYNC->>MAP: Push Segment Updates
  MAP-->>SYNC: Sync Acknowledged
  SYNC->>DB: Upsert Unified Records
  deactivate SYNC
  SYNC-->>WEB: Push Sync Status Update
  WEB-->>User: Dashboard Refreshed
```

### Database Schema

```mermaid
erDiagram
  TENANT {
    uuid tenant_id PK
    string name
    string plan_tier
    string domain
    timestamp created_at
    boolean is_active
  }

  USER {
    uuid user_id PK
    uuid tenant_id FK
    string email
    string role
    string sso_provider
    timestamp last_login
  }

  CONNECTOR {
    uuid connector_id PK
    uuid tenant_id FK
    string connector_type
    string status
    json auth_config
    timestamp last_synced_at
    int sync_interval_seconds
  }

  SYNC_JOB {
    uuid job_id PK
    uuid connector_id FK
    string status
    timestamp started_at
    timestamp completed_at
    int records_synced
    string error_message
  }

  UNIFIED_CONTACT {
    uuid contact_id PK
    uuid tenant_id FK
    string email
    string first_name
    string last_name
    string company
    json source_ids
    timestamp updated_at
  }

  UNIFIED_ACCOUNT {
    uuid account_id PK
    uuid tenant_id FK
    string name
    string domain
    string industry
    int employee_count
    json source_ids
  }

  GTM_EVENT {
    uuid event_id PK
    uuid tenant_id FK
    uuid contact_id FK
    string event_type
    string source_connector
    json payload
    timestamp occurred_at
  }

  TENANT ||--o{ USER : "has"
  TENANT ||--o{ CONNECTOR : "owns"
  TENANT ||--o{ UNIFIED_CONTACT : "stores"
  TENANT ||--o{ UNIFIED_ACCOUNT : "stores"
  CONNECTOR ||--o{ SYNC_JOB : "triggers"
  UNIFIED_CONTACT ||--o{ GTM_EVENT : "generates"
  TENANT ||--o{ GTM_EVENT : "tracks"
```

### Deployment Architecture

```mermaid
flowchart LR
  subgraph Users["End Users"]
    BROWSER["Web Browser\nChrome / Firefox / Safari"]
  end

  subgraph CDN["CDN Layer"]
    CF["CloudFront CDN\nStatic Assets"]
  end

  subgraph PublicIngress["Public Ingress"]
    LB["Load Balancer\nAWS ALB"]
    WAF["WAF\nDDoS Protection"]
  end

  subgraph AppCluster["Application Cluster - EKS"]
    WEB_POD["Web App Pods\nReact SPA"]
    API_POD["API Gateway Pods\nNode.js"]
    AUTH_POD["Auth Service Pods"]
    SYNC_POD["Sync Engine Pods\nWorker Fleet"]
    TENANT_POD["Tenant Manager Pods"]
  end

  subgraph DataLayer["Data Layer - AWS"]
    RDS[("RDS PostgreSQL\nMulti-AZ")]
    REDIS[("ElastiCache Redis\nCluster Mode")]
    SQS["SQS Queues\nSync Events"]
    S3["S3 Bucket\nLogs & Exports"]
  end

  subgraph Warehouse["Analytics"]
    SNOW[("Snowflake\nData Warehouse")]
  end

  subgraph ExternalSaaS["External GTM Platforms"]
    SF["Salesforce"]
    HS["HubSpot"]
    MK["Marketo"]
    GA["Google Ads"]
    SEG["Segment"]
    CB["Clearbit"]
  end

  BROWSER --> CF
  BROWSER --> WAF
  WAF --> LB
  CF --> LB
  LB --> WEB_POD
  LB --> API_POD
  API_POD --> AUTH_POD
  API_POD --> TENANT_POD
  API_POD --> SYNC_POD
  API_POD --> RDS
  API_POD --> REDIS
  SYNC_POD --> SQS
  SQS --> SF
  SQS --> HS
  SQS --> MK
  SQS --> GA
  SQS --> SEG
  SQS --> CB
  SYNC_POD --> SNOW
  API_POD --> S3
```

## Architecture Narrative

Answer: 
1. This is purely based on the web-based for sales and marketing ops.
2. All of the above - full GTM stack coverage
3. Sync data across connectors within 1-5 mintues
4. Multi-tenant SaaS
5. Pre-built connectors only.


---
*Generated by Blueprint Brain 1.7*
