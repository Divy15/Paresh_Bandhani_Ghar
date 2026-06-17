import { useState } from 'react';
import { Navbar, type NavKey } from './components/Navbar/Navbar';
import LoginPage from './page/Login.page';
import SignupPage from './page/Signup.page'; // Ensure this path points to your Signup view
import HomePage from './page/Home.page';
import { useAuth } from './context/AuthContext';
import { useCatalogFilter } from './context/CatalogFilterContext';
import { useCategories } from './context/CategoryContext';
import { getFilterLabel } from './utils/categoryHelpers';

function App() {
  // 1. Extend state typing locally so it can hold "signup" alongside your NavKeys
  const [activeTab, setActiveTab] = useState<NavKey | "signup">("home");
  const { isAuthenticated } = useAuth();
  const { filter } = useCatalogFilter();
  const { categories } = useCategories();
  const activeFilterLabel = getFilterLabel(categories, filter);
  const visibleTab = isAuthenticated && (activeTab === "auth" || activeTab === "signup")
    ? "home"
    : activeTab;

  const renderBodyContent = () => {
    switch (visibleTab) {
      case "auth":
        return (
          <LoginPage 
            onCancel={() => setActiveTab("home")} 
            onNavigateToSignup={() => setActiveTab("signup")} // 2. Connect the link callback to flip view state
          />
        );
      
      case "signup":
        // 3. Mount your registration profile view
        return (
          <SignupPage 
            onCancel={() => setActiveTab("auth")} // Goes back to login screen if they hit cancel
          />
        );

      case "home":
        return <HomePage onShopNow={() => setActiveTab("shopping")} />;
      default:
        return (
          <div className="p-8 text-center text-text-muted font-body">
            Content for <span className="capitalize font-bold text-brand-red">{visibleTab}</span> section coming soon!
            {visibleTab === "shopping" && activeFilterLabel ? (
              <p className="mt-3 text-sm">
                Showing products for{" "}
                <span className="font-semibold text-brand-yellow">{activeFilterLabel}</span>
              </p>
            ) : null}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-bg-main text-text-main transition-colors duration-200">
      {/* We typecast activeTab to NavKey for the Navbar since it doesn't need to know about the secret signup view */}
      <Navbar activeTab={visibleTab as NavKey} setActiveTab={setActiveTab} />
      
      <main className="w-full ">
        {renderBodyContent()}
      </main>
    </div>
  );
}

export default App;
