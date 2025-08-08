// types/tags.ts

export interface Tag {
  designation_fr: string;
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  _id?: string; // MongoDB document id
}
