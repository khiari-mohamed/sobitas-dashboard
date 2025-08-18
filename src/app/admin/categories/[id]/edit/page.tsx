import React from "react";
import { notFound } from "next/navigation";
import { getCategories } from "@/services/categories";
import CategoryEditForm from "../../../../../components/categories/CategoryEditForm";

async function getCategory(id: string) {
  try {
    const categories = await getCategories();
    return categories.find((cat) => cat._id === id) || null;
  } catch {
    return null;
  }
}

export default async function CategoryEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await getCategory(id);
  if (!category) return notFound();
  return <CategoryEditForm category={category} />;
}
