"use client";
import React from "react";
import { useRouter } from "next/navigation";
import SubcategoryTable from "@/components/subcategories/SubcategoryTable";

export default function SubcategoriesPage() {
  const router = useRouter();
  return (
    <div className="bg-white rounded shadow-sm p-4 w-full max-w-[1800px] mx-auto">
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
        <h2 className="text-xl font-semibold text-gray-700">Sous-catégories</h2>
        <div className="flex flex-wrap gap-2 ml-auto">
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded"
            onClick={() => router.push('/admin/subcategories/new')}
          >
            + Ajouter une sous-catégorie
          </button>
        </div>
      </div>
      <SubcategoryTable />
    </div>
  );
}
