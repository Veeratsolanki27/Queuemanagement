# Rugas Queue Management System (Enterprise Full-Stack)

A modern, production-grade, full-stack **Queue Management System** engineered for the Rugas technical assessment and enterprise interview demonstration.

Built with **Java Spring Boot 3 (Security + JPA + PostgreSQL / H2)**, **React 18 + TypeScript + Material UI (MUI)**, and containerized with **Docker & Docker Compose**.

---

## 🚀 Live Features Implementation Checklist

- [x] **1. Manager Authentication & Roles**: Managers securely register/login with JWT Bearer authentication.
- [x] **2. Queue Creation with Custom Names & Prefixes**: Create named queues with automatic or customized token prefixes (e.g. `VIP-001`, `PH-001`, `REG-001`).
- [x] **3. Token Issuance**: Add customers/persons into queues; generates sequential tokens with customer details & service notes.
- [x] **4. Live Queue Display**: Displays all waiting tokens with position `#1`, `#2`, wait durations, customer details, and visual alerts for next in line.
- [x] **5. Priority Re-ordering (Move UP / DOWN)**: Managers can re-order waiting tokens dynamically with a single click, instantly syncing position priority.
- [x] **6. One-Click Serve / Top Token Assignment**: Directly assign the top-priority waiting token to the active service counter with automated wait-time timestamping.
- [x] **7. Token Cancellation**: Managers can cancel any token with immediate position re-balancing across the remaining queue.
- [x] **8. Comprehensive Analytics Dashboard**: Real-time analytics visualising:
  - Total tokens & live counter metrics
  - Average wait time & service duration calculations
  - Interactive hourly & 7-day wait-time and throughput trend charts (Recharts)
  - Token status distribution donut chart
  - Queue performance breakdown comparison table

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Material UI (MUI v5), Emotion, Recharts, Notistack, Axios |
| **Backend** | Java 17, Spring Boot 3.2.5, Spring Security 6, Spring Data JPA, Hibernate, JJWT |
| **Database** | PostgreSQL (Production Docker) + H2 Database (zero-config local dev fallback) |
| **DevOps & Containers** | Docker, Dockerfile (multi-stage builds), Docker Compose, Nginx reverse proxy |

---

## 🏃 Quick Start Guide

### Option 1: Run with Docker Compose (Recommended for Deployment)

Make sure Docker Desktop is running:

```bash
# Clone the repository
git clone <your-repo-url>
cd Queue_Management

# Launch all 3 services (PostgreSQL, Spring Boot Backend, React Nginx Frontend)
docker compose up --build
```
- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:8080/api/v1`
- **Default Manager Login**: `manager` / `manager123`

---

### Option 2: Run Locally (Without Docker)

#### 1. Backend (Spring Boot)
The backend is configured with an in-memory database profile (`dev`) for zero-friction local execution:
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```
Backend will start on `http://localhost:8080`.

#### 2. Frontend (React + MUI)
```bash
cd frontend
npm install
npm run dev
```
Frontend will start on `http://localhost:5173` (or the indicated Vite port).

---

## 🔑 Default Credentials

- **Username**: `manager`
- **Password**: `manager123`
*(You can also use the **Sign Up** tab to create custom manager accounts on the fly.)*

---

## 📡 REST API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Register new manager |
| `POST` | `/api/v1/auth/login` | Login and obtain JWT token |
| `GET` | `/api/v1/queues` | Get all active queues |
| `POST` | `/api/v1/queues` | Create a new named queue |
| `GET` | `/api/v1/queues/{id}` | Get queue details & metrics |
| `DELETE` | `/api/v1/queues/{id}` | Delete a queue |
| `GET` | `/api/v1/queues/{id}/tokens` | Get all tokens in queue |
| `POST` | `/api/v1/queues/{id}/tokens` | Issue new token for a person |
| `POST` | `/api/v1/queues/{id}/tokens/assign-top` | Assign top token to active service |
| `PATCH` | `/api/v1/queues/{id}/tokens/tokens/{tokenId}/move?direction=UP|DOWN` | Move token priority |
| `PATCH` | `/api/v1/queues/{id}/tokens/tokens/{tokenId}/cancel` | Cancel a token |
| `PATCH` | `/api/v1/queues/{id}/tokens/tokens/{tokenId}/complete` | Mark serving token completed |
| `GET` | `/api/v1/analytics/dashboard` | Analytics metrics, trends, and wait times |

---

## 🎯 Interview Talking Points & Architecture Highlights
1. **Clean Layered Architecture**: Strict separation of concerns (Controllers -> Services -> Repositories -> Entities -> DTOs).
2. **Stateless Security**: Standard BCrypt hashed passwords and stateless Bearer JWT verification filter.
3. **Queue Integrity & Atomic Re-indexing**: Token position manipulation (`UP`/`DOWN`, `CANCEL`, `ASSIGN_TOP`) executes inside `@Transactional` boundaries to guarantee zero duplicate position conflicts.
4. **Resilient Production Packaging**: Frontend uses multi-stage Docker builds with Nginx proxying and routing fallbacks (`try_files $uri /index.html`), preventing SPA 404 reload issues.

