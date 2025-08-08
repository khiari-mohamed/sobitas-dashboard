// types/seo-pages.ts
export interface SeoPage {
  id: string;
  page: string;
  meta?: string;
  description_fr?: string;
  nutrition_values?: string;
  questions?: string;
  zone1?: string;
  zone2?: string;
  zone3?: string;
  more_details?: string;
  created_at?: string;
  updated_at?: string;
  _id?: string; // MongoDB document id
}