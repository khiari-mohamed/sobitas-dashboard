// types/contacts.ts
export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at?: string;
  updated_at?: string;
  _id?: string; // MongoDB document id
}