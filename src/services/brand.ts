// src/services/brands.ts
import axios from '@/lib/axios';
import { Brand } from '@/types/brand';

export const getAllBrands = async (): Promise<Brand[]> => {
  const res = await axios.get('/brands');
  return res.data;
};

export const getBrandById = async (id: string): Promise<Brand> => {
  const res = await axios.get(`/brands/${id}`);
  return res.data;
};

export const getAromasForBrand = async (brandId: string) => {
  const res = await axios.get(`/brands/${brandId}/aromas`);
  return res.data;
};

// Additional functions for frontend control (separate from existing functionality)
export const fetchAllBrandsForControl = async (): Promise<Brand[]> => {
  try {
    const res = await axios.get("/brands");
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};

export const updateBrandForControl = async (id: string, payload: Partial<Brand>) => {
  const res = await axios.put(`/brands/${id}`, payload);
  return res.data;
};

export const deleteBrandForControl = async (id: string) => {
  const res = await axios.delete(`/brands/${id}`);
  return res.data;
};