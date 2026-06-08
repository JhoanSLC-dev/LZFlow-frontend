<div align="center">
  <br/>
  <h1>LZFlow</h1>
  <p><strong>Inventory & Sales Management System</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Vue_3-4FC08D?logo=vuedotjs&logoColor=white" alt="Vue 3">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/Pinia-FFD859?logo=pinia&logoColor=black" alt="Pinia">
    <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  </p>
  <br/>
</div>

**LZFlow** is a modern, full-featured single-page application for managing inventory, sales, and business operations. Built with **Vue 3** and **TypeScript**, it provides a responsive dashboard with real-time KPIs, role-based access control, dark/light theme support, and internationalization (English/Spanish).

---

## ✨ Features

- **Dashboard** — KPI cards, revenue charts, sales trends, and top products overview
- **Products** — Full CRUD with paginated listing, search, and form validation
- **Categories** — Organize products into categories
- **Suppliers** — Manage supplier information
- **Sales** — Create, view, and manage sales with line-item support
- **Users** — Role-based user management (owner-only)
- **Authentication** — JWT-based login, register, and token refresh with persistent sessions
- **Dark / Light Theme** — Toggle with localStorage persistence
- **Internationalization** — English and Spanish translations
- **Responsive Layout** — Collapsible sidebar, mobile-friendly navigation

---

## 🛠️ Tech Stack

| Technology             | Purpose                              |
|------------------------|--------------------------------------|
| **Vue 3**             | UI framework (Composition API)       |
| **TypeScript**        | Type-safe development                |
| **Vite 5**            | Build tool & dev server              |
| **Vue Router 4**      | Client-side routing                  |
| **Pinia 2**           | State management                     |
| **Axios**             | HTTP client with JWT interceptors    |
| **Tailwind CSS 3**    | Utility-first styling                |
| **Headless UI**       | Accessible, unstyled UI primitives   |
| **Chart.js + vue-chartjs** | Dashboard charts                 |
| **Zod**               | Schema validation                    |
| **ESLint & Prettier** | Code quality & formatting            |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/lzflow-frontend.git
cd lzflow-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Development

Start the development server (default at `http://localhost:5173`):

```bash
npm run dev
```

The Vite dev server proxies `/api` requests to `http://localhost:3000` — make sure your backend is running.

### Production Build

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 📜 Available Scripts

| Script                 | Description                                   |
|------------------------|-----------------------------------------------|
| `npm run dev`          | Start Vite development server                 |
| `npm run build`        | Type-check and build for production           |
| `npm run preview`      | Preview the production build                  |
| `npm run lint`         | Lint source files with ESLint                 |
| `npm run format`       | Format source files with Prettier             |
| `npm run typecheck`    | Run TypeScript type checking (`vue-tsc`)      |

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/              # DataTable, Modal, Header, Sidebar, etc.
│   └── charts/          # RevenueChart, SalesTrendChart
├── directives/          # Custom Vue directives
├── i18n/                # Internationalization (en/es)
├── layouts/             # AuthLayout, DashboardLayout
├── pages/               # Route pages by feature
│   ├── auth/
│   ├── dashboard/
│   ├── products/
│   ├── categories/
│   ├── suppliers/
│   ├── sales/
│   ├── users/
│   └── settings/
├── router/              # Vue Router configuration
├── services/            # API service layer
├── stores/              # Pinia stores
└── types/               # TypeScript interfaces
```

---

## 🔧 Environment Variables

| Variable          | Description                    | Default                          |
|-------------------|--------------------------------|----------------------------------|
| `VITE_API_URL`    | Backend API base URL           | `http://localhost:3000/api`      |
| `VITE_APP_NAME`   | Application display name       | `Inventory & Sales Management`   |

---

## 🚢 Deployment

The project includes a `vercel.json` for easy deployment to **Vercel**. All routes are rewritten to `index.html` for SPA routing.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

All rights reserved. This project is proprietary and confidential.

---

<div align="center">
  Built with Vue 3, TypeScript, and Tailwind CSS
</div>
