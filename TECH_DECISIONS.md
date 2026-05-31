# Technology Decisions

| Category | Chosen | Reasoning | Alternatives |
|----------|--------|-----------|-------------|
| frontend | **Astro 6.4.2** | For a pure static single landing page with a fresh modern design, Astro 6.4.2 is the ideal choice. Astro is purpose-built for content-focused, static sites and ships zero JavaScript by default, resulting in near-perfect Lighthouse scores. Version 6.x introduces improved build performance, enhanced View Transitions API support for smooth animations, and better image optimization pipeline — all critical for a visually impressive modern landing page. Unlike Next.js or Nuxt, Astro does not impose SSR complexity or unnecessary runtime overhead on a purely static page. It supports any UI component library (React, Vue, Svelte) via islands architecture if interactive components are ever needed, and integrates natively with Tailwind CSS 4. The output is pure static HTML/CSS/JS that can be deployed anywhere — Cloudflare Pages, Netlify, Vercel, or a simple CDN — with no server required. | Next.js 16.2.6 (static export), Svelte 5.56.0 + SvelteKit (static adapter), Plain HTML + Tailwind CSS 4.3.0 + Vite |
| styling | **Tailwind CSS 4.3.0** | Tailwind CSS 4.3.0 is the definitive choice for achieving a fresh, modern design on a static landing page. Version 4 is a ground-up rewrite with a new high-performance Rust-based engine (Lightning CSS), native CSS cascade layers, zero-config content detection, and first-class CSS custom properties support. It is significantly faster to build with than writing custom CSS, produces minimal final CSS via its JIT engine, and pairs perfectly with Astro. The utility-first approach enables rapid iteration on visual design without context-switching between files. Version 4 also introduces improved gradient utilities, 3D transform support, and better dark mode handling — all essential for a visually impressive modern landing page. | UnoCSS 0.65.x, CSS Modules + PostCSS |
| hosting-deployment | **Cloudflare Pages** | For a pure static landing page, Cloudflare Pages is the optimal hosting platform. It offers a generous free tier with unlimited bandwidth, automatic global CDN distribution across 300+ edge locations, instant cache invalidation on deploy, built-in DDoS protection, free SSL, and Git-based continuous deployment. Since the output is pure static files, there is no server to manage. Cloudflare Pages integrates natively with Cloudflare's CDN and Workers ecosystem, meaning if edge functions are ever needed (A/B testing, redirects, form handling), they can be added without migrating platforms. Deploy times for a static Astro build are typically under 30 seconds. The free tier is production-grade for a landing page with no practical traffic limits. | Vercel (Hobby/Pro), Netlify |
| cdn | **Cloudflare CDN (bundled with Cloudflare Pages)** | Since the site is hosted on Cloudflare Pages, the Cloudflare CDN is automatically included at no additional cost. Cloudflare operates one of the largest edge networks globally with 300+ PoPs, providing sub-50ms TTFB for most global users. For a static landing page, this means HTML, CSS, JS, and image assets are served from the nearest edge node to each visitor. Cloudflare also provides automatic Brotli compression, HTTP/3 support, image optimization via Polish (paid), and built-in DDoS mitigation. No additional CDN configuration is required — it is zero-config for static assets on Cloudflare Pages. | Vercel Edge Network, AWS CloudFront |
| ci-cd | **GitHub Actions** | GitHub Actions is the ideal CI/CD solution for a static landing page project. It is free for public repositories and includes 2,000 minutes/month on the free tier for private repos — more than sufficient for a static site build pipeline. The Astro build process typically completes in under 2 minutes. GitHub Actions has native integration with Cloudflare Pages via the official Cloudflare Pages GitHub Action, enabling automatic deployments on push to main and preview deployments on pull requests. The workflow is simple: install dependencies, run astro build, deploy to Cloudflare Pages. No complex pipeline orchestration is needed for a static site. | Cloudflare Pages Git Integration (direct), GitLab CI/CD |
| monitoring | **Cloudflare Analytics + Web Vitals (free tier)** | For a pure static landing page, heavyweight monitoring solutions like Datadog or Prometheus are significant overkill. Cloudflare Analytics provides real-time traffic analytics, request counts, bandwidth usage, threat metrics, and Core Web Vitals data at no additional cost when hosted on Cloudflare Pages. This covers the essential observability needs: is the site up, how many visitors, where are they from, and how is performance. For deeper user behavior analytics, Plausible Analytics or Fathom can be added as lightweight, privacy-respecting alternatives to Google Analytics with a single script tag. There is no backend to monitor, no database, no queue — the monitoring surface is minimal by design. | Plausible Analytics 2.x (cloud), Google Analytics 4 |
| design-system | **Figma (design) + custom Tailwind components** | For a fresh modern landing page design, the recommended workflow is to design in Figma and implement using custom Tailwind CSS 4 utility classes rather than adopting a heavy component library. This approach gives full creative freedom without being constrained by the visual opinions of a UI kit. Tailwind 4's new CSS variable system makes it straightforward to define a custom design token system (colors, typography, spacing) that maps directly from Figma variables. For specific interactive components (carousels, modals, accordions), Headless UI or Radix UI primitives can be used to provide accessible behavior without imposing visual styles. This results in a truly unique, modern design rather than a site that looks like every other Tailwind UI or shadcn/ui implementation. | shadcn/ui (Tailwind-based component collection), Motion (Framer Motion) 12.x for animations |
| package-manager-build | **pnpm 9.x** | pnpm is the recommended package manager for this project due to its significantly faster install times compared to npm and yarn, its efficient disk space usage via content-addressable storage, and its strict dependency isolation that prevents phantom dependency bugs. For a static site project, fast installs directly translate to faster CI/CD pipeline execution. pnpm 9.x has excellent Astro compatibility and is the package manager recommended by the Astro documentation. The lockfile format is reliable and the workspace protocol is clean if the project ever expands to a monorepo. | Bun 1.x (runtime + package manager), npm 10.x |

