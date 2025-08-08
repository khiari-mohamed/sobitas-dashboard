import axios from "@/lib/axios";
import { Banner } from "@/types/banner";

// Use environment variable for API base URL if needed
const API_BASE = "/banners";

// Fetch all banners
export async function getAllBanners(): Promise<Banner[]> {
  const res = await axios.get<Banner[]>(API_BASE);
  return res.data;
}

// Add a new banner
export async function addBanner(banner: Partial<Banner>): Promise<Banner> {
  const res = await axios.post<Banner>(API_BASE, banner);
  return res.data;
}

// Update a banner by _id
export async function updateBanner(id: string, banner: Partial<Banner>): Promise<Banner> {
  const res = await axios.put<Banner>(`${API_BASE}/${id}`, banner);
  return res.data;
}

// Delete a banner by _id
export async function deleteBanner(id: string): Promise<void> {
  await axios.delete(`${API_BASE}/${id}`);
}