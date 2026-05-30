# System Architecture Document

## Project Overview
**Repository:** SmitVgithub/lucent
**Language:** unknown
**Request:** 1. End Consumers
2. Medium
3. $50-$70

Only web-based application support

## Architecture Diagram

```mermaid
flowchart TD
    subgraph Frontend["Frontend Layer"]
        WebApp["Frontend App\n(Web Application)"]
        MobileApp["Mobile App\n(Responsive Web)"]
    end
    
    subgraph Backend["Backend Layer"]
        API["API Gateway"]
        AuthService["Authentication Service"]
        AppService["Application Service"]
    end
    
    subgraph Data["Data Layer"]
        DB[("Primary Database")]
        Cache[("Cache Store")]
    end
    
    subgraph External["External Services"]
        CDN["CDN"]
        EmailService["Email Service"]
    end
    
    WebApp -->|"HTTPS Requests"| API
    MobileApp -->|"HTTPS Requests"| API
    CDN -->|"Static Assets"| WebApp
    CDN -->|"Static Assets"| MobileApp
    API -->|"Authenticate"| AuthService
    API -->|"Business Logic"| AppService
    AuthService -->|"Query/Store"| DB
    AppService -->|"Query/Store"| DB
    AppService -->|"Read Cache"| Cache
    AppService -->|"Send Notifications"| EmailService
```

### Request Flow

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant FrontendApp as Frontend App
    participant API as API Gateway
    participant Auth as Auth Service
    participant App as App Service
    participant DB as Database
    
    Note over User,DB: User Authentication Flow
    User->>FrontendApp: Open Lucent Application
    FrontendApp->>API: POST /auth/login
    activate API
    API->>Auth: Validate Credentials
    activate Auth
    Auth->>DB: Query User Record
    DB-->>Auth: User Data
    Auth-->>API: JWT Token
    deactivate Auth
    API-->>FrontendApp: Auth Response + Token
    deactivate API
    FrontendApp-->>User: Display Dashboard
    
    Note over User,DB: Data Retrieval Flow
    User->>FrontendApp: Request Data View
    FrontendApp->>API: GET /api/data (with JWT)
    activate API
    API->>Auth: Verify Token
    Auth-->>API: Token Valid
    API->>App: Fetch User Data
    activate App
    App->>DB: SELECT Query
    DB-->>App: Result Set
    App-->>API: Formatted Response
    deactivate App
    API-->>FrontendApp: JSON Data
    deactivate API
    FrontendApp-->>User: Render Data View
    
    Note over User,DB: Data Update Flow
    User->>FrontendApp: Submit Form Update
    FrontendApp->>API: PUT /api/data/:id
    activate API
    API->>App: Process Update
    activate App
    App->>DB: UPDATE Query
    DB-->>App: Confirmation
    App-->>API: Success Response
    deactivate App
    API-->>FrontendApp: 200 OK
    deactivate API
    FrontendApp-->>User: Show Success Message
```

### Database Schema

```mermaid
erDiagram
    USER {
        uuid id PK
        string email UK
        string password_hash
        string first_name
        string last_name
        datetime created_at
        datetime updated_at
        boolean is_active
    }
    
    USER_PROFILE {
        uuid id PK
        uuid user_id FK
        string avatar_url
        string phone_number
        json preferences
        datetime last_login
    }
    
    SESSION {
        uuid id PK
        uuid user_id FK
        string token
        string device_info
        datetime expires_at
        datetime created_at
    }
    
    CONTENT {
        uuid id PK
        uuid user_id FK
        string title
        text description
        string status
        datetime created_at
        datetime updated_at
    }
    
    CATEGORY {
        uuid id PK
        string name
        string slug UK
        text description
    }
    
    CONTENT_CATEGORY {
        uuid content_id FK
        uuid category_id FK
    }
    
    ACTIVITY_LOG {
        uuid id PK
        uuid user_id FK
        string action_type
        json metadata
        datetime created_at
    }
    
    USER ||--|| USER_PROFILE : has
    USER ||--o{ SESSION : maintains
    USER ||--o{ CONTENT : creates
    USER ||--o{ ACTIVITY_LOG : generates
    CONTENT ||--o{ CONTENT_CATEGORY : belongs_to
    CATEGORY ||--o{ CONTENT_CATEGORY : contains
```

### Deployment Architecture

```mermaid
flowchart LR
    subgraph Internet["Internet"]
        Users["End Users\n(Browsers)"]
    end
    
    subgraph CloudProvider["Cloud Infrastructure"]
        subgraph EdgeLayer["Edge Layer"]
            CDN["CDN\n(Static Assets)"]
            WAF["Web Application\nFirewall"]
        end
        
        subgraph DMZ["DMZ / Public Subnet"]
            LB["Load Balancer\n(HTTPS Termination)"]
        end
        
        subgraph AppTier["Application Tier / Private Subnet"]
            subgraph WebServers["Web Server Cluster"]
                Web1["Frontend App\nInstance 1"]
                Web2["Frontend App\nInstance 2"]
            end
            
            subgraph APIServers["API Server Cluster"]
                API1["API Server\nInstance 1"]
                API2["API Server\nInstance 2"]
            end
        end
        
        subgraph DataTier["Data Tier / Isolated Subnet"]
            subgraph DBCluster["Database Cluster"]
                DBPrimary[("PostgreSQL\nPrimary")]
                DBReplica[("PostgreSQL\nReplica")]
            end
            Redis[("Redis Cache")]
        end
        
        subgraph Services["Managed Services"]
            Storage["Object Storage\n(Assets)"]
            Email["Email Service"]
            Monitoring["Monitoring &\nLogging"]
        end
    end
    
    Users -->|"HTTPS"| CDN
    CDN -->|"Dynamic Requests"| WAF
    WAF -->|"Filtered Traffic"| LB
    LB -->|"Route /app"| Web1
    LB -->|"Route /app"| Web2
    LB -->|"Route /api"| API1
    LB -->|"Route /api"| API2
    Web1 & Web2 -->|"API Calls"| API1 & API2
    API1 & API2 -->|"Read/Write"| DBPrimary
    DBPrimary -->|"Replication"| DBReplica
    API1 & API2 -->|"Cache"| Redis
    API1 & API2 -->|"Send Email"| Email
    CDN -->|"Fetch Assets"| Storage
    Web1 & Web2 & API1 & API2 -->|"Logs & Metrics"| Monitoring
```

## Architecture Narrative

1. End Consumers
2. Medium
3. $50-$70

Only web-based application support

## Components

- **Frontend App** (service): Frontend App for lucent
- **Mobile App** (service): Mobile App for lucent

---
*Generated by Blueprint Brain 1.7*
