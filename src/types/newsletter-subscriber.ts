// types/newsletters.ts
export interface Newsletter {
  id: string;
  email: string;
  created_at?: string;
  updated_at?: string;
  _id?: string; // MongoDB document id
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at?: string;
  updated_at?: string;
  _id?: string; // MongoDB document id
}