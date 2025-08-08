import axios from "@/lib/axios";
import { VenteFlash } from "@/types/venteflash";

// Fetch all vente flash products
export const fetchAllVenteFlash = async (): Promise<VenteFlash[]> => {
  try {
    const res = await axios.get("/vente-flash");
    console.log("API Response:", res.data);
    
    // Handle different response structures
    if (Array.isArray(res.data)) {
      return res.data as VenteFlash[];
    }
    if (res.data?.data && Array.isArray(res.data.data)) {
      return res.data.data as VenteFlash[];
    }
    if (res.data?.products && Array.isArray(res.data.products)) {
      return res.data.products as VenteFlash[];
    }
    
    console.log("No vente flash products found in response");
    return [];
  } catch (error) {
    console.error("Error fetching vente flash:", error);
    return [];
  }
};

// Update a vente flash product
export const updateVenteFlash = async (id: string, payload: Partial<VenteFlash>) => {
  const res = await axios.patch(`/products/${id}`, payload);
  return res.data;
};

// Delete a vente flash product
export const deleteVenteFlash = async (id: string) => {
  const res = await axios.delete(`/products/${id}`);
  return res.data;
};