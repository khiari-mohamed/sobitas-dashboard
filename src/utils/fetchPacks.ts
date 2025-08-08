import { fetchAllPacks } from "../../../../services/pack";
import { Pack } from "../../../../types/pack";

export const fetchPacks = async (): Promise<Pack[]> => {
  return await fetchAllPacks();
};