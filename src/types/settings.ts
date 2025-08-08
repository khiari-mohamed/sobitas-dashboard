// types/settings.ts
export interface Setting {
  id: string;
  key: string;
  display_name: string;
  value?: string;
  details?: string;
  type: 'text' | 'image';
  order: string;
  group: string;
  _id?: string; // MongoDB document id
}