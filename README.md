<div align="center">

# ⚡ PowerOutage Tracker

### A production-ready, full-stack power outage management system with real-time interactive maps, role-based access control, and a live reporting dashboard.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://mysql.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-FB015B?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>

---

## Overview

**PowerOutage Tracker** is a full-stack web application designed for municipalities, utility companies, or communities to efficiently track and manage power outage incidents. Users can report outages via an interactive map interface, and administrators get a comprehensive dashboard to manage reports, update statuses, and visualize all incidents geographically in real time.

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Map System](#-map-system)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Security](#-security)
- [Default Admin](#-default-admin-credentials)
- [Testing](#-testing)

---

## ✨ Features

### User Features
- Secure registration and login with JWT authentication
- Submit power outage reports with precise location selection via interactive map
- View personal report history and live status updates
- Dashboard with real-time outage statistics and map visualization

### Admin Features
- Full-system analytics dashboard
- View, filter, and manage all reported outages across all users
- Update report status: `pending` → `in_progress` → `resolved`
- Manage users: view profiles, change roles, delete accounts
- Role-based access control (admin / user)
- Global map view with color-coded markers for all active incidents

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript, Bootstrap 5 |
| **Maps** | Leaflet.js + OpenStreetMap |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL 8 |
| **Authentication** | JWT (Access + Refresh Tokens) |
| **Security** | bcrypt password hashing |
| **Testing** | Jest, Supertest |

---

## 🗺 Map System

The application uses **Leaflet.js** with **OpenStreetMap** tiles to provide an interactive, zero-cost mapping experience.

**How it works:**

- **Reporting:** When a user opens the report form, a Leaflet map is rendered. Clicking anywhere on the map captures the latitude and longitude of that point and populates the form fields automatically.
- **Visualization:** On load, the dashboard fetches all reports from the database and places a marker at each stored `lat/lng` coordinate.
- **Admin Global View:** Administrators see every report from all users plotted on a single unified map, enabling geographic pattern recognition and response prioritization.

**Marker color coding:**

| Color | Status |
|---|---|
| 🟠 Orange | `pending` — report submitted, awaiting action |
| 🔵 Blue | `in_progress` — team dispatched or investigating |
| 🟢 Green | `resolved` — outage has been restored |

> Markers that share the same location are rendered with a slight randomized offset to prevent stacking and ensure all incidents remain individually clickable.

---

## 📁 Project Structure

```
poweroutage-tracker/
│
├── config/                  # Database connection and environment config
├── controllers/             # Route handler logic (auth, reports, admin)
├── services/                # Business logic layer
├── models/                  # Database query functions
├── routes/                  # Express route definitions
├── middleware/              # JWT verification, role guards, error handling
├── public/                  # Static frontend files (HTML, CSS, JS, assets)
│   ├── index.html
│   ├── dashboard.html
│   ├── admin.html
│   └── js/
├── tests/                   # Jest + Supertest test suites
│   ├── auth.test.js
│   ├── reports.test.js
│   └── admin.test.js
└── server.js                # Application entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/poweroutage-tracker.git
cd poweroutage-tracker
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=poweroutage_db

JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

PORT=3000
```

**4. Set up the database**

```bash
mysql -u root -p < config/schema.sql
```

**5. Start the server**

```bash
# Development
npm run dev

# Production
npm start
```

The application will be available at `http://localhost:3000`.

---

## 📡 API Reference

All endpoints are prefixed with `/api`. Protected routes require a valid `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Create a new user account |
| `POST` | `/api/auth/login` | Public | Login and receive access + refresh tokens |
| `POST` | `/api/auth/refresh-token` | Public | Exchange a refresh token for a new access token |
| `POST` | `/api/auth/logout` | Authenticated | Invalidate refresh token |

### Reports

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/reports` | Authenticated | Submit a new outage report |
| `GET` | `/api/reports/my-reports` | Authenticated | Retrieve the current user's report history |
| `GET` | `/api/reports/dashboard-stats` | Authenticated | Get live statistics for the user dashboard |
| `GET` | `/api/reports/all` | Admin | Retrieve all reports from all users |
| `PUT` | `/api/reports/:id/status` | Admin | Update the status of a specific report |

### Admin

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/dashboard` | Admin | Full system analytics and summary |
| `GET` | `/api/admin/users` | Admin | List all registered users |
| `PUT` | `/api/admin/users/:id/role` | Admin | Promote or demote a user's role |
| `DELETE` | `/api/admin/users/:id` | Admin | Remove a user account from the system |

---

## 🔒 Security

Security is a first-class concern throughout the application:

- **JWT dual-token strategy** — Short-lived access tokens (15 min) paired with long-lived refresh tokens (7 days) minimize exposure from token theft.
- **bcrypt password hashing** — All passwords are salted and hashed before storage; plaintext passwords are never persisted.
- **Role-based access control** — Middleware enforces that admin-only routes are inaccessible to standard users, regardless of token validity.
- **Input validation** — All incoming request bodies are validated and sanitized before reaching the database layer.
- **Protected route architecture** — Authentication middleware is applied at the router level, not individually per handler, reducing the risk of accidentally exposed endpoints.

---

## 🔑 Default Admin Credentials

An initial admin account is seeded automatically when the database is initialized.

| Field | Value |
|---|---|
| Email | `admin@poweroutage.com` |
| Password | `admin123` |

> ⚠️ **Important:** Change the default admin password immediately before deploying to any production or publicly accessible environment.

---

## 🧪 Testing

The test suite covers authentication flows, report lifecycle, and admin operations using **Jest** and **Supertest**.

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Built with Node.js · Leaflet.js · MySQL · JWT

</div>
