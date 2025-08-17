interface TestimonialConfig {
  sectionTitle: string;
  sectionDescription: string;
  maxDisplay: number;
  showOnFrontend: boolean;
  testimonialOrder: string[];
}

const defaultConfig: TestimonialConfig = {
  sectionTitle: "Avis de nos clients",
  sectionDescription: "Découvrez ce que pensent nos clients de PROTEINE TUNISIE. Plus de 15 ans d'expérience au service de votre performance.",
  maxDisplay: 6,
  showOnFrontend: true,
  testimonialOrder: [],
};

export const getTestimonialConfig = (): TestimonialConfig => {
  if (typeof window === 'undefined') return defaultConfig;
  
  const savedConfig = localStorage.getItem('testimonialConfig');
  if (savedConfig) {
    try {
      return { ...defaultConfig, ...JSON.parse(savedConfig) };
    } catch (error) {
      console.error('Error loading testimonial config:', error);
    }
  }
  return defaultConfig;
};

export const saveTestimonialConfig = (config: Partial<TestimonialConfig>) => {
  if (typeof window === 'undefined') return;
  
  const currentConfig = getTestimonialConfig();
  const updatedConfig = { ...currentConfig, ...config };
  localStorage.setItem('testimonialConfig', JSON.stringify(updatedConfig));
};