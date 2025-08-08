"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SubCategory } from "@/types/subcategory";
import { fetchSubcategories } from "@/utils/fetchSubcategories";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { FaSearch } from "react-icons/fa";
import { Category } from "@/types/category";
import { getCategories } from "@/services/categories";

function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function decodeHTMLEntities(text: string): string {
  if (!text) return "";
  const txt = document.createElement('textarea');
  txt.innerHTML = text;
  return txt.value;
}

export default function SubcategoryTable() {
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteSubcategory, setDeleteSubcategory] = useState<SubCategory | null>(null);
  const [deleteSelectionOpen, setDeleteSelectionOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchSubcategories(),
      getCategories()
    ])
      .then(([subs, cats]) => {
        setSubcategories(subs);
        setCategories(cats);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (subcategory: SubCategory) => {
    setDeleteSubcategory(subcategory);
  };

  const handleConfirmDelete = () => {
    // TODO: Replace with real delete logic
    alert("Sous-catégorie supprimée (placeholder): " + (deleteSubcategory?.designation_fr || deleteSubcategory?.designation || deleteSubcategory?.name));
    setDeleteSubcategory(null);
  };

  // Search and filter logic
  const filtered = subcategories.filter((sub) =>
    (sub.designation_fr || sub.designation || sub.name || sub.slug || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded shadow-sm p-4 w-full max-w-[1800px] mx-auto">
      <ConfirmDeleteModal
        open={!!deleteSubcategory}
        onClose={() => setDeleteSubcategory(null)}
        onConfirm={handleConfirmDelete}
        productName={deleteSubcategory?.designation_fr || deleteSubcategory?.designation || deleteSubcategory?.name}
      />
      <ConfirmDeleteModal
        open={deleteSelectionOpen}
        onClose={() => setDeleteSelectionOpen(false)}
        onConfirm={() => {
          setSubcategories((prev) => prev.filter(s => !selectedIds.includes(s._id)));
          setSelectedIds([]);
          setDeleteSelectionOpen(false);
        }}
        productName={selectedIds.length === 1
          ? (subcategories.find(s => s._id === selectedIds[0])?.designation_fr || subcategories.find(s => s._id === selectedIds[0])?.designation || subcategories.find(s => s._id === selectedIds[0])?.name)
          : `${selectedIds.length} sous-catégories`}
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
        <h2 className="text-xl font-semibold text-gray-700">Sous-catégories</h2>
        <div className="flex flex-wrap gap-2 ml-auto">
          <button
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded"
            disabled={selectedIds.length === 0}
            onClick={() => setDeleteSelectionOpen(true)}
          >
            🗑 Supprimer la sélection
          </button>
        </div>
      </div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Chercher"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded w-full text-sm pr-10"
          />
          <FaSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="overflow-x-auto" style={{ maxHeight: 'none' }}>
        <table className="min-w-full border divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-[#f9fafb] text-gray-700">
            <tr>
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedIds.length > 0 && filtered.every(s => selectedIds.includes(s._id))}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedIds(Array.from(new Set([...selectedIds, ...filtered.map(s => s._id)])));
                    } else {
                      setSelectedIds(selectedIds.filter(id => !filtered.map(s => s._id).includes(id)));
                    }
                  }}
                />
              </th>
              <th className="px-4 py-2 text-blue-600">Désignation</th>
              <th className="px-4 py-2">Catégories</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Review (SEO)</th>
              <th className="px-4 py-2">AggregateRating (SEO)</th>
              <th className="px-4 py-2">Slug</th>
              <th className="px-4 py-2">Créé le</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((sub) => {
              let categoryLabel = "";
              if (categories.length > 0 && sub.categorie_id) {
                const found = categories.find(cat =>
                  String(cat.id) === String(sub.categorie_id) ||
                  String(cat._id) === String(sub.categorie_id)
                );
                if (found) {
                  categoryLabel = found.designation_fr || found.designation || found.id || found._id;
                } else {
                  categoryLabel = String(sub.categorie_id);
                }
              } else {
                categoryLabel = sub.categorie_id || "";
              }
              return (
                <tr key={sub._id}>
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(sub._id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedIds(prev => [...prev, sub._id]);
                        } else {
                          setSelectedIds(prev => prev.filter(id => id !== sub._id));
                        }
                      }}
                    />
                  </td>
                  <td className="px-4 py-2 text-blue-600 underline cursor-pointer" onClick={() => router.push(`/admin/subcategories/${sub._id}/view`)}>
                    {sub.designation_fr || sub.designation || sub.name || sub.slug || sub.id || sub._id}
                  </td>
                  <td className="px-4 py-2">
                    {categoryLabel}
                  </td>
                  <td className="px-4 py-2 max-w-[200px] truncate" title={sub.description_fr || ""}>{
                    sub.description_fr
                      ? decodeHTMLEntities(stripHtml(sub.description_fr)).slice(0, 180) + (stripHtml(sub.description_fr).length > 180 ? '...' : '')
                      : "—"
                  }</td>
                  <td className="px-4 py-2 max-w-[180px] truncate" title={sub.review || ""}>{sub.review || "—"}</td>
                  <td className="px-4 py-2 max-w-[120px] truncate" title={sub.aggregateRating || ""}>{sub.aggregateRating || "—"}</td>
                  <td className="px-4 py-2">{sub.slug}</td>
                  <td className="px-4 py-2">{sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : ""}</td>
                  <td className="px-4 py-2 space-x-1">
                    <button
                      className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                      onClick={() => router.push(`/admin/subcategories/${sub._id}/view`)}
                    >
                      👁 Vue
                    </button>
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                      onClick={() => router.push(`/admin/subcategories/${sub._id}/edit`)}
                    >
                      ✏️ Éditer
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                      onClick={() => handleDelete(sub)}
                    >
                      🗑 Supprimer
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-gray-400">
                  Aucune sous-catégorie trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
