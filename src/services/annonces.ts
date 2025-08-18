// services/annonces.ts
import axiosInstance from '../lib/axios';
import { Annonce } from '../types/annonces';

const RESOURCE = '/annonces';

export const fetchAnnonces = async (): Promise<Annonce[]> => {
  const { data } = await axiosInstance.get<Annonce[]>(RESOURCE);
  return data;
};

export const fetchAnnonceById = async (id: string): Promise<Annonce> => {
  const { data } = await axiosInstance.get<Annonce>(`${RESOURCE}/${id}`);
  return data;
};

export const createAnnonce = async (annonce: Record<string, unknown>): Promise<Annonce> => {
  // Handle file uploads first
  const formData: Record<string, unknown> = { ...annonce };
  
  // Upload files if they exist
  for (const [key, value] of Object.entries(annonce)) {
    if (value instanceof File) {
      try {
        const uploadFormData = new FormData();
        uploadFormData.append('file', value as File);
        const uploadResponse = await axiosInstance.post('/upload/image', uploadFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        formData[key] = uploadResponse.data.url;
      } catch (error) {
        console.error(`Failed to upload ${key}:`, error);
        delete formData[key];
      }
    }
  }
  
  const cleanData = Object.fromEntries(
    Object.entries(formData).filter(([_, value]) => value !== undefined && value !== '' && !(value instanceof File))
  );
  const { data } = await axiosInstance.post<Annonce>(RESOURCE, cleanData);
  return data;
};

export const updateAnnonce = async (id: string, annonce: Record<string, unknown>): Promise<Annonce> => {
  const formData = new FormData();
  
  // Add all fields to FormData
  for (const [key, value] of Object.entries(annonce)) {
    if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
      if (value instanceof File) {
        formData.append(key, value as File);
      } else if (value !== undefined && value !== '') {
        formData.append(key, String(value));
      }
    }
  }
  
  const { data } = await axiosInstance.put<Annonce>(`${RESOURCE}/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const deleteAnnonce = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${RESOURCE}/${id}`);
};

const annoncesService = {
  fetchAnnonces,
  fetchAnnonceById,
  createAnnonce,
  updateAnnonce,
  deleteAnnonce,
};

export default annoncesService;