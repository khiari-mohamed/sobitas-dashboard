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
  if (logoFile) {
    const formData = new FormData();
    Object.entries(brand).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    });
    formData.append('logo', logoFile);
    const res = await axios.post("/brands", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  } else {
    const res = await axios.post("/brands", brand);
    return res.data;
  }
};

// Update a brand
export const updateBrand = async (id: string, brand: Partial<Brand>, logoFile?: File | null): Promise<Brand> => {
  if (logoFile) {
    const formData = new FormData();
    Object.entries(brand).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    });
    formData.append('logo', logoFile);
    const res = await axios.put(`/brands/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  } else {
    const res = await axios.put(`/brands/${id}`, brand);
    return res.data;
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