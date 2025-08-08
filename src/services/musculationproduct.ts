import axios from "@/lib/axios";
import { MusculationProduct } from "@/types/musculationproduct";

// Fetch all musculation products
export const fetchAllMusculationProducts = async (): Promise<MusculationProduct[]> => {
  try {
    const res = await axios.get("/musculation-products");
    console.log("API Response:", res.data);
    
    // Handle different response structures
    if (Array.isArray(res.data)) {
      return res.data as MusculationProduct[];
    }
    if (res.data?.data && Array.isArray(res.data.data)) {
      return res.data.data as MusculationProduct[];
    }
    if (res.data?.products && Array.isArray(res.data.products)) {
      return res.data.products as MusculationProduct[];
    }
    
    console.log("No musculation products found in response");
    return [];
  } catch (error) {
    console.error("Error fetching musculation products:", error);
    return [];
  }
};

// Update a musculation product
export const updateMusculationProduct = async (id: string, payload: Partial<MusculationProduct>) => {
  const res = await axios.put(`/musculation-products/update/${id}`, payload);
  return res.data;
};

// Delete a musculation product
export const deleteMusculationProduct = async (id: string) => {
  const res = await axios.delete(`/musculation-products/delete/${id}`);
  return res.data;
};