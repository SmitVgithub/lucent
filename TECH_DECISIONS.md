# Technology Decisions

| Category | Chosen | Reasoning | Alternatives |
|----------|--------|-----------|-------------|
| mobile-framework | **React Native** | For a mobile app targeting general users with production-ready scaling requirements, React Native offers the best balance of development speed, code sharing potential, and native performance. Given the project is called 'lucent' and targets general users, cross-platform development will maximize reach while minimizing development effort. The large ecosystem and hiring pool make it sustainable for production. | Flutter, Native (Swift + Kotlin) |
| backend | **Node.js + Fastify** | For a mobile app backend serving general users at production scale, Fastify provides excellent performance for API requests with low latency. The JavaScript/TypeScript ecosystem aligns well with React Native development, enabling potential code sharing for validation logic and types. Fastify's schema-based validation and automatic OpenAPI generation streamline mobile API development. | Node.js + Express, Go + Gin |
| database | **PostgreSQL 16** | For a production-ready mobile app serving general users, PostgreSQL provides the reliability, ACID compliance, and query flexibility needed. JSONB support allows for flexible user data storage while maintaining relational integrity for core entities. The mature ecosystem ensures long-term support and easy scaling with read replicas. | MongoDB, PlanetScale (MySQL) |
| auth | **JWT + Refresh Tokens** | Mobile apps require stateless authentication that works offline and across API calls. JWT with refresh tokens is the standard pattern for mobile, allowing secure token storage in device keychain, offline validation of access tokens, and seamless token refresh. This approach scales well and doesn't require session storage infrastructure. | Auth0, Firebase Auth |
| cache | **Redis 7** | For a production mobile app, Redis provides essential caching for API responses, session management for refresh tokens, and rate limiting to protect against abuse. The pub/sub capability enables real-time features like notifications. Redis is battle-tested and available as managed service on all major clouds. | Memcached, DragonflyDB |
| push-notifications | **Firebase Cloud Messaging (FCM)** | For a mobile app targeting general users, FCM is the de facto standard for push notifications. It handles both iOS (via APNs) and Android natively, provides analytics, and is free at scale. The React Native ecosystem has excellent FCM integration libraries. | OneSignal, AWS SNS + Pinpoint |
| api-gateway | **AWS API Gateway** | For a production mobile app, API Gateway provides essential features like rate limiting, request validation, and authentication integration. It scales automatically and integrates well with other AWS services. The HTTP API variant offers cost-effective pricing for mobile app traffic patterns. | Kong, Cloudflare API Shield |
| file-storage | **AWS S3 + CloudFront** | Mobile apps typically need to store user-generated content like profile images and media. S3 provides durable, scalable object storage while CloudFront ensures fast global delivery. Pre-signed URLs enable secure direct uploads from mobile devices without proxying through the backend. | Cloudflare R2, Firebase Storage |
| observability | **Datadog** | For a production mobile app, comprehensive observability is critical. Datadog provides APM, logs, and metrics in one platform with excellent mobile SDK support for Real User Monitoring (RUM). This gives visibility into both backend performance and mobile app experience, essential for general user-facing apps. | CloudWatch + X-Ray, Sentry + Prometheus + Grafana |
| ci-cd | **GitHub Actions + Fastlane** | For mobile app deployment, GitHub Actions provides flexible CI/CD with good mobile build support, while Fastlane automates iOS and Android build, signing, and store submission. This combination is well-documented for React Native and handles the complexity of mobile app distribution. | Bitrise, Expo EAS |
| queue | **BullMQ (Redis-backed)** | Since Redis is already in the stack for caching, BullMQ provides job queue functionality without additional infrastructure. Mobile apps often need background job processing for tasks like image processing, notification batching, and data sync. BullMQ's Node.js integration is seamless with Fastify. | AWS SQS, RabbitMQ |
| infrastructure | **AWS CDK** | For a production mobile app backend on AWS, CDK provides infrastructure as code using TypeScript, matching the backend language. This enables type-safe infrastructure definitions and easier refactoring. The constructs library accelerates common patterns like API Gateway + Lambda or ECS services. | Terraform, Pulumi |
| containerization | **AWS ECS Fargate** | For a production mobile app backend, ECS Fargate provides serverless container orchestration without managing EC2 instances. This reduces operational overhead while maintaining the flexibility of containers. Auto-scaling handles variable mobile traffic patterns well. | AWS Lambda, Kubernetes (EKS) |
| mobile-analytics | **Mixpanel** | For a general user mobile app, understanding user behavior is critical for product decisions. Mixpanel provides event-based analytics with funnel analysis, retention tracking, and user segmentation. The mobile SDKs are well-maintained and the free tier is generous for early-stage products. | Amplitude, Firebase Analytics |

