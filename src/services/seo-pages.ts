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

export const createSeoPage = async (seoPage: Omit<SeoPage, '_id'>): Promise<SeoPage> => {
  const { data } = await axiosInstance.post<SeoPage>(RESOURCE, seoPage);
  return data;
};

export const updateSeoPage = async (id: string, seoPage: Partial<SeoPage>): Promise<SeoPage> => {
  const { data } = await axiosInstance.patch<SeoPage>(`${RESOURCE}/${id}`, seoPage);
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