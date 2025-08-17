// services/system-messages.ts
import axiosInstance from '../lib/axios';
import { SystemMessage } from '../types/system-messages';

const RESOURCE = '/system-messages';

export const fetchSystemMessages = async (): Promise<SystemMessage[]> => {
  const { data } = await axiosInstance.get<SystemMessage[]>(RESOURCE);
  return data;
};

export const fetchSystemMessageById = async (id: string): Promise<SystemMessage> => {
  const { data } = await axiosInstance.get<SystemMessage>(`${RESOURCE}/${id}`);
  return data;
};

export const createSystemMessage = async (systemMessage: any): Promise<SystemMessage> => {
  const cleanData = Object.fromEntries(
    Object.entries(systemMessage).filter(([_, value]) => value !== undefined && value !== '')
  );
  const { data } = await axiosInstance.post<SystemMessage>(RESOURCE, cleanData);
  return data;
};

export const updateSystemMessage = async (id: string, systemMessage: any): Promise<SystemMessage> => {
  const cleanData = Object.fromEntries(
    Object.entries(systemMessage).filter(([key, value]) => 
      value !== undefined && 
      value !== '' && 
      key !== '_id' && 
      key !== '__v' && 
      key !== 'createdAt' && 
      key !== 'updatedAt'
    )
  );
  const { data } = await axiosInstance.put<SystemMessage>(`${RESOURCE}/${id}`, cleanData);
  return data;
};

export const deleteSystemMessage = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${RESOURCE}/${id}`);
};

const systemMessagesService = {
  fetchSystemMessages,
  fetchSystemMessageById,
  createSystemMessage,
  updateSystemMessage,
  deleteSystemMessage,
};

export default systemMessagesService;