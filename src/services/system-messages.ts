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

export const createSystemMessage = async (systemMessage: Omit<SystemMessage, '_id'>): Promise<SystemMessage> => {
  const { data } = await axiosInstance.post<SystemMessage>(RESOURCE, systemMessage);
  return data;
};

export const updateSystemMessage = async (id: string, systemMessage: Partial<SystemMessage>): Promise<SystemMessage> => {
  const { data } = await axiosInstance.patch<SystemMessage>(`${RESOURCE}/${id}`, systemMessage);
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