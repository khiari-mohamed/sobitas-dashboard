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
    const formData = new FormData();
    Object.keys(categoryData).forEach(key => {
      const value = categoryData[key];
      // Only send fields that are not empty, not null, not undefined
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, String(value));
      }
    });
    if (imageFile) formData.append("file", imageFile);

    // Do NOT set Content-Type header manually!
    const response = await axios.post("/categories", formData);
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
    
    if (imageFile) {
      // If there's a file, use FormData with PUT
      const formData = new FormData();
      Object.keys(categoryData).forEach(key => {
        const value = categoryData[key];
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      formData.append("file", imageFile);
      
      console.log('Sending PUT request with file to:', `http://localhost:5000/categories/${id}`);
      const response = await fetch(`http://localhost:5000/categories/${id}`, {
        method: 'PUT',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Update response:', data);
      return data;
    } else {
      // If no file, use FormData with PUT (same as with file but no file attached)
      const formData = new FormData();
      Object.keys(categoryData).forEach(key => {
        const value = categoryData[key];
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      
      console.log('Sending PUT request without file via axios to:', `/categories/${id}`);
      const response = await axios.put(`/categories/${id}`, formData);
      
      console.log('Update response:', response.data);
      return response.data;
    }
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