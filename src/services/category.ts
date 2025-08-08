import axios from "@/lib/axios";
import { Category } from "@/types/category";

// Fetch all categories (for frontend control only)
export const fetchAllCategoriesForControl = async (): Promise<Category[]> => {
  try {
    const res = await axios.get("/categories");
    console.log("API Response:", res.data);
    
    // Handle different response structures
    if (Array.isArray(res.data)) {
      return res.data.map((cat: any) => ({
        ...cat,
        designation_fr: cat.designation_fr || cat.designation,
        title: cat.title || cat.designation_fr || cat.designation,
      })) as Category[];
    }
    if (res.data?.data && Array.isArray(res.data.data)) {
      return res.data.data.map((cat: any) => ({
        ...cat,
        designation_fr: cat.designation_fr || cat.designation,
        title: cat.title || cat.designation_fr || cat.designation,
      })) as Category[];
    }
    if (res.data?.categories && Array.isArray(res.data.categories)) {
      return res.data.categories.map((cat: any) => ({
        ...cat,
        designation_fr: cat.designation_fr || cat.designation,
        title: cat.title || cat.designation_fr || cat.designation,
      })) as Category[];
    }
    
    console.log("No categories found in response");
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// Update a category (for frontend control only)
export const updateCategoryForControl = async (id: string, payload: Partial<Category>) => {
  const res = await axios.put(`/categories/update/${id}`, payload);
  return res.data;
};

// Delete a category (for frontend control only)
export const deleteCategoryForControl = async (id: string) => {
  const res = await axios.delete(`/categories/delete/${id}`);
  return res.data;
};