import axios from '../lib/axios';
import { Page } from '../types/page';

export const fetchPages = async (): Promise<Page[]> => {
  const res = await axios.get('/pages');
  return res.data.data;
};

export const fetchPageBySlug = async (slug: string): Promise<Page> => {
  const res = await axios.get(`/pages/slug/${slug}`);
  return res.data.data;
};

export const fetchPageById = async (id: string): Promise<Page> => {
  const res = await axios.get(`/pages/${id}`);
  return res.data.data;
};