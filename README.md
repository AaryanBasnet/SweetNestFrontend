# 🍰 SweetNest Frontend

**SweetNest Frontend** is the client-side application for the SweetNest custom cake ordering platform. It delivers a rich, interactive user experience for browsing, customizing, and ordering cakes, with smooth animations, modern state management, and scalable architecture.

This repository contains **only the frontend codebase**. The backend lives in a separate repository and communicates via REST APIs.

---

## ✨ Overview

The frontend focuses on:

* A polished customer shopping experience
* Advanced cake customization flows
* High-performance state and server data handling
* Clean UI animations and responsive design

Built with modern React tooling, the app is optimized for maintainability and real-world production use.

---

## 🛠 Tech Stack

* **React 19** (Vite)
* **Zustand** – global client state
* **TanStack React Query** – server state & caching
* **Tailwind CSS** – utility-first styling
* **Framer Motion** – UI animations & transitions
* **Three.js / React Three Fiber** – 3D cake visuals
* **Formik + Yup** – form handling & validation
* **React Router DOM** – routing & layouts

---

## 🚀 Features

### Customer-Facing Features

* User authentication flows (login, register, reset password)
* Browse cakes with search & filters
* Interactive cake customization (size, toppings, colors, message)
* Shopping cart with guest & authenticated user support
* Wishlist management
* Sweet Points loyalty rewards UI
* Promo codes & discounts
* eSewa payment flow integration
* Order tracking & order history
* Reviews & ratings UI
* Push-style notification UI

### UI / UX Highlights

* Responsive, mobile-first layout
* Smooth micro-interactions using Framer Motion
* Modular, reusable component architecture
* Optimistic UI updates with React Query

---

## 📁 Project Structure

```bash
SweetNestFrontend/
├── src/
│   ├── api/            # API service layer
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page-level components
│   ├── routers/        # Route configuration
│   ├── layouts/        # Layout wrappers
│   ├── stores/         # Zustand stores
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Helper utilities
│   ├── styles/         # Global & shared styles
│   └── main.jsx
├── public/
├── package.json
└── vite.config.js
```

---

## ⚙️ Setup & Installation

### Prerequisites

* Node.js **v16+**
* Backend API running (separate repository)

---

### Installation

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The app will be available at:

```
http://localhost:5173
```

---

## 🔌 Environment Variables

Create a `.env` file in the root of the frontend project:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Adjust the URL based on your backend deployment.

---

## 📜 Available Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |
| `npm test`        | Run the test suite       |
| `npm run test:watch` | Re-run tests on change |
| `npm run test:coverage` | Tests with coverage |

---

## 🧪 Testing

**Vitest + React Testing Library**, running in a jsdom environment.

```bash
npm test              # run once
npm run test:watch    # re-run on change
npm run test:coverage # with a coverage report
```

**49 tests** covering:

* `stores/cartStore` – subtotal, shipping, promo discounts, the zero floor
* `stores/authStore` – login/register success and failure, logout, id
  normalisation
* `api/api` – the axios interceptors: token attachment, FormData handling,
  401 sign-out, and the cases that must **not** sign the user out
* `routers/` – `ProtectedRoute` and `AdminRoute` guards

Note the cart tests assert the **client's** view of the total. The server
recomputes every price independently and is the only figure a payment ever
uses - the client number is for display.

Coverage is scoped to the logic layer (stores, api, routers, utils) rather
than every component, so the number reflects what is actually under test.
Component and page tests are the next area to pick up.

---

## 🔄 Continuous Integration

`.github/workflows/ci.yml` runs on every push to `main` and every pull
request:

* **Test** – the Vitest suite with coverage
* **Build** – a production build, and prints the bundle size breakdown to the
  run summary
* **Lint** – on pull requests, lints **only the files the PR changes**
* **Audit** – fails on any high or critical dependency advisory

### Why lint only changed files

The codebase currently carries ~81 pre-existing lint errors across 44 files
(unused variables, plus the React Compiler rules introduced in
`eslint-plugin-react-hooks` v7). Making those a required check today would
mean every pull request starts red - and a check that is always red gets
ignored, which is worse than having no check.

Gating changed files means new and edited code must be clean, so the backlog
shrinks as the app is worked on. Swap it for a plain `npm run lint` once the
count reaches zero.

---

## 🧪 Development Notes

* Server state is handled via **React Query** with caching and invalidation
* Global UI and auth state lives in **Zustand**
* Forms use **Formik + Yup** for consistency
* Animations are isolated to UI components for maintainability

---

## 🔗 Related Repositories

* **SweetNest Backend** – Express, MongoDB, Payments, Auth (separate repo)

---

## 📄 License

This project is **proprietary software**. All rights reserved.
