🍽️ Restaurant Management System — Frontend

A modern React + Vite frontend for a full-stack Restaurant Management System designed to support day-to-day restaurant operations through a centralized web application.

The frontend communicates with a dedicated Node.js + Express + MongoDB backend through REST APIs.

🌐 Live Application

Live Demo:
https://nur-managment-frontend.vercel.app/

Backend Repository:
https://github.com/Fanitu/NurManagmentbackend

Frontend Repository:
https://github.com/Fanitu/NurManagmentFrontend

---

📌 Overview

The Restaurant Management System was built to replace fragmented manual restaurant workflows with a centralized digital system.

The application provides a web-based interface for restaurant staff and administrators to interact with the restaurant's operational data through authenticated backend APIs.

The project is structured as a separate frontend and backend application:

React / Vite Frontend
        │
        │ REST API
        ▼
Node.js / Express Backend
        │
        │ Mongoose
        ▼
MongoDB

This separation keeps the user interface, business logic, authentication, and data layer independently maintainable.

---

✨ Key Capabilities

The frontend is the client application for the Restaurant Management System and communicates with protected backend endpoints for restaurant operations.

📦 Order Management

Provides the user interface for working with restaurant orders through the backend API.

The system is connected to backend functionality for:

- Creating orders
- Viewing orders
- Updating orders
- Deleting orders
- Managing order-related data
- Working with authenticated API requests

📋 Order List Management

The application works with the backend order-list functionality for managing restaurant order/menu-related data.

💰 Cost & Expense Management

The frontend communicates with backend functionality for restaurant financial and operational cost data, including:

- Running costs
- Monthly expenses
- Cost-related records

🔐 Authentication

The frontend works with the backend authentication system to provide protected access to restaurant management functionality.

Authentication and authorization are enforced by the backend API.

📊 Business Management

The application is part of a broader restaurant management platform intended to centralize operational information and reduce reliance on manual business processes.

---

🛠️ Technology Stack

Frontend

- React 18
- React DOM
- Vite 5
- JavaScript
- HTML
- CSS

Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- REST API
- JWT authentication

The frontend's current "package.json" defines React "18.3.1", React DOM "18.3.1", and Vite "5.3.4".

---

🏗️ Project Structure

NurManagmentFrontend/
│
├── src/
│   └── Application source code
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js

The repository currently uses a straightforward Vite/React project structure with the application code contained inside "src".

---

🔄 API Integration

During local development, the Vite development server is configured to proxy "/api" requests toward the backend server.

This allows the frontend to communicate with the local Express API without requiring frontend code to hard-code the backend development URL.

Browser
   │
   │ /api/...
   ▼
Vite Development Server
   │
   │ Proxy
   ▼
Express Backend
   │
   ▼
MongoDB

---

⚙️ Getting Started

Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git

1. Clone the repository

git clone https://github.com/Fanitu/NurManagmentFrontend.git

2. Enter the project

cd NurManagmentFrontend

3. Install dependencies

npm install

4. Start the development server

npm run dev

The Vite development server will provide a local URL that you can open in your browser.

5. Create a production build

npm run build

6. Preview the production build

npm run preview

These commands are defined in the repository's current "package.json".

---

🔐 Security

Security is primarily handled by the backend API.

The corresponding backend implements:

- JWT authentication
- Role-based authorization
- Request validation
- Rate limiting
- MongoDB injection protection
- XSS sanitization
- HTTP parameter pollution protection
- CORS restrictions
- Request-size limits
- Production error handling

For the complete security implementation, see the backend repository:

https://github.com/Fanitu/NurManagmentbackend

---

🚀 Deployment

The frontend is deployed using Vercel.

The repository's GitHub project page currently lists the deployed application:

https://nur-managment-frontend.vercel.app/

The application is built using Vite's production build command:

npm run build

---

🧩 Full-Stack Architecture

This frontend is one part of a complete full-stack application.

┌─────────────────────────────┐
│       React Frontend        │
│          Vite               │
│                             │
│  Restaurant Management UI   │
└──────────────┬──────────────┘
               │
               │ REST API
               ▼
┌─────────────────────────────┐
│      Express Backend        │
│                             │
│ Authentication              │
│ Authorization               │
│ Business Logic              │
│ Validation                  │
│ Security Middleware         │
└──────────────┬──────────────┘
               │
               │ Mongoose
               ▼
┌─────────────────────────────┐
│          MongoDB            │
│                             │
│       Application Data      │
└─────────────────────────────┘

---

💡 Engineering Highlights

This project demonstrates experience with:

- React application development
- Vite-based frontend development
- REST API integration
- Frontend/backend separation
- Development API proxy configuration
- Production deployment with Vercel
- Authentication-aware application architecture
- Full-stack JavaScript development
- Integration with a Node.js/Express backend

---

📈 Production-Oriented Development

This project was developed as part of a real business-management solution rather than only as a tutorial project.

The architecture separates the frontend from the backend API, allowing the application to be developed, deployed, and maintained as independent services.

The backend provides the security and business-logic layer while the React application focuses on the user-facing experience.

---

🔗 Related Project

Restaurant Management System — Backend

Node.js / Express / MongoDB API:

https://github.com/Fanitu/NurManagmentbackend

---

👨‍💻 Author

Fanuel Bahta

Full-Stack Web Developer

- GitHub: https://github.com/Fanitu
- Portfolio: https://fanu-portofoilio.vercel.app/
