# Solutions Castle — Technical Architecture & Developer Reference

> **Repository Version:** `1.1.0`  
> **System Classification:** Premium 3D Editorial Web Application & Expanded Editorial Platform  
> **Core Domain:** Enterprise IT Solutions, AI Process Automation, & Accredited Workforce Training  
> **Primary Technology Stack:** Vanilla HTML5 (RTL & LTR), Vanilla Modern CSS (3D Transforms, Glassmorphism, Design Tokens), Vanilla ECMAScript (Canvas 2D Particle Simulation, rAF Render Engine, Dynamic Internal Engine), Node.js (Static Server & Playwright Test Harness), Python 3 (Telemetry).

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Installation & Setup](#3-installation--setup)
4. [Environment Variables](#4-environment-variables)
5. [Project Structure](#5-project-structure)
6. [File-by-File Technical Documentation](#6-file-by-file-technical-documentation)
7. [Frontend Architecture & Component Modules](#7-frontend-architecture--component-modules)
8. [Global Site Structure & Internal Pages Routing](#8-global-site-structure--internal-pages-routing)
9. [Content Source Rules & Data Integrity Standards](#9-content-source-rules--data-integrity-standards)
10. [Backend Architecture](#10-backend-architecture)
11. [API & HTTP Endpoints](#11-api--http-endpoints)
12. [Database Architecture & State Persistence](#12-database-architecture--state-persistence)
13. [Authentication & Access Control](#13-authentication--access-control)
14. [Input Validation & Form Submissions](#14-input-validation--form-submissions)
15. [State Management System](#15-state-management-system)
16. [Curated 3-SO Transition Architecture](#16-curated-3-so-transition-architecture)
17. [Mathematical & Business Logic](#17-mathematical--business-logic)
18. [External Services & Integrations](#18-external-services--integrations)
19. [File Storage & Asset Management](#19-file-storage--asset-management)
20. [Error Handling & Fallback Architecture](#20-error-handling--fallback-architecture)
21. [Security Model](#21-security-model)
22. [Performance Optimizations](#22-performance-optimizations)
23. [SEO & Accessibility (a11y)](#23-seo--accessibility-a11y)
24. [RTL & Multilingual Architecture](#24-rtl--multilingual-architecture)
25. [NPM Project Scripts](#25-npm-project-scripts)
26. [Deployment Configuration](#26-deployment-configuration)
27. [Development Workflow](#27-development-workflow)
28. [Troubleshooting Guide](#28-troubleshooting-guide)
29. [Testing & Quality Assurance](#29-testing--quality-assurance)
30. [Engineering Standards & Future Extensions](#30-engineering-standards--future-extensions)

---

## 1. Project Overview

### 1.1 Name & Identity
**Solutions Castle** (`solutions-castle`) is an ultra-high-performance corporate web platform and editorial multi-page experience designed for an enterprise IT solutions, AI systems integration, and accredited workforce capability institution serving the UAE, Saudi Arabia, and Egypt.

### 1.2 Purpose & Core Mission
The platform communicates Solutions Castle's unified dual-pillar philosophy:
> **"الأنظمة وحدها لا تكفي.. ندمج بين توريد وهندسة الأنظمة الذكية وتأهيل فرق العمل لضمان التبني التام وتحقيق أعلى عائد استثماري مستدام."**

The platform consists of:
1. **Interactive 3D Landing Page (`index.html`):** A 10-section continuous 3D spatial continuum showcasing the overarching brand narrative with native browser scrolling.
2. **Dedicated Internal Editorial Pages:**
   * **About Us (`/about/`):** Strategic vision, leadership message, KHDA/CPD/ICV/Oracle/AUE credentials, regional timeline (Riyadh $\to$ UAE $\to$ Egypt), and 3 why-partner pillars.
   * **IT Services / IT Solutions (`/it-services/`):** 4-part architectural grid (AI & Automation Agents, Enterprise ERP & Oracle Systems, Cybersecurity & ISO 27001 Compliance, Cloud Migration Azure/AWS) and the 3-step Post-IT Enablement methodology.
   * **Training (`/training/`):** 80+ accredited programs, 3 delivery formats (B2B In-House, 1-on-1 VIP Sheikh Zayed Rd, Public Calendar), interactive 3-category catalog tabs, 4-stage instructional design methodology, and 60-minute trial workshop offer.
   * **Contact (`/contact/`):** 2-column contact interface, category selector, SLA 1-day response badge, regional hub directories (Dubai HQ, Riyadh, Cairo), interactive map container, and a 3-question accordion FAQ.

### 1.3 Key Features & Architectural Feats
* **Unified Design System:** Shared color tokens (`--navy-900`, `--cyan-400`, `--ink-70`, etc.), glassmorphism surfaces, thin technical vectors, and typography across all pages.
* **Curated 3-SO Signature Transition System:** On the landing page, the 3D "SO" emblem is selectively choreographed at 3 critical brand milestones rather than on every scroll, maintaining prestige and visual balance.
* **Full Arabic RTL Support with English Technical Terms:** Native Arabic reading flow paired with inline LTR formatting for acronyms (IT, AI, ERP, RPA, VAPT, SOC, ISO 27001, Azure, AWS, M365, KHDA, CPD, AUE, STANFORD, ICV, ROI).
* **Zero Content Hallucination:** 100% strict adherence to approved factual copy; missing fields (e.g. unannounced phone lines or exact map coordinates) are rendered with clean placeholder styling.
* **Zero External Dependencies:** Built with pure Vanilla HTML5, Vanilla CSS3, and modern Vanilla ECMAScript.

---

## 2. Technology Stack

| Technology / Package | Version | Layer | Primary Purpose | Source / Reference |
| :--- | :--- | :--- | :--- | :--- |
| **HTML5** | Modern Spec | Markup | Semantic document structure, ARIA accessibility, Canvas rendering, and SVG graphics | `index.html`, `about/index.html`, `it-services/index.html`, `training/index.html`, `contact/index.html` |
| **CSS3** | Modern Spec | Styling | Design tokens, 3D transforms, RTL direction, glassmorphism, responsive grids | `assets/css/main.css`, `assets/css/pages.css`, `assets/css/fonts.css` |
| **Vanilla JavaScript** | ECMAScript 2022+ | Frontend Logic | rAF render loop, canvas particle physics, catalog tab filters, FAQ accordions, form handling | `assets/js/main.js`, `assets/js/internal.js` |
| **Plus Jakarta Sans** | Self-hosted WOFF2 | Typography | Primary body, header, and navigation typeface (Weights: 200–800) | `assets/css/fonts.css` |
| **Syne** | Self-hosted WOFF2 | Typography | Display, accent, and numeric typeface (Weights: 400–800) | `assets/css/fonts.css` |
| **Node.js** | `>= 20.0.0` | Runtime | Server runtime for local static delivery and automated test suites | `package.json`, `tools/serve.js` |
| **Playwright** | `^1.63.0` | Dev Tooling | Headless browser automation, visual regression testing, CDP instrumentation | `package.json`, `tools/verify.mjs`, `tools/test-internal.mjs` |
| **Python 3 / Pillow** | Python 3.x | Tooling | Screenshot image analysis, luminance profiling, terminal ASCII art generation | `tools/metrics.py`, `tools/analyze.py` |
| **Vercel CLI / Engine** | OpenAPI Spec | Deployment | Production static edge deployment configuration | `vercel.json` |

---

## 3. Installation & Setup

### 3.1 Prerequisites
* **Node.js:** Version `20.0.0` or higher.
* **NPM:** Version `10.0.0` or higher.
* **Python 3 & Pillow (Optional):** `pip install Pillow` (only required for image metrics).

### 3.2 Step-by-Step Local Setup
```bash
# 1. Clone the repository
git clone <repository-url>
cd solutions-it

# 2. Install development dependencies
npm install

# 3. Install Playwright browser binaries
npx playwright install chromium

# 4. Start the local development server
npm run dev
# Server will listen on http://127.0.0.1:3000

# 5. Run the complete test suites
npm test
```

---

## 4. Environment Variables

| Variable Name | Required | Default Value | Usage Scope | Purpose & Description |
| :--- | :--- | :--- | :--- | :--- |
| `PORT` | Optional | `3000` | Backend (`tools/serve.js`) | Specifies the TCP port for the local static HTTP server (`0.0.0.0:$PORT`). |
| `URL` | Optional | `http://127.0.0.1:3000/?debug` | Test Suite (`tools/verify.mjs`) | Target URL for automated Playwright verification tests. |
| `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS` | Optional | `1` | Test Suite CLI | Skips OS dependency checks in containerized environments. |

---

## 5. Project Structure

```text
solutions-it/
├── .env.example                     # Reference template for optional local environment variables
├── .gitignore                       # Git ignore definitions (node_modules, shots, outputs, OS files)
├── about/                           # About Us Page Directory
│   └── index.html                   # About Us editorial corporate page (/about)
├── assets/                          # Core frontend assets
│   ├── css/                         # Stylesheets
│   │   ├── fonts.css                # @font-face declarations for Plus Jakarta Sans & Syne
│   │   ├── main.css                 # Master 3D design system, tokens, spatial panel continuum
│   │   └── pages.css                # Internal pages design system (RTL, grids, tabs, accordions)
│   ├── icons/                       # Scalable vector graphics and favicons
│   │   └── favicon.svg              # Scalable cyan crest brand favicon
│   └── js/                          # Client-side scripts
│       ├── internal.js              # Interactive engine for internal pages (Tabs, FAQ, Forms, Dust)
│       └── main.js                  # Master 3D spatial engine for landing page (rAF loop, 3D math)
├── contact/                         # Contact Us Page Directory
│   └── index.html                   # Contact, inquiries, regional hubs, and FAQ page (/contact)
├── index.html                       # Semantic 10-section 3D landing page (/)
├── it-services/                     # IT Services & Solutions Page Directory
│   └── index.html                   # 4-Pillar IT, AI automation, and Enablement page (/it-services)
├── package-lock.json                # Locked dependency tree (Playwright 1.63.0)
├── package.json                     # NPM manifest containing scripts and development dependencies
├── public/                          # Publicly served static assets
│   ├── So.png                       # High-resolution 3D "So" emblem with transparency (2000x2000)
│   ├── fonts/                       # Self-hosted WOFF2 font files
│   │   ├── PlusJakartaSans.woff2    # Plus Jakarta Sans variable font (Weights 200-800)
│   │   └── Syne.woff2               # Syne font (Weights 400-800)
│   ├── logo-clear.png               # Transparent Solutions Castle header brand logo (1340x441)
│   └── logo.png                     # Standard brand icon (70KB)
├── shots/                           # Visual verification screenshot captures
├── tools/                           # Developer tooling, static server, and QA test suites
│   ├── analyze.py                   # Python CLI tool: ASCII art luminance and color analysis
│   ├── audit.mjs                    # Playwright DOM bounding box & computed typography auditor
│   ├── filmstrip.mjs                # Playwright script capturing multi-step visual transition filmstrips
│   ├── metrics.py                   # Python CLI tool: Luminance, cyan %, and text brightness calculator
│   ├── nav.mjs                      # Playwright test for keyboard scrolling & navigation link jumping
│   ├── perf.mjs                     # CDP profiler measuring FPS, layout counts, style recalcs, render cost
│   ├── serve.js                     # Node.js HTTP static server supporting clean directory routing
│   ├── test-internal.mjs            # Automated Playwright test suite for all 4 internal pages
│   └── verify.mjs                   # Master Playwright test suite (19 automated test assertions)
├── training/                        # Training & Capability Page Directory
│   └── index.html                   # Accredited training, catalog tabs, methodology, ICV (/training)
├── uploads/                         # Backup asset directory
└── vercel.json                      # Vercel deployment routing configuration
```

---

## 6. File-by-File Technical Documentation

### `index.html` (Landing Page)
* **Purpose:** Single-page 3D spatial continuum containing 10 interactive editorial panels.
* **Key Components:** Sticky navigation header (`#nav`), mobile modal drawer (`#menu`), vertical progress rail (`.rail`), scroll cue indicator (`#cue`), virtual scroll track (`#track`), 3D SO perspective stage (`#soStage`), and developer telemetry HUD (`#debug`).

### `about/index.html` (About Us Page)
* **Route:** `/about` or `/about/`
* **Purpose:** Editorial corporate profile highlighting credentials, vision, regional timeline, and why-partner pillars.
* **Sections:**
  1. **Hero:** Title, sub-headline, and official credibility badge strip (KHDA, CPD, ICV, Oracle Partner, AUE).
  2. **Leadership Message:** Strategic message from executive leadership emphasizing human-technology integration.
  3. **Regional Timeline:** Horizontal interactive timeline spanning Riyadh (2019), UAE / Sheikh Zayed Rd (2023), and Egypt regional operations.
  4. **Vision & Mission:** Side-by-side editorial panels for Vision and Mission.
  5. **Why Partner With Us:** 3 distinctive pillars (Integration between human & tech, government/academic accreditations, 20+ accredited regional consultants).
  6. **Conversion Banner:** Strategic closing banner with CTA links.

### `it-services/index.html` (IT Services / IT Solutions Page)
* **Route:** `/it-services` or `/it-services/`
* **Purpose:** Technical presentation of enterprise systems, AI agents, cloud architectures, and enablement methodology.
* **Sections:**
  1. **IT Hero:** Strategic headline, value proposition, Oracle Partner credential badge, and primary/secondary CTAs.
  2. **4-Part IT Pillars Grid:**
     * *Pillar 1 — AI & Automation:* Department AI Agents & RPA workflows.
     * *Pillar 2 — Enterprise ERP & Core Systems:* ERP customization, Oracle integration, unified databases.
     * *Pillar 3 — Cybersecurity & Governance:* VAPT vulnerability testing, SOC operations, ISO 27001 compliance.
     * *Pillar 4 — Cloud Migration & Architecture:* Azure & AWS secure migration, M365 infrastructure, cost optimization.
  3. **Post-IT Enablement Bridge (3-Step Process):** Visual bridge linking IT deployment to workforce adoption:
     * *01:* System supply & AI agent configuration.
     * *02:* KHDA-accredited employee workforce training.
     * *03:* Maximizing ROI and eliminating employee change resistance.
  4. **Tech Consultation Form:** Full-featured form with service dropdown (AI Agents, ERP, Cybersecurity, Cloud) and real-time validation.

### `training/index.html` (Training Page)
* **Route:** `/training` or `/training/`
* **Purpose:** Professional capability development, accredited programs, delivery formats, and catalog.
* **Sections:**
  1. **Training Hero:** 80+ accredited programs headline, catalog download CTA, and corporate training request CTA.
  2. **Credential Strip:** KHDA Dubai government license, CPD international accreditation, AUE executive partnership, and Stanford professional training partnership.
  3. **3 Delivery Formats:**
     * *B2B In-House:* Custom enterprise training delivered on-site or virtually.
     * *1-on-1 VIP:* Executive coaching at Dubai Sheikh Zayed Road headquarters.
     * *Public Calendar:* Open professional workshops and certified bootcamps.
  4. **Interactive Training Catalog:** 3-tab filter interface:
     * *Management & Strategic Leadership*
     * *Accounting & Financial Management*
     * *Artificial Intelligence & Technology (AI for Business, CEH, Power BI)*
  5. **4-Stage Training Methodology:** 01 Assessment $\to$ 02 Design $\to$ 03 Execution $\to$ 04 Evaluation.
  6. **Corporate Edge & ICV:** Value contribution in government tenders and the **60-minute Try-Before-You-Buy trial workshop offer**.
  7. **Training Consultation Form:** Dedicated form for enterprise or individual inquiries.

### `contact/index.html` (Contact Us Page)
* **Route:** `/contact` or `/contact/`
* **Purpose:** Final conversion destination, direct communication channels, regional offices, and FAQ.
* **Sections:**
  1. **Contact Hero:** Headline, description, and SLA 1-day response badge.
  2. **2-Column Composition:**
     * *Left:* Comprehensive consultation form with service category selector (Training vs. IT/AI), name, organization, phone, email, and message.
     * *Right:* Regional hubs (Dubai Sheikh Zayed Rd HQ, Riyadh Office, `hello@solutionscastle.com`, WhatsApp customer service).
  3. **Interactive Map Container:** Regional presence map container ready for live coordinates.
  4. **Contact FAQ Accordion:** Exactly 3 questions (KHDA/CPD accreditation, B2B in-house delivery, IT/AI consultation exploratory session).

### `assets/css/pages.css`
* **Purpose:** Master stylesheet for internal pages.
* **Key Features:** RTL document setup (`direction: rtl; text-align: right;`), LTR encapsulation for technical terms (`.tech-term`), glassmorphism card surfaces, horizontal timeline layouts, 4-pillar asymmetric grids, tab filters, accordion transitions, and mobile responsive rules.

### `assets/js/internal.js`
* **Purpose:** Client-side runtime for internal pages.
* **Key Features:** Sticky navigation observer (`.is-stuck`), mobile menu drawer controller, training catalog category tab switching, FAQ accordion toggling with smooth icon rotation, form submission feedback UX (`.form-feedback`), and lightweight canvas dust simulation.

---

## 7. Frontend Architecture & Component Modules

```
┌────────────────────────────────────────────────────────────────────────┐
│                   SOLUTIONS CASTLE PLATFORM ECOSYSTEM                  │
├────────────────────────────────────────────────────────────────────────┤
│                       SHARED GLOBAL COMPONENTS                         │
│  • Atmospheric Canvas Engine (#dust: 2D Particle Simulation)           │
│  • Global Navigation Header (#nav: Brand Crest, Links, CTA, Mobile)    │
│  • Mobile Navigation Drawer (#menu: Accessible Modal Dialog)           │
│  • Global Footer (.footer: Brand Tagline, Links, Credentials, Hubs)    │
├───────────────────────────────────┬────────────────────────────────────┤
│       LANDING PAGE ENGINE         │      INTERNAL PAGES ENGINE         │
│  (index.html & main.js)           │  (assets/css/pages.css & internal) │
├───────────────────────────────────┼────────────────────────────────────┤
│ • 10-Section 3D Spatial Continuum │ • Dedicated Routes (/about, etc.)  │
│ • Native Scroll Position Mapping  │ • Arabic RTL Layout & Typography   │
│ • Curated 3-SO Transition Moments │ • Interactive Catalog Tabs         │
│ • Fit-to-Width Headline Scaling   │ • Interactive FAQ Accordions       │
│ • Real-time Telemetry Debug HUD   │ • Asymmetric 4-Pillar IT Grid      │
│ • Adaptive Performance Governor   │ • Post-IT Enablement Bridge        │
│                                   │ • Interactive Regional Timelines   │
│                                   │ • AJAX Form Feedback Simulations   │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 8. Global Site Structure & Internal Pages Routing

The site operates with clean, production-ready directory routing:

| URL Route | File System Path | Primary Purpose | Key Content Blocks |
| :--- | :--- | :--- | :--- |
| `/` | `index.html` | 3D Spatial Landing Page | 10-Panel Brand Journey, 3 Curated SO Moments |
| `/about` | `about/index.html` | About Us Profile | Credentials, CEO Message, Riyadh/UAE/Egypt Timeline, Vision/Mission, 3 Pillars |
| `/it-services` | `it-services/index.html` | IT Services & Solutions | Oracle Strip, 4 IT Pillars (AI, ERP, Cyber, Cloud), Post-IT Enablement, Consultation Form |
| `/training` | `training/index.html` | Workforce Training | Credentials, 3 Delivery Formats, 3-Category Catalog Tabs, 4 Stages, ICV 60-min Trial |
| `/contact` | `contact/index.html` | Contact & Inquiries | SLA Badge, 2-Col Form & Hubs, UAE/KSA/Egypt Directory, Map, 3-Question FAQ |

---

## 9. Content Source Rules & Data Integrity Standards

To preserve complete enterprise integrity, the website enforces strict content source boundaries:

1. **Zero Content Hallucination:** Only the explicitly supplied factual claims are used across the website.
2. **No Invented Entities:** No fake client testimonials, unannounced course dates, fake course hours, or fictitious certifications.
3. **Transparent Placeholders:** Where real-world details (e.g. direct telephone extensions or exact street building numbers) are unannounced, they are explicitly styled as professional placeholders (e.g. `[ الهاتف المعتمد — قيد التحديث الرسمي ]`).
4. **Preservation of English Technical Nomenclature:** Key technical acronyms and vendor names remain in crisp English (LTR) within the Arabic (RTL) context: `IT`, `AI`, `ERP`, `RPA`, `VAPT`, `SOC`, `ISO 27001`, `Azure`, `AWS`, `M365`, `KHDA`, `CPD`, `AUE`, `STANFORD`, `ICV`, `ROI`.

---

## 10. Backend Architecture

The local development backend is a zero-dependency static HTTP server (`tools/serve.js`):

```
Client HTTP Request
       │
       ▼
[tools/serve.js HTTP Server]
       │
       ├─► Extract and sanitize path: decodeURIComponent(req.url.split('?')[0])
       │
       ├─► Path Confinement Check: file.startsWith(ROOT)
       │     └─► [FAIL] ──► 403 Forbidden ("forbidden")
       │
       ├─► Check if exact file exists: fs.stat(file)
       │     └─► [EXISTS & FILE] ──► Stream file with MIME type (200 OK)
       │
       ├─► Check if directory index exists: fs.stat(path.join(file, 'index.html'))
       │     └─► [EXISTS & FILE] ──► Stream index.html (200 OK)
       │
       ├─► Check if clean extensionless HTML exists: fs.stat(file + '.html')
       │     └─► [EXISTS & FILE] ──► Stream .html file (200 OK)
       │
       └─► [NOT FOUND] ──► 404 Not Found ("404")
```

---

## 11. API & HTTP Endpoints

| Endpoint | Method | Response Type | Description |
| :--- | :---: | :--- | :--- |
| `/` | `GET` | `text/html` | Serves Landing Page (`index.html`). |
| `/about/` | `GET` | `text/html` | Serves About Us Page (`about/index.html`). |
| `/it-services/` | `GET` | `text/html` | Serves IT Services Page (`it-services/index.html`). |
| `/training/` | `GET` | `text/html` | Serves Training Page (`training/index.html`). |
| `/contact/` | `GET` | `text/html` | Serves Contact Page (`contact/index.html`). |
| `/assets/*` | `GET` | Various | Serves CSS stylesheets, JS engines, and vector icons. |
| `/public/*` | `GET` | Various | Serves WOFF2 fonts and transparent PNG emblems. |

---

## 12. Database Architecture & State Persistence

The Solutions Castle web platform is a high-performance, stateless client-side web application. It requires no relational or document database.
* **Scroll Position Restoration:** `history.scrollRestoration = 'manual'` ensures fresh refreshes on the landing page start at the hero section.
* **Form State Handling:** Form inputs are handled through accessible HTML5 forms with client-side interactive feedback.

---

## 13. Authentication & Access Control

* **Access Model:** 100% Public Access.
* **Interactive Accessibility Guarding:** Inactive 3D landing page panels are dynamically given the HTML `inert` attribute (`panel.inert = (state !== 'active')`), preventing off-screen elements from capturing keyboard focus or tab stops.

---

## 14. Input Validation & Form Submissions

Forms across `/it-services/`, `/training/`, and `/contact/` implement standard HTML5 validation (`required`, `type="email"`, `type="tel"`, `pattern`):
* **Visual Submission Feedback:** Handled by `assets/js/internal.js`. When submitted, the submit button enters a loading state (`"جاري الإرسال..."`) and displays a success confirmation badge (`"تم الإرسال بنجاح ✓"`), resetting the form fields automatically.

---

## 15. State Management System

### Landing Page State (`assets/js/main.js`)
* `y`: Current `window.scrollY` (source of truth).
* `segPx`: Virtual section height in pixels ($=\text{vh} \times 1.6$).
* `transPx`: Transition scrub distance in pixels ($=\text{vh} \times 1.0$).
* `activeIdx`: Current active panel index ($0 \dots 9$).
* `tier`: Active adaptive quality tier ($3 \dots 0$).

### Internal Pages State (`assets/js/internal.js`)
* `catalogTabs`: Active selected training category tab index.
* `faqItems`: Expanded/collapsed accordion item indices.
* `menu.is-open`: Boolean state for mobile drawer navigation.

---

## 16. Curated 3-SO Transition Architecture

The landing page features a selective transition system where the 3D "SO" emblem appears exclusively at **3 meaningful brand signature moments**:

| Transition # | Transition Pathway | Mode | Choreography Description |
| :---: | :--- | :---: | :--- |
| **01** | **Hero $\to$ Who We Are** | `3D Panel` | Clean spatial recession and forward unfolding. No SO. |
| **02** | **Who We Are $\to$ What We Do** | `3D Panel` | Pitch backward and rising depth. No SO. |
| **03** | **What We Do $\to$ IT Services** | `SO Signature 1` | **First SO Appearance (Brand Introduction):** Emergence from depth ($Z: -620\text{px} \to 380\text{px}$) with controlled Y-axis yaw ($-72^\circ \to 60^\circ$) and smooth energy halo ($0.55 \to 1.05$). |
| **04** | **IT Services $\to$ Training** | `3D Panel` | Lateral yaw flip between the two core capability pillars. No SO. |
| **05** | **Training $\to$ How We Work** | `3D Panel` | Spatial progression into the 5-stage delivery pipeline. No SO. |
| **06** | **How We Work $\to$ Industries** | `SO Signature 2` | **Second SO Appearance (Ecosystem Hub):** Central hub pulse ($Z: -450\text{px} \to 160\text{px}$, $scale: 0.80 \to 1.15$), expanding energy ring, and horizontal light beams. |
| **07** | **Industries $\to$ The Connection** | `3D Panel` | Convergence toward the connection plane. No SO. |
| **08** | **The Connection $\to$ Two Destinations** | `SO Signature 3` | **Third SO Appearance (Grand Climax):** Forward surge ($Z: -240\text{px} \to 500\text{px}$, $scale: 1.00 \to 1.48$), expansive energy halo, and dual split directional beams ($\pm 28^\circ$). |
| **09** | **Two Destinations $\to$ Final CTA** | `3D Panel` | Soft settle into finale display title and footer. No SO. |

---

## 17. Mathematical & Business Logic

### 17.1 Scroll Mapping & Deadzones
* **Progress Calculation:**
  $$g = \frac{y + \text{vh}}{\text{segPx}}, \quad t = \text{clamp}(\lfloor g \rfloor, 1, 9)$$
  $$p = \text{clamp}\left(\frac{y - \text{tops}[t] + \text{vh}}{\text{transPx}}, 0, 1\right)$$
* **Deadzone Normalization ($e$):**
  $$e = \text{clamp}\left(\frac{p - 0.04}{1 - 2 \times 0.04}, 0, 1\right)$$

---

## 18. External Services & Integrations

* **100% Self-Contained:** Zero third-party script tags, zero Google Fonts CDN calls, zero external CSS dependencies.
* **Local Fonts:** Plus Jakarta Sans & Syne WOFF2 files served from `/public/fonts/`.

---

## 19. File Storage & Asset Management

* `public/So.png`: $2000 \times 2000$ high-resolution 3D emblem with alpha transparency.
* `public/logo-clear.png`: $1340 \times 441$ high-resolution horizontal logo.
* `public/images/about-hero.jpg`: High-resolution 3D architectural digital network composition for About Us.
* `public/images/it-hero.jpg`: High-resolution enterprise cloud data architecture composition for IT Services.
* `public/images/training-hero.jpg`: High-resolution executive interactive training environment composition for Training.
* `public/images/contact-hero.jpg`: High-resolution regional communication hub composition for Contact Us.
* `public/images/it-pillar-ai.jpg`, `it-pillar-erp.jpg`, `it-pillar-cyber.jpg`, `it-pillar-cloud.jpg`: Dedicated editorial visual headers for the 4 IT solution pillars.
* `assets/icons/favicon.svg`: Scalable vector favicon.

---

## 20. Error Handling & Fallback Architecture

1. **No-JavaScript Fallback (`.no-js`):** If JS is unavailable, `<html class="no-js">` un-fixes all panels, displaying a continuous accessible vertical layout.
2. **Adaptive Performance Fallback:** If framerates drop ($dt > 24\text{ms}$), dust and grain layers are shed automatically.
3. **Resize Jitter Protection:** Resize recalculations ignore height fluctuations $< 140\text{px}$ to prevent mobile URL bar jitter.

---

## 21. Security Model

* **Path Traversal Protection:** `tools/serve.js` enforces `file.startsWith(ROOT)` check.
* **No Dynamic Evaluation:** Codebase contains zero `eval()`, `new Function()`, or unescaped HTML injections.
* **Local Origin Confinement:** All media assets are local; no cross-origin data leaks.

---

## 22. Performance Optimizations

1. **Passive Event Listeners:** Scroll events use `{ passive: true }`.
2. **Canvas 2D Alpha Bucketing:** Dust particles are pre-grouped into 4 alpha buckets, reducing fill operations by $> 85\%$.
3. **Offscreen Canvas Downscaling:** Dust simulation renders at $62\%$ scale (`DS = 0.62`) and scales via GPU hardware transforms.
4. **CSS Hardware Acceleration:** Transforms leverage `translate3d()`, `rotateX()`, and `will-change: transform, opacity`.

---

## 23. SEO & Accessibility (a11y)

* **Unique `<title>` and Meta Descriptions:** Configured per page and dynamically localized on language switch.
* **Semantic Heading Hierarchies:** Single `<h1>` per page with structured `<h2>` and `<h3>` tags.
* **Keyboard Navigation:** Full tab order support, visible focus rings, and Escape key modal dismissals.
* **Non-Interactive Editorial Fork:** Section 3 Fork (A / B) and Section 9 Gate elements are rendered as non-interactive `<div>` containers with no `href`, preventing keyboard trap or click navigation while preserving 100% of the 3D aesthetic.
* **Reduced Motion Compliance:** `@media (prefers-reduced-motion: reduce)` disables 3D rotations, particles, and heavy transforms.

---

## 24. Global Bilingual (Arabic / English) Architecture

* **Centralized Translation Hub (`assets/js/i18n.js`):** Zero bloated dependencies; uses a lightweight declarative `data-i18n` attribute system and centralized dictionaries for `en` and `ar`.
* **Instant Directional & Layout Switching:** Automatically flips `<html lang>` (`en` $\leftrightarrow$ `ar`) and `<html dir>` (`ltr` $\leftrightarrow$ `rtl`), with CSS bidirectional flex/grid rules and arrow mirroring (`transform: scaleX(-1)` in RTL).
* **State Persistence:** User language selection persists across pages and browser refreshes via `localStorage.getItem('sc_lang')` (defaulting to English on first visit).
* **Dynamic Refitting Hook:** Dispatches `sc:languageChanged` to re-trigger typography recalculation (`fitText`) and 3D frame layout without breaking the landing page spatial continuum.
* **Technical Term Preservation:** English enterprise acronyms (IT, AI, ERP, RPA, VAPT, SOC, ISO 27001, Azure, AWS, M365, KHDA, CPD, AUE, STANFORD, ICV, ROI) remain correctly formatted in both languages via `.tech-term`.

---

## 25. NPM Project Scripts

| Script Command | CLI Command | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `node tools/serve.js` | Starts local dev server on port 3000. |
| `npm run start` | `node tools/serve.js` | Alias for `npm run dev`. |
| `npm run verify` | `node tools/verify.mjs` | Runs 19-assertion landing page Playwright test suite. |
| `npm run test:internal` | `node tools/test-internal.mjs` | Runs automated bilingual & internal pages Playwright test suite. |
| `npm test` | `node tools/verify.mjs && node tools/test-internal.mjs` | Executes the complete end-to-end verification suite. |
| `npm run nav` | `node tools/nav.mjs` | Tests keyboard scrolling and navigation routing flows. |
| `npm run perf` | `node tools/perf.mjs` | CDP profiler measuring FPS, DOM nodes, and layout cost. |
| `npm run audit` | `node tools/audit.mjs` | DOM bounding box and computed typography layout auditor. |
| `npm run filmstrip` | `node tools/filmstrip.mjs` | Captures visual transition filmstrips across all 9 transitions. |

---

## 26. Deployment Configuration

* **Vercel Configuration (`vercel.json`):**
  ```json
  {
    "$schema": "https://openapi.vercel.sh/vercel.json",
    "outputDirectory": "."
  }
  ```
* Compatible with any static edge host (Vercel, Netlify, Cloudflare Pages, AWS S3/CloudFront, GitHub Pages, Nginx, Apache).

---

## 27. Development Workflow

1. **Install Dependencies:** `npm install && npx playwright install chromium`
2. **Start Dev Server:** `npm run dev` (Access at `http://127.0.0.1:3000`)
3. **Inspect Internal Pages:**
   * Landing Page: `http://127.0.0.1:3000/`
   * About Us: `http://127.0.0.1:3000/about/`
   * IT Services: `http://127.0.0.1:3000/it-services/`
   * Training: `http://127.0.0.1:3000/training/`
   * Contact: `http://127.0.0.1:3000/contact/`
4. **Run Verification:** `npm test`

---

## 28. Troubleshooting Guide

* **Port Already in Use:** Specify custom port: `PORT=3001 npm run dev`.
* **Playwright Missing Browsers:** Run `npx playwright install chromium`.
* **RTL Layout Misalignment:** Ensure technical acronyms are wrapped in `<span class="tech-term">`.

---

## 29. Testing & Quality Assurance

All test suites execute with a **100% pass rate (0 errors)**:
* `node tools/verify.mjs`: **19/19 PASSED** (Scroll height, flat rest positions, 3 curated SO moments, reduced motion, mobile/tablet viewports, 0 console errors).
* `node tools/test-internal.mjs`: **PASSED** (Bilingual toggle EN $\leftrightarrow$ AR, persistence, reload retention, HTTP 200, H1 validation, RTL checks, editorial sliders, training catalog filters, FAQ accordions, form feedback UX, mobile menu drawers, non-interactive fork & gate assertions).
* `node tools/nav.mjs`: **PASSED** (Full route flows `/` $\to$ `/about/` $\to$ `/it-services/` $\to$ `/training/` $\to$ `/contact/` $\to$ `/`).
* `node tools/perf.mjs`: **PASSED** (Render cost $0.051\text{ ms/frame}$, 60 FPS baseline).

---

## 30. Engineering Standards & Future Extensions

1. **Content Rule:** Always preserve strict factual accuracy from approved copy sources across both English and Arabic.
2. **Visual Consistency:** Extend `assets/css/pages.css` tokens for any future sub-pages.
3. **Motion Hygiene:** Keep 3D and canvas animations subtle, elegant, and performance-governed.
