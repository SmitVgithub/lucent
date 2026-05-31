# Scalability Roadmap

## Stage: 0-1K MAU

**Users:** 0 - 1,000 MAU
**Estimated Cost:** $5/month

### Architecture Changes
- Deploy pure static HTML/CSS/JS assets to DigitalOcean Spaces with static website hosting enabled — no server-side compute required
- Enable DigitalOcean Spaces CDN (powered by Cloudflare edge) to serve assets from global edge locations, eliminating origin latency for all users
- Configure custom domain with HTTPS via DigitalOcean Spaces CDN SSL certificate at no additional cost
- Set aggressive Cache-Control headers (max-age=31536000 for versioned assets, max-age=3600 for index.html) to maximize CDN cache hit ratio

### New Components
- DigitalOcean Spaces bucket (static asset origin storage + CDN endpoint) — included in $5/mo base plan
- DNS configuration via DigitalOcean Managed DNS or external registrar pointing to Spaces CDN CNAME

### Key Metrics
- **responseTime:** < 100ms TTFB from CDN edge globally
- **throughput:** Up to 1,000 concurrent requests handled by CDN without origin hits
- **availability:** 99.9% uptime via CDN edge redundancy
- **bandwidthUsage:** < 10 GB/month (well within 1TB included in $5 plan)
- **cdnCacheHitRatio:** > 95% cache hit rate for static assets
- **originRequests:** < 5% of total requests reach Spaces origin

## Stage: 1K-50K MAU

**Users:** 1,000 - 50,000 MAU
**Estimated Cost:** $14/month

### Architecture Changes
- Implement asset fingerprinting/content hashing in build pipeline (e.g., main.a1b2c3.css) to enable permanent CDN caching with instant cache-busting on deploy — eliminates stale content issues at scale
- Add DigitalOcean Spaces lifecycle rules and versioning to maintain deploy history and enable instant rollback without re-upload
- Integrate lightweight analytics (Plausible or Fathom — ~$9/mo) to track real user performance metrics (Core Web Vitals, LCP, CLS) and identify geographic latency hotspots
- Optimize static assets: compress images to WebP/AVIF, minify HTML/CSS/JS, enable Brotli compression at CDN layer to reduce bandwidth and improve load times
- Set up uptime monitoring (Better Uptime free tier or UptimeRobot) with alerting on CDN endpoint availability

### New Components
- Privacy-first analytics service (Plausible.io or Fathom) for real user monitoring without GDPR complexity — $9/mo
- CI/CD pipeline (GitHub Actions free tier) for automated build, asset fingerprinting, and deployment to DigitalOcean Spaces on every git push

### Key Metrics
- **responseTime:** < 80ms TTFB from CDN edge, < 1.5s LCP on 4G mobile
- **throughput:** Up to 50,000 concurrent sessions handled entirely at CDN edge
- **availability:** 99.95% uptime with CDN multi-PoP failover
- **bandwidthUsage:** < 100 GB/month (within $5 Spaces plan 1TB cap)
- **cdnCacheHitRatio:** > 99% cache hit rate with fingerprinted assets
- **deployFrequency:** Multiple deploys per day with zero-downtime via atomic Spaces uploads
- **coreWebVitals:** LCP < 2.5s, CLS < 0.1, FID < 100ms

## Stage: 50K-500K MAU

**Users:** 50,000 - 500,000 MAU
**Estimated Cost:** $39/month

### Architecture Changes
- Evaluate multi-CDN strategy: add Cloudflare free/pro tier ($0-$20/mo) in front of DigitalOcean Spaces as secondary CDN layer for additional edge PoPs, DDoS protection, and WAF rules — Cloudflare proxies to Spaces origin
- Implement HTTP/3 and QUIC support via Cloudflare to reduce connection overhead for mobile users on high-latency networks at this traffic volume
- Add DigitalOcean Spaces replication or secondary Spaces bucket in a second region (e.g., NYC + AMS) as origin redundancy — failover via DNS if primary region has issues
- Introduce A/B testing capability via Cloudflare Workers (free tier: 100K requests/day) to test landing page variants without infrastructure changes
- Implement Resource Hints (preload, prefetch, preconnect) and critical CSS inlining to achieve sub-1s LCP at scale across diverse global user base
- Set up structured logging and alerting on CDN bandwidth consumption — at 500K MAU with rich media, bandwidth could approach 500GB-1TB/mo requiring plan review

