# BudgetApp — Frontend

A **React** application built with Vite and Tailwind CSS. This is the frontend repository for BudgetApp — a fullstack budgeting application where users can manage monthly budgets, spending categories, and transactions.

> This app connects to the BudgetApp .NET backend API. See the [backend repo](#) for setup instructions. The backend must be running before the frontend will work.

---

## Table of Contents

- [Technologies Used](#technologies-used)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup & Running Locally](#setup--running-locally)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Pages & Routing](#pages--routing)
- [Components](#components)
- [Custom Hooks](#custom-hooks)
- [API Communication](#api-communication)
- [Authentication Flow](#authentication-flow)

---

## Technologies Used

| Technology       | Purpose                            |
| ---------------- | ---------------------------------- |
| React 19         | UI library                         |
| Vite             | Build tool and development server  |
| React Router DOM | Client-side routing and navigation |
| Axios            | HTTP client for API communication  |
| Tailwind CSS v4  | Utility-first styling              |

---

## Features

- **Register & Login** with JWT-based authentication
- **Password reset** flow
- **Dashboard** showing budget summary, category balances, and remaining amounts
- **Categories** page for managing spending categories with allocated amounts
- **Transaction form** to log income and expense transactions per category
- **Statistics** page visualising spending data
- **Admin panel** for managing all users (Admin role only)
- **Protected routes** — unauthenticated users are automatically redirected to login
- **Responsive design** built with Tailwind CSS

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- The BudgetApp backend API running locally or deployed

---

## Setup & Running Locally

**1. Clone the repository**

```bash
git clone <frontend-repo-url>
cd group-project-frontend
```

**2. Install dependencies**

```bash
npm install
```

**3. Create environment file**

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5123/api
```

For a deployed backend, replace the URL with your production API URL.

**4. Start the development server**

```bash
npm run dev
```

The app runs at `http://localhost:5173` by default.

**Build for production:**

```bash
npm run build
```

---

## Environment Variables

| Variable       | Description                 | Example                     |
| -------------- | --------------------------- | --------------------------- |
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:5123/api` |

---

## Project Structure

```
src/
├── pages/
│   ├── Login.jsx              ← Login form, calls /api/auth/login
│   ├── Register.jsx           ← Registration form, calls /api/auth/register
│   ├── ResetPassword.jsx      ← Password reset flow
│   ├── Dashboard.jsx          ← Budget overview and summary
│   ├── Categories.jsx         ← Manage categories for a budget
│   ├── TransactionForm.jsx    ← Add income/expense transactions
│   ├── Statistics.jsx         ← Spending charts and statistics
│   └── Admin.jsx              ← User management panel (Admin only)
├── components/
│   ├── NavBar.jsx             ← Top navigation bar
│   ├── ProtectedRoute.jsx     ← Redirects to /login if no token found
│   ├── CategoryCard.jsx       ← Reusable card for displaying a category
│   ├── TransactionItem.jsx    ← Reusable row for a single transaction
│   ├── ProgressBar.jsx        ← Visual spending progress indicator
│   ├── Modal.jsx              ← Generic reusable modal component
│   └── Button.jsx             ← Reusable styled button component
├── hooks/
│   ├── useBudgetSummary.js    ← Fetches budget summary data
│   ├── useCategories.js       ← Fetches categories for a budget
│   └── useTransactions.js     ← Fetches transactions for a category
├── helpers/
│   └── auth.js                ← Token utilities: decodeToken, getUserIdFromToken, isAdmin
├── services/
│   └── api.js                 ← Axios instance with base URL and JWT interceptor
└── App.jsx                    ← Route definitions and layout wrapper
```

---

## Pages & Routing

| Path               | Page             | Protected        |
| ------------------ | ---------------- | ---------------- |
| `/login`           | Login            | No               |
| `/register`        | Register         | No               |
| `/reset-password`  | Reset Password   | No               |
| `/`                | Dashboard        | Yes              |
| `/categories`      | Categories       | Yes              |
| `/add-transaction` | Transaction Form | Yes              |
| `/statistics`      | Statistics       | Yes              |
| `/admin`           | Admin Panel      | Yes (Admin role) |

Routes marked as protected are wrapped in `ProtectedRoute`. If no JWT token exists in `localStorage`, the user is immediately redirected to `/login`. The `NavBar` is hidden on public routes (login, register, reset password).

---

## Components

**`ProtectedRoute.jsx`**
Checks for a token in `localStorage`. If no token is found, it redirects to `/login` using React Router's `<Navigate>`. Otherwise it renders the child component.

**`NavBar.jsx`**
Top navigation bar shown on all protected pages. Displays navigation links and the logged-in user's email. The Admin link is only visible to users with the Admin role, checked via `isAdmin()` from `helpers/auth.js`.

**`CategoryCard.jsx`**
Reusable card component for displaying a single category with its name, allocated amount, current balance, and a `ProgressBar` indicating spending.

**`TransactionItem.jsx`**
Reusable row component for displaying a single transaction with its description, amount, type (Income/Expense), and date.

**`ProgressBar.jsx`**
Visual progress indicator that fills based on the ratio of amount spent to amount allocated. Changes colour as the budget fills up.

**`Modal.jsx`**
Generic reusable modal component used across pages for forms and confirmations.

**`Button.jsx`**
Reusable button component with consistent styling applied across the app.

---

## Custom Hooks

Custom hooks separate data-fetching logic from page components, keeping pages clean and making the fetching logic reusable.

**`useBudgetSummary(budgetId)`**
Fetches the full budget summary from `/api/budgets/summary/{budgetId}`. Returns `{ summary, loading, error }`.

**`useCategories(budgetId)`**
Fetches all categories for a given budget from `/api/categories/{budgetId}`. Returns `{ categories, loading, error }`.

**`useTransactions(categoryId)`**
Fetches all transactions for a given category from `/api/transactions/{categoryId}`. Returns `{ transactions, loading, error }`.

All hooks use `useEffect` to fetch on mount and `useState` to manage loading and error states.

---

## API Communication

All HTTP calls go through a single Axios instance defined in `services/api.js`:

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5123/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

The **request interceptor** automatically attaches the JWT token to every outgoing request. No component or hook ever has to set the `Authorization` header manually — it is handled centrally here.

---

## Authentication Flow

1. User submits the login form — a `POST /api/auth/login` request is sent with email and password.
2. The API responds with a JWT token, the user's email, and their role.
3. The token and email are stored in `localStorage`.
4. The user's first budget ID is immediately fetched and also stored in `localStorage` for use across pages.
5. The user is navigated to the Dashboard.
6. Every subsequent API request automatically includes the token via the Axios interceptor.
7. On logout, `localStorage` is cleared and the user is redirected to `/login`.

**Token utilities in `helpers/auth.js`:**

| Function               | Description                                                    |
| ---------------------- | -------------------------------------------------------------- |
| `decodeToken(token)`   | Decodes the base64 JWT payload and returns it as an object     |
| `getUserIdFromToken()` | Reads the user's ID from the decoded token in `localStorage`   |
| `isAdmin()`            | Returns `true` if the role claim in the token equals `"Admin"` |
