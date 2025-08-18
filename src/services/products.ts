// src/services/products.ts
"use server";
import axiosInstance from "../lib/axios";
import { Product, FlashSaleProduct, Review } from "../types/product";
export type { Product } from "../types/product";

type Pagination = {
  page: number;
  limit: number;
  total: number;
};



// Normalization function to map backend fields to frontend Product type
function normalizeProduct(raw: Record<string, unknown>): Product {
  const safeString = (val: unknown): string => typeof val === 'string' ? val : '';
  const safeNumber = (val: unknown): number => typeof val === 'number' ? val : Number(val) || 0;
  const safeBool = (val: unknown): boolean => typeof val === 'boolean' ? val : Boolean(val);
  const safeArray = (val: unknown): unknown[] => Array.isArray(val) ? val : [];
  const safeObj = (val: unknown): Record<string, unknown> => (val && typeof val === 'object' && !Array.isArray(val)) ? val as Record<string, unknown> : {};
  
  return {
    title: safeString(raw.title || raw.designation_fr || raw.designation),
    price: safeNumber(raw.price ?? raw.prix ?? 0),
    discountedPrice: safeNumber(raw.discountedPrice ?? raw.promo ?? raw.promo_ht ?? raw.price ?? raw.prix ?? 0),
    id: safeNumber(raw.id ?? raw._id ?? 0),
    imgs: {
      thumbnails: safeArray(raw.images).map((img: unknown) => safeString(safeObj(img).url)) || (safeObj(raw.mainImage).url ? [safeString(safeObj(raw.mainImage).url)] : []),
      previews: safeArray(raw.images).map((img: unknown) => safeString(safeObj(img).url)) || (safeObj(raw.mainImage).url ? [safeString(safeObj(raw.mainImage).url)] : []),
    },
    currency: safeString(raw.currency) || "TND",
    _id: safeString(raw._id),
    designation: safeString(raw.designation),
    slug: safeString(raw.slug),
    oldPrice: safeNumber(raw.oldPrice ?? raw.prix_ht ?? raw.promo ?? 0) || undefined,
    mainImage: safeObj(raw.mainImage).url ? safeObj(raw.mainImage) as { url: string } : { url: "" },
    images: safeArray(raw.images) as { url: string }[],
    inStock: safeBool(raw.inStock ?? (raw.rupture === "0" ? true : false)),
    reviews: safeArray(raw.reviews) as Review[],
    features: safeArray(raw.features) as string[],
    aroma_ids: safeArray(raw.aroma_ids) as string[],
    brand: safeString(raw.brand),
    smallDescription: safeString(raw.smallDescription || raw.description_cover),
    description: safeString(raw.description || raw.description_fr),
    meta_description_fr: safeString(raw.meta_description_fr),
    category: safeString(raw.category),
    subCategory: safeArray(raw.subCategory) as (string | { _id: string; designation: string })[],
    venteflashDate: raw.venteflashDate as Date | undefined,
    isFlashSale: safeBool(raw.isFlashSale),
    discountPercentage: raw.discountPercentage as number | undefined,
    type: safeString(raw.type),
    isNewProduct: safeBool(raw.isNewProduct !== undefined ? raw.isNewProduct : raw.isNewArrival !== undefined ? raw.isNewArrival : raw.new_product === "1"),
    isBestSeller: safeBool(raw.isBestSeller !== undefined ? raw.isBestSeller : raw.bestSellerSection !== undefined ? raw.bestSellerSection : raw.best_seller === "1"),
    isOutOfStock: safeBool(raw.isOutOfStock ?? (raw.rupture === "1" ? true : false)),
    isPublished: safeBool(raw.isPublished !== undefined ? raw.isPublished : raw.publier === "1"),
    aggregateRating: raw.aggregateRating as number | undefined ?? (raw.note ? safeNumber(raw.note) : undefined),
    promoExpirationDate: raw.promoExpirationDate as Date | undefined ?? raw.promo_expiration_date as Date | undefined,
    sous_categorie_id: safeString(raw.sous_categorie_id ?? raw.sousCategorieId ?? raw.subCategoryId),
    cover: safeString(raw.cover || safeObj(raw.mainImage).url),
    nutrition_values: safeString(raw.nutrition_values),
    questions: safeString(raw.questions),
    zone1: safeString(raw.zone1),
    zone2: safeString(raw.zone2),
    zone3: safeString(raw.zone3),
    zone4: safeString(raw.zone4),
    content_seo: safeString(raw.content_seo || raw.contentSeo),
    meta: safeString(raw.meta),
    pack: safeString(raw.pack),
    rupture: safeString(raw.rupture),
    status: safeBool(raw.status ?? true),
    qte: safeNumber(raw.qte) as React.ReactNode,
    quantity: safeNumber(raw.quantity || raw.qte) as React.ReactNode
  };
}
// Helper function to transform images with ID support
const transformImages = (product: Product) => {
  const images = [product.mainImage, ...(product.images || [])];
  const normalizeUrl = (url: string) => {
    if (!url) return "/images/placeholder.png";
    if (url.startsWith("http") || url.startsWith("/")) return url;
    return "/" + url;
  };
  const urls = images.map(img => normalizeUrl(img.url));

  return {
    thumbnails: urls,
    previews: urls
  };
};

