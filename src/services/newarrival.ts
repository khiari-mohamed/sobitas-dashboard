import axios from "@/lib/axios";
import { NewArrival } from "@/types/newarrival";

// Fetch all new arrival products
export const fetchAllNewArrivals = async (): Promise<NewArrival[]> => {
  try {
    const res = await axios.get("/products/store/new-arrivals");
    console.log("New arrivals response:", res.data);
    
    // Handle the response structure from the backend
    if (res.data?.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    if (res.data?.products && Array.isArray(res.data.products)) {
      return res.data.products;
    }
    if (Array.isArray(res.data)) {
      return res.data;
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return [];
  }
};

// Update a new arrival product
export const updateNewArrival = async (id: string, payload: Partial<NewArrival>) => {
  const res = await axios.put(`/products/admin/update/${id}`, payload);
  return res.data;
};

// Delete a new arrival product
export const deleteNewArrival = async (id: string) => {
  const res = await axios.delete(`/products/admin/delete/${id}`);
  return res.data;
};

// New Arrival Configuration Functions
export const getNewArrivalConfig = async () => {
  try {
    const res = await axios.get('/products/admin/newarrival-config');
    return res.data;
  } catch (error) {
    console.error('Error fetching new arrival config:', error);
    return null;
  }
};

export const updateNewArrivalConfig = async (config: { sectionTitle: string; sectionDescription: string; maxDisplay: number; showOnFrontend: boolean; productOrder: string[] }) => {
  try {
    const res = await axios.post('/products/admin/newarrival-config', config);
    return res.data;
  } catch (error) {
    console.error('Error updating new arrival config:', error);
    throw error;
  }
};

export const updateNewArrivalOrder = async (productOrder: string[]) => {
  try {
    const res = await axios.put('/products/admin/newarrival-order', { productOrder });
    return res.data;
  } catch (error) {
    console.error('Error updating new arrival order:', error);
    throw error;
  }
};