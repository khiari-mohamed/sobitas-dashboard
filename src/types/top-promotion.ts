export type TopPromotion = {
  _id: string;
  productId: string; // or Types.ObjectId if you want to be more specific
  designation_fr: string;
  prix: number;
  promo: number;
  qte: number;
  rupture?: string;
  publier?: string;
  startDate: string;
  endDate: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  cover?: string; // <-- Add this line
  product?: any; // <-- Add this line if you want to include the full product object
};