// Helper to calculate reviews count and average
const calculateReviews = (product: Product) => {
  const reviewsCount = product.reviews?.length || 0;
  const totalRating = product.reviews?.reduce((sum, review) => sum + parseInt(String(review.stars), 10), 0) || 0;
  const averageRating = reviewsCount > 0 ? totalRating / reviewsCount : 0;

  return {
    reviewsCount,
    averageRating
  };
};

// Helper to safely extract product arrays with pagination support
const extractProductData = (data: Record<string, unknown>) => {
  const safeObj = (val: unknown): Record<string, unknown> => (val && typeof val === 'object' && !Array.isArray(val)) ? val as Record<string, unknown> : {};
  
  // Case 1: { products: [...] }
  if (Array.isArray(data?.products)) {
    return {
      products: data.products,
      pagination: data.pagination ?? null
    };
  }
  // Case 2: { data: { products: [...] } }
  if (Array.isArray(safeObj(data?.data).products)) {
    return {
      products: safeObj(data?.data).products as unknown[],
      pagination: safeObj(data?.data).pagination ?? data.pagination ?? null
    };
  }
  // Case 3: { data: [...] }
  if (Array.isArray(data?.data)) {
    return {
      products: data.data as unknown[],
      pagination: data.pagination ?? null
    };
  }
  // Case 4: Array directly
  if (Array.isArray(data)) {
    return {
      products: data,
      pagination: null
    };
  }
  // Fallback: empty
  return {
    products: [],
    pagination: null
  };
};

// Cache key generator
const getCacheKey = (endpoint: string, params?: string) => {
  return `products-${endpoint}${params ? `-${params}` : ''}`;
};

export async function getTopProductsFeature(): Promise<Product[]> {
  const cacheKey = getCacheKey('top-products');
  try {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    const controller = new AbortController();
    const response = await axiosInstance.get("/products/store/top", {
      signal: controller.signal
    });

    const { products } = extractProductData(response.data);
    const result = products.map((raw: Record<string, unknown>) => {
      const product = normalizeProduct(raw);
      return {
        ...product,
        imgs: transformImages(product),
        ...calculateReviews(product)
      };
    });

    if (typeof window !== 'undefined') {
      sessionStorage.setItem(cacheKey, JSON.stringify(result));
    }
    return result;
  } catch (error) {
    console.error("Error fetching top products:", error);
    return [];
  }
}

