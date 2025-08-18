import React from "react";
import { notFound } from "next/navigation";
import { fetchProductById } from "@/utils/fetchProducts";
import ProductEditForm from "@/components/products/ProductEditForm";

async function getProduct(id: string) {
  try {
    return await fetchProductById(id);
  } catch {
    return null;
  }
}

export default async function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return notFound();

  return <ProductEditForm product={product} />;
}
