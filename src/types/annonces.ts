// types/annonces.ts
export interface Annonce {
  id: string;
  image_1?: string;
  image_2?: string;
  image_3?: string;
  image_4?: string;
  image_5?: string;
  image_6?: string;
  link_img_1?: string;
  link_img_2?: string;
  link_img_3?: string;
  link_img_4?: string;
  link_img_5?: string;
  link_img_6?: string;
  products_default_cover?: string;
  created_at?: string;
  updated_at?: string;
  _id?: string; // MongoDB document id
}