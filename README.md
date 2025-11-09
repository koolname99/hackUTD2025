"# Personal Finance Dashboard

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
- **Vite** - Fast build tool and development server
- **Auth0** - Authentication and authorization
- **Axios** - HTTP client for API requests
- **Recharts** - Data visualization library
- **CSS3** - Custom styling and animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

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

## 📱 Application Structure

```
hackUTD2025-1/
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
- CORS protection
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

## 🚧 Development Notes

This project was developed for HackUTD 2025 and includes:
- Vietnamese language support in some components
- Flexible MongoDB schema for rapid development
- Modular component architecture for scalability

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 👥 Team
Developed for HackUTD 2025 by the hackUTD2025 team.

---
