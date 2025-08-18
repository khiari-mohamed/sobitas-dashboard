import React from "react";
import { notFound } from "next/navigation";
import { getCategories } from "@/services/categories";
import CategoryViewClient from "@/components/categories/CategoryViewClient";

async function getCategory(id: string) {
  try {
    const categories = await getCategories();
    return categories.find((cat) => cat._id === id) || null;
  } catch {
    return null;
  }
}

export default async function CategoryViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await getCategory(id);
  if (!category) return notFound();
  return <CategoryViewClient category={category} id={id} />;
}
