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

export default async function ProductEditPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) return notFound();

  return <ProductEditForm product={product} />;
}
