# Archivalia

> Enterprise Academic E-Library & Digital Resource Circulation System

A microservices-based digital library platform built with Spring Boot, Spring Cloud, React, and Docker. Designed for academic institutions to manage book catalogs, circulation (borrow/return), fines, notifications, and resource discovery.

---

## Architecture

| Service | Port | Description |
|---|---|---|
| **Eureka Server** | 8761 | Service registry and discovery |
| **API Gateway** | 8080 | Single entry point, routing, CORS, JWT validation |
| **Auth/User Service** | 8081 | Registration, login, JWT, RBAC *(Phase 2)* |
| **Book Service** | 8082 | Catalog, categories, copy inventory *(Phase 3)* |
| **Borrow Service** | 8083 | Borrow/return circulation *(Phase 4)* |
| **Fine Service** | 8084 | Overdue fines, Razorpay payment *(Phase 5)* |
| **Notification Service** | 8085 | In-app notifications *(Phase 6)* |
| **Recommendation Service** | 8086 | Book recommendations *(Phase 7)* |
| **Discovery Service** | 8087 | External resource search/import *(Phase 8)* |
| **React Frontend** | 5173 | Vite + React SPA *(Phase 9-11)* |

## Tech Stack

- **Backend:** Java 17, Spring Boot 3.2, Spring Cloud 2023.0, JPA/Hibernate, MySQL 8
- **Frontend:** React, Vite, JavaScript (JSX), Vanilla CSS *(future phase)*
- **Infrastructure:** Docker, Docker Compose, Eureka, Spring Cloud Gateway
- **Security:** Spring Security, JWT, BCrypt, RBAC *(future phase)*
- **Payment:** Razorpay Sandbox *(future phase)*

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [JDK 17](https://adoptium.net/) *(for local development)*
- [Maven 3.9+](https://maven.apache.org/) *(for local development)*
- [Node.js 18+](https://nodejs.org/) *(for frontend, future phase)*

## Quick Start

### 1. Clone and configure

```bash
git clone <your-repo-url>
cd Archivalia
cp .env.example .env
# Edit .env with your own values (passwords, secrets)
```

### 2. Run with Docker Compose

```bash
docker-compose up --build
```

### 3. Verify

| What | URL | Expected |
|---|---|---|
| Eureka Dashboard | http://localhost:8761 | Dashboard showing registered services |
| API Gateway Health | http://localhost:8080/actuator/health | `{"status":"UP"}` |
| MySQL | `localhost:3306` | Accepts connections (use any MySQL client) |

### 4. Stop

```bash
docker-compose down
```

To also remove the MySQL data volume:

```bash
docker-compose down -v
```

## Project Structure

```
Archivalia/
├── backend/
│   ├── eureka-server/       # Service registry (Phase 1)
│   ├── api-gateway/         # API Gateway (Phase 1)
│   ├── auth-service/        # Auth & users (Phase 2)
│   ├── book-service/        # Book catalog (Phase 3)
│   ├── borrow-service/      # Circulation (Phase 4)
│   ├── fine-service/        # Fines & payment (Phase 5)
│   ├── notification-service/# Notifications (Phase 6)
│   ├── recommendation-service/ # Recommendations (Phase 7)
│   └── discovery-service/   # External import (Phase 8)
├── frontend/                # React SPA (Phase 9-11)
├── docs/                    # Architecture & API docs
├── docker-compose.yml
├── init-databases.sql
├── .env.example
└── .gitignore
```

## Development

### Running a service locally (without Docker)

```bash
cd backend/eureka-server
mvn spring-boot:run
```

```bash
cd backend/api-gateway
mvn spring-boot:run
```

### Running with Docker (recommended)

```bash
docker-compose up --build
```

## Environment Variables

All secrets are managed via the `.env` file (never committed to Git). See `.env.example` for the full list of required variables.

## License

This project is for educational and portfolio purposes.
