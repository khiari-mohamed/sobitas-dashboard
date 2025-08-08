import axios from "@/lib/axios";
import { BestSeller } from "@/types/bestseller";

// Fetch all best seller products
export const fetchAllBestSellers = async (): Promise<BestSeller[]> => {
  try {
    const res = await axios.get("/products");
    console.log("API Response:", res.data);
    
    // Handle different response structures
    if (res.data?.data?.products && Array.isArray(res.data.data.products)) {
      return res.data.data.products as BestSeller[];
    }
    if (res.data?.data && Array.isArray(res.data.data)) {
      return res.data.data as BestSeller[];
    }
    if (Array.isArray(res.data)) {
      return res.data as BestSeller[];
    }
    if (res.data?.products && Array.isArray(res.data.products)) {
      return res.data.products as BestSeller[];
    }
    
    console.log("No products found in response");
    return [];
  } catch (error) {
    console.error("Error fetching best sellers:", error);
    return [];
  }
};

// Update a best seller product
export const updateBestSeller = async (id: string, payload: Partial<BestSeller>) => {
  const res = await axios.patch(`/products/${id}`, payload);
  return res.data;
};

// Delete a best seller product
export const deleteBestSeller = async (id: string) => {
  const res = await axios.delete(`/products/${id}`);
  return res.data;
};