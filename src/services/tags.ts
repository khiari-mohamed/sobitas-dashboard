// services/tags.ts

import axiosInstance from '../lib/axios';
import { Tag } from '../types/tags';

const RESOURCE = '/tags';

export const fetchTags = async (): Promise<Tag[]> => {
  const { data } = await axiosInstance.get<Tag[]>(RESOURCE);
  return data;
};

export const fetchTagById = async (id: string): Promise<Tag> => {
  const { data } = await axiosInstance.get<Tag>(`${RESOURCE}/${id}`);
  return data;
};

export const createTag = async (tag: Partial<Tag>): Promise<Tag> => {
  const cleanData = Object.fromEntries(
    Object.entries(tag).filter(([, value]) => value !== undefined && value !== '')
  );
  const { data } = await axiosInstance.post<Tag>(RESOURCE, cleanData);
  return data;
};

export const updateTag = async (id: string, tag: Partial<Tag>): Promise<Tag> => {
  const cleanData = Object.fromEntries(
    Object.entries(tag).filter(([key, value]) => 
      value !== undefined && 
      value !== '' && 
      key !== '_id' && 
      key !== '__v' && 
      key !== 'createdAt' && 
      key !== 'updatedAt'
    )
  );
  const { data } = await axiosInstance.put<Tag>(`${RESOURCE}/${id}`, cleanData);
  return data;
};

export const deleteTag = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${RESOURCE}/${id}`);
};

const tagsService = {
  fetchTags,
  fetchTagById,
  createTag,
  updateTag,
  deleteTag,
};

export default tagsService;
