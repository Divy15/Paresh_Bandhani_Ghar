import { createRoot } from 'react-dom/client'
import {  AuthProvider  } from "./context/AuthContext.tsx";
import {  ThemeProvider } from "./context/ThemeContext.tsx";
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <AuthProvider> 
  <ThemeProvider>
    <App />
  </ThemeProvider>
  </AuthProvider>
)
