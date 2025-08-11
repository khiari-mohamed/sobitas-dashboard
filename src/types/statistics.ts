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

export interface StatisticsData {
  mainChart: MainChartData;
  categoryPerformance: CategoryPerformance[];
  promoCodeStats: PromoCodeStats[];
  salesByCountry: SalesByCountry[];
  yearOverYear: YearOverYear[];
  metrics: StatisticsMetrics;
}

export interface ModuleConfig {
  apiEndpoint: string;
  label: string;
  valueKey: string;
  color: string;
}

export const AVAILABLE_MODULES = [
  'Commande',
  'Facture TVA',
  'Bon de commande',
  'Produit',
  'Redirection',
  'Review',
  'Seo Page',
  'Ticket',
  'User'
] as const;

export type ModuleType = typeof AVAILABLE_MODULES[number];