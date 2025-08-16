// services/services.ts
import axiosInstance from '../lib/axios';
import { ServiceItem } from '../types/services';

const RESOURCE = '/services';

export const fetchServices = async (): Promise<ServiceItem[]> => {
  const { data } = await axiosInstance.get<ServiceItem[]>(RESOURCE);
  return data;
};

export const fetchServiceById = async (id: string): Promise<ServiceItem> => {
  const { data } = await axiosInstance.get<ServiceItem>(`${RESOURCE}/${id}`);
  return data;
};

export const createService = async (service: any): Promise<ServiceItem> => {
  // Handle file uploads first
  const formData: any = { ...service };
  
  // Upload files if they exist
  for (const [key, value] of Object.entries(service)) {
    if (value && typeof value === 'object' && value.constructor === File) {
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
    Object.entries(formData).filter(([_, value]) => value !== undefined && value !== '' && !(value && typeof value === 'object' && value.constructor === File))
  );
  const { data } = await axiosInstance.post<ServiceItem>(RESOURCE, cleanData);
  return data;
};

export const updateService = async (id: string, service: any): Promise<ServiceItem> => {
  const formData = new FormData();
  
  // Add all fields to FormData
  for (const [key, value] of Object.entries(service)) {
    if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
      if (value && typeof value === 'object' && value.constructor === File) {
        formData.append(key, value as File);
      } else if (value !== undefined && value !== '') {
        formData.append(key, String(value));
      }
    }
  }
  
  const { data } = await axiosInstance.put<ServiceItem>(`${RESOURCE}/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const deleteService = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${RESOURCE}/${id}`);
};

const servicesService = {
  fetchServices,
  fetchServiceById,
  createService,
  updateService,
  deleteService,
};

export default servicesService;