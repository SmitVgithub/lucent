# System Architecture Document

## Project Overview
**Repository:** SmitVgithub/lucent
**Language:** unknown
**Request:** 1. Web app (embedded on my website)
2. Dynamic document search
3. HIPAA and ISO 27001
4. Standalone

## Architecture Diagram

```mermaid
flowchart TD
    subgraph Frontend["Frontend Layer"]
        WA["Lucent Web App"]
        EMB["Embedded Widget"]
    end
    
    subgraph Backend["Backend Services"]
        API["API Gateway"]
        AUTH["Authentication Service"]
        SEARCH["Document Search Engine"]
        DOC["Document Service"]
        AUDIT["Audit Logging Service"]
    end
    
    subgraph Data["Data Layer"]
        DB[("PostgreSQL Database")]
        ES[("Elasticsearch Index")]
        CACHE[("Redis Cache")]
        S3[("Encrypted Document Storage")]
    end
    
    subgraph Security["Security Layer"]
        WAF["Web Application Firewall"]
        ENC["Encryption Service"]
        KMS["Key Management Service"]
    end
    
    WA -->|"HTTPS"| WAF
    EMB -->|"HTTPS"| WAF
    WAF -->|"Filtered Traffic"| API
    API -->|"Authenticate"| AUTH
    API -->|"Search Request"| SEARCH
    API -->|"Document CRUD"| DOC
    API -->|"Log Activity"| AUDIT
    SEARCH -->|"Query"| ES
    SEARCH -->|"Cache Results"| CACHE
    DOC -->|"Store/Retrieve"| S3
    DOC -->|"Encrypt/Decrypt"| ENC
    AUTH -->|"User Data"| DB
    AUDIT -->|"Audit Logs"| DB
    ENC -->|"Key Operations"| KMS
```

### Request Flow

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant W as Lucent Web App
    participant API as API Gateway
    participant AUTH as Auth Service
    participant SEARCH as Search Engine
    participant DOC as Document Service
    participant AUDIT as Audit Service
    participant ES as Elasticsearch
    participant S3 as Document Storage
    
    Note over U,S3: Authentication Flow
    U->>W: Access Lucent App
    W->>API: Login Request
    activate API
    API->>AUTH: Validate Credentials
    activate AUTH
    AUTH-->>API: JWT Token
    deactivate AUTH
    API-->>W: Auth Token + Session
    deactivate API
    API->>AUDIT: Log Login Event
    
    Note over U,S3: Document Search Flow
    U->>W: Enter Search Query
    W->>API: Search Request + Token
    activate API
    API->>AUTH: Validate Token
    AUTH-->>API: Token Valid
    API->>SEARCH: Execute Search
    activate SEARCH
    SEARCH->>ES: Query Documents
    ES-->>SEARCH: Search Results
    SEARCH-->>API: Filtered Results
    deactivate SEARCH
    API-->>W: Display Results
    deactivate API
    API->>AUDIT: Log Search Activity
    
    Note over U,S3: Document Retrieval Flow
    U->>W: Select Document
    W->>API: Get Document Request
    activate API
    API->>DOC: Retrieve Document
    activate DOC
    DOC->>S3: Fetch Encrypted Doc
    S3-->>DOC: Encrypted Content
    DOC-->>API: Decrypted Document
    deactivate DOC
    API-->>W: Document Content
    deactivate API
    API->>AUDIT: Log Document Access
