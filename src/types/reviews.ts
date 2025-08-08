export interface Review {
  rating?: number;
  id: string;
  user_id: string;
  product_id: string;
  _id?: string;
  stars: string;
  comment: string | null;
  publier: string;
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
    role: string;
    avatar: string;
  };
}
