export interface Blog {
  _id: string;
  id?: string;
  title?: string;
  slug?: string;
  designation_fr?: string;
  cover?: { url: string; img_id?: string } | string;
  content?: string;
  description?: string;
  description_cover?: string;
  meta_description_fr?: string;
  alt_cover?: string;
  meta?: string;
  content_seo?: string;
  review?: string | null;
  aggregateRating?: string | null;
  author?: string;
  author_role?: string;
  publier?: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
}