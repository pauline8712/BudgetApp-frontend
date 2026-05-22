# BudgetApp — Frontend

React-frontend för BudgetApp. Byggd med React, Vite och Tailwind CSS v4.

---

## Tekniker

| Teknik | Version |
|---|---|
| React | 19 |
| Vite | 6 |
| Tailwind CSS | v4 |
| React Router | v7 |
| Axios | senaste |

---

## Kom igång lokalt

```bash
npm install
npm run dev
```

Appen startar på: `http://localhost:5173`

> Backend måste köra på `http://localhost:5123` för att API-anrop ska fungera.

---

## Miljövariabler

Skapa en `.env.local` fil i frontend-mappen:

```
VITE_API_URL=http://localhost:5123/api
```

---

## Autentisering — flöde

Appen använder JWT (JSON Web Token) för autentisering mot backend.

### Första gången (ny användare)

```
Öppnar appen → localhost:5173
        ↓
Ingen token i localStorage
        ↓
ProtectedRoute skickar till /login
        ↓
Klickar "Registrera dig" → /register
        ↓
Fyller i email + lösenord → POST /api/auth/register
        ↓
Backend skapar användare → redirect till /login
        ↓
Loggar in → POST /api/auth/login
        ↓
Token sparas i localStorage
        ↓
Redirect till / (Dashboard)
```

### Återkommande användare

```
Öppnar appen → localhost:5173
        ↓
Token finns i localStorage
        ↓
ProtectedRoute släpper igenom → Dashboard visas
        ↓
Varje API-anrop (categories, budgets osv.)
skickar automatiskt token via Axios interceptor:
Authorization: Bearer eyJhbG...
        ↓
Backend verifierar token → 200 OK
```

### Om token saknas eller är utgången

```
Försöker gå till /categories
        ↓
ProtectedRoute: ingen token hittad
        ↓
Redirect till /login
```

---

## Routes

| URL | Sida | Skyddad |
|---|---|---|
| `/login` | Inloggning | Nej |
| `/register` | Registrering | Nej |
| `/reset-password` | Återställ lösenord | Nej |
| `/` | Dashboard | Ja |
| `/categories` | Kategorier | Ja |
| `/add-transaction` | Lägg till transaktion | Ja |
| `/statistics` | Statistik | Ja |

---

## Mappstruktur

```
src/
├── components/
│   ├── Button.jsx
│   ├── CategoryCard.jsx
│   ├── Modal.jsx
│   ├── ProgressBar.jsx
│   ├── ProtectedRoute.jsx
│   └── TransactionItem.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Categories.jsx
│   ├── TransactionForm.jsx
│   ├── Statistics.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── ResetPassword.jsx
├── services/
│   └── api.js
├── App.jsx
└── main.jsx
```
