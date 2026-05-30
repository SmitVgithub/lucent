# System Architecture Document

## Project Overview
**Repository:** SmitVgithub/lucent
**Language:** unknown
**Request:** Create a taxi driver application with a real-time ride sharing.

## Architecture Diagram

```mermaid
flowchart TD
    subgraph Frontend["Frontend Layer"]
        MA["Mobile App\n(iOS/Android)"]
    end
    
    subgraph Backend["Backend Services"]
        AG["API Gateway"]
        AS["Auth Service"]
        RS["Ride Service"]
        MS["Matching Service"]
        NS["Notification Service"]
        LS["Location Service"]
        PS["Payment Service"]
    end
    
    subgraph Data["Data Layer"]
        PG[("PostgreSQL\nMain Database")]
        RD[("Redis\nCache & Sessions")]
        MQ["Message Queue\n(RabbitMQ)"]
    end
    
    subgraph External["External Services"]
        MAP["Maps API\n(Google/Mapbox)"]
        PAY["Payment Gateway\n(Stripe)"]
        PUSH["Push Notifications\n(FCM/APNs)"]
    end
    
    MA -->|"HTTPS/WSS"| AG
    AG --> AS
    AG --> RS
    AG --> LS
    AS --> PG
    AS --> RD
    RS --> MS
    RS --> PG
    MS --> MQ
    MS --> RD
    LS --> RD
    LS --> MAP
    RS --> PS
    PS --> PAY
    NS --> MQ
    NS --> PUSH
    MQ --> NS
```

### Request Flow

```mermaid
sequenceDiagram
    participant D as Driver App
    participant R as Rider App
    participant AG as API Gateway
    participant AS as Auth Service
    participant RS as Ride Service
    participant MS as Matching Service
    participant LS as Location Service
    participant NS as Notification Service
    
    Note over D,NS: Driver Authentication Flow
    D->>AG: Login Request
    AG->>AS: Validate Credentials
    activate AS
    AS-->>AG: JWT Token
    deactivate AS
    AG-->>D: Auth Success + Token
    
    Note over D,NS: Driver Goes Online
    D->>AG: Set Status Online
    AG->>LS: Update Driver Location
    activate LS
    LS-->>AG: Location Confirmed
    deactivate LS
    
    Note over R,NS: Rider Requests Ride
    R->>AG: Request Ride (pickup, destination)
    AG->>RS: Create Ride Request
    activate RS
    RS->>MS: Find Nearby Drivers
    activate MS
    MS->>LS: Get Available Drivers
    LS-->>MS: Driver List
    MS-->>RS: Best Match Driver
    deactivate MS
    RS->>NS: Notify Driver
    deactivate RS
    NS-->>D: Push: New Ride Request
    
    Note over D,NS: Driver Accepts Ride
    D->>AG: Accept Ride
    AG->>RS: Confirm Acceptance
    RS->>NS: Notify Rider
    NS-->>R: Push: Driver Assigned
    
    Note over D,NS: Real-time Location Sharing
    loop Every 5 seconds
        D->>LS: Update Location (WebSocket)
        LS-->>R: Driver Location Update
    end
```

### Database Schema

