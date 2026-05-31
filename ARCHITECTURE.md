# System Architecture Document

## Project Overview
**Repository:** SmitVgithub/lucent
**Language:** unknown
**Request:** Build a real-time fleet management system called "TrackFleet" for a logistics company. It needs a web dashboard for dispatchers, an Android-only driver app with offline GPS tracking, and an iOS iPad app for warehouse managers. Integrate with Twilio for SMS alerts, Mapbox for live maps, and Stripe for invoice payments. Expected 500 drivers, 50 dispatchers, 10 warehouses. Budget under $300/month.

## Architecture Diagram

```mermaid
flowchart TD
    subgraph Clients["Client Applications"]
        WEB["Web Dashboard\n(Dispatchers - 50 users)"]
        ANDROID["Android Driver App\n(500 drivers)\nOffline GPS Support"]
        IPAD["iOS iPad App\n(Warehouse Managers - 10)"]
    end

    subgraph Backend["Backend Services"]
        API["TrackFleet API Server\n(Node.js/Express)"]
        WS["WebSocket Server\n(Real-time Updates)"]
        QUEUE["Message Queue\n(Redis)"]
        WORKER["Background Workers\n(GPS Processing, Alerts)"]
    end

    subgraph Data["Data Layer"]
        DB[("PostgreSQL\nMain Database")]
        CACHE[("Redis Cache\nSession & GPS Buffer")]
        TIMESERIES[("TimescaleDB\nGPS History")]
    end

    subgraph External["External Services"]
        TWILIO["Twilio\nSMS Alerts"]
        MAPBOX["Mapbox\nLive Maps & Routing"]
        STRIPE["Stripe\nInvoice Payments"]
    end

    WEB -->|"HTTPS"| API
    WEB -->|"WSS"| WS
    ANDROID -->|"HTTPS + Sync"| API
    ANDROID -->|"WSS"| WS
    IPAD -->|"HTTPS"| API
    IPAD -->|"WSS"| WS

    API --> DB
    API --> CACHE
    API --> QUEUE
    WS --> CACHE
    QUEUE --> WORKER
    WORKER --> DB
    WORKER --> TIMESERIES
    WORKER --> TWILIO

    API --> MAPBOX
    API --> STRIPE
    ANDROID --> MAPBOX
```

### Request Flow

```mermaid
sequenceDiagram
    autonumber
    participant D as Android Driver App
    participant API as TrackFleet API
    participant WS as WebSocket Server
    participant Q as Redis Queue
    participant W as Worker
    participant DB as PostgreSQL
    participant TS as TimescaleDB
    participant TW as Twilio
    participant WEB as Dispatcher Dashboard

    Note over D,WEB: Flow 1: Driver GPS Tracking (Online)
    D->>+API: POST /api/location (lat, lng, timestamp)
    API->>Q: Queue location update
    API-->>-D: 200 OK
    Q->>+W: Process location batch
    W->>TS: Store GPS history
    W->>DB: Update driver current position
    W->>WS: Broadcast position update
    WS-->>WEB: Real-time driver location
    deactivate W

    Note over D,WEB: Flow 2: Offline GPS Sync
    D->>D: Store GPS locally (offline)
    D->>+API: POST /api/location/batch (queued points)
    API->>Q: Queue batch processing
    API-->>-D: 200 OK (clear local cache)

    Note over D,WEB: Flow 3: Delivery Alert
    D->>+API: POST /api/delivery/complete
    API->>DB: Update delivery status
    API->>Q: Queue SMS notification
    API-->>-D: 200 OK
    Q->>+W: Process notification
    W->>TW: Send SMS to customer
    TW-->>W: SMS sent
    W->>WS: Broadcast delivery update
    deactivate W
    WS-->>WEB: Delivery completed notification

    Note over D,WEB: Flow 4: Invoice Payment
    WEB->>+API: POST /api/invoice/create
    API->>DB: Create invoice record
    API-->>-WEB: Invoice created
    WEB->>+API: POST /api/payment/process
    API->>API: Call Stripe API
    API->>DB: Update payment status
    API-->>-WEB: Payment confirmed
```

### Database Schema

