// types/services.ts
export interface ServiceItem {
  id: string;
  designation_fr: string;
  description_fr: string;
  icon: string;
  created_at?: string;
  updated_at?: string;
  _id?: string; // MongoDB document id
}