```mermaid
erDiagram
    USER {
        uuid id PK
        string email UK
        string phone UK
        string password_hash
        string first_name
        string last_name
        enum role "driver,rider"
        boolean is_verified
        timestamp created_at
    }
    
    DRIVER_PROFILE {
        uuid id PK
        uuid user_id FK
        string license_number UK
        string vehicle_make
        string vehicle_model
        string vehicle_plate UK
        enum status "online,offline,busy"
        float rating
        int total_rides
    }
    
    RIDE {
        uuid id PK
        uuid rider_id FK
        uuid driver_id FK
        point pickup_location
        point dropoff_location
        string pickup_address
        string dropoff_address
        enum status "requested,accepted,in_progress,completed,cancelled"
        decimal fare_amount
        float distance_km
        int duration_minutes
        timestamp requested_at
        timestamp started_at
        timestamp completed_at
    }
    
    LOCATION_LOG {
        uuid id PK
        uuid user_id FK
        uuid ride_id FK
        point coordinates
        float speed
        float heading
        timestamp recorded_at
    }
    
    PAYMENT {
        uuid id PK
        uuid ride_id FK
        uuid user_id FK
        decimal amount
        string currency
        enum status "pending,completed,failed,refunded"
        string stripe_payment_id
        timestamp processed_at
    }
    
    RATING {
        uuid id PK
        uuid ride_id FK
        uuid from_user_id FK
        uuid to_user_id FK
        int score
        string comment
        timestamp created_at
    }
    
    NOTIFICATION {
        uuid id PK
        uuid user_id FK
        string title
        string body
        enum type "ride_request,ride_update,payment,promo"
        boolean is_read
        timestamp sent_at
    }
    
    USER ||--o| DRIVER_PROFILE : "has"
    USER ||--o{ RIDE : "requests as rider"
    DRIVER_PROFILE ||--o{ RIDE : "accepts as driver"
    USER ||--o{ LOCATION_LOG : "generates"
    RIDE ||--o{ LOCATION_LOG : "tracks"
    RIDE ||--|| PAYMENT : "has"
    USER ||--o{ PAYMENT : "makes"
    RIDE ||--o{ RATING : "receives"
    USER ||--o{ RATING : "gives"
    USER ||--o{ RATING : "receives"
    USER ||--o{ NOTIFICATION : "receives"
```

### Deployment Architecture

```mermaid
flowchart LR
    subgraph Users["End Users"]
        IOS["iOS App"]
        AND["Android App"]
    end
    
    subgraph CDN["CDN Layer"]
        CF["CloudFlare\nCDN & DDoS"]
    end
    
    subgraph AWS["AWS Cloud"]
        subgraph PublicSubnet["Public Subnet"]
            ALB["Application\nLoad Balancer"]
        end
        
        subgraph PrivateSubnet["Private Subnet - EKS Cluster"]
            subgraph Services["Kubernetes Pods"]
                APIGW["API Gateway\nPod x3"]
                AUTH["Auth Service\nPod x2"]
                RIDE["Ride Service\nPod x3"]
                MATCH["Matching Service\nPod x2"]
                LOC["Location Service\nPod x3"]
                NOTIF["Notification Service\nPod x2"]
                PAY["Payment Service\nPod x2"]
            end
        end
        
        subgraph DataSubnet["Data Subnet"]
            RDS[("RDS PostgreSQL\nMulti-AZ")]
            REDIS[("ElastiCache\nRedis Cluster")]
            MQ["Amazon MQ\nRabbitMQ"]
        end
        
        S3[("S3 Bucket\nStatic Assets")]
    end
    
    subgraph External["External Services"]
        STRIPE["Stripe API"]
        GOOGLE["Google Maps API"]
        FCM["Firebase Cloud\nMessaging"]
        APNS["Apple Push\nNotification"]
    end
    
    IOS --> CF
    AND --> CF
    CF --> ALB
    ALB --> APIGW
    APIGW --> AUTH
    APIGW --> RIDE
    APIGW --> LOC
    AUTH --> RDS
    AUTH --> REDIS
    RIDE --> MATCH
    RIDE --> RDS
    MATCH --> REDIS
    MATCH --> MQ
    LOC --> REDIS
    LOC --> GOOGLE
    NOTIF --> MQ
    NOTIF --> FCM
    NOTIF --> APNS
    PAY --> STRIPE
    PAY --> RDS
    CF --> S3
```

## Architecture Narrative

Create a taxi driver application with a real-time ride sharing.

## Components

- **Mobile App** (service): Mobile App for lucent

---
*Generated by Blueprint Brain 1.7*
