import { useState, useEffect, useCallback } from 'react';
import { Navbar, type NavKey } from './components/Navbar/Navbar';
import LoginPage from './page/Login.page';
import SignupPage from './page/Signup.page';
import HomePage from './page/Home.page';
import ShoppingPage from './page/Shopping.page';
import LikesPage from './page/Likes.page';
import BagPage from './page/Bag.page';
import ProductDetailsPage from './page/ProductDetails.page';
import { useAuth } from './context/AuthContext';
import { useStore } from './context/StoreContext';

type AppTab = NavKey | "signup";

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("home");
  const { isAuthenticated } = useAuth();
  const { activeProductId, setActiveProductId } = useStore();

  useEffect(() => {
    if (isAuthenticated && (activeTab === "auth" || activeTab === "signup")) {
      setActiveTab("shopping");
    }
  }, [isAuthenticated, activeTab]);

  const handleOpenProduct = useCallback((productId: string) => {
    setActiveProductId(productId);
    setActiveTab("product-details");
  }, [setActiveProductId]);

  const handleBackFromProduct = useCallback(() => {
    setActiveProductId(null);
    setActiveTab("shopping");
  }, [setActiveProductId]);

  const handleExplore = useCallback(() => {
    setActiveTab("shopping");
  }, []);

  const renderBodyContent = () => {
    switch (activeTab) {
      case "auth":
        return (
          <LoginPage
            onCancel={() => setActiveTab("home")}
            onNavigateToSignup={() => setActiveTab("signup")}
          />
        );

      case "signup":
        return (
          <SignupPage
            onCancel={() => setActiveTab("auth")}
          />
        );

      case "home":
        return <HomePage onShopNow={() => setActiveTab("shopping")} />;

      case "shopping":
        return <ShoppingPage onProductClick={handleOpenProduct} />;

      case "likes":
        return (
          <LikesPage
            onExplore={handleExplore}
            onProductClick={handleOpenProduct}
          />
        );

      case "bag":
        return <BagPage onExplore={handleExplore} />;

      case "product-details":
        if (!activeProductId) {
          return <ShoppingPage onProductClick={handleOpenProduct} />;
        }
        return (
          <ProductDetailsPage
            key={activeProductId}
            productId={activeProductId}
            onBack={handleBackFromProduct}
            onProductClick={handleOpenProduct}
          />
        );

      default:
        return (
          <div className="p-8 text-center text-text-muted font-body">
            Content for <span className="capitalize font-bold text-brand-red">{activeTab}</span> section coming soon!
          </div>
        );
    }
  };

  const navbarTab: NavKey =
    activeTab === "signup" ? "auth" : (activeTab as NavKey);

  return (
    <div className="min-h-screen bg-bg-main text-text-main transition-colors duration-200">
      <Navbar
        activeTab={navbarTab}
        setActiveTab={(tab) => setActiveTab(tab)}
      />

      <main className="w-full">
        {renderBodyContent()}
      </main>
    </div>
  );
}

export default App;
