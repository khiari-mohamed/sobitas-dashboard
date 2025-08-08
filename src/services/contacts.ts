// services/contacts.ts
import axiosInstance from '../lib/axios';
import { Contact } from '../types/contacts';

const RESOURCE = '/contacts';

export const fetchContacts = async (): Promise<Contact[]> => {
  const { data } = await axiosInstance.get<Contact[]>(RESOURCE);
  return data;
};

export const fetchContactById = async (id: string): Promise<Contact> => {
  const { data } = await axiosInstance.get<Contact>(`${RESOURCE}/${id}`);
  return data;
};

export const createContact = async (contact: Omit<Contact, '_id'>): Promise<Contact> => {
  const { data } = await axiosInstance.post<Contact>(RESOURCE, contact);
  return data;
};

export const updateContact = async (id: string, contact: Partial<Contact>): Promise<Contact> => {
  const { data } = await axiosInstance.patch<Contact>(`${RESOURCE}/${id}`, contact);
  return data;
};

export const deleteContact = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${RESOURCE}/${id}`);
};

const contactsService = {
  fetchContacts,
  fetchContactById,
  createContact,
  updateContact,
  deleteContact,
};

export default contactsService;