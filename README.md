# 📘 Investment Client Hub Documentation

## 🧾 Overview

The **Investment Client Hub** is a web application designed for investment offices to manage clients and visualize financial assets. It features a containerized architecture using Docker for easy and consistent setup across environments.

## ✅ Features

### 👥 Client Management

* Register new clients (Name, Email, Status: Active/Inactive).
* List all registered clients.
* Edit existing client details.

### 💼 Financial Asset Management

* Display a predefined list of financial assets (e.g., "Ação XYZ", "Fundo ABC") from the database.
* Add new assets via API.
* *(Planned)* View asset allocations per client.

### 🧠 TypeScript First

* Entire stack built with TypeScript for type safety and improved developer experience.

---

## 🛠️ Tech Stack

### 🔙 Backend

* **Framework:** Fastify
* **ORM:** Prisma
* **Database:** MySQL
* **Validation:** Zod
* **Dev Tools:** ts-node, ts-node-dev

### 🔜 Frontend

* **Framework:** Next.js
* **UI Library:** ShadCN (Radix UI + Tailwind CSS)
* **State/Data:** React Query
* **Forms:** React Hook Form + Zod
* **HTTP Client:** Axios

### 📦 Infrastructure

* **Containerization:** Docker + Docker Compose
* **DB Image:** `mysql:8.4`

---

## ⚙️ Prerequisites

Before you begin, ensure you have:

* [Docker Desktop](https://www.docker.com/products/docker-desktop)
* [Node.js (LTS)](https://nodejs.org/en/download/)
* npm (bundled with Node.js)

---

## 🚀 Getting Started

### 1. 🔽 Clone Repositories

```bash
# In your project root
cd your-project-root

# Clone backend
git clone <your-backend-repo-url> backend

# Clone frontend
git clone <your-frontend-repo-url> frontend
```

Expected Structure:

```
your-project-root/
├── backend/
├── frontend/
└── docker-compose.yml
```

### 2. 🔐 Set Environment Variables

Create a `.env` file inside `backend/`:

```env
# backend/.env
DATABASE_URL="mysql://root:123@db:3306/investment_db"
# Replace '123' with your password
```

### 3. 🐳 Run with Docker Compose

In the root directory:

```bash
docker compose down -v && docker compose up --build
```

This will:

* Rebuild images
* Start MySQL
* Apply Prisma migrations
* Seed the database with initial asset data
* Start backend and frontend

Watch logs for:

```
Start seeding...
Created/Updated asset with id: X
Seeding finished.
Server listening at http://0.0.0.0:3001
```

### 4. 🌐 Access the App

* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Backend API:** [http://localhost:3001](http://localhost:3001)
* **Client Management UI:** [http://localhost:3000/clients](http://localhost:3000/clients)

---

## 🔁 Backend API Reference

### Base URL: `http://localhost:3001`

### 📊 Assets

#### `GET /assets`

Returns all stored financial assets.

```json
[
  { "id": 1, "name": "Ação XYZ", "value": "123.45" },
  { "id": 2, "name": "Fundo ABC", "value": "50.00" },
  ...
]
```

#### `POST /assets`

Creates a new asset.

```json
{
  "name": "Novo Ativo Exemplo",
  "value": "499.99"
}
```

Zod Validation:

* `name`: required string
* `value`: string matching monetary format

Successful Response:

```json
{
  "id": 6,
  "name": "Novo Ativo Exemplo",
  "value": "499.99",
  "createdAt": "2025-06-06T12:00:00.000Z",
  "updatedAt": "2025-06-06T12:00:00.000Z"
}
```

---

### 👥 Clients

#### `GET /clients`

Fetch all clients.

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "status": "active",
    "createdAt": "2025-06-06T12:00:00.000Z",
    "updatedAt": "2025-06-06T12:00:00.000Z"
  }
]
```

#### `POST /clients`

Create a new client.

```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "status": "active"
}
```

#### `PATCH /clients/:id`

Update client details.

```json
{
  "name": "Jane E. Smith",
  "status": "inactive"
}
```

#### `DELETE /clients/:id`

Delete a client. Responds with `204 No Content`.

---

## 🧬 Prisma Schema

```prisma
// backend/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Client {
  id        Int       @id @default(autoincrement())
  name      String
  email     String    @unique
  status    String    @default("active")
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  assets    ClientAsset[]
}

model Asset {
  id        Int       @id @default(autoincrement())
  name      String    @unique
  value     Decimal   @db.Decimal(10, 2)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  clients   ClientAsset[]
}

model ClientAsset {
  id        Int      @id @default(autoincrement())
  clientId  Int
  assetId   Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  client    Client   @relation(fields: [clientId], references: [id])
  asset     Asset    @relation(fields: [assetId], references: [id])

  @@unique([clientId, assetId])
}
```

---

## 📜 License

This project is for educational and internal use. Customize licensing as needed.
