import axios from "@/lib/axios";
import { NewArrival } from "@/types/newarrival";

// Fetch all new arrival products
export const fetchAllNewArrivals = async (): Promise<NewArrival[]> => {
  try {
    const res = await axios.get("/products/store/new-arrivals");
    console.log("API Response:", res.data);
    
    // Handle different response structures
    if (res.data?.data?.products && Array.isArray(res.data.data.products)) {
      return res.data.data.products as NewArrival[];
    }
    if (res.data?.data && Array.isArray(res.data.data)) {
      return res.data.data as NewArrival[];
    }
    if (Array.isArray(res.data)) {
      return res.data as NewArrival[];
    }
    if (res.data?.products && Array.isArray(res.data.products)) {
      return res.data.products as NewArrival[];
    }
    
    console.log("No new arrival products found in response");
    return [];
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return [];
  }
};

// Update a new arrival product
export const updateNewArrival = async (id: string, payload: Partial<NewArrival>) => {
  const res = await axios.patch(`/products/${id}`, payload);
  return res.data;
};

// Delete a new arrival product
export const deleteNewArrival = async (id: string) => {
  const res = await axios.delete(`/products/${id}`);
  return res.data;
};