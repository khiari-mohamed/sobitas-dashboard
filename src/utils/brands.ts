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
export const createBrand = async (brand: Partial<Brand>): Promise<Brand> => {
  // You may need to adjust the endpoint and payload as per your backend
  const res = await axios.post("/brands", brand);
  return res.data;
};

// Update a brand
export const updateBrand = async (id: string, brand: Partial<Brand>): Promise<Brand> => {
  const res = await axios.put(`/brands/${id}`, brand);
  return res.data;
};

// Delete a brand
export const deleteBrand = async (id: string): Promise<void> => {
  await axios.delete(`/brands/${id}`);
};

// Get a single brand by ID
export const fetchBrandById = async (id: string): Promise<Brand> => {
  return await getBrandById(id);
};