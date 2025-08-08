import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export async function fetchDashboardMetrics(dateRange: string = "7d") {
  const res = await axios.get(`${BASE_URL}/api/dashboard/metrics?range=${dateRange}`);
  return res.data;
}

export async function fetchRecentActivity(limit: number = 10) {
  const res = await axios.get(`${BASE_URL}/api/dashboard/activity?limit=${limit}`);
  return res.data;
}