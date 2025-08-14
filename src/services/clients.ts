import { Client } from "@/types/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchClients(): Promise<Client[]> {
  const res = await fetch(`${API_URL}/clients`);
  const data = await res.json();
  return data.data;
}

export async function createClient(data: Partial<Client>) {
  const res = await fetch(`${API_URL}/clients/admin/new-with-data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateClient(id: string, data: Partial<Client>) {
  const res = await fetch(`${API_URL}/clients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function sendSmsToClient(phone_1: string, message: string) {
  const res = await fetch(`${API_URL}/clients/sms/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to: phone_1, message }),
  });
  return res.json();
}

export async function sendBulkSmsToClients(phones: string[], message: string) {
  const res = await fetch(`${API_URL}/clients/sms/send-bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to: phones, message }),
  });
  return res.json();
}

export async function deleteClient(id: string) {
  const res = await fetch(`${API_URL}/clients/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}
