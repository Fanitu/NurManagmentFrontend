🍽️ Restaurant Management System — Frontend

A production-oriented React + Vite frontend for a full-stack Restaurant Management System built to centralize restaurant order processing, revenue tracking, operating costs, expenses, and daily business operations.

The application provides separate Admin and Worker experiences and communicates with a Node.js/Express backend through REST APIs.

🌐 Live Application

Live Demo:
https://nur-managment-frontend.vercel.app/

Frontend Repository:
https://github.com/Fanitu/NurManagmentFrontend

Backend Repository:
https://github.com/Fanitu/NurManagmentbackend

---

📌 Overview

The Restaurant Management System replaces fragmented manual workflows with a centralized web application for recording orders and monitoring restaurant financial activity.

The frontend is responsible for the user-facing application and role-based workflows, while the backend handles authentication, authorization, business logic, validation, security, and database operations.

Full-stack architecture

┌─────────────────────────────┐
│       React + Vite          │
│          Frontend           │
│                             │
│  Admin UI   │   Worker UI   │
└──────────────┬──────────────┘
               │
               │ REST API
               ▼
┌─────────────────────────────┐
│      Node.js + Express      │
│          Backend            │
│                             │
│ Auth • Validation • Logic   │
│ Security • REST Endpoints   │
└──────────────┬──────────────┘
               │
               │ Mongoose
               ▼
┌─────────────────────────────┐
│           MongoDB           │
└─────────────────────────────┘

---

✨ Features

🔐 Restaurant-Aware Authentication

The login flow requires:

- Restaurant ID
- User name
- Password

The Restaurant ID is normalized to uppercase before authentication.

The frontend stores the authentication token and restores the authenticated session when the application is reopened. It also handles authentication loading and invalid-session cleanup.

Authentication flow

Restaurant ID
      +
User Name
      +
Password
      │
      ▼
Backend Authentication
      │
      ▼
JWT Token
      │
      ▼
Frontend Session
      │
      ▼
Role-based Workspace

---

👑 Admin Workspace

Administrators have a dedicated navigation interface with four main areas:

- Revenue
- Running Costs
- Monthly Expenses
- Order List

The Admin Panel switches between these modules without leaving the main application workspace.

📊 Revenue Dashboard

The revenue interface supports three reporting periods:

- Daily
- Weekly
- Monthly

Daily Revenue

Daily reporting displays:

- Total revenue
- Operating/running costs
- Expandable daily details
- Individual orders
- Order prices
- Order timestamps
- Running costs
- Deleted orders when applicable

The detailed view allows an administrator to inspect the underlying orders and costs instead of seeing only an aggregate number.

Weekly Revenue

Weekly reporting provides:

- Total revenue
- Operating costs
- Total profit
- Expandable weekly details
- Grouped orders
- Grouped operating costs
- Total sales
- Deleted-order records

The weekly profit displayed by the frontend is calculated from revenue minus running costs.

Monthly Revenue

Monthly reporting provides:

- Total revenue
- Operating costs
- Monthly expenses
- Net profit after all displayed expenses
- Expandable monthly details
- Grouped orders
- Grouped operating costs
- Monthly expense records
- Deleted orders and deletion reasons

🧾 Detailed Financial Records

The expanded reporting views allow administrators to drill into the underlying data.

For example, weekly and monthly details group orders by item and show quantities, selling prices, and totals. Operating costs are similarly grouped and totaled.

Deleted orders are displayed separately with information including the order name, type, deletion reason, original date, and amount.

---

💰 Running Cost Management

Administrators have a dedicated running-cost section for working with operational expenses.

The Admin Panel connects this area directly to the running-cost input component.

---

📅 Monthly Expense Management

Monthly expenses have their own administration interface and are also incorporated into the monthly financial reporting view.

Monthly reporting distinguishes active monthly payments from cancelled/deactivated payments and calculates the applicable expense amount for the reporting period.

---

📋 Order List Management

Administrators can access a dedicated order-list management area from the Admin Panel.

---

👷 Worker Workspace

Workers have a separate, simplified workspace focused on daily order operations.

The Worker Panel currently provides:

- Order entry
- Today's orders

The running-cost worker interface exists in the codebase but is currently disabled in the Worker Panel navigation.

Order Entry

Workers use the order-entry workflow to record restaurant orders.

Today's Orders

Workers can access the orders received for the current day through the dedicated today's-orders view.

This separation keeps the worker workflow focused on operational tasks while financial reporting and management functionality remain in the Admin workspace.

---

