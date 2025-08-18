import { Product } from "../types/product";

export interface ProductListResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export async function fetchAllProducts(page: number = 1, limit: number = 10): Promise<ProductListResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/products?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch products");

  const data = await res.json();
  // Try to extract products and pagination from various possible response shapes
  let products: Product[] = [];
  let pagination = { page, limit, total: 0 };

  if (Array.isArray(data.products)) {
    products = data.products;
    if (data.pagination) pagination = data.pagination;
    else if (typeof data.total === 'number') pagination.total = data.total;
  } else if (data.data && Array.isArray(data.data.products)) {
    products = data.data.products;
    if (data.data.pagination) pagination = data.data.pagination;
    else if (typeof data.data.total === 'number') pagination.total = data.data.total;
  } else if (Array.isArray(data)) {
    products = data;
    pagination.total = data.length;
  }

  return { products, pagination };
}

// Fetch a single product by ID
export async function fetchProductById(id: string): Promise<Product> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  const data = await res.json();
  // Handle both { data: { ...product } } and { data: { products: [ ... ] } }
  if (data.data && Array.isArray(data.data.products) && data.data.products.length > 0) {
    return data.data.products[0];
  }
  if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
    return data.data;
  }
  if (data.product) return data.product;
  return data;
}


// Bulk create products
export async function createProductsBulk(products: Product[]): Promise<{ success: boolean; message: string; data?: Product[] }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/products/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(products),
  });
  if (!res.ok) throw new Error("Bulk import failed");
  return res.json();
}