"use client";
import React, { useEffect, useState } from "react";
import { SubCategory } from "@/types/subcategory";
import { getCategories } from "@/services/categories";
import { Category } from "@/types/category";
import { getSubCategoryById } from "@/services/subcategories";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";

function renderHTML(html: string | null | undefined) {
  if (!html) return <span className="text-gray-400">—</span>;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function SubcategoryViewClient({ id }: { subcategory?: SubCategory; id: string }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategory, setSubcategory] = useState<SubCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
    getSubCategoryById(id)
      .then((data) => setSubcategory(data))
      .finally(() => setLoading(false));
  }, [id]);

  // Wait for both subcategory and categories to be loaded
  if (loading || !subcategory || categories.length === 0) {
    return <div className="px-2 sm:px-6 lg:px-12 py-8">Chargement...</div>;
  }

  let categoryLabel = "—";
  if (categories.length > 0 && subcategory.categorie_id) {
    const found = categories.find(cat =>
      String(cat.id) === String(subcategory.categorie_id) ||
      String(cat._id) === String(subcategory.categorie_id)
    );
    if (found) {
      categoryLabel = found.designation_fr || found.designation || found.id || found._id;
    } else {
      categoryLabel = String(subcategory.categorie_id);
    }
  }

  const handleDelete = () => {
    setShowDelete(false);
    // TODO: Replace with real delete logic
    alert("Sous-catégorie supprimée (placeholder)");
  };

  return (
    <div className="px-2 sm:px-6 lg:px-12 py-8">
      {/* Top Buttons */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => router.push(`/admin/subcategories/${id}/edit`)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaEdit /> Éditer
        </button>
        <button
          type="button"
          onClick={() => setShowDelete(true)}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaTrash /> Supprimer
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/subcategories")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaArrowLeft /> Retourner à la liste
        </button>
      </div>
      <ConfirmDeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        productName={subcategory.designation_fr || subcategory.designation || subcategory.slug || subcategory._id}
      />
      <div className="bg-white rounded-xl shadow-lg p-10 w-full">
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Catégorie</h3>
        <div className="mb-6 text-lg">{categoryLabel}</div>
        <hr className="my-6 border-gray-200" />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Désignation</h3>
        <div className="mb-6 text-lg">{subcategory.designation_fr || subcategory.designation || "—"}</div>
        <hr className="my-6 border-gray-200" />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Slug</h3>
        <div className="mb-6 text-lg">{subcategory.slug || "���"}</div>
        <hr className="my-6 border-gray-200" />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Description</h3>
        <div className="mb-6 text-lg">{renderHTML(subcategory.description_fr)}</div>
        <hr className="my-6 border-gray-200" />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Alt Cover</h3>
        <div className="mb-6 text-lg">{subcategory.alt_cover || "—"}</div>
        <hr className="my-6 border-gray-200" />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Description cover (seo)</h3>
        <div className="mb-6 text-lg">{subcategory.description_cove || "—"}</div>
        <hr className="my-6 border-gray-200" />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Meta (name;content/name;content...)</h3>
        <div className="mb-6 text-lg">{renderHTML(subcategory.meta)}</div>
        <hr className="my-6 border-gray-200" />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Schema description (seo)</h3>
        <div className="mb-6 text-lg">{renderHTML(subcategory.content_seo)}</div>
        <hr className="my-6 border-gray-200" />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Review (seo)</h3>
        <div className="mb-6 text-lg">{renderHTML(subcategory.review)}</div>
        <hr className="my-6 border-gray-200" />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">AggregateRating (seo)</h3>
        <div className="mb-6 text-lg">{subcategory.aggregateRating || "—"}</div>
        <hr className="my-6 border-gray-200" />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Nutrition Values</h3>
        <div className="mb-6 text-lg">{renderHTML(subcategory.nutrition_values)}</div>
        <hr className="my-6 border-gray-200" />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Questions</h3>
        <div className="mb-6 text-lg">{renderHTML(subcategory.questions)}</div>
        <hr className="my-6 border-gray-200" />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">More Details</h3>
        <div className="mb-6 text-lg">{renderHTML(subcategory.more_details)}</div>
        <hr className="my-6 border-gray-200" />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Tabilation Zone 1</h3>
        <div className="mb-6 text-lg">{subcategory.zone1 || "—"}</div>
        <hr className="my-6 border-gray-200" />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Tabilation Zone 2</h3>
        <div className="mb-6 text-lg">{subcategory.zone2 || "—"}</div>
        <hr className="my-6 border-gray-200" />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Tabilation Zone 3</h3>
        <div className="mb-6 text-lg">{subcategory.zone3 || "—"}</div>
      </div>
    </div>
  );
}
