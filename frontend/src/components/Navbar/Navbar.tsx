import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  LogIn,
  LogOut,
  Sun,
  Moon,
  ShoppingBag,
  User,
  ChevronDown,
  type LucideIcon,
  Home,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useCategories } from "../../context/CategoryContext";
import { useCatalogFilter } from "../../context/CatalogFilterContext";
import {
  SearchBox,
  type SearchSuggestion,
} from "../CommonComponent/SearchBox";
import type { Category, CategorySearchSuggestion } from "../../types/category";
import { hasSubcategories } from "../../utils/categoryHelpers";

export type NavKey = "home" | "contact" | "auth" | "shopping";

interface NavItem {
  key: NavKey;
  title: Record<"en" | "gu", string>;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { key: "home", title: { en: "Home", gu: "પ્રોડક્ટ" }, icon: Home },
  { key: "contact", title: { en: "Contact", gu: "સંપર્ક" }, icon: Phone },
];

const LOGGED_IN_NAV_ITEMS: NavItem[] = [
  { key: "shopping", title: { en: "Product", gu: "પ્રોડક્ટ" }, icon: ShoppingBag },
  { key: "contact", title: { en: "Contact", gu: "સંપર્ક" }, icon: Phone },
];

interface NavbarProps {
  activeTab: NavKey;
  setActiveTab: (tab: NavKey) => void;
}

const getNameParts = (name = "") => name.trim().split(/\s+/).filter(Boolean);
const getFirstName = (name = "") => getNameParts(name)[0] ?? "User";
const getInitials = (name = "") => {
  const nameParts = getNameParts(name);
  const firstInitial = nameParts[0]?.charAt(0) ?? "U";
  const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0) : "";
  return `${firstInitial}${lastInitial}`.toUpperCase();
};

