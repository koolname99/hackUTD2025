import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'
import App from './App.jsx'

const redirectUri = window.location.origin
console.log('Auth0 Redirect URI:', redirectUri)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-cnot25sflbf1r4ji.us.auth0.com"
      clientId="ywHBNqL69MZmjJUICFUViRHXrBRUN6DJ"
      authorizationParams={{
        redirect_uri: redirectUri
      }}
      cacheLocation="localstorage"
      onRedirectCallback={(appState) => {
        console.log('Redirect callback:', appState)
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        )
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
)
