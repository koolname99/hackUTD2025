import { useAuth0 } from '@auth0/auth0-react'
import './DashboardLayout.css'

export default function DashboardLayout({ children, currentPage, setCurrentPage }) {
  const { logout, user } = useAuth0()

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">💰</span>
            <span className="logo-text">PF Tracker</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button 
            onClick={() => setCurrentPage('dashboard')} 
            className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setCurrentPage('cards')} 
            className={`nav-item ${currentPage === 'cards' ? 'active' : ''}`}
          >
            <span className="nav-icon">💳</span>
            <span>Cards</span>
          </button>
          <button 
            onClick={() => setCurrentPage('subscriptions')} 
            className={`nav-item ${currentPage === 'subscriptions' ? 'active' : ''}`}
          >
            <span className="nav-icon">🔄</span>
            <span>Subscriptions</span>
          </button>
          <button 
            onClick={() => setCurrentPage('ai-assistant')} 
            className={`nav-item ${currentPage === 'ai-assistant' ? 'active' : ''}`}
          >
            <span className="nav-icon">🤖</span>
            <span>PF AI Assistant</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            <h1 className="page-title">
              {currentPage === 'dashboard' ? 'Dashboard' : 
               currentPage === 'cards' ? 'Cards' : 
               currentPage === 'subscriptions' ? 'Subscriptions' : 
               currentPage === 'ai-assistant' ? 'PF AI Assistant' : 'Dashboard'}
            </h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              {user?.picture && (
                <img src={user.picture} alt={user.name} className="user-avatar-small" />
              )}
              <div className="user-details">
                <span className="user-name">{user?.name || 'User'}</span>
                <span className="user-email">{user?.email}</span>
              </div>
            </div>
            <button
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              className="logout-btn"
            >
              Log Out
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  )
}

