import axios from '@/lib/axios';

export interface StatisticsParams {
  module: string;
  startDate: string;
  endDate: string;
  chartType?: 'bar' | 'line';
}

export interface MainChartData {
  labels: string[];
  data: number[];
}

export interface CategoryPerformance {
  name: string;
  totalSales: number;
}

export interface PromoCodeStats {
  code: string;
  usageCount: number;
  totalDiscount: number;
}

export interface SalesByCountry {
  country: string;
  sales: number;
  orders: number;
}

export interface YearOverYear {
  year: string;
  revenue: number;
}

export interface StatisticsMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
}

// Main statistics API calls
export const statisticsService = {
  // Get main chart data based on module and date range
  async getMainChartData(params: StatisticsParams): Promise<MainChartData> {
    const response = await axios.get('/api/statistics/main', { params });
    return response.data;
  },

  // Get category performance data
  async getCategoryPerformance(params: Omit<StatisticsParams, 'chartType'>): Promise<CategoryPerformance[]> {
    const response = await axios.get('/api/analytics/category-performance', { params });
    return response.data.data || [];
  },

  // Get promo code statistics
  async getPromoCodeStats(params: Omit<StatisticsParams, 'chartType'>): Promise<PromoCodeStats[]> {
    const response = await axios.get('/api/analytics/promo-code-stats', { params });
    return response.data.data || [];
  },

  // Get sales by country
  async getSalesByCountry(params: Omit<StatisticsParams, 'chartType'>): Promise<SalesByCountry[]> {
    const response = await axios.get('/api/analytics/sales-by-country', { params });
    return response.data.data || [];
  },

  // Get year over year comparison
  async getYearOverYear(params: Omit<StatisticsParams, 'chartType'>): Promise<YearOverYear[]> {
    const response = await axios.get('/api/analytics/year-over-year', { params });
    return response.data.data || [];
  },

  // Get revenue over time
  async getRevenueOverTime(params: Omit<StatisticsParams, 'chartType'> & { timeFrame?: string }): Promise<Array<{ date: string; revenue: number }>> {
    const response = await axios.get('/api/analytics/revenue-over-time', { params });
    return response.data || [];
  },

  // Get all statistics data in one call
  async getAllStatistics(params: StatisticsParams) {
    try {
      const [
        mainChart,
        categoryPerformance,
        promoCodeStats,
        salesByCountry,
        yearOverYear
      ] = await Promise.all([
        this.getMainChartData(params),
        this.getCategoryPerformance(params),
        this.getPromoCodeStats(params),
        this.getSalesByCountry(params),
        this.getYearOverYear(params)
      ]);

      return {
        mainChart,
        categoryPerformance,
        promoCodeStats,
        salesByCountry,
        yearOverYear
      };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }
};

// Module-specific data generators for different modules
export const moduleDataGenerators = {
  'Commande': () => ({
    apiEndpoint: '/api/analytics/orders',
    label: 'Commandes',
    valueKey: 'orderCount',
    color: 'rgba(29, 161, 242, 0.8)'
  }),

  'Facture TVA': () => ({
    apiEndpoint: '/api/analytics/invoices',
    label: 'Factures TVA',
    valueKey: 'invoiceCount',
    color: 'rgba(34, 197, 94, 0.8)'
  }),

  'Bon de commande': () => ({
    apiEndpoint: '/api/analytics/purchase-orders',
    label: 'Bons de commande',
    valueKey: 'poCount',
    color: 'rgba(168, 85, 247, 0.8)'
  }),

  'Produit': () => ({
    apiEndpoint: '/api/analytics/products',
    label: 'Produits',
    valueKey: 'productCount',
    color: 'rgba(249, 115, 22, 0.8)'
  }),

  'Redirection': () => ({
    apiEndpoint: '/api/analytics/redirections',
    label: 'Redirections',
    valueKey: 'redirectCount',
    color: 'rgba(236, 72, 153, 0.8)'
  }),

  'Review': () => ({
    apiEndpoint: '/api/analytics/reviews',
    label: 'Avis',
    valueKey: 'reviewCount',
    color: 'rgba(14, 165, 233, 0.8)'
  }),

  'Seo Page': () => ({
    apiEndpoint: '/api/analytics/seo-pages',
    label: 'Pages SEO',
    valueKey: 'pageCount',
    color: 'rgba(16, 185, 129, 0.8)'
  }),

  'Ticket': () => ({
    apiEndpoint: '/api/analytics/tickets',
    label: 'Tickets',
    valueKey: 'ticketCount',
    color: 'rgba(245, 158, 11, 0.8)'
  }),

  'User': () => ({
    apiEndpoint: '/api/analytics/users',
    label: 'Utilisateurs',
    valueKey: 'userCount',
    color: 'rgba(139, 92, 246, 0.8)'
  })
};

// Utility functions
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('fr-TN', { 
    style: 'currency', 
    currency: 'TND',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString('fr-FR');
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const calculateGrowthPercentage = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

export const generateDateRange = (startDate: string, endDate: string): string[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates = [];
  
  const currentDate = new Date(start);
  while (currentDate <= end) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};