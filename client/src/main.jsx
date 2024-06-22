import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'
// import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <GoogleOAuthProvider clientId="102045327694-jheg2qcd21ojaboqkabbs53hfdu4tpr1.apps.googleusercontent.com"> */}

      <App />
    {/* </GoogleOAuthProvider>; */}

  </React.StrictMode>,
)
