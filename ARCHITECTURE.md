# System Architecture Document

## Project Overview
**Repository:** SmitVgithub/lucent
**Language:** unknown
**Request:** Build one online pizza restaurant application named "Sam's Pizza" where people can order the pizza on restaurant itself or take away - no home delivery. So there is only two option in restaurant and take away. It is for iOS app. Let me know if you need more information from my side.

## Architecture Diagram

```mermaid
flowchart TD
    subgraph Frontend["Frontend Layer"]
        MobileApp["📱 Mobile App\niOS App for Sam's Pizza"]
        FrontendApp["🌐 Frontend App\nWeb Interface"]
    end
    
    subgraph Backend["Backend Layer"]
        APIServer["⚙️ API Server\nREST API for lucent"]
    end
    
    subgraph Data["Data Layer"]
        Database[("🗄️ Database\nPostgreSQL")]
        Cache[("⚡ Cache\nRedis")]
    end
    
    subgraph External["External Services"]
        PaymentGateway["💳 Payment Gateway"]
        PushNotifications["🔔 Push Notifications\nAPNS"]
    end
    
    MobileApp -->|"User requests"| APIServer
    FrontendApp -->|"User requests"| APIServer
    APIServer -->|"Query/Store"| Database
    APIServer -->|"Session/Cache"| Cache
    APIServer -->|"Process payments"| PaymentGateway
    APIServer -->|"Send notifications"| PushNotifications
```

### Request Flow

```mermaid
sequenceDiagram
    autonumber
    participant User as 👤 Customer
    participant iOS as 📱 Mobile App
    participant API as ⚙️ API Server
    participant DB as 🗄️ Database
    participant Payment as 💳 Payment Gateway
    
    Note over User,Payment: Order Flow - Dine-in or Take Away
    
    User->>iOS: Open Sam's Pizza App
    iOS->>API: GET /menu
    activate API
    API->>DB: Query available pizzas
    DB-->>API: Pizza menu data
    API-->>iOS: Menu with prices
    deactivate API
    iOS-->>User: Display pizza menu
    
    User->>iOS: Select pizzas & order type
    Note right of User: Choose: In-Restaurant or Take Away
    
    User->>iOS: Add items to cart
    iOS->>API: POST /cart/items
    activate API
    API->>DB: Store cart items
    API-->>iOS: Cart updated
    deactivate API
    
    User->>iOS: Proceed to checkout
    iOS->>API: POST /orders
    activate API
    API->>DB: Create order record
    API->>Payment: Process payment
    activate Payment
    Payment-->>API: Payment confirmed
    deactivate Payment
    API->>DB: Update order status
    API-->>iOS: Order confirmation
    deactivate API
    iOS-->>User: Show order number & pickup time
```

### Database Schema

```mermaid
erDiagram
    USER {
        uuid id PK
        string name
        string email UK
        string phone
        string password_hash
        datetime created_at
    }
    
    PIZZA {
        uuid id PK
        string name
        string description
        string size
        decimal price
        string image_url
        boolean is_available
    }
    
    TOPPING {
        uuid id PK
        string name
        decimal price
        boolean is_available
    }
    
    ORDER {
        uuid id PK
        uuid user_id FK
        string order_type "IN_RESTAURANT or TAKE_AWAY"
        string status
        decimal total_amount
        string order_number
        datetime pickup_time
        datetime created_at
    }
    
    ORDER_ITEM {
        uuid id PK
        uuid order_id FK
        uuid pizza_id FK
        integer quantity
        decimal unit_price
        decimal subtotal
    }
    
    ORDER_ITEM_TOPPING {
        uuid id PK
        uuid order_item_id FK
        uuid topping_id FK
    }
    
    PAYMENT {
        uuid id PK
        uuid order_id FK
        string payment_method
        string transaction_id
        decimal amount
        string status
        datetime paid_at
    }
    
    USER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    PIZZA ||--o{ ORDER_ITEM : "ordered as"
    ORDER_ITEM ||--o{ ORDER_ITEM_TOPPING : "has extra"
    TOPPING ||--o{ ORDER_ITEM_TOPPING : "added to"
    ORDER ||--|| PAYMENT : "paid via"
```

### Deployment Architecture

```mermaid
flowchart LR
    subgraph Internet["🌐 Internet"]
        Users["👥 Customers"]
    end
    
    subgraph Apple["Apple Services"]
        AppStore["🍎 App Store"]
        APNS["🔔 APNS\nPush Notifications"]
    end
    
    subgraph CDN["Content Delivery"]
        CloudCDN["☁️ CDN\nStatic Assets"]
    end
    
    subgraph Cloud["☁️ Cloud Infrastructure"]
        subgraph DMZ["DMZ / Public Subnet"]
            LB["⚖️ Load Balancer\nNginx / ALB"]
        end
        
        subgraph AppTier["Application Tier / Private Subnet"]
            API1["⚙️ API Server 1"]
            API2["⚙️ API Server 2"]
        end
        
        subgraph DataTier["Data Tier / Private Subnet"]
            PrimaryDB[("🗄️ PostgreSQL\nPrimary")]
            ReplicaDB[("🗄️ PostgreSQL\nReplica")]
            RedisCache[("⚡ Redis\nCache Cluster")]
        end
    end
    
    subgraph External["External Services"]
        Stripe["💳 Stripe\nPayment Processing"]
    end
    
    Users -->|"Download App"| AppStore
    Users -->|"HTTPS"| LB
    Users -->|"Static files"| CloudCDN
    
    LB -->|"Route traffic"| API1
    LB -->|"Route traffic"| API2
    
    API1 -->|"Read/Write"| PrimaryDB
    API2 -->|"Read/Write"| PrimaryDB
    API1 -->|"Read"| ReplicaDB
    API2 -->|"Read"| ReplicaDB
    API1 -->|"Cache"| RedisCache
    API2 -->|"Cache"| RedisCache
    
    PrimaryDB -->|"Replication"| ReplicaDB
    
    API1 -->|"Payment API"| Stripe
    API2 -->|"Payment API"| Stripe
    API1 -->|"Push"| APNS
    API2 -->|"Push"| APNS
```

## Architecture Narrative

Build one online pizza restaurant application named "Sam's Pizza" where people can order the pizza on restaurant itself or take away - no home delivery. So there is only two option in restaurant and take away. It is for iOS app. Let me know if you need more information from my side.

## Components

- **API Server** (service): API Server for lucent
- **Frontend App** (service): Frontend App for lucent
- **Mobile App** (service): Mobile App for lucent

---
*Generated by Blueprint Brain 1.7*
