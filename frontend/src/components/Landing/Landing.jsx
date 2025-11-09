import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import Login from '../Login/Login'
import backgroundImage from '../../assets/background.webp'
import './Landing.css'

export default function Landing() {
  const [showLogin, setShowLogin] = useState(false)
  const { loginWithRedirect } = useAuth0()

  if (showLogin) {
    return <Login />
  }

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section" style={{ '--bg-image': `url(${backgroundImage})` }}>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Take Control of Your
              <span className="gradient-text"> Finances</span>
            </h1>
            <p className="hero-subtitle">
              Track your transactions, analyze spending patterns, and make smarter financial decisions with our powerful PF Tracker platform.
            </p>
            <div className="hero-buttons">
              <button 
                onClick={() => loginWithRedirect()} 
                className="btn-primary"
              >
                Get Started
              </button>
              <button 
                onClick={() => setShowLogin(true)} 
                className="btn-secondary"
              >
                Sign In
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-card">
              <div className="card-header">
                <div className="card-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="card-content">
                <div className="card-balance">
                  <p>Total Balance</p>
                  <h2>$12,450.00</h2>
                </div>
                <div className="card-stats">
                  <div className="stat-item">
                    <span className="stat-label">Income</span>
                    <span className="stat-value positive">+$5,200</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Expenses</span>
                    <span className="stat-value negative">-$2,100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Our Platform?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Real-Time Analytics</h3>
              <p className="feature-description">
                Get instant insights into your spending habits with comprehensive analytics and visualizations.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Secure & Private</h3>
              <p className="feature-description">
                Your financial data is encrypted and protected with industry-leading security measures.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3 className="feature-title">Transaction Tracking</h3>
              <p className="feature-description">
                Automatically categorize and track all your transactions across multiple accounts.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3 className="feature-title">Smart Insights</h3>
              <p className="feature-description">
                AI-powered recommendations help you optimize your spending and save more money.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📂</div>
              <h3 className="feature-title">Category-Based Spending</h3>
              <p className="feature-description">
                Organize and manage your expenses by categories like housing, food, transportation, and more. Track spending patterns and stay within budget.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3 className="feature-title">Subscription Reminders</h3>
              <p className="feature-description">
                Never forget to cancel unwanted subscriptions. Get smart reminders before monthly renewals to avoid over-spending.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

