import axios from "@/lib/axios";
import { Pack } from "@/types/pack";

// Fetch a pack by slug
export const getPackById = async (id: string): Promise<Pack | null> => {
  try {
    const res = await axios.get(`/admin/packs/get/${id}`);
    return res.data.data || null;
  } catch (e) {
    return null;
  }
};

export const fetchAllPacks = async (): Promise<Pack[]> => {
  const res = await axios.get("/admin/packs/raw");
  return res.data.data as Pack[];
};

// Create a new pack
export const createPack = async (payload: Partial<Pack>) => {
  const res = await axios.post("/admin/packs/new", payload);
  return res.data;
};

// Update a pack
export const updatePack = async (id: string, payload: Partial<Pack>) => {
  const res = await axios.patch(`/admin/packs/${id}`, payload);
  return res.data;
};

// Delete a pack
export const deletePack = async (id: string) => {
  const res = await axios.delete(`/admin/packs/delete/${id}`);
  return res.data;
};

