import { Aroma } from "@/types/aroma";

// Replace with your actual API endpoints
export async function getFlavors(): Promise<Aroma[]> {
  const res = await fetch("/api/aromas");
  return res.json();
}

export async function createFlavor(flavor: Partial<Aroma>) {
  return fetch("/api/aromas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(flavor),
  });
}

export async function updateFlavor(id: string, flavor: Partial<Aroma>) {
  return fetch(`/api/aromas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(flavor),
  });
}

export async function deleteFlavor(id: string) {
  return fetch(`/api/aromas/${id}`, { method: "DELETE" });
}