export async function getNewProductsFeature(): Promise<Product[]> {
  const cacheKey = getCacheKey('new-products');
  try {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    const controller = new AbortController();
    const response = await axiosInstance.get("/products/store/new-arrivals", {
      signal: controller.signal
    });

    const { products } = extractProductData(response.data);
    const result = products.map((raw: Record<string, unknown>) => {
      const product = normalizeProduct(raw);
      return {
        ...product,
        imgs: transformImages(product),
        ...calculateReviews(product)
      };
    });

    if (typeof window !== 'undefined') {
      sessionStorage.setItem(cacheKey, JSON.stringify(result));
    }
    return result;
  } catch (error) {
    console.error("Error fetching new products:", error);
    return [];
  }
}
export async function getVenteFlashProductFeature(): Promise<FlashSaleProduct[]> {
  const cacheKey = getCacheKey('flash-sale');
  try {
    // Check if sessionStorage is available (i.e. running on client)
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    const controller = new AbortController();
    const response = await axiosInstance.get("/products/store/vente-flash", {
      signal: controller.signal
    });

    const { products } = extractProductData(response.data);
    const result = products.map((raw: Record<string, unknown>) => {
      const product = normalizeProduct(raw);
      return {
        ...product,
        endTime: product.venteflashDate
          ? (typeof product.venteflashDate === "string"
              ? product.venteflashDate
              : product.venteflashDate instanceof Date
                ? product.venteflashDate.toISOString()
                : String(product.venteflashDate))
          : "",
        originalPrice: product.oldPrice || product.price,
        imgs: transformImages(product),
        ...calculateReviews(product)
      };
    });

    // Save result to sessionStorage only on client
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(cacheKey, JSON.stringify(result));
    }

    return result;
  } catch (error) {
    console.error("Error fetching flash sale products:", error);
    return [];
  }
}
export async function getMaterielDeMusculationProductFeature(): Promise<Product[]> {
  const cacheKey = getCacheKey('fitness-equipment');
  try {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    const controller = new AbortController();
    const response = await axiosInstance.get("/products/store/materiel-de-musculation", {
      signal: controller.signal
    });

    const { products } = extractProductData(response.data);
    const result = products.map((raw: Record<string, unknown>) => {
      const product = normalizeProduct(raw);
      return {
        ...product,
        imgs: transformImages(product),
        ...calculateReviews(product)
      };
    });

    if (typeof window !== 'undefined') {
      sessionStorage.setItem(cacheKey, JSON.stringify(result));
    }
    return result;
  } catch (error) {
    console.error("Error fetching fitness equipment:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const cacheKey = getCacheKey('product-by-slug', slug);
  try {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    const controller = new AbortController();
    const response = await axiosInstance.get(`/products/slug/${slug}`, {
      signal: controller.signal
    });

    // Extract and normalize the product data
    const rawProduct = response.data?.product?.data || response.data?.product || response.data;
    if (!rawProduct) return null;

    const product = normalizeProduct(rawProduct);

    const result = {
      ...product,
      imgs: transformImages(product),
      ...calculateReviews(product)
    };

    if (typeof window !== 'undefined') {
      sessionStorage.setItem(cacheKey, JSON.stringify(result));
    }
    return result;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

export async function getProductListPage(query: string): Promise<{
  products: Product[];
  pagination: { page: number; limit: number; total: number } | null;
}> {
  const cacheKey = getCacheKey('product-list', query);
  try {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    const controller = new AbortController();
    const response = await axiosInstance.get(`/products${query ? `?${query}` : ''}`, {
      signal: controller.signal
    });

      // Handle different response structures
    let productsData = response.data;
    if (response.data?.data) {
      productsData = response.data.data;
    }

    const { products, pagination } = extractProductData(productsData);
    const result = {
      products: products.map((raw: Record<string, unknown>) => {
        const product = normalizeProduct(raw);
        return {
          ...product,
          imgs: transformImages(product),
          ...calculateReviews(product)
        };
      }),
      pagination: pagination as { page: number; limit: number; total: number } | null
    };


    if (typeof window !== 'undefined') {
      sessionStorage.setItem(cacheKey, JSON.stringify(result));
    }
    return result;
  } catch (error) {
    console.error("Error fetching product list:", error);
    return { products: [], pagination: null };
  }
}

export async function getMaxPrice(): Promise<number> {
  const cacheKey = getCacheKey('max-price');
  try {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    const controller = new AbortController();
    const response = await axiosInstance.get("/products/max-price", {
      signal: controller.signal
    });

    const result = response.data?.maxPrice || 0;

    if (typeof window !== 'undefined') {
      sessionStorage.setItem(cacheKey, JSON.stringify(result));
    }
    return result;
  } catch (error) {
    console.error("Error fetching max price:", error);
    return 0;
  }
}

export async function getRelatedProducts(categoryId: string): Promise<Product[]> {
  const cacheKey = getCacheKey('related-products', categoryId);
  try {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    const controller = new AbortController();
    const response = await axiosInstance.get(`/products/category/${categoryId}`, {
      signal: controller.signal
    });

    const { products } = extractProductData(response.data);
    const result = products.map((raw: Record<string, unknown>) => {
      const product = normalizeProduct(raw);
      return {
        ...product,
        imgs: transformImages(product),
        ...calculateReviews(product)
      };
    });

    if (typeof window !== 'undefined') {
      sessionStorage.setItem(cacheKey, JSON.stringify(result));
    }
    return result;
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}



export async function getLatestProducts(limit: number = 3): Promise<Product[]> {
  const cacheKey = getCacheKey('latest-products', String(limit));
  try {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    const controller = new AbortController();
    // Adjust endpoint as needed. This assumes your backend supports sorting and limiting.
    const response = await axiosInstance.get(`/products?sort=createdAt:desc&limit=${limit}`, {
      signal: controller.signal
    });

    const { products } = extractProductData(response.data);
    const result = products.map((raw: Record<string, unknown>) => {
      const product = normalizeProduct(raw);
      return {
        ...product,
        imgs: transformImages(product),
        ...calculateReviews(product)
      };
    });

    if (typeof window !== 'undefined') {
      sessionStorage.setItem(cacheKey, JSON.stringify(result));
    }
    return result;
  } catch (error) {
    console.error("Error fetching latest products:", error);
    return [];
  }

  
}

///dashborad methods 

function isValidObjectId(id: string) {
  return typeof id === "string" && /^[a-f\d]{24}$/i.test(id);
}

function isValidProductId(id: string) {
  // Accept both MongoDB ObjectIds and numeric IDs
  return typeof id === "string" && id.trim().length > 0 && (
    /^[a-f\d]{24}$/i.test(id) || // MongoDB ObjectId format
    /^\d+$/.test(id) // Numeric ID format
  );
}

/**
 * Toggle the published status of a product (admin only).
 * @param productId The product's _id
 */
export async function toggleProductStatus(productId: string): Promise<{ success: boolean; data: Product }> {
  if (!isValidObjectId(productId)) {
    throw new Error("Invalid product ID");
  }
  // Send an empty object as the body to avoid 400 error
  const response = await axiosInstance.patch(`/products/admin/${productId}/toggle-status`, {});
  return response.data;
}


export async function createProduct(productData: Partial<Product>, mainImageFile?: File | null, imageFiles?: File[]) {
  const formData = new FormData();
  // ...append fields as above...
  if (mainImageFile) formData.append("mainImage", mainImageFile);
  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((file) => formData.append("images", file));
  }
  const response = await axiosInstance.post("/products/admin/new", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}


export async function updateProduct(productId: string, productData: Partial<Product>, mainImageFile?: File | null, imageFiles?: File[]) {
  const formData = new FormData();
  // ...append fields as in createProduct...
  if (productData.designation) formData.append("designation", productData.designation);
  if (productData.price !== undefined) formData.append("price", String(productData.price));
  formData.append("oldPrice", String(productData.oldPrice || 0));
  // ...other fields...
  if (mainImageFile) formData.append("mainImage", mainImageFile);
  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((file) => formData.append("images", file));
  }
  const response = await axiosInstance.put(`/products/admin/update/${productId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function deleteProduct(productId: string): Promise<void> {
  await axiosInstance.delete(`/products/admin/delete/${productId}`);
}

/**
 * Fetch all products (for admin selection, e.g. Vente Flash).
 * Returns minimal info for selection lists.
 */
export async function getAllProducts(): Promise<{ _id: string; designation_fr?: string; name?: string; slug?: string }[]> {
  try {
    const response = await axiosInstance.get("/products/admin/all");
    // Adjust the endpoint if needed!
    // The backend should return an array of products with at least _id and designation_fr/name/slug
    return Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data?.products)
      ? response.data.products
      : [];
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
}

export async function getProductById(productId: string): Promise<Product | null> {
  if (!isValidProductId(productId)) {
    throw new Error("Invalid product ID");
  }
  try {
    const response = await axiosInstance.get(`/products/${productId}`);
    const rawProduct = response.data?.data || response.data?.product || response.data;
    if (!rawProduct) return null;

    const product = normalizeProduct(rawProduct);
    return {
      ...product,
      imgs: transformImages(product),
      ...calculateReviews(product)
    };
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
}