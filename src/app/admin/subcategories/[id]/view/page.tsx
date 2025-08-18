import React from "react";
import { notFound } from "next/navigation";
import { fetchSubcategories } from "@/utils/fetchSubcategories";
import SubcategoryViewClient from "../../../../../components/subcategories/SubcategoryViewClient";

async function getSubcategory(id: string) {
  try {
    const all = await fetchSubcategories();
    return all.find((s) => s._id === id);
  } catch {
    return null;
  }
}

export default async function SubcategoryViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const subcategory = await getSubcategory(id);
  if (!subcategory) return notFound();
  return <SubcategoryViewClient subcategory={subcategory} id={id} />;
}
