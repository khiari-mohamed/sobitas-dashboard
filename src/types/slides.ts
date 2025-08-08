// types/slides.ts
export interface Slide {
  id: string;
  cover: string;
  designation_fr?: string;
  description_fr?: string;
  btn_text_fr?: string;
  btn_link?: string;
  created_at?: string;
  updated_at?: string;
  position?: string;
  text_color?: string;
  text_weight?: string;
  type?: string;
  _id?: string; // MongoDB document id
}