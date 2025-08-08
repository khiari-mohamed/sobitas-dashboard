// src/services/facture.ts

import { Facture } from "@/types/facture";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/commande`
    : "http://localhost:5000/commande";

export async function fetchFactures(): Promise<Facture[]> {
  const res = await fetch(`${API_URL}`);
  if (!res.ok) throw new Error("Failed to fetch factures");
  return res.json();
}

export async function fetchFactureById(id: string): Promise<Facture> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch facture");
  return res.json();
}

export async function createFacture(facture: Partial<Facture>): Promise<Facture> {
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(facture),
  });
  if (!res.ok) throw new Error("Failed to create facture");
  return res.json();
}

export async function updateFacture(id: string, facture: Partial<Facture>): Promise<Facture> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(facture),
  });
  if (!res.ok) throw new Error("Failed to update facture");
  return res.json();
}

export async function deleteFacture(id: string): Promise<any> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete facture");
  return res.json();
}

const factureService = {
  fetchFactures,
  fetchFactureById,
  createFacture,
  updateFacture,
  deleteFacture,
};

export default factureService;