```

### Database Schema

```mermaid
erDiagram
    USER ||--o{ SESSION : has
    USER ||--o{ DOCUMENT : owns
    USER ||--o{ SEARCH_HISTORY : performs
    USER ||--o{ AUDIT_LOG : generates
    DOCUMENT ||--o{ DOCUMENT_VERSION : has
    DOCUMENT ||--o{ DOCUMENT_INDEX : indexed_in
    DOCUMENT }o--o{ TAG : tagged_with
    
    USER {
        uuid id PK
        string email UK
        string password_hash
        string full_name
        boolean is_active
        datetime created_at
        datetime last_login
        string role
    }
    
    SESSION {
        uuid id PK
        uuid user_id FK
        string jwt_token
        datetime expires_at
        string ip_address
        datetime created_at
    }
    
    DOCUMENT {
        uuid id PK
        uuid owner_id FK
        string title
        string storage_path
        string encryption_key_id
        string content_type
        bigint file_size
        datetime created_at
        datetime updated_at
        boolean is_deleted
    }
    
    DOCUMENT_VERSION {
        uuid id PK
        uuid document_id FK
        int version_number
        string storage_path
        string checksum
        datetime created_at
    }
    
    DOCUMENT_INDEX {
        uuid id PK
        uuid document_id FK
        text content_text
        jsonb metadata
        datetime indexed_at
    }
    
    TAG {
        uuid id PK
        string name UK
        string category
    }
    
    SEARCH_HISTORY {
        uuid id PK
        uuid user_id FK
        string query_text
        int results_count
        datetime searched_at
    }
    
    AUDIT_LOG {
        uuid id PK
        uuid user_id FK
        string action_type
        string resource_type
        uuid resource_id
        jsonb details
        string ip_address
        datetime created_at
    }
```

### Deployment Architecture

```mermaid
flowchart LR
    subgraph Internet["Internet"]
        USERS["Users / Embedded Sites"]
    end
    
    subgraph CloudProvider["Cloud Infrastructure - HIPAA Compliant"]
        subgraph EdgeLayer["Edge Security"]
            CDN["CDN / Static Assets"]
            WAF["WAF / DDoS Protection"]
            LB["Load Balancer"]
        end
        
        subgraph AppTier["Application Tier - Private Subnet"]
            subgraph K8s["Kubernetes Cluster"]
                API1["API Pod 1"]
                API2["API Pod 2"]
                AUTH1["Auth Pod"]
                SEARCH1["Search Pod 1"]
                SEARCH2["Search Pod 2"]
                DOC1["Document Pod"]
                AUDIT1["Audit Pod"]
            end
        end
        
        subgraph DataTier["Data Tier - Isolated Subnet"]
            subgraph DBCluster["Database Cluster"]
                PGPRI[("PostgreSQL Primary")]
                PGREP[("PostgreSQL Replica")]
            end
            subgraph SearchCluster["Search Cluster"]
                ES1[("Elasticsearch Node 1")]
                ES2[("Elasticsearch Node 2")]
            end
            REDIS[("Redis Cluster")]
        end
        
        subgraph Storage["Encrypted Storage"]
            S3[("S3 - Document Storage")]
            S3BACKUP[("S3 - Backup Bucket")]
        end
        
        subgraph SecurityServices["Security Services"]
            KMS["KMS - Key Management"]
            SECRETS["Secrets Manager"]
            IAM["IAM Roles"]
        end
        
        subgraph Monitoring["Monitoring & Compliance"]
            LOGS["CloudWatch Logs"]
            METRICS["Metrics Dashboard"]
            ALERTS["Alert Manager"]
        end
    end
    
    USERS -->|"HTTPS"| CDN
    CDN -->|"Dynamic"| WAF
    WAF -->|"Filtered"| LB
    LB --> API1
    LB --> API2
    API1 --> AUTH1
    API2 --> AUTH1
    API1 --> SEARCH1
    API2 --> SEARCH2
    API1 --> DOC1
    API1 --> AUDIT1
    AUTH1 --> PGPRI
    AUDIT1 --> PGPRI
    SEARCH1 --> ES1
    SEARCH2 --> ES2
    SEARCH1 --> REDIS
    DOC1 --> S3
    DOC1 --> KMS
    PGPRI --> PGREP
    PGPRI --> S3BACKUP
    K8s --> SECRETS
    K8s --> IAM
    K8s --> LOGS
```

## Architecture Narrative

# Blueprint Architecture Narrative: HIPAA-Compliant Document Search Platform

## Executive Summary

This architecture defines a standalone, embeddable web application for dynamic document search that meets stringent HIPAA and ISO 27001 compliance requirements. The system is designed to be embedded within an existing website while maintaining complete isolation of protected health information (PHI) and audit capabilities. By leveraging Google Cloud Platform's compliance-certified infrastructure combined with a carefully selected open-source stack, this design achieves the critical balance between regulatory compliance, operational simplicity, and cost-effectiveness for a greenfield deployment.

---

## System Overview and Design Philosophy

The architecture follows a **compliance-first, defense-in-depth** approach where every component interaction assumes potential exposure to PHI and implements appropriate safeguards. The frontend is a React Single Page Application built with TypeScript, embedded via iframe with strict Content Security Policy headers to prevent data leakage to the parent website. This isolation boundary is critical—the embedded app operates as a fully independent security domain, communicating only through well-defined postMessage APIs for non-sensitive UI coordination while all PHI-bearing requests flow directly to the backend over TLS 1.3.

The backend leverages **Node.js with Fastify**, chosen specifically for its low-overhead request handling and first-class TypeScript support, which enables compile-time type safety across the entire request/response lifecycle—a significant advantage when handling structured medical documents where schema violations could indicate injection attempts. Fastify's plugin architecture allows us to implement HIPAA-required audit logging as middleware that captures every PHI access event before the request handler executes, ensuring no code path can bypass compliance logging. The framework's built-in JSON Schema valida


---
*Generated by Blueprint Brain 1.7*
