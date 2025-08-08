export interface Page {
  _id: string;
  title: string;
  slug: string;
  body: string;
  excerpt?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  author_id?: string | null;
  image?: string | null;
  status: string;
  cover?: {
    url: string;
    img_id: string;
  };
  createdAt?: string;
  updatedAt?: string;
}