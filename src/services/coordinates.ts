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

export const createCoordinate = async (coordinate: Omit<Coordinates, '_id'>): Promise<Coordinates> => {
  const { data } = await axiosInstance.post<Coordinates>(API_URL, coordinate);
  return data;
};

export const updateCoordinate = async (id: string, coordinate: Partial<Coordinates>): Promise<Coordinates> => {
  const { data } = await axiosInstance.patch<Coordinates>(`${API_URL}/${id}`, coordinate);
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