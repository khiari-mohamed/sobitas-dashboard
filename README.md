# Statistics Dashboard System

A comprehensive statistics dashboard system built with Next.js, React, and Chart.js that provides dynamic analytics and reporting capabilities.

## Features

### 📊 Dynamic Statistics Module
- **Multi-Module Support**: Analyze data for different modules (Commande, Facture TVA, Produit, User, etc.)
- **Date Range Selection**: Flexible date range filtering for precise analytics
- **Chart Type Selection**: Choose between bar charts and line charts for data visualization
- **Real-time Data Processing**: Dynamic data generation and processing

### 📈 Comprehensive Analytics
- **Main Chart Visualization**: Primary data visualization with customizable chart types
- **Category Performance**: Pie/Doughnut charts showing performance by category
- **Year-over-Year Comparison**: Bar charts comparing current vs previous year data
- **Promo Code Statistics**: Detailed table showing promo code usage and discounts
- **Sales by Country**: Geographic sales distribution with detailed metrics

### 🎯 Key Metrics Dashboard
- **Total Revenue**: Real-time revenue tracking with currency formatting
- **Order Count**: Total number of orders processed
- **Customer Analytics**: Customer count and engagement metrics
- **Average Order Value**: Calculated average order value with trends

### 🛠️ Technical Features
- **Responsive Design**: Mobile-first responsive design using Tailwind CSS
- **TypeScript Support**: Full TypeScript implementation for type safety
- **Modular Architecture**: Clean, maintainable code structure
- **Mock Data System**: Comprehensive mock data generation for testing
- **Chart.js Integration**: Professional charts with Chart.js and react-chartjs-2

## File Structure

```
src/
├── app/
│   └── admin/
│       └── statistics/
│           └── page.tsx                 # Main statistics page
├── components/
│   ├── EspaceStatistiques.tsx          # Statistics form component
│   └── StatisticsResults.tsx           # Results display component
├── services/
│   └── statistics.ts                   # API service functions
├── types/
│   └── statistics.ts                   # TypeScript type definitions
└── utils/
    └── statisticsHelpers.ts            # Utility functions and data generators
```

## Usage

### 1. Access Statistics Page
Navigate to `/admin/statistics` to access the statistics dashboard.

### 2. Configure Analysis
- **Select Module**: Choose from available modules (Commande, Facture TVA, etc.)
- **Set Date Range**: Select start and end dates for analysis
- **Choose Chart Type**: Select between histogram (bar) or linear (line) charts
- **Execute Analysis**: Click "Exécuter" to generate statistics

### 3. View Results
The results page displays:
- Key metrics cards with totals and trends
- Main chart visualization based on selected parameters
- Category performance pie chart
- Year-over-year comparison
- Detailed data tables for promo codes and country sales

## Available Modules

1. **Commande** - Order analytics and trends
2. **Facture TVA** - VAT invoice statistics
3. **Bon de commande** - Purchase order analytics
4. **Produit** - Product performance metrics
5. **Redirection** - URL redirection analytics
6. **Review** - Customer review statistics
7. **Seo Page** - SEO page performance
8. **Ticket** - Support ticket analytics
9. **User** - User engagement metrics

## Data Visualization

### Chart Types
- **Bar Charts**: Perfect for comparing discrete data points
- **Line Charts**: Ideal for showing trends over time
- **Pie/Doughnut Charts**: Great for showing proportional data
- **Data Tables**: Detailed tabular data with sorting and formatting

### Responsive Design
- Mobile-optimized layouts
- Adaptive chart sizing
- Touch-friendly interactions
- Responsive data tables

## Mock Data System

The system includes a comprehensive mock data generator that:
- Creates realistic data patterns based on module type
- Simulates seasonal trends and patterns
- Generates consistent data across different time ranges
- Provides varied data for different business scenarios

## Currency and Formatting

- **Currency**: Tunisian Dinar (TND) formatting
- **Numbers**: French locale formatting
- **Dates**: French date formatting
- **Percentages**: Growth calculations and trend indicators

## Installation

1. Install dependencies:
```bash
npm install chart.js react-chartjs-2 leaflet react-leaflet lucide-react
```

2. Add the statistics route to your navigation system

3. Configure your API endpoints (currently using mock data)

## Customization

### Adding New Modules
1. Add module to `AVAILABLE_MODULES` in `types/statistics.ts`
2. Configure module settings in `getModuleConfig()` in `utils/statisticsHelpers.ts`
3. Update mock data generator for new module patterns

### Styling
- Modify Tailwind classes in components
- Update chart colors in module configurations
- Customize responsive breakpoints as needed

## Performance Considerations

- Lazy loading of chart components
- Efficient data processing with memoization
- Responsive image and chart rendering
- Optimized bundle size with dynamic imports

## Future Enhancements

- Real API integration with backend services
- Export functionality (PDF, Excel, CSV)
- Advanced filtering and search capabilities
- Real-time data updates with WebSocket
- Custom dashboard builder
- Advanced analytics with machine learning insights

This statistics system provides a solid foundation for business intelligence and analytics, with room for expansion and customization based on specific business needs.