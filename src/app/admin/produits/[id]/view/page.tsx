import React from "react";
import { notFound } from "next/navigation";
import { fetchProductById } from "@/utils/fetchProducts";
import ProductViewClient from "@/components/products/ProductViewClient";

async function getProduct(id: string) {
  try {
    return await fetchProductById(id);
  } catch {
    return null;
  }
}

export default async function ProductViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return notFound();
  return <ProductViewClient product={product} id={id} />;
}
