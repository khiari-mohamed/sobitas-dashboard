import { MusculationProduct } from "@/types/MusculationProducts";

export async function fetchMusculationProducts(): Promise<MusculationProduct[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/musculation-products`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch musculation products");
    return await res.json();
  } catch (error) {
    console.error("Error fetching musculation products:", error);
    return [];
  }
}

// NEW FUNCTION: Fetch a single product by slug
export async function fetchMusculationProductBySlug(slug: string): Promise<MusculationProduct | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/musculation-products/slug/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch musculation product by slug");
    return await res.json();
  } catch (error) {
    console.error("Error fetching musculation product by slug:", error);
    return null;
  }
}


// Create a new musculation product
export async function createMusculationProduct(payload: Partial<MusculationProduct>) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/musculation-products/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create musculation product");
  return await res.json();
}

// Update a musculation product
export async function updateMusculationProduct(id: string, payload: Partial<MusculationProduct>) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/musculation-products/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update musculation product");
  return await res.json();
}

// Delete a musculation product
export async function deleteMusculationProduct(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/musculation-products/delete/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete musculation product");
  return await res.json();
}