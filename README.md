# 🍽️ FoodHub Server API

Production Base URL:

https://foodhubserver-lac.vercel.app/api/v1

FoodHub Server is a RESTful backend API built with Express.js,
TypeScript, and Prisma ORM. It powers a food marketplace platform
connecting customers and food providers.

------------------------------------------------------------------------

## 🚀 Tech Stack

-   Node.js
-   Express.js
-   TypeScript
-   Prisma ORM
-   PostgreSQL
-   JWT Authentication
-   Vercel (Deployment)

------------------------------------------------------------------------

## 📦 Installation (Local Development)

``` bash
git clone https://github.com/YOUR_USERNAME/foodhub-server.git
cd foodhub-server
npm install
```

Create a `.env` file:

    DATABASE_URL=your_database_url
    JWT_SECRET=your_secret_key

Run migrations:

``` bash
npx prisma migrate dev
```

Start server:

``` bash
npm run dev
```

------------------------------------------------------------------------

# 🔐 Authentication

Authentication is handled using JWT.

Add to request headers:

Authorization: Bearer `<your_access_token>`{=html}

Roles: - ADMIN - PROVIDER - CUSTOMER

------------------------------------------------------------------------

# 📌 API Endpoints

Base URL:

https://foodhubserver-lac.vercel.app/api/v1

------------------------------------------------------------------------

## 👤 Auth Routes

  Method   Endpoint         Description
  -------- ---------------- -------------------
  POST     /auth/register   Register new user
  POST     /auth/login      Login user

------------------------------------------------------------------------

## 👨‍🍳 Provider Routes

  Method   Endpoint        Access     Description
  -------- --------------- ---------- -------------------------------
  POST     /provider       PROVIDER   Create provider profile
  GET      /provider       Public     Get all providers (paginated)
  GET      /provider/:id   Public     Get single provider profile

------------------------------------------------------------------------

## 🍔 Meal Routes

  Method   Endpoint    Access     Description
  -------- ----------- ---------- -----------------
  POST     /meal       PROVIDER   Create meal
  GET      /meal       Public     Get all meals
  GET      /meal/:id   Public     Get single meal
  PATCH    /meal/:id   PROVIDER   Update meal
  DELETE   /meal/:id   PROVIDER   Delete meal

------------------------------------------------------------------------

## 🛒 Order Routes

  Method   Endpoint            Access           Description
  -------- ------------------- ---------------- ---------------------
  POST     /order              CUSTOMER         Create order
  GET      /order              Protected        Get orders
  PATCH    /order/:id/status   PROVIDER/ADMIN   Update order status

------------------------------------------------------------------------

## ⭐ Review Routes

  Method   Endpoint      Access     Description
  -------- ------------- ---------- ---------------
  POST     /review       CUSTOMER   Create review
  PATCH    /review/:id   CUSTOMER   Update review
  DELETE   /review/:id   CUSTOMER   Delete review

------------------------------------------------------------------------

# 📄 Pagination

Example:

GET /provider?page=1&limit=10

Response format:

{ "success": true, "message": "All data fetched successfully", "data": {
"meta": { "total": 100, "page": 1, "limit": 10, "totalPage": 10 },
"data": \[\] } }

------------------------------------------------------------------------

# ❌ Error Format

{ "success": false, "message": "Error message here", "data": null }

------------------------------------------------------------------------

# 🧠 Architecture Overview

src/ ├── modules/ │ ├── auth/ │ ├── user/ │ ├── provider/ │ ├── meal/ │
├── order/ │ └── review/ ├── middlewares/ ├── utils/ ├── lib/ └── app.ts

Pattern: - Route → Controller → Service → Prisma - Centralized error
handling - Role-based middleware

------------------------------------------------------------------------

# 🛡 Security Features

-   JWT Authentication
-   Role-based Authorization
-   Prisma ORM for safe DB queries
-   Error Handling Middleware
-   Protected Routes

------------------------------------------------------------------------

# 🌍 Deployment

Live API:

https://foodhubserver-lac.vercel.app/api/v1

Hosted on Vercel.

------------------------------------------------------------------------

# 📜 License

MIT License
