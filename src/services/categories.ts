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
  try {
    // Always use FormData to handle both cases
    const formData = new FormData();
    
    // Add all form fields
    Object.keys(categoryData).forEach(key => {
      const value = categoryData[key];
      // Only send fields that are not empty, not null, not undefined
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, String(value));
      }
    });
    
    // Add file if provided
    if (imageFile) {
      formData.append("file", imageFile);
    }

    // Use the working endpoint
    const response = await axios.post("/categories/admin/new-with-file", formData);
    return response.data;
  } catch (error) {
    console.error('Create category error:', error);
    throw error;
  }
};

/**
 * Update a category (Dashboard/Admin only)
 */
export const updateCategory = async (id: string, categoryData: any, imageFile?: File | null) => {
  try {
    console.log('Updating category:', id, categoryData, 'hasFile:', !!imageFile);
    
    // Always use FormData to handle both cases
    const formData = new FormData();
    
    // Add all form fields
    Object.keys(categoryData).forEach(key => {
      const value = categoryData[key];
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    
    // Add file if provided
    if (imageFile) {
      formData.append("file", imageFile);
    }

    // Use the working endpoint
    const response = await axios.put(`/categories/admin/update-with-file/${id}`, formData);
    console.log('Update response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Update category error:', error);
    throw error;
  }
};

/**
 * Delete a category (Dashboard/Admin only)
 */
export const deleteCategory = async (id: string) => {
  try {
    const response = await axios.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete category error:', error);
    throw error;
  }
};