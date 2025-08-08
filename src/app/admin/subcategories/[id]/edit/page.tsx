import React from "react";
import { notFound } from "next/navigation";
import { fetchSubcategories } from "@/utils/fetchSubcategories";
import SubcategoryEditForm from "../../../../../components/subcategories/SubcategoryEditForm";

async function getSubcategory(id: string) {
  try {
    const all = await fetchSubcategories();
    return all.find((s) => s._id === id);
  } catch {
    return null;
  }
}

export default async function SubcategoryEditPage({ params }: { params: { id: string } }) {
  const subcategory = await getSubcategory(params.id);
  if (!subcategory) return notFound();
  return <SubcategoryEditForm subcategory={subcategory} />;
}
