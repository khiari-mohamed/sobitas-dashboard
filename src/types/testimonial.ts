export interface Testimonial {
  _id: string;
  id?: string;
  comment: string;
  stars: string;
  user_id?: string;
  product_id?: string;
  publier?: string;
  created_at?: string;
  updated_at?: string;
  user?: {
    name: string;
    role?: string;
    avatar?: string;
  };
  authorName?: string;
  authorRole?: string;
  authorImg?: string;
  review?: string;
  status?: string;
}

export interface TestimonialConfig {
  sectionTitle: string;
  sectionDescription: string;
  maxDisplay: number;
  showOnFrontend: boolean;
  testimonialOrder: string[];
}