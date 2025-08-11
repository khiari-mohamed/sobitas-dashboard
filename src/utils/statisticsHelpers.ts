import { ModuleType } from '@/types/statistics';

// Generate mock data based on module and date range
export function generateMockStatisticsData(
  module: ModuleType,
  startDate: string,
  endDate: string
) {
  // Set default date range if not provided
  const end = endDate ? new Date(endDate) : new Date();
  const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
  
  // Generate labels based on date range
  const labels = [];
  const data = [];
  
  for (let i = 0; i <= Math.min(daysDiff, 30); i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    labels.push(date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }));
    
    // Generate different data patterns based on module with TND values
    let baseValue = 1000;
    let variance = 500;
    
    switch (module) {
      case 'Commande':
        baseValue = 1500.750;
        variance = 800.250;
        break;
      case 'Facture TVA':
        baseValue = 1200.500;
        variance = 600.125;
        break;
      case 'Produit':
        baseValue = 2000.875;
        variance = 1000.300;
        break;
      case 'User':
        baseValue = 800.125;
        variance = 400.750;
        break;
      case 'Review':
        baseValue = 600.250;
        variance = 300.500;
        break;
      default:
        baseValue = 1000.000;
        variance = 500.000;
    }
    
    // Add realistic patterns (weekends lower, mid-week higher)
    const dayOfWeek = date.getDay();
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1.2;
    
    const value = (baseValue + Math.random() * variance) * weekendMultiplier;
    
    data.push(Math.max(0, Math.round(value * 1000) / 1000));
  }
  
  return { labels, data };
}

// Generate comprehensive statistics data
export function generateComprehensiveData(
  module: ModuleType,
  startDate: string,
  endDate: string
) {
  const mainChart = generateMockStatisticsData(module, startDate, endDate);
  
  return {
    mainChart,
    categoryPerformance: [
      { name: 'Électronique', totalSales: 45000.750 },
      { name: 'Vêtements', totalSales: 32000.250 },
      { name: 'Maison & Jardin', totalSales: 28000.500 },
      { name: 'Sport & Loisirs', totalSales: 15000.125 },
      { name: 'Livres & Médias', totalSales: 8000.875 },
      { name: 'Beauté & Santé', totalSales: 12000.300 }
    ],
    promoCodeStats: [
      { code: 'SUMMER2024', usageCount: 156, totalDiscount: 7800.750 },
      { code: 'WELCOME10', usageCount: 89, totalDiscount: 4450.250 },
      { code: 'FLASH20', usageCount: 67, totalDiscount: 6700.500 },
      { code: 'STUDENT15', usageCount: 34, totalDiscount: 2550.125 },
      { code: 'BLACKFRIDAY', usageCount: 203, totalDiscount: 15225.875 }
    ],
    salesByCountry: [
      { country: 'Tunisie', sales: 125000.750, orders: 450 },
      { country: 'France', sales: 89000.250, orders: 320 },
      { country: 'Algérie', sales: 67000.500, orders: 280 },
      { country: 'Maroc', sales: 45000.125, orders: 190 },
      { country: 'Allemagne', sales: 32000.875, orders: 120 },
      { country: 'Italie', sales: 28000.300, orders: 95 },
      { country: 'Espagne', sales: 22000.650, orders: 78 }
    ],
    yearOverYear: [
      { year: '2023', revenue: 450000.750 },
      { year: '2024', revenue: 620000.250 }
    ],
    metrics: {
      totalRevenue: mainChart.data.reduce((sum, val) => sum + val, 0),
      totalOrders: Math.floor(mainChart.data.reduce((sum, val) => sum + val, 0) / 125.750),
      totalCustomers: Math.floor(mainChart.data.reduce((sum, val) => sum + val, 0) / 250.500),
      averageOrderValue: 125.750
    }
  };
}

// Format currency for Tunisia
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: 'TND',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  }).format(amount);
};

// Format numbers with French locale
export const formatNumber = (num: number): string => {
  return num.toLocaleString('fr-FR');
};

// Format dates
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Calculate growth percentage
export const calculateGrowthPercentage = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

// Generate date range array
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

// Get module configuration
export const getModuleConfig = (module: ModuleType) => {
  const configs = {
    'Commande': {
      color: 'rgba(29, 161, 242, 0.8)',
      icon: '📦',
      description: 'Analyse des commandes'
    },
    'Facture TVA': {
      color: 'rgba(34, 197, 94, 0.8)',
      icon: '🧾',
      description: 'Factures avec TVA'
    },
    'Bon de commande': {
      color: 'rgba(168, 85, 247, 0.8)',
      icon: '📋',
      description: 'Bons de commande'
    },
    'Produit': {
      color: 'rgba(249, 115, 22, 0.8)',
      icon: '🛍️',
      description: 'Gestion des produits'
    },
    'Redirection': {
      color: 'rgba(236, 72, 153, 0.8)',
      icon: '🔗',
      description: 'Redirections URL'
    },
    'Review': {
      color: 'rgba(14, 165, 233, 0.8)',
      icon: '⭐',
      description: 'Avis clients'
    },
    'Seo Page': {
      color: 'rgba(16, 185, 129, 0.8)',
      icon: '🔍',
      description: 'Pages SEO'
    },
    'Ticket': {
      color: 'rgba(245, 158, 11, 0.8)',
      icon: '🎫',
      description: 'Support tickets'
    },
    'User': {
      color: 'rgba(139, 92, 246, 0.8)',
      icon: '👥',
      description: 'Utilisateurs'
    }
  };
  
  return configs[module] || configs['Commande'];
};