const API_BASE_URL = 'http://localhost:3001';

// Add error handling wrapper
const apiCall = async (url: string) => {
  try {
    console.log('Calling API:', url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('API call failed:', url, error);
    throw error;
  }
};

export const fetchRevenueOverTime = async (params?: { 
  timeFrame?: string; 
  startDate?: string; 
  endDate?: string; 
}) => {
  const queryParams = new URLSearchParams();
  if (params?.timeFrame) queryParams.append('timeFrame', params.timeFrame);
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  
  return apiCall(`${API_BASE_URL}/analytics/revenue-over-time?${queryParams}`);
};

export const fetchYearOverYear = async () => {
  return apiCall(`${API_BASE_URL}/analytics/year-over-year`);
};

export const fetchCategoryPerformance = async (params?: { 
  startDate?: string; 
  endDate?: string; 
}) => {
  const queryParams = new URLSearchParams();
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  
  return apiCall(`${API_BASE_URL}/analytics/category-performance?${queryParams}`);
};

export const fetchPromoCodeStats = async (params?: { 
  startDate?: string; 
  endDate?: string; 
}) => {
  const queryParams = new URLSearchParams();
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  
  return apiCall(`${API_BASE_URL}/analytics/promo-code-stats?${queryParams}`);
};

export const fetchSalesByCountry = async () => {
  return apiCall(`${API_BASE_URL}/analytics/sales-by-country`);
};

export const fetchModuleStatistics = async (module: string, params?: {
  startDate?: string;
  endDate?: string;
}) => {
  const queryParams = new URLSearchParams();
  queryParams.append('module', module);
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);

  let endpoint = '';
  switch (module) {
    case 'Commande':
      endpoint = '/analytics/revenue-over-time';
      break;
    case 'Facture TVA':
      endpoint = '/analytics/revenue-over-time';
      break;
    case 'Produit':
      endpoint = '/analytics/top-products';
      break;
    case 'User':
      endpoint = '/analytics/recent-activity';
      break;
    default:
      endpoint = '/analytics/revenue-over-time';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}?${queryParams}`);
  if (!response.ok) throw new Error(`Failed to fetch ${module} statistics`);
  return response.json();
};