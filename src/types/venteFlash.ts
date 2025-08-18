export interface VenteFlash {
  _id: string;
  id?: string;
  slug?: string;
  designation_fr?: string;
  cover?: string;
  new_product?: string;
  best_seller?: string;
  note?: number;
  alt_cover?: string;
  description_cover?: string;
  prix?: number;
  pack?: string;
  promo?: number;
  promo_expiration_date?: string;
  publier?: string;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: string;
  updated_at?: string;
  code_product?: string | null;
  brand_id?: string | null;
  gallery?: string;
  meta_description_fr?: string;
  rupture?: string;
  meta?: string;
  content_seo?: string;
  review?: string;
  aggregateRating?: string;
  nutrition_values?: string;
  questions?: string;
  zone1?: string;
  zone2?: string;
  zone3?: string;
  zone4?: string;
  status?: string;
  qte?: string;
  mainImage?: {
    url: string;
    img_id: string;
  };
  images?: Array<{
    url: string;
    img_id: string;
  }>;
}