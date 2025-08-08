import { getVenteFlashList } from "../../../../services/venteFlash";
import { VenteFlash } from "../../../../types/venteFlash";

export const fetchAllVenteFlash = async (): Promise<VenteFlash[]> => {
  return await getVenteFlashList();
};