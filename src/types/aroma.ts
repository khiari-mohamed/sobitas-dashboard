
import type { Brand } from "./brand";

export interface Aroma {
  _id: string; // MongoDB ObjectId as string
  id: string; // Custom string ID
  designation_fr: string;
  created_at: string;
  updated_at: string;
  brand: string | Brand; // Brand ObjectId or populated Brand object
}