```mermaid
erDiagram
    COMPANY ||--o{ WAREHOUSE : has
    COMPANY ||--o{ DISPATCHER : employs
    COMPANY ||--o{ DRIVER : employs
    COMPANY ||--o{ VEHICLE : owns
    COMPANY ||--o{ INVOICE : generates

    WAREHOUSE ||--o{ WAREHOUSE_MANAGER : "managed by"
    WAREHOUSE ||--o{ SHIPMENT : originates

    DRIVER ||--o{ GPS_LOCATION : reports
    DRIVER ||--|| VEHICLE : drives
    DRIVER ||--o{ DELIVERY : completes
    DRIVER ||--o{ ALERT : receives

    DISPATCHER ||--o{ SHIPMENT : manages
    DISPATCHER ||--o{ ROUTE : creates

    VEHICLE ||--o{ GPS_LOCATION : tracked
    VEHICLE ||--o{ ROUTE : assigned

    ROUTE ||--o{ DELIVERY : contains
    ROUTE }|--|| DRIVER : "assigned to"

    SHIPMENT ||--o{ DELIVERY : "split into"
    SHIPMENT }|--|| CUSTOMER : "delivered to"

    CUSTOMER ||--o{ DELIVERY : receives
    CUSTOMER ||--o{ ALERT : notified

    INVOICE ||--o{ PAYMENT : "paid by"
    INVOICE }|--|| CUSTOMER : "billed to"

    COMPANY {
        uuid id PK
        string name
        string address
        timestamp created_at
    }

    DRIVER {
        uuid id PK
        uuid company_id FK
        string name
        string phone
        string license_number
        boolean is_active
        timestamp last_seen
    }

    VEHICLE {
        uuid id PK
        uuid company_id FK
        uuid current_driver_id FK
        string plate_number
        string model
        string status
    }

    GPS_LOCATION {
        uuid id PK
        uuid driver_id FK
        uuid vehicle_id FK
        decimal latitude
        decimal longitude
        float speed
        float heading
        timestamp recorded_at
        boolean synced_offline
    }

    DISPATCHER {
        uuid id PK
        uuid company_id FK
        string name
        string email
        string password_hash
    }

    WAREHOUSE {
        uuid id PK
        uuid company_id FK
        string name
        string address
        decimal latitude
        decimal longitude
    }

    WAREHOUSE_MANAGER {
        uuid id PK
        uuid warehouse_id FK
        string name
        string email
        string password_hash
    }

    ROUTE {
        uuid id PK
        uuid driver_id FK
        uuid dispatcher_id FK
        date scheduled_date
        string status
        json waypoints
    }

    SHIPMENT {
        uuid id PK
        uuid warehouse_id FK
        uuid customer_id FK
        string tracking_number
        string status
        timestamp created_at
    }

    DELIVERY {
        uuid id PK
        uuid shipment_id FK
        uuid route_id FK
        uuid driver_id FK
        string address
        string status
        timestamp completed_at
        string signature_url
    }

    CUSTOMER {
        uuid id PK
        string name
        string phone
        string email
        string address
    }

    ALERT {
        uuid id PK
        uuid driver_id FK
        uuid customer_id FK
        string type
        string message
        string channel
        timestamp sent_at
    }

    INVOICE {
        uuid id PK
        uuid company_id FK
        uuid customer_id FK
        decimal amount
        string status
        string stripe_invoice_id
        timestamp due_date
    }

    PAYMENT {
        uuid id PK
        uuid invoice_id FK
        decimal amount
        string stripe_payment_id
        string status
        timestamp paid_at
    }
```

### Deployment Architecture

```mermaid
flowchart LR
    subgraph AppStores["App Distribution"]
        PLAYSTORE["Google Play Store\n(Android Driver App)"]
        APPSTORE["Apple App Store\n(iOS iPad App)"]
    end

    subgraph ClientDevices["Client Devices"]
        BROWSER["Web Browser\n(Dispatcher Dashboard)"]
        ANDROID["Android Phones\n(500 Drivers)"]
        IPAD["iPads\n(10 Warehouse Managers)"]
    end

    subgraph CDN["CDN Layer"]
        CF["Cloudflare\nCDN + DDoS Protection"]
    end

    subgraph Cloud["Railway / Render Cloud (~$150/mo)"]
        subgraph WebTier["Web Tier"]
            NGINX["Nginx\nReverse Proxy"]
            WEBAPP["Static Web App\n(React Dashboard)"]
        end

        subgraph AppTier["Application Tier"]
            API1["API Server 1\n(Node.js)"]
            API2["API Server 2\n(Node.js)"]
            WSSERVER["WebSocket Server\n(Socket.io)"]
        end

        subgraph WorkerTier["Worker Tier"]
            WORKER1["GPS Worker"]
            WORKER2["Notification Worker"]
        end
    end

    subgraph DataTier["Managed Data Services (~$100/mo)"]
        subgraph Primary["Primary Database"]
            PG["Supabase PostgreSQL\n+ TimescaleDB Extension"]
        end
        subgraph Cache["Cache Layer"]
            REDIS["Upstash Redis\n(Serverless)"]
        end
    end

    subgraph External["External APIs"]
        TWILIO["Twilio API\n(SMS)"]
        MAPBOX["Mapbox API\n(Maps + Geocoding)"]
        STRIPE["Stripe API\n(Payments)"]
    end

    PLAYSTORE -.->|"Install"| ANDROID
    APPSTORE -.->|"Install"| IPAD

    BROWSER -->|"HTTPS"| CF
    ANDROID -->|"HTTPS"| CF
    IPAD -->|"HTTPS"| CF

    CF -->|"Route"| NGINX
    NGINX -->|"Static"| WEBAPP
    NGINX -->|"API"| API1
    NGINX -->|"API"| API2
    NGINX -->|"WS"| WSSERVER

    API1 --> PG
    API2 --> PG
    API1 --> REDIS
    API2 --> REDIS
    WSSERVER --> REDIS

    API1 --> REDIS
    REDIS --> WORKER1
    REDIS --> WORKER2

    WORKER1 --> PG
    WORKER2 --> TWILIO

    API1 --> MAPBOX
    API1 --> STRIPE
    ANDROID -->|"Direct SDK"| MAPBOX
```

## Architecture Narrative

Build a real-time fleet management system called "TrackFleet" for a logistics company. It needs a web dashboard for dispatchers, an Android-only driver app with offline GPS tracking, and an iOS iPad app for warehouse managers. Integrate with Twilio for SMS alerts, Mapbox for live maps, and Stripe for invoice payments. Expected 500 drivers, 50 dispatchers, 10 warehouses. Budget under $300/month.


---
*Generated by Blueprint Brain 1.7*
