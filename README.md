# Personal Finance Dashboard

A full-stack personal finance management application built for HackUTD 2025. This application provides users with comprehensive financial tracking, AI-powered assistance, and intelligent insights into their spending patterns.

## 🌟 Features

- **Financial Dashboard**: Real-time overview of income, expenses, and net worth
- **Transaction Management**: Monthly transaction grouping and analysis
- **AI Assistant**: Intelligent chatbot for financial advice and insights
- **Cards Management**: Credit card and account management interface
- **Subscription Tracking**: Monitor and manage recurring subscriptions
- **Authentication**: Secure login with Auth0 integration
- **Email Verification**: User registration validation system
- **Responsive Design**: Modern, mobile-friendly interface

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI framework
- **Auth0** - Authentication and authorization
- **CSS3** - Custom styling and animations

### Backend
- **Node.js** - Runtime environment
- **MongoDB** - NoSQL database with Mongoose ODM

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Auth0 account for authentication
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/koolname99/hackUTD2025.git
cd hackUTD2025-1
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Configure Auth0 by creating environment variables or updating the Auth0 configuration in your React app.

### 4. Start the Application

**Backend (Terminal 1):**
```bash
cd backend
node server.js
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173` (Vite default)
- Backend API: `http://localhost:5000`

## 💻

## 📱 Application Structure

```
hackUTD2025/
├── backend/
│   ├── models/
│   │   └── Account.js          # MongoDB schema for user accounts
│   ├── server.js               # Express server and API routes
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIAssistant/    # AI chatbot interface
│   │   │   ├── Cards/          # Credit cards management
│   │   │   ├── Dashboard/      # Main financial dashboard
│   │   │   ├── Landing/        # Landing page
│   │   │   ├── Layout/         # App layout components
│   │   │   ├── Login/          # Authentication components
│   │   │   └── Subscriptions/  # Subscription tracking
│   │   ├── api.js              # API service functions
│   │   ├── App.jsx             # Main application component
│   │   └── main.jsx            # Application entry point
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Transactions
- `GET /api/transactions` - Retrieve transactions grouped by month
- Query parameter: `email` (user email for filtering)

### Authentication
- `GET /api/auth/check-email` - Verify if user email exists in system
- Query parameter: `email`

### Categories & Budgets
- `GET /api/category-budgets` - Get user's category budgets
- `POST /api/category-budgets` - Save category budget settings

### AI Assistant
- `POST /api/ai/chat` - Send message to AI assistant for financial advice

## 🏗️ Architecture

### System Overview
The Personal Finance Dashboard follows a modern full-stack architecture with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ - Components    │    │ - REST API      │    │ - User Data     │
│ - Auth0 Client  │    │ - Auth Routes   │    │ - Transactions  │
│ - State Mgmt    │    │ - Data Models   │    │ - Categories    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       ▲
        │                       │                       │
        ▼                       ▼                       │
┌─────────────────┐    ┌─────────────────┐              │
│   Auth0         │    │   AI Service    │              │
│   Identity      │    │   (External)    │              │
│   Provider      │◄───│   Financial AI  │──────────────┘
└─────────────────┘    └─────────────────┘
```

### Frontend Architecture
- **Component-Based Design**: Modular React components for each feature
- **Layout System**: Centralized layout management with `DashboardLayout`
- **Authentication Flow**: Auth0 integration with protected routes
- **API Layer**: Centralized API service (`api.js`) for backend communication
- **State Management**: React hooks and local state management
- **Responsive Design**: CSS-based responsive layouts

### Backend Architecture
- **RESTful API**: Express.js server with organized route handlers
- **Data Layer**: Mongoose ODM for MongoDB interactions
- **Authentication**: Auth0 token validation and user verification
- **Error Handling**: Centralized error handling and logging

### Data Flow
1. **User Authentication**: Auth0 handles login/logout and token management
2. **API Requests**: Frontend makes authenticated requests to backend
3. **Data Processing**: Backend processes requests and interacts with MongoDB
4. **Response Handling**: Structured JSON responses with error handling
5. **State Updates**: Frontend updates UI based on API responses

### Security Architecture
- **Authentication**: Auth0 JWT tokens for secure user identification
- **Authorization**: Backend validates tokens and user permissions
- **Email Verification**: Additional security layer for user registration
- **Environment Variables**: Sensitive data protected via environment configuration

### Database Schema
```
Account Collection:
├── _id (ObjectId)
├── email (String, unique)
├── transactions (Array)
│   ├── amount (Number)
│   ├── category (String)
│   ├── date (Date)
│   └── description (String)
├── categoryBudgets (Object)
├── createdAt (Date)
└── updatedAt (Date)
```

### Component Architecture
```
App.jsx
├── Landing Component (Unauthenticated)
└── DashboardLayout (Authenticated)
    ├── Dashboard
    │   ├── FinancialDashboard
    │   └── TransactionsByMonth
    ├── Cards Management
    ├── Subscriptions Tracking
    └── AIAssistant
```

## 🎯 Key Components

### Dashboard
- **FinancialDashboard**: Main overview with charts and summaries
- **TransactionsByMonth**: Monthly transaction breakdown
- Real-time calculation of income, expenses, and net worth

### AI Assistant
- Intelligent chatbot for financial advice
- Real-time messaging interface
- Integration with financial data for contextual responses

### Authentication Flow
1. User lands on the application
2. Auth0 handles authentication
3. System verifies email registration
4. Access granted to authenticated, registered users

## 🔒 Security Features

- Auth0 integration for secure authentication
- Email verification system
- Environment variable protection for sensitive data

## 🎨 UI/UX Features

- Modern, clean interface design
- Responsive layout for mobile and desktop
- Loading states and error handling
- Smooth animations and transitions
- Intuitive navigation between features

## 🤖 AI Integration

The application includes an AI assistant that can:
- Analyze spending patterns
- Provide financial advice
- Answer questions about financial data
- Offer personalized recommendations

## 📊 Data Visualization

Using Recharts library for:
- Monthly spending trends
- Category-wise expense breakdown
- Income vs. expense comparisons
- Financial goal tracking

## 📝 Future Improvements

- **Credit Score Monitoring**: Integration with credit score APIs.
- **Multi-Currency Support**: For international users or foreign transactions.
- **Expense Anomaly Detection**: Flag unusualy spending patterns and deavtivate credit card if necessary. 

## 👥 Team
Developed for HackUTD 2025 by the hackUTD2025 team.

---
