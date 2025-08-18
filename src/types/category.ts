export interface CategoryImage {
  url: string;
  img_id?: string;
}

export interface Category {
  _id: string;
  id?: string;
  designation?: string;
  designation_fr?: string;
  title?: string;
  slug?: string;
  image?: CategoryImage;
  cover?: string;
  product_liste_cover?: string;
  alt_cover?: string;
  description_fr?: string;
  description_cover?: string;
  meta?: string;
  content_seo?: string;
  review?: string;
  aggregateRating?: string;
  nutrition_values?: string;
  questions?: string;
  more_details?: string;
  zone1?: string;
  zone2?: string;
  zone3?: string;
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  products?: string[];
  subCategories?: Category[];
  subcategories?: Category[];
  status?: string;
}