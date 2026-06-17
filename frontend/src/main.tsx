import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { CategoryProvider } from './context/CategoryContext.tsx'
import { CatalogFilterProvider } from './context/CatalogFilterContext.tsx'

createRoot(document.getElementById('root')!).render(
   <AuthProvider>
      <ThemeProvider>
        <CategoryProvider>
          <CatalogFilterProvider>
            <App />
          </CatalogFilterProvider>
        </CategoryProvider>
      </ThemeProvider>
    </AuthProvider>,
)
