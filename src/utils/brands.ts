import {
  getAllBrands as fetchAllBrands,
  getBrandById,
} from "@/services/brand";
import { Brand } from "@/types/brand";
import axios from "@/lib/axios";

// Fetch all brands
export const getAllBrands = async (): Promise<Brand[]> => {
  return await fetchAllBrands();
};

// Create a new brand
export const createBrand = async (brand: Partial<Brand>, logoFile?: File | null): Promise<Brand> => {
  try {
    // Always use FormData to handle both cases
    const formData = new FormData();
    
    // Add all form fields
    Object.entries(brand).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value as string);
      }
    });
    
    // Add file if provided
    if (logoFile) {
      formData.append('file', logoFile);
    }

    // Use the working endpoint
    const res = await axios.post("/brands/admin/new-with-file", formData);
    return res.data;
  } catch (error) {
    console.error('Create brand error:', error);
    throw error;
  }
};

// Update a brand
export const updateBrand = async (id: string, brand: Partial<Brand>, logoFile?: File | null): Promise<Brand> => {
  try {
    // Always use FormData to handle both cases
    const formData = new FormData();
    
    // Add all form fields
    Object.entries(brand).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    });
    
    // Add file if provided
    if (logoFile) {
      formData.append('file', logoFile);
    }

    // Use the working endpoint
    const res = await axios.put(`/brands/admin/update-with-file/${id}`, formData);
    return res.data;
  } catch (error) {
    console.error('Update brand error:', error);
    throw error;
  }
};

// Delete a brand
export const deleteBrand = async (id: string): Promise<void> => {
  await axios.delete(`/brands/${id}`);
};

// Get a single brand by ID
export const fetchBrandById = async (id: string): Promise<Brand> => {
  return await getBrandById(id);
};