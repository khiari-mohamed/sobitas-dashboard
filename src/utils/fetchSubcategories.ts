import { getAllSubCategories } from "../services/subcategories";
import { SubCategory } from "../types/subcategory";

export const fetchSubcategories = async (): Promise<SubCategory[]> => {
  return await getAllSubCategories();
};