const renderCategoryAvatar = (name: string, imageUrl?: string) =>
  imageUrl ? (
    <img
      src={imageUrl}
      alt={name}
      className="h-14 w-14 rounded-full border border-border-main object-cover"
    />
  ) : (
    <span className="grid h-14 w-14 place-items-center rounded-full border border-border-main bg-brand-yellow/15 text-base font-bold text-brand-yellow">
      {name.slice(0, 1)}
    </span>
  );

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { categories, searchSuggestions, isLoading: isCategoriesLoading } =
    useCategories();
  const { filter, setCategoryFilter, clearFilter } = useCatalogFilter();

  const [lang] = useState<"en" | "gu">("en");
  const [expandedIcon, setExpandedIcon] = useState<NavKey | null>("home");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(
    null
  );
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const expandedCategory = categories.find(
    (category) => category.id === expandedCategoryId
  );

  const authItem: NavItem = isAuthenticated
    ? { key: "auth", title: { en: "Logout", gu: "લોગઆઉટ" }, icon: LogOut }
    : { key: "auth", title: { en: "Login", gu: "લોગઇન" }, icon: LogIn };

  const visibleNavItems = [
    ...(isAuthenticated ? LOGGED_IN_NAV_ITEMS : NAV_ITEMS),
    ...(!isAuthenticated ? [authItem] : []), 
  ];

  const firstName = getFirstName(user?.username);
  const userInitials = getInitials(user?.username);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const handleNavClick = (item: NavItem, viewport: "desktop" | "mobile-tablet") => {
    const payload = {
      viewport,
      clickedMenu: item.title.en,
      activeTabBeforeClick: activeTab,
      isAuthenticated,
      user: user?.username ?? null,
    };

    console.log("[Navbar API payload preview]", payload);

    if (item.key === "auth") {
      if (isAuthenticated) {
        handleLogout();
      } else {
        setActiveTab("auth");
        setExpandedIcon("auth");
      }
      return;
    }

    setActiveTab(item.key);
    setExpandedIcon(item.key);
    setIsProfileMenuOpen(false);
  };

  const handleLogout = () => {
    console.log("[Logout API payload preview]", { username: user?.username ?? null });
    // Guard state modification order to ensure smooth transition inside Framer Motion AnimatePresence
    setIsProfileMenuOpen(false);
    logout();
    setActiveTab("home");
    setExpandedIcon("home");
  };

  const handleProfileClick = () => {
    console.log("[Profile menu API payload preview]", {
      username: user?.username ?? null,
      action: "open-profile-edit",
    });
    setIsProfileMenuOpen(false);
  };

  const navigateToShopping = (
    categoryId: string,
    subcategoryId: string | null = null
  ) => {
    setCategoryFilter(categoryId, subcategoryId);
    setActiveTab("shopping");
  };

  const handleCategoryClick = (category: Category) => {
    if (hasSubcategories(category)) {
      const isCollapsing = expandedCategoryId === category.id;
      setExpandedCategoryId(isCollapsing ? null : category.id);

      // Clear a category-only filter (e.g. Dupatta) when switching to another category
      if (!isCollapsing && filter.categoryId !== category.id) {
        clearFilter();
      }
      return;
    }

    setExpandedCategoryId(null);
    navigateToShopping(category.id);
  };

  const handleSubcategoryClick = (
    categoryId: string,
    subcategoryId: string
  ) => {
    navigateToShopping(categoryId, subcategoryId);
  };

  const handleSearch = (payload: {
    query: string;
    suggestion?: SearchSuggestion;
  }) => {
    const suggestion = payload.suggestion as CategorySearchSuggestion | undefined;

    if (suggestion?.categoryId) {
      navigateToShopping(
        suggestion.categoryId,
        suggestion.subcategoryId ?? null
      );
      return;
    }

    console.log("[Search API payload preview]", payload);
    setActiveTab("shopping");
  };

  const isCategoryActive = (category: Category) => {
    if (filter.subcategoryId) {
      return filter.categoryId === category.id;
    }
    if (hasSubcategories(category)) {
      return expandedCategoryId === category.id;
    }
    return filter.categoryId === category.id;
  };

  const isSubcategoryActive = (subcategoryId: string) =>
    filter.subcategoryId === subcategoryId;

  const renderDropdownMenu = () => (
    <div className="grid gap-1 p-2 bg-bg-main">
      <button
        type="button"
        onClick={handleProfileClick}
        className="flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-text-main transition hover:bg-border-main/50"
      >
        <User size={16} className="text-text-muted" />
        Profile
      </button>

      {LOGGED_IN_NAV_ITEMS.map((item) => {
        const IconComponent = item.icon;
        return (
          <button
            type="button"
            key={item.key}
            onClick={() => handleNavClick(item, "desktop")}
            className="flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-text-main transition hover:bg-border-main/50"
          >
            <IconComponent size={16} className="text-text-muted" />
            {item.title[lang]}
          </button>
        );
      })}

      <button
        type="button"
        onClick={toggleTheme}
        className="flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-text-main transition hover:bg-border-main/50 border-t border-border-main/40 mt-1 pt-2"
      >
        {theme === "light" ? <Moon size={16} className="text-text-muted" /> : <Sun size={16} className="text-brand-yellow" />}
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </button>

      <button
        type="button"
        onClick={handleLogout}
        className="flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-brand-red transition hover:bg-brand-red/10 mt-1 font-semibold"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );

  return (
    <header className="w-full bg-bg-main border-b border-border-main text-text-main relative z-50">
      
      {/* ====================================================================== */}
      {/* 1. DESKTOP & LAPTOP & TABLET VIEWPORT (xl and above) */}
      {/* ====================================================================== */}
      <div className="hidden xl:grid grid-cols-[auto_1fr_auto] items-center gap-6 px-8 py-5 max-w-7xl mx-auto">
        
        {/* Left Branding */}
        <div className="text-left">
          <h1 className="font-header text-2xl lg:text-3xl font-bold tracking-wider text-brand-red whitespace-nowrap">
            Paresh Bandhani Ghar<span className="text-brand-yellow">.</span>
          </h1>
          <span className="text-[10px] font-body tracking-[0.4em] uppercase text-brand-yellow block mt-0.5">
            Heritage Gujarati Bandhani
          </span>
        </div>

        {/* Center Links */}
        {!isAuthenticated ? (<>
        <div className="flex min-w-0 items-center justify-center space-x-8 font-body text-xs uppercase tracking-widest font-medium">
          {visibleNavItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.key;
            
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item, "desktop")}
                className={`relative py-1 cursor-pointer transition ${
                  isActive ? "text-brand-red font-bold" : "text-text-muted hover:text-text-main"
                }`}
              >
                <div className="flex items-center">
                  <span className="pr-2">
                    <IconComponent size={14} />
                  </span>
                  {item.title[lang]}
                  {isActive && (
                    <motion.div
                      layoutId="desktopUnderline"
                      className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-red"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
        </>) : null}

        {/* Right Utilities */}
        <div className="flex items-center justify-end space-x-4 font-body text-sm">
          
          {/* Desktop SearchBox - After login available */}
          {isAuthenticated ? (
          <div className="w-64 max-w-xs">
            <SearchBox
              suggestions={searchSuggestions}
              placeholder="Search items..."
              className="py-1"
              onSearch={handleSearch}
              onSelect={(suggestion) => console.log("[Search suggestion selected]", suggestion)}
            />
          </div>
          ) : null }

          {/* <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full border border-border-main hover:bg-brand-yellow/10 transition cursor-pointer shrink-0"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button> */}

          {isAuthenticated ? (
            <div ref={profileMenuRef} className="relative pl-2 border-l border-border-main">
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 cursor-pointer focus:outline-none group text-left"
              >
                {user?.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={firstName}
                    className="h-9 w-9 rounded-full border border-border-main object-cover"
                  />
                ) : (
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-brand-yellow/40 bg-brand-yellow/15 text-xs font-bold text-brand-yellow">
                    {userInitials}
                  </span>
                )}
                <div className="flex flex-col hidden lg:flex">
                  <span className="max-w-20 truncate text-[11px] font-semibold leading-none text-brand-yellow flex items-center gap-0.5">
                    {firstName}
                    <ChevronDown size={10} className={`transition-transform duration-200 ${isProfileMenuOpen ? "rotate-180" : ""}`} />
                  </span>
                </div>
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-[calc(100%+12px)] z-50 w-56 overflow-hidden rounded-lg border border-border-main bg-bg-main shadow-xl"
                  >
                    {renderDropdownMenu()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : null}
        </div>
      </div>

      {/* ====================================================================== */}
      {/* 2. MOBILE VIEWPORT OVERALL HEADER CONTAINER (Below xl) */}
      {/* ====================================================================== */}
      <div className="xl:hidden flex flex-col w-full">
        
        {/* Core Mobile Banner Line */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border-main/50">
          <div>
            <h1 className="font-header text-2xl font-bold tracking-wide text-brand-red">
              Paresh Bandhani Ghar<span className="text-brand-yellow">.</span>
            </h1>
            <span className="text-[10px] font-body tracking-[0.4em] uppercase text-brand-yellow block mt-0.5">
              Heritage Gujarati Bandhani
            </span>
          </div>

          {isAuthenticated ? (
            <div ref={profileMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
                className="flex min-w-14 flex-col items-center gap-1 text-brand-yellow"
                aria-expanded={isProfileMenuOpen}
                aria-label="Open profile menu"
              >
                {user?.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={firstName}
                    className="h-9 w-9 rounded-full border border-border-main object-cover"
                  />
                ) : (
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-brand-yellow/40 bg-brand-yellow/15 text-xs font-bold">
                    {userInitials}
                  </span>
                )}
                <span className="flex max-w-20 items-center gap-0.5 truncate text-[11px] font-semibold leading-none">
                  {firstName}
                  <ChevronDown
                    size={12}
                    className={`shrink-0 transition ${isProfileMenuOpen ? "rotate-180" : ""}`}
                  />
                </span>
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 top-[calc(100%+12px)] z-50 w-64 overflow-hidden rounded-lg border border-border-main bg-bg-main shadow-xl"
                  >
                    <div className="border-b border-border-main px-4 py-3 bg-border-main/10">
                      <div className="flex items-center gap-3">
                        {user?.photoUrl ? (
                          <img
                            src={user.photoUrl}
                            alt={firstName}
                            className="h-11 w-11 rounded-full border border-border-main object-cover"
                          />
                        ) : (
                          <span className="grid h-11 w-11 place-items-center rounded-full border border-brand-yellow/40 bg-brand-yellow/15 text-sm font-bold text-brand-yellow">
                            {userInitials}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-text-main">
                            {user?.username}
                          </p>
                          <p className="text-xs text-text-muted">Account Menu</p>
                        </div>
                      </div>
                    </div>
                    {renderDropdownMenu()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : null}
        </div>

        {/* Mobile Search Input Row always available below header brand lines */}
        {isAuthenticated ? (<>
        <div className="p-3 border-b border-border-main/40 bg-bg-main">
          <SearchBox
            suggestions={searchSuggestions}
            placeholder="Search categories and products"
            onSearch={handleSearch}
            onSelect={(suggestion) => console.log("[Search suggestion selected]", suggestion)}
          />
        </div>
        </>) : null}

        {!isAuthenticated && (
          <div className="w-full bg-border-main/30 px-4 py-2 flex items-center justify-between overflow-x-auto gap-4">
            <div className="flex items-center gap-1.5 bg-bg-main p-1 rounded-full border border-border-main shadow-sm">
              {visibleNavItems.map((item) => {
                const IconComponent = item.icon;
                const isExpanded = expandedIcon === item.key;
                const isActive = activeTab === item.key;

                return (
                  <motion.button
                    key={item.key}
                    layout
                    onClick={() => handleNavClick(item, "mobile-tablet")}
                    onMouseEnter={() => setExpandedIcon(item.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer text-xs font-body font-medium ${
                      isActive ? "bg-brand-red text-white" : "text-text-muted hover:bg-border-main"
                    }`}
                    transition={{ type: "spring", damping: 25, stiffness: 220 }}
                  >
                    <IconComponent size={14} />
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.span
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: "auto", opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden whitespace-nowrap"
                        >
                          {item.title[lang]}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>

            <div className="flex items-center justify-end pl-2">
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full border border-border-main bg-bg-main shadow-sm text-text-muted cursor-pointer"
              >
                {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Categories Horizontal Bar */}
      {isAuthenticated && (
        <div className="border-t border-border-main bg-bg-main/95">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 xl:px-8">
            <div className="category-scrollbar flex min-w-0 gap-3 overflow-x-auto pb-2">
              {isCategoriesLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`category-skeleton-${index}`}
                    className="flex min-w-[100px] flex-col items-center gap-2 rounded-xl border border-border-main/60 p-3"
                  >
                    <span className="h-14 w-14 animate-pulse rounded-full bg-border-main/60" />
                    <span className="h-3 w-14 animate-pulse rounded bg-border-main/60" />
                  </div>
                ))
              ) : (
                categories.map((category) => {
                  const isExpanded = expandedCategoryId === category.id;
                  const isActive = isCategoryActive(category);

                  return (
                    <button
                      type="button"
                      key={category.id}
                      onClick={() => handleCategoryClick(category)}
                      className={`flex min-w-[100px] flex-col items-center gap-2 rounded-xl border p-3 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                        isActive || isExpanded
                          ? "border-brand-red bg-brand-red/5 text-brand-red shadow-sm"
                          : "border-border-main/70 bg-bg-main text-text-muted hover:border-brand-red/40 hover:text-brand-red"
                      }`}
                    >
                      {renderCategoryAvatar(category.name, category.url)}
                      <span>{category.name}</span>
                    </button>
                  );
                })
              )}
            </div>

            <AnimatePresence initial={false}>
              {expandedCategory && hasSubcategories(expandedCategory) ? (
                <motion.div
                  key={expandedCategory.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 rounded-xl border border-border-main bg-border-main/10 p-3 sm:p-4">
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
                      {expandedCategory.name} collections
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {expandedCategory.subcategories.map((subcategory) => {
                        const isActive = isSubcategoryActive(subcategory.id);

                        return (
                          <button
                            type="button"
                            key={subcategory.id}
                            onClick={() =>
                              handleSubcategoryClick(
                                expandedCategory.id,
                                subcategory.id
                              )
                            }
                            className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-[11px] font-semibold uppercase tracking-[0.12em] transition ${
                              isActive
                                ? "border-brand-red bg-brand-red/5 text-brand-red shadow-sm"
                                : "border-border-main/70 bg-bg-main text-text-muted hover:border-brand-red/40 hover:text-brand-red"
                            }`}
                          >
                            {renderCategoryAvatar(
                              subcategory.name,
                              subcategory.url ?? expandedCategory.url
                            )}
                            <span className="text-center leading-tight">
                              {subcategory.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      )}
    </header>
  );
};