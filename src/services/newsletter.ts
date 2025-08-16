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

export const createNewsletter = async (newsletter: any): Promise<Newsletter> => {
  const cleanData = Object.fromEntries(
    Object.entries(newsletter).filter(([_, value]) => value !== undefined && value !== '')
  );
  const { data } = await axiosInstance.post<Newsletter>(RESOURCE, cleanData);
  return data;
};

export const updateNewsletter = async (id: string, newsletter: any): Promise<Newsletter> => {
  const cleanData = Object.fromEntries(
    Object.entries(newsletter).filter(([key, value]) => 
      value !== undefined && 
      value !== '' && 
      key !== '_id' && 
      key !== '__v' && 
      key !== 'createdAt' && 
      key !== 'updatedAt'
    )
  );
  const { data } = await axiosInstance.put<Newsletter>(`${RESOURCE}/${id}`, cleanData);
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