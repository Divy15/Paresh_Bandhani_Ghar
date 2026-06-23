import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, LogOut, LayoutDashboard, Shirt, Receipt, Undo2, Settings2 } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Helper style function for desktop/tablet links
  const navLinkStyle = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 ${
      isActive ? 'text-brand-maroon-500 font-semibold' : 'text-text-main hover:text-brand-maroon-500'
    }`;

  // Helper style function for mobile accordion menu drops
  const mobileNavLinkStyle = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors p-3 rounded-lg flex items-center gap-3 ${
      isActive ? 'bg-brand-maroon-500/10 text-brand-maroon-500 font-semibold' : 'text-text-main hover:bg-bg-main'
    }`;

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="relative z-50 bg-bg-card border-b border-border-main shadow-sm">
      {/* 1. Main Universal Upper Header Bar */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-6 py-4 flex items-center justify-between"
      >
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => { navigate(isAuthenticated ? '/dashboard' : '/login'); closeMenu(); }}
          >
            <div className="w-3 h-3 rounded-full bg-brand-maroon-500 animate-pulse" />
            <span className="font-serif text-xl font-bold text-brand-maroon-500 tracking-wide">
              Paresh Bandhani Ghar
            </span>
          </div>
        </div>

        {/* Right Side Control Interface Context */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          {/* Desktop Navigation Link Node Clusters (Hidden on Mobile/Tablet) */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center gap-6">
              <NavLink to="/dashboard" className={navLinkStyle}>
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </NavLink>
              <NavLink to="/products" className={navLinkStyle}>
                <Shirt className="w-4 h-4" /> Product Registration
              </NavLink>
              <NavLink to="/billing" className={navLinkStyle}>
                <Receipt className="w-4 h-4" /> Billing
              </NavLink>
              <NavLink to="/returns" className={navLinkStyle}>
                <Undo2 className="w-4 h-4" /> Return Product
              </NavLink>
              <NavLink to="/configuration" className={navLinkStyle}>
                <Settings2 className="w-4 h-4" /> Configuration
              </NavLink>
            </div>
          )}
          
          {/* Theme Switcher Toggle Button (Always visible!) */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-bg-main text-text-muted transition-colors focus:outline-none"
            title="Toggle UI Mode"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* Desktop Only Logout Button */}
          {isAuthenticated && (
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white bg-brand-maroon-500 hover:bg-brand-maroon-600 shadow transition-all duration-200"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          )}

          {/* Mobile/Tablet Menu Button Toggle Trigger (Only if authenticated) */}
          {isAuthenticated && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-text-main hover:bg-bg-main transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </motion.nav>

      {/* 2. Expandable Mobile/Tablet Lower Drawer Block (After login) */}
      <AnimatePresence>
        {isAuthenticated && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="lg:hidden border-t border-border-main bg-bg-card overflow-hidden w-full absolute left-0 right-0 top-full shadow-lg"
          >
            <div className="px-6 py-4 flex flex-col gap-2 bg-bg-card">
              <NavLink to="/dashboard" className={mobileNavLinkStyle} onClick={closeMenu}>
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </NavLink>

              <NavLink to="/products" className={mobileNavLinkStyle} onClick={closeMenu}>
                <Shirt className="w-4 h-4" /> Product Registration
              </NavLink>

              <NavLink to="/billing" className={mobileNavLinkStyle} onClick={closeMenu}>
                <Receipt className="w-4 h-4" /> Billing
              </NavLink>

              <NavLink to="/returns" className={mobileNavLinkStyle} onClick={closeMenu}>
                <Undo2 className="w-4 h-4" /> Return Product
              </NavLink>

              <NavLink to="/configuration" className={mobileNavLinkStyle} onClick={closeMenu}>
                <Settings2 className="w-4 h-4" /> Configuration
              </NavLink>

              <hr className="border-border-main my-2" />

              <button
                onClick={() => {
                  closeMenu();
                  logout();
                  navigate('/login');
                }}
                className="w-full mt-1 flex items-center justify-center gap-2 p-3 text-sm font-semibold rounded-lg text-white bg-brand-maroon-500 hover:bg-brand-maroon-600 transition-colors shadow-sm"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};