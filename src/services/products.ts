// src/services/products.ts
"use server";
import axiosInstance from "../lib/axios";
import { Product, FlashSaleProduct } from "../types/product";
export type { Product } from "../types/product";

type Pagination = {
  page: number;
  limit: number;
  total: number;
};

type ProductListResponse = {
  products: Product[];
  pagination: Pagination;
};

// Type guard for product responses
function isProductResponse(data: any): data is ProductListResponse {
  return (
    Array.isArray(data?.products) &&
    typeof data?.pagination === "object" &&
    data.pagination !== null
  );
}

// Normalization function to map backend fields to frontend Product type
function normalizeProduct(raw: any): Product {
  return {
    title: raw.title || raw.designation_fr || raw.designation || "",
    price: Number(raw.price ?? raw.prix ?? 0),
    discountedPrice: Number(raw.discountedPrice ?? raw.promo ?? raw.promo_ht ?? raw.price ?? raw.prix ?? 0),
    id: Number(raw.id ?? raw._id ?? 0),
    imgs: {
      thumbnails: raw.images?.map((img: any) => img.url) || (raw.mainImage?.url ? [raw.mainImage.url] : []),
      previews: raw.images?.map((img: any) => img.url) || (raw.mainImage?.url ? [raw.mainImage.url] : []),
    },
    currency: raw.currency || "TND",
    _id: raw._id || "",
    designation: raw.designation || "",
    slug: raw.slug || "",
    oldPrice: Number(raw.oldPrice ?? raw.prix_ht ?? raw.promo ?? 0) || undefined,
    mainImage: raw.mainImage || { url: "" },
    images: raw.images || [],
    inStock: raw.inStock ?? (raw.rupture === "0" ? true : false),
    reviews: raw.reviews || [],
    features: raw.features || [],
    aroma_ids: raw.aroma_ids || [],
    brand: raw.brand || "",
    //smallDescription: raw.smallDescription || raw.meta_description_fr || "",
    smallDescription: raw.smallDescription || raw.description_cover || "",
    //description: raw.description || "",
    description: raw.description || raw.description_fr || "",
    meta_description_fr: raw.meta_description_fr || "",
    category: raw.category || "",
    subCategory: raw.subCategory || [],
    venteflashDate: raw.venteflashDate || undefined,
    isFlashSale: raw.isFlashSale || false,
    discountPercentage: raw.discountPercentage || undefined,
    type: raw.type || "",
    isNewProduct:
      raw.isNewProduct !== undefined
        ? raw.isNewProduct
        : raw.isNewArrival !== undefined
        ? raw.isNewArrival
        : raw.new_product === "1",
    isBestSeller:
      raw.isBestSeller !== undefined
        ? raw.isBestSeller
        : raw.bestSellerSection !== undefined
        ? raw.bestSellerSection
        : raw.best_seller === "1",
    isOutOfStock: raw.isOutOfStock ?? (raw.rupture === "1" ? true : false),
    isPublished:
      raw.isPublished !== undefined
        ? raw.isPublished
        : raw.publier === "1",
    aggregateRating: raw.aggregateRating ?? (raw.note ? Number(raw.note) : undefined),
    promoExpirationDate: raw.promoExpirationDate ?? raw.promo_expiration_date ?? undefined,
    sous_categorie_id: raw.sous_categorie_id ?? raw.sousCategorieId ?? raw.subCategoryId ?? "",
    cover: raw.cover || raw.mainImage?.url || "",
    nutrition_values: raw.nutrition_values || "",
questions: raw.questions || "",

zone1: raw.zone1 || "",
zone2: raw.zone2 || "",
zone3: raw.zone3 || "",
zone4: raw.zone4 || "",
content_seo: raw.content_seo || raw.contentSeo || "",
meta: raw.meta || "",
pack: raw.pack || "",
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
const extractProductData = (data: any) => {
  // Case 1: { products: [...] }
  if (Array.isArray(data?.products)) {
    return {
      products: data.products,
      pagination: data.pagination ?? null
    };
  }
  // Case 2: { data: { products: [...] } }
  if (Array.isArray(data?.data?.products)) {
    return {
      products: data.data.products,
      pagination: data.data.pagination ?? data.pagination ?? null
    };
  }
  // Case 3: { data: [...] }
  if (Array.isArray(data?.data)) {
    return {
      products: data.data,
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
    const result = products.map(raw => {
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
    const result = products.map(raw => {
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
    const result = products.map(raw => {
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
    const result = products.map(raw => {
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
  pagination: any;
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
      products: products.map(raw => {
        const product = normalizeProduct(raw);
        return {
          ...product,
          imgs: transformImages(product),
          ...calculateReviews(product)
        };
      }),
      pagination
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
    const result = products.map(raw => {
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
    const result = products.map(raw => {
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
export async function toggleProductStatus(productId: string): Promise<any> {
  if (!isValidObjectId(productId)) {
    throw new Error("Invalid product ID");
  }
  // Send an empty object as the body to avoid 400 error
  const response = await axiosInstance.patch(`/products/admin/${productId}/toggle-status`, {});
  return response.data;
}


export async function createProduct(productData: any, mainImageFile?: File | null, imageFiles?: File[]) {
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


export async function updateProduct(productId: string, productData: any, mainImageFile?: File | null, imageFiles?: File[]) {
  const formData = new FormData();
  // ...append fields as in createProduct...
  formData.append("designation", productData.designation);
  formData.append("price", String(productData.price));
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
  await axiosInstance.delete(`/products/${productId}`);
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