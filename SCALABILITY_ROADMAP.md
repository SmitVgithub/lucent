# Scalability Roadmap

## Stage: 0-1K MAU - MVP Launch

**Users:** 0 - 1,000 MAU
**Estimated Cost:** $361.07/month

### Architecture Changes
- Deploy Mobile App backend on single AWS EC2 t3.medium instance with auto-restart capability
- Implement WebSocket connections via AWS API Gateway for real-time ride updates with connection pooling
- Configure AWS RDS PostgreSQL db.t3.small with PostGIS extension for geospatial queries (driver locations, ride matching)
- Set up Redis ElastiCache t3.micro for session management and real-time driver location caching with 5-second TTL
- Implement basic horizontal pod autoscaling based on CPU utilization (target 70%)

### New Components
- AWS API Gateway WebSocket API for real-time bidirectional communication between drivers and riders
- AWS SNS for push notifications (ride requests, driver arrival, trip completion)
- AWS S3 for driver document storage (license, vehicle registration, profile photos)
- AWS CloudWatch for basic monitoring and alerting on Mobile App health

### Key Metrics
- **apiResponseTime:** <200ms p95
- **locationUpdateLatency:** <500ms
- **rideMatchingTime:** <3 seconds
- **websocketConnectionSuccess:** >98%
- **availability:** 99.5%
- **concurrentDrivers:** 50-100
- **dailyActiveRides:** 100-500

## Stage: 1K-50K MAU - Growth Phase

**Users:** 1,000 - 50,000 MAU
**Estimated Cost:** $1850/month

### Architecture Changes
- Migrate Mobile App backend to AWS ECS Fargate with 2-6 task auto-scaling across multiple AZs
- Upgrade RDS PostgreSQL to db.r6g.large with read replicas for separating ride history queries from real-time operations
- Implement Redis ElastiCache cluster mode (3 nodes r6g.large) with geospatial indexing for efficient driver proximity searches
- Deploy AWS Location Service for optimized route calculation, ETA estimation, and geofencing for airport/event zones
- Introduce Amazon SQS for decoupling ride request processing and implementing retry logic for failed matches
- Implement database connection pooling with PgBouncer to handle increased concurrent connections from Mobile App

### New Components
- AWS Lambda functions for surge pricing calculation based on real-time supply/demand ratios
- Amazon Kinesis Data Streams for ingesting high-volume driver location updates (every 3 seconds per active driver)
- AWS ElasticSearch for ride history search, driver analytics, and operational dashboards
- Amazon CloudFront CDN for Mobile App static assets and API acceleration
- AWS Secrets Manager for secure API key rotation and database credential management

### Key Metrics
- **apiResponseTime:** <150ms p95
- **locationUpdateLatency:** <300ms
- **rideMatchingTime:** <2 seconds
- **websocketConnectionSuccess:** >99%
- **availability:** 99.9%
- **concurrentDrivers:** 500-2500
- **dailyActiveRides:** 2000-15000
- **locationUpdatesPerSecond:** 500-2500

## Stage: 50K-500K MAU - Scale Phase

**Users:** 50,000 - 500,000 MAU
**Estimated Cost:** $12500/month

### Architecture Changes
- Decompose Mobile App monolith into microservices: Ride Matching Service, Driver Service, Payment Service, Notification Service
- Deploy Amazon Aurora PostgreSQL Serverless v2 with global database for multi-region active-active deployment
- Implement CQRS pattern with separate read/write databases - Aurora for writes, DynamoDB for high-speed reads
- Migrate real-time location tracking to AWS IoT Core for handling 50K+ concurrent driver connections with MQTT protocol
- Deploy Amazon ElastiCache Global Datastore for cross-region driver location synchronization with <50ms replication lag
- Implement cell-based architecture partitioning rides by geographic region to isolate failures and optimize matching
- Deploy AWS Global Accelerator for optimal Mobile App API routing to nearest healthy region

### New Components
- Amazon MSK (Managed Kafka) for event streaming between microservices with guaranteed ordering for ride state machines
- AWS Step Functions for orchestrating complex ride workflows (matching, dispatch, payment, rating)
- Amazon DynamoDB with DAX for sub-millisecond driver availability lookups and ride state management
- AWS App Mesh for service-to-service communication, traffic management, and observability
- Amazon Fraud Detector for real-time detection of fraudulent ride patterns and payment anomalies
- AWS X-Ray and CloudWatch Container Insights for distributed tracing across all Mobile App microservices
- Amazon MemoryDB for Redis-compatible persistent caching of critical ride session data

### Key Metrics
- **apiResponseTime:** <100ms p95
- **locationUpdateLatency:** <150ms
- **rideMatchingTime:** <1.5 seconds
- **websocketConnectionSuccess:** >99.5%
- **availability:** 99.95%
- **concurrentDrivers:** 10000-50000
- **dailyActiveRides:** 50000-300000
- **locationUpdatesPerSecond:** 15000-50000
- **crossRegionFailoverTime:** <30 seconds

## Inflection Points

| Timing | Trigger | Action | Cost Delta |
|--------|---------|--------|------------|
| 10K-15K MAU (approximately month 4-6) | WebSocket connection limits exceeded on API Gateway causing Mobile App real-time updates to fail | Migrate to AWS IoT Core for MQTT-based real-time communication, implement connection multiplexing, and deploy regional WebSocket endpoints | +$400-600/month for IoT Core, offset by reduced API Gateway costs, net increase ~$300/month |
| 20K-30K MAU (approximately month 6-9) | Database CPU consistently above 80% during peak hours causing slow ride matching in Mobile App | Deploy read replicas for ride history queries, migrate real-time driver locations to Redis with geospatial indexing, implement database connection pooling | +$800-1200/month for read replica and upgraded ElastiCache cluster |
| 100K-150K MAU (approximately month 12-15) | Single-region deployment cannot meet latency SLAs for geographically distributed users | Deploy multi-region active-active architecture with Aurora Global Database, implement geographic load balancing via Global Accelerator, deploy regional ride matching services | +$4000-6000/month for secondary region infrastructure (roughly 50-60% increase) |
| 75K-100K MAU (approximately month 10-14) | Monolithic Mobile App backend deployment velocity slowing team productivity | Decompose into microservices (Ride Matching, Driver, Payment, Notification), implement service mesh with App Mesh, deploy event-driven architecture with MSK | +$2500-3500/month for additional compute, Kafka, and service mesh infrastructure |
| 40K-60K MAU (approximately month 8-11) | Location update ingestion causing backpressure and stale driver positions in Mobile App | Deploy Kinesis Data Streams with multiple shards for location ingestion, implement Lambda consumers for processing, use DynamoDB with DAX for sub-millisecond location reads | +$1500-2000/month for Kinesis, Lambda compute, and DynamoDB capacity |
| 30K-50K MAU (approximately month 7-10) | Surge pricing calculations causing ride matching delays during high-demand periods | Pre-compute surge multipliers using Lambda scheduled functions, cache in Redis with 30-second TTL, implement circuit breaker to fall back to cached values | +$200-400/month for additional Lambda invocations and enhanced caching |
