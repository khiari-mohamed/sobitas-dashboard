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

// Create a new pack with file support
export const createPack = async (payload: Partial<Pack>, file?: File) => {
  const formData = new FormData();
  
  // Add all form fields to FormData (only simple values)
  Object.keys(payload).forEach(key => {
    const value = payload[key as keyof Pack];
    if (value !== null && value !== undefined && value !== '') {
      // Only add simple string/number values, skip complex objects and arrays
      if (typeof value === 'string' || typeof value === 'number') {
        formData.append(key, value.toString());
      }
    }
  });
  
  // Add file if provided
  if (file) {
    formData.append('files', file);
  }
  
  const res = await axios.post("/admin/packs/admin/new-with-file", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// Update a pack with file support
export const updatePack = async (id: string, payload: Partial<Pack>, file?: File) => {
  const formData = new FormData();
  
  // Add all form fields to FormData (only simple values)
  Object.keys(payload).forEach(key => {
    const value = payload[key as keyof Pack];
    if (value !== null && value !== undefined && value !== '') {
      // Only add simple string/number values, skip complex objects and arrays
      if (typeof value === 'string' || typeof value === 'number') {
        formData.append(key, value.toString());
      }
    }
  });
  
  // Add file if provided
  if (file) {
    formData.append('files', file);
  }
  
  const res = await axios.put(`/admin/packs/admin/update-with-file/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// Delete a pack
export const deletePack = async (id: string) => {
  console.log('Deleting pack:', id);
  try {
    const res = await axios.delete(`/admin/packs/admin/delete/${id}`);
    return res.data;
  } catch (error: any) {
    console.error('Delete pack error:', error.response?.data || error.message);
    throw error;
  }
};

// Bulk delete packs
export const bulkDeletePacks = async (ids: string[]) => {
  console.log('Bulk deleting packs:', ids);
  try {
    const res = await axios.post('/admin/packs/admin/delete/many', ids, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (error: any) {
    console.error('Bulk delete error:', error.response?.data || error.message);
    throw error;
  }
};

// Get frontend pack configuration
export const getFrontendPackConfig = async () => {
  try {
    const res = await axios.get('/admin/packs/frontend/config');
    return res.data;
  } catch (error: any) {
    console.error('Frontend config error:', error.response?.data || error.message);
    throw error;
  }
};

