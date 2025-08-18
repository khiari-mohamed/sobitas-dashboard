// services/slides.ts
import axiosInstance from '../lib/axios';
import { Slide } from '../types/slides';

const RESOURCE = '/slides';

export const fetchSlides = async (): Promise<Slide[]> => {
  const { data } = await axiosInstance.get<Slide[]>(RESOURCE);
  return data;
};

export const fetchSlideById = async (id: string): Promise<Slide> => {
  const { data } = await axiosInstance.get<Slide>(`${RESOURCE}/${id}`);
  return data;
};

export const createSlide = async (slide: Partial<Slide>): Promise<Slide> => {
  // Handle file uploads first
  const formData: Record<string, unknown> = { ...slide };
  
  // Upload files if they exist
  for (const [key, value] of Object.entries(slide)) {
    if (value && typeof value === 'object' && 'name' in value && 'size' in value) {
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
    Object.entries(formData).filter(([, value]) => value !== undefined && value !== '' && !(value && typeof value === 'object' && 'name' in value && 'size' in value))
  );
  const { data } = await axiosInstance.post<Slide>(RESOURCE, cleanData);
  return data;
};

export const updateSlide = async (id: string, slide: Partial<Slide>): Promise<Slide> => {
  const formData = new FormData();
  
  // Add all fields to FormData
  for (const [key, value] of Object.entries(slide)) {
    if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
      if (value && typeof value === 'object' && 'name' in value && 'size' in value) {
        formData.append(key, value as File);
      } else if (value !== undefined && value !== '') {
        formData.append(key, String(value));
      }
    }
  }
  
  const { data } = await axiosInstance.put<Slide>(`${RESOURCE}/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const deleteSlide = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${RESOURCE}/${id}`);
};

const slidesService = {
  fetchSlides,
  fetchSlideById,
  createSlide,
  updateSlide,
  deleteSlide,
};

export default slidesService;