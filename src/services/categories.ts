import axios from '@/lib/axios';
import { isAxiosError } from 'axios';
import { Category } from '@/types/category';
export type { Category } from '@/types/category';
export const getCategories = async (): Promise<Category[]> => {
  try {
    const { data } = await axios.get('/categories');
    return data.map((cat: any) => ({
      ...cat,
      designation_fr: cat.designation_fr || cat.designation,
      products: cat.products || []
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  try {
    const { data } = await axios.get(`/categories/slug/${slug}`);
    
    if (!data) {
      throw new Error('Category not found');
    }

    // Build complete image URL if cover exists
    const coverUrl = data.cover 
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${data.cover}`
      : undefined;

    return {
      ...data,
      designation_fr: data.designation_fr || data.designation,
      cover: coverUrl,
      products: data.products || []
    };
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error);
    if (isAxiosError(error) && error.response?.status === 404) {
      throw new Error(`Category "${slug}" not found`);
    }
    throw error;
  }
};


// =======================
// === Dashboard Admin Functions (do not remove above) ===
// =======================

/**
 * Create a new category (Dashboard/Admin only)
 */
export const createCategory = async (categoryData: any, imageFile?: File | null) => {
  const formData = new FormData();
  formData.append("designation", categoryData.designation);
  formData.append("slug", categoryData.slug);
  if (imageFile) formData.append("image", imageFile);

  const response = await axios.post("/categories/new", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * Update a category (Dashboard/Admin only)
 */
export const updateCategory = async (id: string, categoryData: any, imageFile?: File | null) => {
  const formData = new FormData();
  formData.append("designation", categoryData.designation);
  formData.append("slug", categoryData.slug);
  if (imageFile) formData.append("image", imageFile);

  const response = await axios.put(`/categories/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};


/**
 * Delete a category (Dashboard/Admin only)
 */
export const deleteCategory = async (id: string) => {
  await axios.delete(`/categories/delete/${id}`);
};


