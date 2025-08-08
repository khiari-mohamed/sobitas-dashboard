import { fetchMusculationProducts } from "../../../../services/Musculationproducts";
import { MusculationProduct } from "../../../../types/MusculationProducts";

export const fetchAllMusculationProducts = async (): Promise<MusculationProduct[]> => {
  return await fetchMusculationProducts();
};