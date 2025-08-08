// services/settings.ts
import axiosInstance from '../lib/axios';
import { Setting } from '../types/settings';

const RESOURCE = '/settings';

export const fetchSettings = async (): Promise<Setting[]> => {
  const { data } = await axiosInstance.get<Setting[]>(RESOURCE);
  return data;
};

export const fetchSettingById = async (id: string): Promise<Setting> => {
  const { data } = await axiosInstance.get<Setting>(`${RESOURCE}/${id}`);
  return data;
};

export const fetchSettingByKey = async (key: string): Promise<Setting> => {
  const { data } = await axiosInstance.get<Setting>(`${RESOURCE}/by-key/${key}`);
  return data;
};

export const createSetting = async (setting: Omit<Setting, '_id'>): Promise<Setting> => {
  const { data } = await axiosInstance.post<Setting>(RESOURCE, setting);
  return data;
};

export const updateSetting = async (id: string, setting: Partial<Setting>): Promise<Setting> => {
  const { data } = await axiosInstance.patch<Setting>(`${RESOURCE}/${id}`, setting);
  return data;
};

export const deleteSetting = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${RESOURCE}/${id}`);
};

const settingsService = {
  fetchSettings,
  fetchSettingById,
  fetchSettingByKey,
  createSetting,
  updateSetting,
  deleteSetting,
};

export default settingsService;