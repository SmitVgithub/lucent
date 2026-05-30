# System Architecture Document

## Project Overview
**Repository:** SmitVgithub/lucent
**Language:** unknown
**Request:** Build one online pizza restaurant application named "Sam's Pizza" where people can order the pizza on restaurant itself or take away - no home delivery. So there is only two option in restaurant and take away. It is for iOS app. Let me know if you need more information from my side.

## Architecture Diagram

```mermaid
flowchart TD
    subgraph Frontend["Frontend Layer"]
        MobileApp["📱 Mobile App\niOS App"]
        FrontendApp["🌐 Frontend App\nWeb Interface"]
    end
    
    subgraph Backend["Backend Layer"]
        APIServer["⚙️ API Server\nLucent Backend"]
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
    APIServer -->|"Read/Write"| Database
    APIServer -->|"Session/Cache"| Cache
    APIServer -->|"Process payments"| PaymentGateway
    APIServer -->|"Send notifications"| PushNotifications
```

### Request Flow

```mermaid
sequenceDiagram
    participant User as 👤 Customer
    participant App as 📱 Mobile App
    participant API as ⚙️ API Server
    participant DB as 🗄️ Database
    participant Payment as 💳 Payment Gateway
    
    Note over User,Payment: Browse Menu & Add to Cart
    User->>App: Open Sam's Pizza App
    App->>API: GET /menu
    activate API
    API->>DB: Query available pizzas
    DB-->>API: Pizza list
    API-->>App: Menu items
    deactivate API
    App-->>User: Display menu
    
    User->>App: Add pizza to cart
    App->>App: Update local cart
    
    Note over User,Payment: Place Order Flow
    User->>App: Select order type (Dine-in/Take away)
    User->>App: Proceed to checkout
    App->>API: POST /orders
    activate API
    API->>DB: Validate items & pricing
    DB-->>API: Validation result
    API-->>App: Order created (pending payment)
    deactivate API
    
    Note over User,Payment: Payment Processing
    User->>App: Enter payment details
    App->>API: POST /payments
    activate API
    API->>Payment: Process payment
    activate Payment
    Payment-->>API: Payment confirmed
    deactivate Payment
    API->>DB: Update order status
    API-->>App: Payment success
    deactivate API
    App-->>User: Show order confirmation & number
```

### Database Schema

```mermaid
erDiagram
    USER {
        uuid id PK
        string email UK
        string phone
        string name
        string password_hash
        datetime created_at
    }
    
    MENU_ITEM {
        uuid id PK
        string name
        string description
        string category
        decimal price
        string image_url
        boolean is_available
    }
    
    ORDER {
        uuid id PK
        uuid user_id FK
        string order_number UK
        string order_type "dine_in or take_away"
        string status
        decimal subtotal
        decimal tax
        decimal total
        datetime created_at
        datetime estimated_ready_at
    }
    
    ORDER_ITEM {
        uuid id PK
        uuid order_id FK
        uuid menu_item_id FK
        integer quantity
        decimal unit_price
        decimal total_price
        string special_instructions
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
    
    PIZZA_CUSTOMIZATION {
        uuid id PK
        uuid order_item_id FK
        string size
        string crust_type
        json toppings
        decimal extra_charge
    }
    
    USER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    MENU_ITEM ||--o{ ORDER_ITEM : "ordered as"
    ORDER ||--|| PAYMENT : "paid via"
    ORDER_ITEM ||--o| PIZZA_CUSTOMIZATION : "customized with"
```

### Deployment Architecture

```mermaid
flowchart LR
    subgraph Users["End Users"]
        iOS["📱 iOS Users\nSam's Pizza App"]
        Web["🌐 Web Users\nBrowser"]
    end
    
    subgraph CDN["Content Delivery"]
        CloudFront["☁️ CloudFront CDN\nStatic Assets"]
    end
    
    subgraph AWS["AWS Cloud"]
        subgraph PublicSubnet["Public Subnet"]
            ALB["⚖️ Application\nLoad Balancer"]
        end
        
        subgraph PrivateSubnet["Private Subnet"]
            subgraph ECS["ECS Cluster"]
                APIContainer1["🐳 API Server\nContainer 1"]
                APIContainer2["🐳 API Server\nContainer 2"]
                FrontendContainer["🐳 Frontend App\nContainer"]
            end
        end
        
        subgraph DataSubnet["Data Subnet"]
            RDS[("🗄️ RDS PostgreSQL\nPrimary")]
            RDSReplica[("🗄️ RDS PostgreSQL\nRead Replica")]
            ElastiCache[("⚡ ElastiCache\nRedis")]
        end
        
        S3["📦 S3 Bucket\nImages & Assets"]
    end
    
    subgraph External["External Services"]
        Stripe["💳 Stripe\nPayments"]
        APNS["🍎 Apple APNS\nPush Notifications"]
    end
    
    iOS -->|"HTTPS"| ALB
    Web -->|"HTTPS"| CloudFront
    CloudFront -->|"Origin"| ALB
    CloudFront -->|"Static files"| S3
    
    ALB --> APIContainer1
    ALB --> APIContainer2
    ALB --> FrontendContainer
    
    APIContainer1 --> RDS
    APIContainer2 --> RDS
    APIContainer1 --> ElastiCache
    APIContainer2 --> ElastiCache
    RDS --> RDSReplica
    
    APIContainer1 -->|"API calls"| Stripe
    APIContainer2 -->|"API calls"| Stripe
    APIContainer1 -->|"Push"| APNS
    APIContainer2 -->|"Push"| APNS
```

## Architecture Narrative

Build one online pizza restaurant application named "Sam's Pizza" where people can order the pizza on restaurant itself or take away - no home delivery. So there is only two option in restaurant and take away. It is for iOS app. Let me know if you need more information from my side.

## Components

- **API Server** (service): API Server for lucent
- **Frontend App** (service): Frontend App for lucent
- **Mobile App** (service): Mobile App for lucent

---
*Generated by Blueprint Brain 1.7*
