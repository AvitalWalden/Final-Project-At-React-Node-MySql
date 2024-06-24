import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="914868581421-941amdhclu0qopke8nuj7djf2duip9lm.apps.googleusercontent.com">

      <App />
    </GoogleOAuthProvider>;

  </React.StrictMode>
)