🧑‍💻 Role-Based Application Design

The application uses a role-based frontend architecture.

                    Login
                      │
                      ▼
              Authentication
                      │
                      ▼
                User / Role
                 ┌────┴────┐
                 │         │
              Admin      Worker
                 │         │
        ┌────────┼──────┐  ├── Order Entry
        │        │      │  └── Today's Orders
      Revenue  Costs  Expenses
        │
     Orders

The application maintains the authenticated user through a React "AuthContext", exposing authentication state, loading state, login, and logout functionality to the rest of the application.

---

🔄 Session Management

The frontend restores the user's session when the application loads.

The authentication context:

1. Checks for the stored authentication token.
2. Calls the backend "getMe()" endpoint when a token exists.
3. Restores the authenticated user.
4. Removes an invalid token when session restoration fails.
5. Exposes loading state while authentication is being restored.
6. Clears the token and user state on logout.

---

🌍 Multilingual User Interface

The application contains user-facing labels in Amharic, particularly throughout the restaurant operational and financial interfaces.

Examples include labels for:

- Revenue
- Operating costs
- Monthly expenses
- Orders
- Profit
- Daily/weekly/monthly reporting

This makes the system suitable for restaurant staff working primarily with an Ethiopian-language interface.

---

🛠️ Technology Stack

Frontend

- React 18
- Vite 5
- JavaScript
- React Context API
- HTML
- CSS

Backend

The frontend communicates with a separate backend built with:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- REST APIs

The frontend's authentication context communicates with the API client for login and session restoration.

---

🏗️ Frontend Architecture

src/
│
├── api/
│   └── API client / backend communication
│
├── components/
│   │
│   ├── admin/
│   │   ├── AdminPanel
│   │   ├── RevenueDisplay
│   │   ├── OrdersListPanel
│   │   └── MonthlyExpenses
│   │
│   ├── worker/
│   │   ├── WorkerPanel
│   │   ├── OrderInput
│   │   ├── TodaysOrders
│   │   └── RunningCostInput
│   │
│   └── shared/
│       └── LoginModal
│
├── context/
│   └── AuthContext
│
├── App.jsx
└── main.jsx

The Admin and Worker panels are intentionally separated into their own component areas, while authentication is centralized through React Context.

---

🔌 API Integration

The frontend uses a dedicated API client to communicate with the backend.

Authentication requests include the restaurant identifier, and the authentication context receives the returned token and user information.

The frontend also calls dedicated reporting endpoints for weekly and monthly financial details.

---

🔒 Security Architecture

Security-sensitive responsibilities are handled by the backend rather than trusted solely to the frontend.

The companion backend includes:

- JWT authentication
- Role-based authorization
- Request validation
- Rate limiting
- MongoDB sanitization
- XSS protection
- HTTP parameter pollution protection
- CORS restrictions
- Request-size limits
- Production error handling

See the backend repository for the complete security implementation:

https://github.com/Fanitu/NurManagmentbackend

---

⚙️ Getting Started

Prerequisites

Make sure you have:

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

5. Build for production

npm run build

6. Preview the production build

npm run preview

---

🚀 Deployment

The frontend is deployed as a web application and is available through Vercel.

Live application:

https://nur-managment-frontend.vercel.app/

The production application communicates with the deployed backend API.

---

💡 Engineering Highlights

This project demonstrates practical full-stack frontend engineering through:

- Role-based UI architecture
- Restaurant-specific authentication
- Persistent JWT sessions
- React Context for global authentication state
- REST API integration
- Financial reporting interfaces
- Daily, weekly, and monthly business reporting
- Expandable financial detail views
- Revenue and cost calculations
- Deleted-order visibility and reason tracking
- Separate Admin and Worker workflows
- Amharic user-facing interface
- Production deployment with Vercel

---

📈 Business Use Case

The system is designed around a real restaurant-management workflow where staff need to record orders while administrators need visibility into financial performance.

Instead of keeping operational and financial information in separate manual records, the application connects order activity with revenue, running costs, monthly expenses, and profit reporting.

This allows administrators to move from individual transaction records to daily, weekly, and monthly financial summaries within the same application.

---

🔗 Related Repository

Restaurant Management System — Backend

Node.js / Express / MongoDB backend:

https://github.com/Fanitu/NurManagmentbackend

---

👨‍💻 Author

Fanuel Bahta

Full-Stack Web Developer

- GitHub: https://github.com/Fanitu
- Portfolio: https://fanu-portofoilio.vercel.app/

---

📄 License

This project is provided for portfolio and demonstration purposes.