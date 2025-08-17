interface VenteFlashConfig {
  sectionTitle: string;
  sectionDescription: string;
  maxDisplay: number;
  showOnFrontend: boolean;
}

const defaultConfig: VenteFlashConfig = {
  sectionTitle: "Ventes Flash",
  sectionDescription: "Profitez de nos offres exclusives avant qu'il ne soit trop tard!",
  maxDisplay: 4,
  showOnFrontend: true,
};

export const getVenteFlashConfig = (): VenteFlashConfig => {
  if (typeof window === 'undefined') return defaultConfig;
  
  const savedConfig = localStorage.getItem('venteFlashConfig');
  if (savedConfig) {
    try {
      return { ...defaultConfig, ...JSON.parse(savedConfig) };
    } catch (error) {
      console.error('Error loading vente flash config:', error);
    }
  }
  return defaultConfig;
};

export const saveVenteFlashConfig = (config: Partial<VenteFlashConfig>) => {
  if (typeof window === 'undefined') return;
  
  const currentConfig = getVenteFlashConfig();
  const updatedConfig = { ...currentConfig, ...config };
  localStorage.setItem('venteFlashConfig', JSON.stringify(updatedConfig));
};