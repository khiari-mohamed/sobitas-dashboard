import axiosInstance from '../lib/axios';
import { Coordinates } from '../types/coordinates';

const API_URL = '/coordinates';

export const fetchCoordinates = async (): Promise<Coordinates[]> => {
  const { data } = await axiosInstance.get<Coordinates[]>(API_URL);
  return data;
};

export const fetchCoordinateById = async (id: string): Promise<Coordinates> => {
  const { data } = await axiosInstance.get<Coordinates>(`${API_URL}/${id}`);
  return data;
};

export const createCoordinate = async (coordinate: any): Promise<Coordinates> => {
  // Handle file uploads first
  const formData: any = { ...coordinate };
  
  // Upload files if they exist
  for (const [key, value] of Object.entries(coordinate)) {
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
  const { data } = await axiosInstance.post<Coordinates>(API_URL, cleanData);
  return data;
};

export const updateCoordinate = async (id: string, coordinate: any): Promise<Coordinates> => {
  const formData = new FormData();
  
  // Add all fields to FormData
  for (const [key, value] of Object.entries(coordinate)) {
    if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
      if (value && typeof value === 'object' && value.constructor === File) {
        formData.append(key, value as File);
      } else if (value !== undefined && value !== '') {
        formData.append(key, String(value));
      }
    }
  }
  
  const { data } = await axiosInstance.put<Coordinates>(`${API_URL}/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const deleteCoordinate = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${API_URL}/${id}`);
};

const coordinatesService = {
  fetchCoordinates,
  fetchCoordinateById,
  createCoordinate,
  updateCoordinate,
  deleteCoordinate,
};

export default coordinatesService;