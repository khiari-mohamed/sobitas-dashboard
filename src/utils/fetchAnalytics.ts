import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_ANALYTICS_API_URL || "http://localhost:5000/analytics";

/**
 * Generic fetcher for analytics endpoints.
 * @param endpoint - API endpoint (e.g. 'revenue-over-time')
 * @param params - Query parameters as object
 * @param config - Optional Axios config (headers, etc.)
 */
async function fetchAnalytics<T = any>(
  endpoint: string,
  params: Record<string, any> = {},
  config: AxiosRequestConfig = {}
): Promise<T> {
  try {
    const res = await axios.get(`${BASE_URL}/${endpoint}`, {
      params,
      ...config,
    });
    return res.data;
  } catch (error: any) {
    // Robust error handling
    if (axios.isAxiosError(error)) {
      // Optionally log or send to monitoring
      throw new Error(
        error.response?.data?.message ||
        error.response?.statusText ||
        "Analytics API error"
      );
    }
    throw new Error("Unknown analytics fetch error");
  }
}

// Specific analytics fetchers using the generic function

export async function fetchRevenueOverTime(params = {}) {
  const res = await axios.get(`${BASE_URL}/revenue-over-time`, { params });
  let data = res.data;
  if (!Array.isArray(data)) data = [];
  return data.map((d: any, i: number) => ({
    label: d.label || d.month || d.date || d._id || `M${i+1}`,
    totalRevenue: d.totalRevenue || d.revenue || d.value || d.total || 0,
    orderCount: d.orderCount || d.orders || d.users || d.count || 0,
  }));
}

export function fetchYearOverYear(params = {}, config = {}) {
  return fetchAnalytics("year-over-year", params, config);
}

export function fetchMonthlyEvolution(params = {}, config = {}) {
  return fetchAnalytics("monthly-evolution", params, config);
}

export function fetchMostSoldProduct(params = {}, config = {}) {
  return fetchAnalytics("most-sold", params, config);
}

export function fetchBestDayForProduct(productId: string, params = {}, config = {}) {
  return fetchAnalytics(`best-day/${productId}`, params, config);
}

export function fetchHighestRevenueDay(params = {}, config = {}) {
  return fetchAnalytics("highest-revenue-day", params, config);
}

export function fetchRevenueByBrand(params = {}, config = {}) {
  return fetchAnalytics("revenue-by-brand", params, config);
}

export function fetchTopProducts(params = {}, config = {}) {
  return fetchAnalytics("top-products", params, config);
}

export function fetchOrdersByCategory(params = {}, config = {}) {
  return fetchAnalytics("orders-by-category", params, config);
}

export function fetchCategoryPerformance(params = {}, config = {}) {
  return fetchAnalytics("category-performance", params, config);
}

export function fetchPromoCodeStats(params = {}, config = {}) {
  return fetchAnalytics("promo-code-stats", params, config);
}

export function fetchSalesByCountry(params = {}, config = {}) {
  return fetchAnalytics("sales-by-country", params, config);
}

export function fetchMargins(params = {}, config = {}) {
  return fetchAnalytics("margins", params, config);
}

export function fetchFilterSales(params = {}, config = {}) {
  return fetchAnalytics("filter-sales", params, config);
}

export function fetchSalesByBrand(params = {}, config = {}) {
  return fetchAnalytics("sales-by-brand", params, config);
}

export function fetchDailySales(params = {}, config = {}) {
  return fetchAnalytics("daily-sales", params, config);
}

export function fetchRecentActivity(params = {}, config = {}) {
  return fetchAnalytics("recent-activity", params, config);
}

export { fetchAnalytics };

/**
 * Custom hook to use revenue over time data
 * @param dateRange - The date range for the data
 */
export function useRevenueOverTime(dateRange) {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchRevenueOverTime({ range: dateRange })
      .then((data) => {
        setSalesData(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [dateRange]);

  return { salesData, loading };
}