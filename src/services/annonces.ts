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

export const createAnnonce = async (annonce: Omit<Annonce, '_id'>): Promise<Annonce> => {
  const { data } = await axiosInstance.post<Annonce>(RESOURCE, annonce);
  return data;
};

export const updateAnnonce = async (id: string, annonce: Partial<Annonce>): Promise<Annonce> => {
  const { data } = await axiosInstance.patch<Annonce>(`${RESOURCE}/${id}`, annonce);
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