## Switch-To Conditions

### mobile-framework (React Native)
- If the app requires heavy GPU-intensive animations or custom rendering, switch to Flutter
- If platform-specific features like ARKit/ARCore become core to the product, switch to Native
- If the team already has strong Dart expertise, consider Flutter

### backend (Node.js + Fastify)
- If the app requires ML/AI features server-side, switch to Python + FastAPI
- If concurrent connections exceed 100K and latency becomes critical, switch to Go
- If the team struggles with async patterns, consider Express for simplicity

### database (PostgreSQL 16)
- If the data model is highly document-oriented with deeply nested structures, switch to MongoDB
- If serverless scaling becomes critical and team is small, consider PlanetScale
- If real-time sync to mobile is needed, consider Firebase/Firestore

### auth (JWT + Refresh Tokens)
- If enterprise SSO (SAML/OIDC) is required, switch to Auth0 or similar
- If development speed is critical and budget allows, use Auth0
- If already using Firebase for other features, consolidate with Firebase Auth

### cache (Redis 7)
- If only simple key-value caching is needed and cost is critical, switch to Memcached
- If Redis memory costs become prohibitive at scale, evaluate DragonflyDB
- If using AWS heavily, consider ElastiCache for operational simplicity

### push-notifications (Firebase Cloud Messaging (FCM))
- If advanced marketing automation is needed, switch to OneSignal or Braze
- If already heavily invested in AWS and need multi-channel, use SNS + Pinpoint
- If targeting China market, need additional provider like JPush

### api-gateway (AWS API Gateway)
- If multi-cloud deployment is required, switch to Kong
- If DDoS protection is a primary concern, consider Cloudflare
- If using Kubernetes, consider Kong Ingress or Ambassador

### file-storage (AWS S3 + CloudFront)
- If egress costs become significant, switch to Cloudflare R2
- If using Firebase for other features, consolidate with Firebase Storage
- If multi-cloud is required, use a cloud-agnostic solution

### observability (Datadog)
- If budget is constrained, switch to CloudWatch + Sentry combination
- If only crash reporting is needed initially, start with Sentry alone
- If running on Kubernetes, Prometheus + Grafana may be more cost-effective

### ci-cd (GitHub Actions + Fastlane)
- If using Expo managed workflow, switch to EAS for simpler builds
- If team lacks mobile DevOps expertise, Bitrise reduces complexity
- If build times become critical, consider dedicated mobile CI like Bitrise or CircleCI

### queue (BullMQ (Redis-backed))
- If job durability is critical and Redis persistence isn't sufficient, switch to SQS
- If complex routing patterns emerge, consider RabbitMQ
- If moving to serverless architecture, SQS integrates better with Lambda

### infrastructure (AWS CDK)
- If multi-cloud deployment becomes necessary, switch to Terraform or Pulumi
- If team prefers declarative over imperative IaC, consider Terraform
- If complex testing of infrastructure is needed, Pulumi offers better testing support

### containerization (AWS ECS Fargate)
- If traffic is highly variable with long idle periods, Lambda may be more cost-effective
- If deploying multiple microservices, Kubernetes provides better orchestration
- If multi-cloud or on-premise deployment is needed, switch to Kubernetes

### mobile-analytics (Mixpanel)
- If budget is very constrained, Firebase Analytics provides free basic analytics
- If advanced behavioral analysis is critical, Amplitude may offer better insights
- If already using Firebase heavily, consolidate with Firebase Analytics

