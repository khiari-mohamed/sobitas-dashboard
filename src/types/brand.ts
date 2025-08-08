
import { Aroma } from './aroma';
export interface Brand {
  slug: any;
  _id: string; // MongoDB ObjectId as string
  id: string; // Custom string ID
  designation_fr: string;
  logo: string;
  description_fr?: string;
  created_at?: string;
  updated_at?: string;
  alt_cover?: string;
  description_cover?: string;
  meta?: string;
  content_seo?: string;
  review?: string;
  aggregateRating?: string;
  nutrition_values?: string | null;
  questions?: string | null;
  more_details?: string;
  aromas?: Array<string | Aroma>; // Array of Aroma ObjectIds or populated Aroma objects
}
