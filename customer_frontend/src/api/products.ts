import type { CSSProperties } from "react";

export interface Product {
  id: string;
  name: string;
  category: string;      // "cat_1" | "cat_2" | "cat_3"
  subcategory?: string;   // "sub_1" to "sub_5"
  tag: string;
  price: string;
  rawPrice: number;
  images: string[];
  patterns: CSSProperties[];
  isLiked?: boolean;
}

// 12 beautiful textile/fashion Unsplash images for Gujarati Bandhani theme
const UNSPLASH_IMAGES = [
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80", // Red Silk Fabric
  "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80", // Green Silk Fabric
  "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80", // Golden Silk Fabric
  "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80", // Orange Pattern
  "https://images.unsplash.com/photo-1590736969955-71cb94801759?auto=format&fit=crop&w=600&q=80", // Indian Dress/Kurta
  "https://images.unsplash.com/photo-1524492449929-c42ab9f11f8c?auto=format&fit=crop&w=600&q=80", // Indian Red Heritage
  "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=600&q=80", // Colorful Indian Textiles
  "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?auto=format&fit=crop&w=600&q=80", // Fabric Scrolls
  "https://images.unsplash.com/photo-1597176118030-c8e4041443d9?auto=format&fit=crop&w=600&q=80", // Floral Indian Wear
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80", // Bag/Textiles detail
  "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80", // Ethnic Clothing store
  "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=600&q=80"  // Luxury Garment details
];

// Aesthetic CSS patterns mimicking Bandhani tie-dye motifs
const MOCK_PATTERNS = [
  {
    backgroundColor: "#B8252E", // Red Bandhani
    backgroundImage: "radial-gradient(circle at 14px 14px, rgba(255,255,255,0.8) 0 2px, transparent 2.5px)",
    backgroundSize: "28px 28px"
  },
  {
    backgroundColor: "#063020", // Deep Emerald
    backgroundImage: "radial-gradient(circle at 12px 12px, rgba(245,242,235,0.75) 0 1.8px, transparent 2.3px)",
    backgroundSize: "24px 24px"
  },
  {
    backgroundColor: "#C5A059", // Mustard Gold
    backgroundImage: "radial-gradient(circle at 16px 16px, rgba(26,26,26,0.6) 0 1.8px, transparent 2.4px)",
    backgroundSize: "32px 32px"
  },
  {
    backgroundColor: "#8A1C24", // Maroon Zari
    backgroundImage: "radial-gradient(circle at 15px 15px, rgba(197,160,89,0.8) 0 2px, transparent 2.6px)",
    backgroundSize: "30px 30px"
  },
  {
    backgroundColor: "#1A4032", // Jade Green
    backgroundImage: "radial-gradient(circle at 10px 10px, rgba(197,160,89,0.7) 0 1.5px, transparent 2.2px)",
    backgroundSize: "20px 20px"
  }
];

const COLORS = [
  "Royal Red", "Emerald Green", "Mustard Gold", "Sunset Orange",
  "Midnight Blue", "Marigold Yellow", "Ivory Cream", "Magenta Pink",
  "Deep Maroon", "Sage Green", "Turquoise Blue", "Plum Violet"
];

const STYLES = [
  "Traditional Khatri", "Gota Patti Work", "Zari Zardosi Border",
  "Mirror Work Handloom", "Satin Border Classic", "Kundan Handcrafted",
  "Festive Heritage", "Designer Collection", "Aesthetic Bandhej"
];

const SAREE_BASES = ["Gajji Silk Saree", "Traditional Gharchola Saree", "Cotton Bandhej Saree", "Georgette Zari Saree", "Patola Saree"];
const DRESS_BASES = ["Bandhej Dress Material", "Anarkali Suit Set", "Gajji Silk Kurti Set", "Cotton Salwar Suit", "Kalamkari Dress Set"];
const DUPATTA_BASES = ["Festive Silk Dupatta", "Gota Patti Stole", "Classic Bandhej Dupatta", "Chiffon Handloom Dupatta", "Cotton Zari Dupatta"];

// Deterministic product generator (20,000+ items pool)
export function getProductByIndex(index: number): Product {
  const i = index;
  // Category mapping: Saree (0), Dress (1), Dupatta (2)
  const categoryIndex = i % 3;
  let categoryId = "cat_1";
  let subcategoryId: string | undefined = undefined;
  let baseNames = SAREE_BASES;
  let priceBase = 1999;
  let priceVar = 600;

  if (categoryIndex === 0) {
    categoryId = "cat_1";
    // Subcategories for saree: sub_1 (Cotton), sub_2 (Jacquard), sub_3 (Gajji Silk)
    const subIdx = i % 3;
    subcategoryId = subIdx === 0 ? "sub_1" : subIdx === 1 ? "sub_2" : "sub_3";
    baseNames = SAREE_BASES;
    priceBase = 1999;
    priceVar = 750;
  } else if (categoryIndex === 1) {
    categoryId = "cat_2";
    // Subcategories for dress: sub_4 (Cotton Dress), sub_5 (Gajji Silk Dress)
    const subIdx = i % 2;
    subcategoryId = subIdx === 0 ? "sub_4" : "sub_5";
    baseNames = DRESS_BASES;
    priceBase = 1199;
    priceVar = 450;
  } else {
    categoryId = "cat_3";
    subcategoryId = undefined; // Dupatta has no subcategories in MOCK_CATEGORIES
    baseNames = DUPATTA_BASES;
    priceBase = 499;
    priceVar = 250;
  }

  const color = COLORS[i % COLORS.length];
  const style = STYLES[(i + 2) % STYLES.length];
  const baseName = baseNames[(i + 4) % baseNames.length];
  
  const name = `${color} ${baseName}`;
  const tag = style;
  const rawPrice = priceBase + (i % 15) * priceVar;
  const price = `Rs. ${rawPrice.toLocaleString("en-IN")}`;

  // Image list (auto-scrolling carousel of 3 items per product)
  const images = [
    UNSPLASH_IMAGES[i % UNSPLASH_IMAGES.length],
    UNSPLASH_IMAGES[(i + 3) % UNSPLASH_IMAGES.length],
    UNSPLASH_IMAGES[(i + 7) % UNSPLASH_IMAGES.length]
  ];

  // Pattern list corresponding to dark/light colors
  const patterns = [
    MOCK_PATTERNS[i % MOCK_PATTERNS.length],
    MOCK_PATTERNS[(i + 1) % MOCK_PATTERNS.length],
    MOCK_PATTERNS[(i + 2) % MOCK_PATTERNS.length]
  ];

  return {
    id: `prod_${i + 1}`,
    name,
    category: categoryId,
    subcategory: subcategoryId,
    tag,
    price,
    rawPrice,
    images,
    patterns
  };
}