## Switch-To Conditions

### frontend (Astro 6.4.2)
- Switch to Next.js if the project evolves beyond a single landing page into a multi-page site with dynamic routes, user authentication, or API needs
- Switch to SvelteKit if the team has strong Svelte expertise and requires highly interactive animations or game-like UI elements
- Switch to plain HTML + Vite if the page is a one-time delivery with no future maintenance and absolute minimal toolchain is preferred

### styling (Tailwind CSS 4.3.0)
- Switch to UnoCSS if build performance becomes a bottleneck in a very large design system context
- Switch to CSS Modules if the team strongly prefers semantic class names and component-scoped styles over utility classes

### hosting-deployment (Cloudflare Pages)
- Switch to Vercel if the project migrates to Next.js and requires ISR or server-side rendering capabilities
- Switch to AWS S3 + CloudFront if the organization has existing AWS infrastructure and wants consolidated billing
- Switch to Netlify if built-in form handling, identity, or split testing features become requirements without adding third-party services

### cdn (Cloudflare CDN (bundled with Cloudflare Pages))
- Switch to CloudFront if the organization moves hosting to AWS S3 and requires AWS-native tooling
- Switch to a dedicated CDN like Fastly if sub-millisecond cache purge SLAs are contractually required

### ci-cd (GitHub Actions)
- Switch to direct Cloudflare Pages Git integration if the team wants zero CI/CD maintenance and has no need for custom build steps or quality gates
- Switch to GitLab CI/CD if the organization standardizes on GitLab for source control and DevOps tooling

### monitoring (Cloudflare Analytics + Web Vitals (free tier))
- Add Plausible or Fathom if privacy-compliant user behavior tracking and conversion funnel analysis are required
- Add Google Analytics 4 if integration with Google Ads campaigns or Search Console is needed for marketing purposes
- Add Sentry (free tier) if JavaScript errors on the client side need to be tracked and alerted on

### design-system (Figma (design) + custom Tailwind components)
- Adopt shadcn/ui if development speed is prioritized over design uniqueness and the team needs a consistent component library quickly
- Add Motion/Framer Motion if the design requires complex scroll-triggered animations, parallax effects, or page transitions that CSS alone cannot achieve

### package-manager-build (pnpm 9.x)
- Switch to Bun if the team prioritizes absolute fastest local development iteration and all required Astro integrations confirm Bun compatibility
- Switch to npm if deploying to a restricted CI environment where only npm is available or supported

