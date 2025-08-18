import axios from "@/lib/axios";
import { Testimonial } from "@/types/testimonial";

// Fetch all testimonials
export const fetchAllTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const res = await axios.get("/reviews/testimonials");
    console.log("API Response:", res.data);
    
    // Handle different response structures
    if (Array.isArray(res.data)) {
      return res.data.map((item: Testimonial) => ({
        ...item,
        _id: item._id || item.id,
        authorName: item.user?.name || item.authorName || "Utilisateur",
        authorRole: item.user?.role || item.authorRole || "",
        authorImg: item.user?.avatar || item.authorImg || "",
        review: item.comment || item.review || "",
      })) as Testimonial[];
    }
    if (res.data?.data && Array.isArray(res.data.data)) {
      return res.data.data.map((item: Testimonial) => ({
        ...item,
        _id: item._id || item.id,
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
  try {
    const res = await axios.put(`/reviews/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw error;
  }
};

// Delete a testimonial
export const deleteTestimonial = async (id: string) => {
  const res = await axios.delete(`/reviews/${id}`);
  return res.data;
};

// Testimonial configuration API calls
export const fetchTestimonialConfig = async () => {
  try {
    // Try API first
    const res = await axios.get("/testimonial/config");
    console.log('Fetched config from API:', res.data);
    return res.data;
  } catch (error) {
    console.error("API not available, using localStorage:", error);
    // Fallback to localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('testimonialConfig');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  }
};

export const saveTestimonialConfig = async (config: { sectionTitle: string; sectionDescription: string; maxDisplay: number; showOnFrontend: boolean; testimonialOrder: string[] }) => {
  try {
    console.log('Sending config to API:', config);
    const res = await axios.post("/testimonial/config", config);
    console.log('API response:', res.data);
    return res.data;
  } catch (error) {
    console.error("API not available, using localStorage:", error);
    // Fallback to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('testimonialConfig', JSON.stringify(config));
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('testimonialConfigChanged', { detail: config }));
    }
    return { success: true, data: config };
  }
};