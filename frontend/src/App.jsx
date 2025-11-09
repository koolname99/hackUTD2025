import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react'
import { checkEmailExists } from './api'
import Landing from "./components/Landing/Landing";
import DashboardLayout from "./components/Layout/DashboardLayout";
import Dashboard from "./components/Dashboard/Dashboard";
import Cards from "./components/Cards/Cards";
import Subscriptions from "./components/Subscriptions/Subscriptions";
import AIAssistant from "./components/AIAssistant/AIAssistant";

function App() {
  const { isAuthenticated, isLoading, error, user, logout } = useAuth0()
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [emailChecked, setEmailChecked] = useState(false)
  const [emailExists, setEmailExists] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)

  // Check email after successful authentication
  useEffect(() => {
    if (isAuthenticated && user?.email && !emailChecked) {
      setCheckingEmail(true)
      checkEmailExists(user.email)
        .then((res) => {
          setEmailExists(res.exists)
          setEmailChecked(true)
          if (!res.exists) {
            // Log out if email doesn't exist
            console.log('Email not registered, logging out...')
          }
        })
        .catch((err) => {
          console.error('Error checking email:', err)
          // Allow access if check fails (fallback)
          setEmailExists(true)
          setEmailChecked(true)
        })
        .finally(() => {
          setCheckingEmail(false)
        })
    }
  }, [isAuthenticated, user?.email, emailChecked])

  if (error) {
    console.error('Auth0 Error:', error)
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f5f7fa'
      }}>
        <h2 style={{ color: '#dc2626', marginBottom: '12px' }}>Authentication Error</h2>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Reload Page
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f5f7fa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Landing />
  }

  // Show loading while checking email
  if (checkingEmail || !emailChecked) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f5f7fa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280' }}>Verifying account...</p>
        </div>
      </div>
    )
  }

  // Show error if email not registered
  if (emailChecked && !emailExists) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f5f7fa'
      }}>
        <h2 style={{ color: '#dc2626', marginBottom: '12px' }}>Email Chưa Được Đăng Ký</h2>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>
          Email {user?.email} chưa được đăng ký trong hệ thống. Vui lòng đăng ký trước khi đăng nhập.
        </p>
        <button 
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Quay Lại
        </button>
      </div>
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'cards':
        return <Cards />
      case 'subscriptions':
        return <Subscriptions />
      case 'ai-assistant':
        return <AIAssistant />
      default:
        return <Dashboard />
    }
  }

  return (
    <DashboardLayout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </DashboardLayout>
  );
}

export default App;
