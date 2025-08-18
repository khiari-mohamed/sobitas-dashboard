import { ReactNode } from "react";

export interface ProductImage {
  url: string;
  img_id?: string;
}

export type Review = {
  rating: number;
  _id: string;
  id: string;
  user_id: string;
  product_id: string;
  stars: number;
  comment: string;
  publier: string;
  created_at: string;
  updated_at: string;
};

export type Product = {
  rupture: string;
  status: boolean;
  qte: ReactNode;
  quantity: ReactNode;
  zone4: string;
  zone3: string;
  zone2: string;
  zone1: string;
  content_seo: string;
  meta: string;
  aroma_ids: string[];
  designation_fr?: string;  // Changed to optional
  promo?: number;           // Changed to optional
  prix?: number;            // Changed to optional
  gallery?: boolean;
  title: string;
  price: number;
  cover?: string;
  meta_description_fr?: string;
  discountedPrice: number;
  id: number;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
  currency: string;
   // <-- allow robust image property for cart/sidebar

  _id: string;
  designation: string;
  slug: string;
  oldPrice?: number;
  mainImage: ProductImage;
  images?: ProductImage[];
  inStock?: boolean;
  reviews?: Review[];
  features?: string[];
  brand?: string;
  smallDescription?: string;
  description?: string;
  category?: string | {
    slug: string;
    title: string; _id: string; designation: string 
};
  subCategory?: Array<string | { _id: string; designation: string }>;
  sous_categorie_id?: string;
  venteflashDate?: Date;
  isFlashSale?: boolean;
  discountPercentage?: number;
  type: string;
  isNewProduct?: boolean; // from new_product
  isBestSeller?: boolean; // from best_seller
  isOutOfStock?: boolean; // from rupture
  isPublished?: boolean;  // from publier
  aggregateRating?: number; // parse from note or aggregateRating
  promoExpirationDate?: Date; // from promo_expiration_date
  createdAt?: Date | string;
nutrition_values?: string;
questions?: string;
//new niggas to make sure lkolhom mawjoudin 
sousCategorieId?: string; // sous_categorie_id
designationFr?: string; // designation_fr
prixHt?: string | number | null; // prix_ht
promoHt?: string | number | null; // promo_ht
descriptionFr?: string; // description_fr
publier?: string; // publier
createdBy?: string | null; // created_by
updatedBy?: string | null; // updated_by
updatedAt?: string; // updated_at
codeProduct?: string; // code_product
pack?: string; // pack
brandId?: string; // brand_id
newProduct?: string; // new_product
bestSeller?: string; // best_seller
note?: string | number; // note
metaDescriptionFr?: string; // meta_description_fr
altCover?: string; // alt_cover
descriptionCover?: string; // description_cover
contentSeo?: string; // content_seo
review?: string | Review[]; // review (if you want to store review object/array)
nutritionValues?: string | null; // nutrition_values
aromaIds?: string[]; // aroma_ids (array of string)

};

export interface FlashSaleProduct extends Product {
  endTime: string;
  originalPrice: number;
  type: string;
}

export interface ProductReference {
  _id: string;
  designation: string;
  slug: string;
  price?: number;
  mainImage: ProductImage;
}