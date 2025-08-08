import React from "react";
import CategoryTable from "@/components/categories/CategoryTable";

export default function CategoriesPage() {
  return (
    <div className="bg-white rounded shadow-sm p-4 w-full max-w-[1800px] mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Catégories</h1>
      <CategoryTable />
    </div>
  );
}
