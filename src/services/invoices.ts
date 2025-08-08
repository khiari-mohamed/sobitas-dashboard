import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function fetchInvoices(params = {}) {
  const res = await axios.get(`${API_BASE}/invoice`, { params });
  return res.data;
}

export async function fetchInvoiceById(id: string) {
  const res = await axios.get(`${API_BASE}/invoice/${id}`);
  return res.data;
}

export async function createInvoice(data: any) {
  const res = await axios.post(`${API_BASE}/invoice`, data);
  return res.data;
}

export async function updateInvoice(id: string, data: any) {
  const res = await axios.patch(`${API_BASE}/invoice/${id}`, data);
  return res.data;
}

export async function deleteInvoice(id: string) {
  const res = await axios.delete(`${API_BASE}/invoice/${id}`);
  return res.data;
}