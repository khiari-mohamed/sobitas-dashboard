import axios from "@/lib/axios";
import { Banner } from "@/types/banner";

const API_BASE = "/banners";

export async function getAllBanners(): Promise<Banner[]> {
  const res = await axios.get<Banner[]>(API_BASE);
  return res.data;
}

export async function addBanner(banner: Partial<Banner>): Promise<Banner> {
  const res = await axios.post<Banner>(API_BASE, banner);
  return res.data;
}

export async function updateBanner(id: string, banner: Partial<Banner>): Promise<Banner> {
  const res = await axios.put<Banner>(`${API_BASE}/${id}`, banner);
  return res.data;
}

export async function deleteBanner(id: string): Promise<void> {
  await axios.delete(`${API_BASE}/${id}`);
}

export async function getBanner(id: string): Promise<Banner> {
  const res = await axios.get<Banner>(`${API_BASE}/${id}`);
  return res.data;
}