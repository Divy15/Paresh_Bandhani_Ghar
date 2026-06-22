import React, { createContext, useContext, useState, useEffect } from "react";

export interface BagItem {
  productId: string;
  quantity: number;
}

interface StoreContextType {
  likedIds: string[];
  toggleLike: (productId: string) => void;
  isLiked: (productId: string) => boolean;
  bag: BagItem[];
  addToBag: (productId: string) => void;
  removeFromBag: (productId: string) => void;
  updateBagQuantity: (productId: string, quantity: number) => void;
  clearBag: () => void;
  activeProductId: string | null;
  setActiveProductId: (id: string | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [bag, setBag] = useState<BagItem[]>([]);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);

  // Load initial state from localStorage
  useEffect(() => {
    try {
      const storedLikes = localStorage.getItem("pbg_liked_products");
      if (storedLikes) {
        // Support both object maps or lists if format changes
        const parsed = JSON.parse(storedLikes);
        if (Array.isArray(parsed)) {
          setLikedIds(parsed);
        } else if (typeof parsed === "object" && parsed !== null) {
          setLikedIds(Object.keys(parsed));
        }
      }
    } catch (e) {
      console.error("Failed to load liked products from storage", e);
    }

    try {
      const storedBag = localStorage.getItem("pbg_bag_items");
      if (storedBag) {
        setBag(JSON.parse(storedBag));
      }
    } catch (e) {
      console.error("Failed to load bag items from storage", e);
    }
  }, []);

  const toggleLike = (productId: string) => {
    setLikedIds((prev) => {
      let next: string[];
      if (prev.includes(productId)) {
        next = prev.filter((id) => id !== productId);
      } else {
        next = [...prev, productId];
      }
      localStorage.setItem("pbg_liked_products", JSON.stringify(next));
      return next;
    });
  };

  const isLiked = (productId: string) => {
    return likedIds.includes(productId);
  };

  const addToBag = (productId: string) => {
    setBag((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      let next: BagItem[];
      if (existing) {
        next = prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(item.quantity + 1, 10) }
            : item
        );
      } else {
        next = [...prev, { productId, quantity: 1 }];
      }
      localStorage.setItem("pbg_bag_items", JSON.stringify(next));
      return next;
    });
  };

  const removeFromBag = (productId: string) => {
    setBag((prev) => {
      const next = prev.filter((item) => item.productId !== productId);
      localStorage.setItem("pbg_bag_items", JSON.stringify(next));
      return next;
    });
  };

  const updateBagQuantity = (productId: string, quantity: number) => {
    setBag((prev) => {
      const next = prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, Math.min(quantity, 10)) }
          : item
      );
      localStorage.setItem("pbg_bag_items", JSON.stringify(next));
      return next;
    });
  };

  const clearBag = () => {
    setBag([]);
    localStorage.removeItem("pbg_bag_items");
  };

  return (
    <StoreContext.Provider
      value={{
        likedIds,
        toggleLike,
        isLiked,
        bag,
        addToBag,
        removeFromBag,
        updateBagQuantity,
        clearBag,
        activeProductId,
        setActiveProductId,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
