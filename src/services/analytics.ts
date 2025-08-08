// /src/services/analytics.ts
import axios from "@/lib/axios";

export const getRecentActivity = async (limit = 10) => {
  const { data } = await axios.get(`/analytics/recent-activity?limit=${limit}`);
  return data;
};