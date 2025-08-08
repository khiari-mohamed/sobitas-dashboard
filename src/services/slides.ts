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

export const createSlide = async (slide: Omit<Slide, '_id'>): Promise<Slide> => {
  const { data } = await axiosInstance.post<Slide>(RESOURCE, slide);
  return data;
};

export const updateSlide = async (id: string, slide: Partial<Slide>): Promise<Slide> => {
  const { data } = await axiosInstance.patch<Slide>(`${RESOURCE}/${id}`, slide);
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