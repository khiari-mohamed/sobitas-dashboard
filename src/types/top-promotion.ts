export interface TopPromotion {
  _id: string;
  title: string;
  description?: string;
  discount?: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  created_at?: string;
  updated_at?: string;
}