import { useAuth0 } from '@auth0/auth0-react'
import './Login.css'

function Login() {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading, error } = useAuth0()

  const handleLogin = () => {
    console.log('Attempting to login...')
    console.log('Redirect URI:', window.location.origin)
    loginWithRedirect().catch((err) => {
      console.error('Login error:', err)
    })
  }

  if (error) {
    console.error('Auth0 Error in Login:', error)
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>Error</h1>
          <p style={{ color: 'red' }}>{error.message}</p>
          <button onClick={() => window.location.reload()} className="login-btn">
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="loading">Loading...</div>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>Welcome!</h1>
          <div className="user-info">
            {user?.picture && (
              <img src={user.picture} alt={user.name} className="user-avatar" />
            )}
            <h2>{user?.name}</h2>
            <p className="user-email">{user?.email}</p>
          </div>
          <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className="logout-btn">
            Log Out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome to PF Tracker</h1>
        <p className="subtitle">Please sign in to continue</p>
        <button onClick={handleLogin} className="login-btn">
          Log In
        </button>
      </div>
    </div>
  )
}

export default Login

