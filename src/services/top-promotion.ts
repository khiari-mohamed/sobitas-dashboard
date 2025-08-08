import axiosInstance from "@/lib/axios";
import type { TopPromotion } from "@/types/top-promotion";

export async function getTopPromotions(): Promise<TopPromotion[]> {
  try {
    const response = await axiosInstance.get("/top-promotions/active");
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching top promotions:", error);
    return [];
  }
}