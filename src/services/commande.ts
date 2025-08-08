// src/services/commande.ts
import { Commande } from "@/types/commande";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/commande`
    : "http://localhost:5000/commande";

export async function fetchCommandes(): Promise<Commande[]> {
  const res = await fetch(`${API_URL}`);
  if (!res.ok) throw new Error("Failed to fetch commandes");
  return res.json();
}

export async function fetchCommandeById(id: string): Promise<Commande> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch commande");
  return res.json();
}

export async function createCommande(commande: Partial<Commande>): Promise<Commande> {
  const res = await fetch(`${API_URL}` , {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(commande),
  });
  if (!res.ok) throw new Error("Failed to create commande");
  return res.json();
}

export async function updateCommande(id: string, commande: Partial<Commande>): Promise<Commande> {
  const res = await fetch(`${API_URL}/${id}` , {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(commande),
  });
  if (!res.ok) throw new Error("Failed to update commande");
  return res.json();
}

export async function deleteCommande(id: string): Promise<any> {
  const res = await fetch(`${API_URL}/${id}` , {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete commande");
  return res.json();
}

const commandeService = {
  fetchCommandes,
  fetchCommandeById,
  createCommande,
  updateCommande,
  deleteCommande,
};

export default commandeService;
