export interface BestSeller {
  _id?: string;
  designation_fr: string;
  prix: number;
  promo?: number;
  qte: string;
  publier: string;
  cover?: string;
  slug?: string;
  description_fr?: string;
  description_cover?: string;
}

export interface BestSellerConfig {
  sectionTitle: string;
  sectionDescription: string;
  maxDisplay: number;
  showOnFrontend: boolean;
  productOrder: string[];
}