export function getProductById(id: string): Product | null {
  const prefix = "prod_";
  if (id.startsWith(prefix)) {
    const idxStr = id.slice(prefix.length);
    const index = parseInt(idxStr, 10) - 1;
    if (!isNaN(index) && index >= 0 && index < 20000) {
      const p = getProductByIndex(index);
      return {
        ...p,
        isLiked: getLikedStatus(p.id)
      };
    }
  }
  return null;
}

export function getProductColorVariations(currentProduct: Product): Product[] {
  let baseName = currentProduct.name;
  for (const color of COLORS) {
    if (currentProduct.name.startsWith(color)) {
      baseName = currentProduct.name.slice(color.length).trim();
      break;
    }
  }

  const variations: Product[] = [];
  for (let i = 0; i < 150; i++) {
    const p = getProductByIndex(i);
    if (p.id === currentProduct.id) continue;
    
    let pBase = p.name;
    for (const color of COLORS) {
      if (p.name.startsWith(color)) {
        pBase = p.name.slice(color.length).trim();
        break;
      }
    }
    
    if (pBase === baseName) {
      variations.push(p);
    }
  }
  return variations;
}

export function getSimilarProducts(currentProduct: Product, limit: number = 4): Product[] {
  const similar: Product[] = [];
  const likedIds = getLikedIds();

  for (let i = 0; i < 150 && similar.length < limit; i++) {
    const p = getProductByIndex(i);
    if (p.id === currentProduct.id) continue;
    if (p.category === currentProduct.category) {
      similar.push({
        ...p,
        isLiked: likedIds.includes(p.id),
      });
    }
  }
  return similar;
}

// Memory cache for fetched pages
// Key format: `${categoryId}_${subcategoryId}_${page}_${limit}`
const productCache: Record<string, Product[]> = {};

// Liked state persist (stored in localStorage as string array — synced with StoreContext)
const LIKED_KEY = "pbg_liked_products";

const getLikedIds = (): string[] => {
  try {
    const val = localStorage.getItem(LIKED_KEY);
    if (!val) return [];
    const parsed = JSON.parse(val);
    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed === "object" && parsed !== null) return Object.keys(parsed);
    return [];
  } catch {
    return [];
  }
};

export function getLikedStatus(productId: string): boolean {
  return getLikedIds().includes(productId);
}

interface FetchProductsResult {
  products: Product[];
  hasMore: boolean;
  totalCount: number;
}

// Simulated paginated API with Caching and realistic network delay
export async function fetchProductsApi(
  page: number,
  limit: number = 20,
  categoryId: string | null = null,
  subcategoryId: string | null = null
): Promise<FetchProductsResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const cacheKey = `${categoryId ?? "all"}_${subcategoryId ?? "all"}_${page}_${limit}`;
  
  if (productCache[cacheKey]) {
    // Merge latest like status before returning cached items
    const cachedProducts = productCache[cacheKey].map((p) => ({
      ...p,
      isLiked: getLikedStatus(p.id)
    }));
    
    return {
      products: cachedProducts,
      hasMore: page * limit < 20000,
      totalCount: 20000
    };
  }

  // Filter and generate products dynamically
  const batch: Product[] = [];
  let indexPointer = 0;
  const targetBatchSize = limit;
  const likedIds = getLikedIds();

  // Determine starting range for pagination.
  // Since we are filtering dynamically, we scan deterministically.
  // To keep pagination extremely fast, we scan using simple arithmetic:
  let matchCount = 0;
  const skipCount = (page - 1) * limit;

  while (batch.length < targetBatchSize && indexPointer < 20000) {
    const p = getProductByIndex(indexPointer);
    
    // Check filter criteria
    let isMatch = true;
    if (categoryId && p.category !== categoryId) {
      isMatch = false;
    }
    if (subcategoryId && p.subcategory !== subcategoryId) {
      isMatch = false;
    }

    if (isMatch) {
      if (matchCount >= skipCount) {
        batch.push({
          ...p,
          isLiked: likedIds.includes(p.id),
        });
      }
      matchCount++;
    }
    indexPointer++;
  }

  // Cache generated results
  productCache[cacheKey] = batch;

  // Since we simulate 20,000 products in the base pool:
  const totalCount = categoryId ? (categoryId === "cat_1" ? 6667 : categoryId === "cat_2" ? 6667 : 6666) : 20000;

  return {
    products: batch,
    hasMore: matchCount < totalCount,
    totalCount
  };
}
