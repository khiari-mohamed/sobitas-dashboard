// services/newsletters.ts
import axiosInstance from '../lib/axios';
import { Newsletter } from '../types/newsletter-subscriber';

const RESOURCE = '/newsletters';

export const fetchNewsletters = async (): Promise<Newsletter[]> => {
  const { data } = await axiosInstance.get<Newsletter[]>(RESOURCE);
  return data;
};

export const fetchNewsletterById = async (id: string): Promise<Newsletter> => {
  const { data } = await axiosInstance.get<Newsletter>(`${RESOURCE}/${id}`);
  return data;
};

export const createNewsletter = async (newsletter: Omit<Newsletter, '_id'>): Promise<Newsletter> => {
  const { data } = await axiosInstance.post<Newsletter>(RESOURCE, newsletter);
  return data;
};

export const updateNewsletter = async (id: string, newsletter: Partial<Newsletter>): Promise<Newsletter> => {
  const { data } = await axiosInstance.patch<Newsletter>(`${RESOURCE}/${id}`, newsletter);
  return data;
};

export const deleteNewsletter = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${RESOURCE}/${id}`);
};

const newslettersService = {
  fetchNewsletters,
  fetchNewsletterById,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
};

export default newslettersService;