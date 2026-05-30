# System Architecture Document

## Project Overview
**Repository:** SmitVgithub/lucent
**Language:** unknown
**Request:** 1. End Consumers
2. Medium
3. Under $1000/month

## Architecture Diagram

```mermaid
flowchart TD
    subgraph Frontend["Frontend Layer"]
        WEB["Web Application"]
        MOBILE["Mobile App"]
    end
    
    subgraph Backend["Backend Layer"]
        API["API Gateway"]
        AUTH["Auth Service"]
        CORE["Core Service"]
        NOTIFY["Notification Service"]
    end
    
    subgraph Data["Data Layer"]
        DB[("PostgreSQL Database")]
        CACHE[("Redis Cache")]
        STORAGE[("File Storage")]
    end
    
    subgraph External["External Services"]
        EMAIL["Email Provider"]
        PAYMENT["Payment Gateway"]
        ANALYTICS["Analytics Service"]
    end
    
    WEB -->|"HTTPS"| API
    MOBILE -->|"HTTPS"| API
    API -->|"Authenticate"| AUTH
    API -->|"Business Logic"| CORE
    API -->|"Send Alerts"| NOTIFY
    AUTH -->|"Session Data"| CACHE
    CORE -->|"CRUD Operations"| DB
    CORE -->|"Cache Queries"| CACHE
    CORE -->|"Store Files"| STORAGE
    NOTIFY -->|"Send Email"| EMAIL
    CORE -->|"Process Payment"| PAYMENT
    API -->|"Track Events"| ANALYTICS
```

### Request Flow

```mermaid
sequenceDiagram
    participant U as User
    participant W as Web App
    participant A as API Gateway
    participant AU as Auth Service
    participant C as Core Service
    participant D as Database
    participant P as Payment Gateway
    
    Note over U,D: User Registration Flow
    U->>W: Enter registration details
    W->>A: POST /api/register
    activate A
    A->>AU: Validate & create user
    activate AU
    AU->>D: Store user record
    D-->>AU: Confirm creation
    AU-->>A: Return JWT token
    deactivate AU
    A-->>W: Registration success
    deactivate A
    W-->>U: Show dashboard
    
    Note over U,P: Purchase Flow
    U->>W: Select product
    W->>A: POST /api/orders
    activate A
    A->>AU: Verify token
    AU-->>A: Token valid
    A->>C: Create order
    activate C
    C->>D: Save order
    C->>P: Process payment
    activate P
    P-->>C: Payment confirmed
    deactivate P
    C->>D: Update order status
    C-->>A: Order complete
    deactivate C
    A-->>W: Order confirmation
    deactivate A
    W-->>U: Display receipt
```

### Database Schema

```mermaid
erDiagram
    USER {
        uuid id PK
        string email UK
        string password_hash
        string full_name
        string phone
        datetime created_at
        datetime updated_at
        boolean is_active
    }
    
    PROFILE {
        uuid id PK
        uuid user_id FK
        string avatar_url
        text bio
        json preferences
    }
    
    PRODUCT {
        uuid id PK
        string name
        text description
        decimal price
        integer stock_quantity
        string category
        boolean is_available
    }
    
    ORDER {
        uuid id PK
        uuid user_id FK
        decimal total_amount
        string status
        datetime order_date
        string payment_method
    }
    
    ORDER_ITEM {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        integer quantity
        decimal unit_price
    }
    
    PAYMENT {
        uuid id PK
        uuid order_id FK
        decimal amount
        string provider
        string transaction_id
        string status
        datetime processed_at
    }
    
    NOTIFICATION {
        uuid id PK
        uuid user_id FK
        string type
        string title
        text message
        boolean is_read
        datetime sent_at
    }
    
    USER ||--|| PROFILE : has
    USER ||--o{ ORDER : places
    USER ||--o{ NOTIFICATION : receives
    ORDER ||--|{ ORDER_ITEM : contains
    ORDER ||--|| PAYMENT : has
    PRODUCT ||--o{ ORDER_ITEM : included_in
```

### Deployment Architecture

```mermaid
flowchart LR
    subgraph Internet["Internet"]
        USERS(("End Users"))
        CDN["CDN / CloudFlare"]
    end
    
    subgraph Cloud["Cloud Infrastructure"]
        subgraph DMZ["Public Subnet"]
            LB["Load Balancer"]
            WAF["Web Application Firewall"]
        end
        
        subgraph AppTier["Application Subnet"]
            subgraph Containers["Container Cluster"]
                API1["API Instance 1"]
                API2["API Instance 2"]
                WORKER["Background Worker"]
            end
        end
        
        subgraph DataTier["Private Subnet"]
            PRIMARY[("PostgreSQL Primary")]
            REPLICA[("PostgreSQL Replica")]
            REDIS[("Redis Cluster")]
            S3[("Object Storage")]
        end
    end
    
    subgraph External["External Services"]
        SMTP["SendGrid SMTP"]
        STRIPE["Stripe API"]
        MONITOR["Monitoring Service"]
    end
    
    USERS -->|"HTTPS"| CDN
    CDN -->|"Origin Request"| WAF
    WAF --> LB
    LB --> API1
    LB --> API2
    API1 --> REDIS
    API2 --> REDIS
    API1 --> PRIMARY
    API2 --> PRIMARY
    PRIMARY -->|"Replication"| REPLICA
    WORKER --> PRIMARY
    WORKER --> S3
    API1 --> SMTP
    API2 --> STRIPE
    Containers --> MONITOR
```

## Architecture Narrative

1. End Consumers
2. Medium
3. Under $1000/month


---
*Generated by Blueprint Brain 1.7*
