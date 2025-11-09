// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain="dev-krkzmo2yx15225nx.us.auth0.com"
    clientId="P3vLyHy1NQ9UauSosCY6s1a6b9aQhGgH"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "http://localhost:5000/api",
      scope: "openid profile email",
    }}
  >
    <App />
  </Auth0Provider>
);
