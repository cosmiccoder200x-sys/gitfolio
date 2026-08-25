# Gitfolio 🚀 — Developer Portfolio & SaaS Platform

> **Build a stunning, high-converting developer portfolio from your GitHub profile in minutes.**

Gitfolio is a modern, developer-first SaaS platform designed for software engineers, open-source maintainers, AI developers, and technical creators. It automatically indexes your GitHub repositories, contributions, and bio, providing a 3-pane visual builder and 6 genuinely distinct layout architectures.

![Gitfolio SaaS Platform](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop)

---

## ✨ Core Features

- 🐙 **1-Click GitHub Synchronization**: Instantly imports your public repositories, star counts, fork metrics, commit activity, primary language distribution, and verified social links.
- 🎨 **6 Distinct Layout Architectures**:
  - **Minimal**: High-contrast, typography-focused layout for quiet luxury reading.
  - **Terminal**: Interactive CLI emulator with command runner (`help`, `projects`, `skills`, `clear`).
  - **Bento Grid**: Contemporary modular grid with stat gauges, star counters, and visual widgets.
  - **Editorial**: Magazine-grade serif headers, expansive project case studies, and narrative timelines.
  - **Gradient**: Fluid ambient mesh backdrop with glowing glassmorphism cards.
  - **Open Source**: GitHub-first 52-week contribution heatmap, commit streak counters, and pinned repos.
- 🛠️ **3-Pane Visual Live Builder**: Real-time section toggling, reordering, custom color palettes, font selectors, and desktop/tablet/mobile viewport previews.
- 📊 **Privacy-Friendly Analytics**: Monitor pageviews, geographical distribution, referrer sources (GitHub, Twitter, LinkedIn, Recruiter portals), and project CTRs without cookies.
- 🌐 **Custom Domains & Automated SSL**: Zero-config DNS record setup (`yourname.dev`) with CNAME/TXT validation and edge routing.
- 🔍 **ATS & SEO Engine**: Semantic HTML5 markup, Open Graph tags, Twitter cards, and structured JSON-LD data.
- 🛡️ **Platform Governance & Admin**: Super-admin MRR analytics, user moderation, and deployment metrics.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, TailwindCSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Development Server**: Node.js & Vite Dev Server

---

## 🚀 Quickstart: Local Host Installation Guide

Follow these simple steps to run Gitfolio locally on your machine.

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher): [Download Node.js](https://nodejs.org/)
- **npm** (v9.0.0 or higher) or **pnpm** / **yarn**
- **Git**: [Download Git](https://git-scm.com/)

---

### Step 1: Clone the Repository

Open your terminal or command prompt and clone the Gitfolio repository:

```bash
git clone https://github.com/cosmiccoder200x-sys/gitfolio.git
cd gitfolio
```

---

### Step 2: Install Dependencies

Install all required project dependencies using `npm`:

```bash
npm install
```

*(Alternatively, if using `pnpm` or `yarn`:)*
```bash
pnpm install
# or
yarn install
```

---

### Step 3: Configure Environment Variables

Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

*(On Windows PowerShell:)*
```powershell
Copy-Item .env.example .env
```

*Note: Gitfolio is fully equipped with offline mock data fallback, so environment keys are optional for local testing.*

---

### Step 4: Run the Development Server

Start the Vite development server:

```bash
npm run dev
```

You should see output similar to this:

```text
  VITE v6.4.3  ready in 1200 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.8:3000/
```

---

### Step 5: Open in Your Browser

Open your browser and visit:

👉 **[http://localhost:3000](http://localhost:3000)**

You can now explore the Landing Page, test the GitHub OAuth & Username onboarding flow, customize templates in the 3-Pane Visual Builder, view analytics, and publish live portfolios!

---

## 📦 Production Build & Deployment

To create an optimized production build:

```bash
npm run build
```

To preview the built production bundle locally:

```bash
npm run preview
```

The output files will be generated in the `dist/` directory, ready for zero-config deployment to Vercel, Netlify, Cloudflare Pages, or AWS Amplify.

---

## 📂 Project Architecture

```text
gitfolio/
├── src/
│   ├── components/         # Reusable UI widgets & tab wrappers
│   ├── data/               # Mock datasets, template definitions, showcase profiles
│   ├── features/
│   │   ├── auth/           # AuthModal & 4-Step Onboarding Pipeline
│   │   ├── dashboard/      # SaaS Sidebar, TopBar, and 8 Dashboard Subviews
│   │   │   └── views/      # Overview, Builder, Projects, Templates, Analytics, Domains, Settings, Admin
│   │   ├── landing/        # Navbar, Hero, Feature Grid, Templates, Community Showcase, Pricing, Footer
│   │   ├── public/         # Standalone Published Portfolio Page (gitfolio.dev/:slug)
│   │   └── templates/      # 6 Portfolio Templates (Minimal, Terminal, Bento, Editorial, Gradient, OpenSource)
│   ├── types/              # SaaS Data interfaces & PortfolioConfig models
│   ├── App.tsx             # Main SaaS Router & State Manager
│   └── main.tsx            # Application Entrypoint
├── public/                 # Static assets & favicon
├── package.json            # Project dependencies & scripts
├── README.md               # Documentation & Local Setup Guide
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.ts          # Vite build configuration
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to enhance templates, add new visual builder capabilities, or optimize performance.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git checkout -b feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p center>
  Built with ❤️ for developers worldwide by <a href="https://github.com/cosmiccoder200x-sys/gitfolio">Gitfolio Maintainers</a>
</p>
