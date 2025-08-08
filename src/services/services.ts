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

export const createService = async (service: Omit<ServiceItem, '_id'>): Promise<ServiceItem> => {
  const { data } = await axiosInstance.post<ServiceItem>(RESOURCE, service);
  return data;
};

export const updateService = async (id: string, service: Partial<ServiceItem>): Promise<ServiceItem> => {
  const { data } = await axiosInstance.patch<ServiceItem>(`${RESOURCE}/${id}`, service);
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