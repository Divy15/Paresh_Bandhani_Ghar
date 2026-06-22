import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { CategoryProvider } from './context/CategoryContext.tsx'
import { CatalogFilterProvider } from './context/CatalogFilterContext.tsx'
import { StoreProvider } from './context/StoreContext.tsx'

createRoot(document.getElementById('root')!).render(
   <AuthProvider>
      <ThemeProvider>
        <CategoryProvider>
          <CatalogFilterProvider>
            <StoreProvider>
              <App />
              <Toaster position="bottom-right" toastOptions={{ duration: 2500 }} />
            </StoreProvider>
          </CatalogFilterProvider>
        </CategoryProvider>
      </ThemeProvider>
    </AuthProvider>,
)
