import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/login.page';
import { DashboardPage } from './pages/dashboard.page';
import { ProductRegistrationPage } from './pages/product';
import { Navbar } from './components/navbar/Navbar';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg-main text-text-main flex flex-col">
        {/* Navbar stays fixed at the top */}
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            {/* Public Route */}
            <Route 
              path="/login" 
              element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
            />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/products" 
              element={isAuthenticated ? <ProductRegistrationPage /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/billing" 
              element={isAuthenticated ? <div className="p-6">Billing Page (Coming Soon)</div> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/returns" 
              element={isAuthenticated ? <div className="p-6">Return Product (Coming Soon)</div> : <Navigate to="/login" replace />} 
            />

            {/* Fallback Catch-All Route */}
            <Route 
              path="*" 
              element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;