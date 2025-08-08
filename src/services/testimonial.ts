import axios from "@/lib/axios";
import { Testimonial } from "@/types/testimonial";

// Fetch all testimonials
export const fetchAllTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const res = await axios.get("/reviews");
    console.log("API Response:", res.data);
    
    // Handle different response structures
    if (Array.isArray(res.data)) {
      return res.data.map((item: any) => ({
        ...item,
        authorName: item.user?.name || item.authorName || "Utilisateur",
        authorRole: item.user?.role || item.authorRole || "",
        authorImg: item.user?.avatar || item.authorImg || "",
        review: item.comment || item.review || "",
      })) as Testimonial[];
    }
    if (res.data?.data && Array.isArray(res.data.data)) {
      return res.data.data.map((item: any) => ({
        ...item,
        authorName: item.user?.name || item.authorName || "Utilisateur",
        authorRole: item.user?.role || item.authorRole || "",
        authorImg: item.user?.avatar || item.authorImg || "",
        review: item.comment || item.review || "",
      })) as Testimonial[];
    }
    if (res.data?.reviews && Array.isArray(res.data.reviews)) {
      return res.data.reviews.map((item: any) => ({
        ...item,
        authorName: item.user?.name || item.authorName || "Utilisateur",
        authorRole: item.user?.role || item.authorRole || "",
        authorImg: item.user?.avatar || item.authorImg || "",
        review: item.comment || item.review || "",
      })) as Testimonial[];
    }
    
    console.log("No testimonials found in response");
    return [];
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
};

// Update a testimonial
export const updateTestimonial = async (id: string, payload: Partial<Testimonial>) => {
  const res = await axios.patch(`/reviews/${id}`, payload);
  return res.data;
};

// Delete a testimonial
export const deleteTestimonial = async (id: string) => {
  const res = await axios.delete(`/reviews/${id}`);
  return res.data;
};