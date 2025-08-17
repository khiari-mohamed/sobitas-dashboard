/*import axios from "@/lib/axios";
import { TopPromotion } from "@/types/toppromotion";

// Fetch all top promotion products
export const fetchAllTopPromotions = async (): Promise<TopPromotion[]> => {
  try {
    const res = await axios.get("/top-promotions");
    return res.data?.data || [];
  } catch (error) {
    console.error("Error fetching top promotions:", error);
    return [];
  }
};

// Update a top promotion product with file support
export const updateTopPromotion = async (id: string, payload: any) => {
  const formData = new FormData();
  
  // Add all fields to FormData
  for (const [key, value] of Object.entries(payload)) {
    if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
      if (value && typeof value === 'object' && value.constructor === File) {
        formData.append(key, value as File);
      } else if (value !== undefined && value !== '') {
        formData.append(key, String(value));
      }
    }
  }
  
  const res = await axios.put(`/top-promotions/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

// Create a top promotion product
export const createTopPromotion = async (payload: any) => {
  const cleanData = Object.fromEntries(
    Object.entries(payload).filter(([_, value]) => value !== undefined && value !== '')
  );
  const res = await axios.post("/top-promotions", cleanData);
  return res.data;
};

// Delete a top promotion product
export const deleteTopPromotion = async (id: string) => {
  const res = await axios.delete(`/top-promotions/${id}`);
  return res.data;
};

// Get section configuration
export const getSectionConfig = async () => {
  const res = await axios.get('/top-promotions/config/section');
  return res.data?.data || { maxDisplay: 4, sectionTitle: 'Top Promos', sectionDescription: 'Profitez de nos meilleures offres du moment sur une sélection de produits !', showOnFrontend: true };
};

// Update section configuration
export const updateSectionConfig = async (config: any) => {
  const res = await axios.put('/top-promotions/config/section', config);
  return res.data;
};

*/