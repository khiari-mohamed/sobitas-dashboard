import axios from "@/lib/axios";
import { TopPromotion } from "@/types/toppromotion";

// Fetch all top promotion products
export const fetchAllTopPromotions = async (): Promise<TopPromotion[]> => {
  try {
    const res = await axios.get("/products");
    console.log("API Response:", res.data);
    
    // Handle different response structures
    if (res.data?.data?.products && Array.isArray(res.data.data.products)) {
      // Filter products with promotions (promo < prix)
      return res.data.data.products.filter((product: TopPromotion) => 
        product.promo && product.prix && Number(product.promo) < Number(product.prix)
      ) as TopPromotion[];
    }
    if (res.data?.data && Array.isArray(res.data.data)) {
      return res.data.data.filter((product: TopPromotion) => 
        product.promo && product.prix && Number(product.promo) < Number(product.prix)
      ) as TopPromotion[];
    }
    if (Array.isArray(res.data)) {
      return res.data.filter((product: TopPromotion) => 
        product.promo && product.prix && Number(product.promo) < Number(product.prix)
      ) as TopPromotion[];
    }
    if (res.data?.products && Array.isArray(res.data.products)) {
      return res.data.products.filter((product: TopPromotion) => 
        product.promo && product.prix && Number(product.promo) < Number(product.prix)
      ) as TopPromotion[];
    }
    
    console.log("No promotion products found in response");
    return [];
  } catch (error) {
    console.error("Error fetching top promotions:", error);
    return [];
  }
};

// Update a top promotion product
export const updateTopPromotion = async (id: string, payload: Partial<TopPromotion>) => {
  const res = await axios.patch(`/products/${id}`, payload);
  return res.data;
};

// Delete a top promotion product
export const deleteTopPromotion = async (id: string) => {
  const res = await axios.delete(`/products/${id}`);
  return res.data;
};