// services/seo-pages.ts
import axiosInstance from '../lib/axios';
import { SeoPage } from '../types/seo-pages';

const RESOURCE = '/seo-pages';

export const fetchSeoPages = async (): Promise<SeoPage[]> => {
  const { data } = await axiosInstance.get<SeoPage[]>(RESOURCE);
  return data;
};

export const fetchSeoPageById = async (id: string): Promise<SeoPage> => {
  const { data } = await axiosInstance.get<SeoPage>(`${RESOURCE}/${id}`);
  return data;
};

export const createSeoPage = async (seoPage: any): Promise<SeoPage> => {
  const cleanData = Object.fromEntries(
    Object.entries(seoPage).filter(([_, value]) => value !== undefined && value !== '')
  );
  const { data } = await axiosInstance.post<SeoPage>(RESOURCE, cleanData);
  return data;
};

export const updateSeoPage = async (id: string, seoPage: any): Promise<SeoPage> => {
  const cleanData = Object.fromEntries(
    Object.entries(seoPage).filter(([key, value]) => 
      value !== undefined && 
      value !== '' && 
      key !== '_id' && 
      key !== '__v' && 
      key !== 'createdAt' && 
      key !== 'updatedAt'
    )
  );
  const { data } = await axiosInstance.put<SeoPage>(`${RESOURCE}/${id}`, cleanData);
  return data;
};

export const deleteSeoPage = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${RESOURCE}/${id}`);
};

const seoPagesService = {
  fetchSeoPages,
  fetchSeoPageById,
  createSeoPage,
  updateSeoPage,
  deleteSeoPage,
};

export default seoPagesService;