### New Components
- Cloudflare Pro or Business plan ($20-$200/mo) for advanced WAF, bot management, and additional edge PoPs to handle 500K MAU traffic spikes without origin exposure
- Cloudflare Workers (free-to-$5/mo) for edge-side A/B testing, geo-based redirects, and request manipulation without origin compute
- Secondary DigitalOcean Spaces bucket in second region for origin redundancy (+$5/mo) — total Spaces cost $10/mo

### Key Metrics
- **responseTime:** < 50ms TTFB globally via multi-CDN edge, < 1.2s LCP on 4G mobile
- **throughput:** 500K+ concurrent sessions across CDN edge network with zero origin load
- **availability:** 99.99% uptime with multi-CDN + multi-region origin redundancy
- **bandwidthUsage:** 500GB-1TB/month — monitor against DigitalOcean Spaces 1TB cap, overage at $0.02/GB
- **cdnCacheHitRatio:** > 99.5% cache hit rate — origin receives < 0.5% of requests
- **ddosProtection:** Cloudflare WAF absorbing L3/L4/L7 attacks without origin exposure
- **deployPipeline:** < 2 minute deploy time from git push to global CDN propagation
- **coreWebVitals:** LCP < 1.8s, CLS < 0.05, FID < 50ms — top 10% web performance

## Inflection Points

| Timing | Trigger | Action | Cost Delta |
|--------|---------|--------|------------|
| Approximately 80K-120K MAU depending on page asset weight and session depth | Bandwidth consumption approaches 800GB/month on DigitalOcean Spaces $5 plan (1TB included limit) | Add Cloudflare free tier in front of Spaces as caching proxy to absorb bandwidth before it hits Spaces origin — Cloudflare does not charge for bandwidth, reducing Spaces egress by 95%+ | Cloudflare free tier adds $0/mo but reduces Spaces bandwidth overage risk — saves potential $10-50/mo in overage fees |
| Can occur at any stage if a single viral event drives sudden traffic — plan for this before first major marketing push | Organic traffic spikes (viral content, press coverage, Product Hunt launch) causing CDN origin request surge that exposes Spaces rate limits | Implement Cloudflare as primary CDN with Spaces as pure origin — Cloudflare's global Anycast network absorbs traffic spikes at edge, origin sees only cache-miss traffic. Enable Cloudflare's 'Always Online' mode as fallback | Cloudflare Pro at $20/mo provides enterprise-grade DDoS protection and eliminates origin exposure — +$20/mo insurance against traffic spikes |
| Typically occurs at 10K-50K MAU when business stakeholders request lead capture or A/B testing capabilities | Business requirements demand conversion tracking, form submissions, or dynamic personalization on the landing page | Introduce DigitalOcean App Platform (static site tier free, or $5/mo for custom domains) or Cloudflare Workers for edge functions — keep static HTML as base but add serverless API endpoints for form handling (e.g., Formspree $0-10/mo or custom Worker). This is an architectural pivot from pure static to JAMstack | Serverless form handling via Formspree free tier ($0) or Cloudflare Workers ($5/mo) — minimal cost increase of $0-10/mo to unlock dynamic capabilities |
| Relevant at 100K+ MAU when geographic distribution of users becomes significant and regional performance impacts conversion rates | Geographic performance data shows > 200ms TTFB for users in underserved regions (Southeast Asia, South America, Africa) despite CDN | Evaluate Cloudflare Business/Enterprise or AWS CloudFront with multi-region Spaces origins to add PoPs in underperforming regions. Alternatively, optimize asset sizes aggressively (target < 50KB total page weight) to compensate for higher latency markets | Cloudflare Business at $200/mo provides 250+ PoPs globally — significant cost jump, justified only if geographic markets are revenue-critical. Asset optimization is free and should be attempted first |
