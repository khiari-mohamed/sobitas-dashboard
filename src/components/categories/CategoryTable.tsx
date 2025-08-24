"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/types/category";
import { getCategories, deleteCategory } from "@/services/categories";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { FaSearch } from "react-icons/fa";
import { getCategoryImageWithFallback } from "@/utils/imageUtils";

const defaultItemsPerPage = 10;

export default function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [deleteCategoryObj, setDeleteCategoryObj] = useState<Category | null>(null);
  const [deleteSelectionOpen, setDeleteSelectionOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    getCategories()
      .then((data) => setCategories(data))
      .finally(() => setLoading(false));
  }, []);

  // Filtering
  const filtered = categories.filter((c) =>
    (c.designation || c.designation_fr || c.title || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  const paginated = search ? filtered : categories;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, paginated.length);
  const totalPages = paginated.length === 0 ? 0 : Math.ceil(paginated.length / itemsPerPage);
  const pageItems = paginated.slice(startIndex, endIndex);

  const handleDelete = (cat: Category) => setDeleteCategoryObj(cat);

  const handleConfirmDelete = async () => {
    if (deleteCategoryObj) {
      await deleteCategory(deleteCategoryObj._id);
      setCategories((prev) => prev.filter((c) => c._id !== deleteCategoryObj._id));
      setDeleteCategoryObj(null);
      setSelectedIds((prev) => prev.filter((id) => id !== deleteCategoryObj._id));
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      await deleteCategory(id);
    }
    setCategories((prev) => prev.filter((c) => !selectedIds.includes(c._id)));
    setSelectedIds([]);
    setDeleteSelectionOpen(false);
  };

  return (
    <div>
      <ConfirmDeleteModal
        open={!!deleteCategoryObj}
        onClose={() => setDeleteCategoryObj(null)}
        onConfirm={handleConfirmDelete}
        productName={deleteCategoryObj?.designation || deleteCategoryObj?.designation_fr || deleteCategoryObj?.title}
      />
      <ConfirmDeleteModal
        open={deleteSelectionOpen}
        onClose={() => setDeleteSelectionOpen(false)}
        onConfirm={handleBulkDelete}
        productName={selectedIds.length === 1
          ? (categories.find(c => c._id === selectedIds[0])?.designation || categories.find(c => c._id === selectedIds[0])?.designation_fr || categories.find(c => c._id === selectedIds[0])?.title)
          : `${selectedIds.length} catégories`}
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
        <h2 className="text-xl font-semibold text-gray-700">Catégories</h2>
        <div className="flex flex-wrap gap-2 ml-auto">
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded"
            onClick={() => router.push('/admin/categories/new')}
          >
            + Ajouter une catégorie
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded"
            disabled={selectedIds.length === 0}
            onClick={() => setDeleteSelectionOpen(true)}
          >
            🗑 Supprimer la sélection
          </button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Chercher"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
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
                  checked={selectedIds.length > 0 && pageItems.every(c => selectedIds.includes(c._id))}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedIds(Array.from(new Set([...selectedIds, ...pageItems.map(c => c._id)])));
                    } else {
                      setSelectedIds(selectedIds.filter(id => !pageItems.map(c => c._id).includes(id)));
                    }
                  }}
                />
              </th>
              <th className="px-4 py-2">Couverture</th>
              <th className="px-4 py-2 text-blue-600">Désignation</th>
              <th className="px-4 py-2">Slug</th>
              <th className="px-4 py-2">Review (seo)</th>
              <th className="px-4 py-2">AggregateRating (seo)</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageItems.map((cat) => (
              <tr key={cat._id}>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(cat._id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedIds(prev => [...prev, cat._id]);
                      } else {
                        setSelectedIds(prev => prev.filter(id => id !== cat._id));
                      }
                    }}
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="flex justify-center items-center">
                    <img
                      src={(() => {
                        const { src } = getCategoryImageWithFallback(cat as unknown as Record<string, unknown>);
                        return src;
                      })()}
                      alt={cat.designation || cat.designation_fr || cat.title || "Category"}
                      width={80}
                      height={80}
                      className="rounded object-contain border border-gray-200 shadow"
                      style={{ width: 80, height: 80 }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const { fallback } = getCategoryImageWithFallback(cat as unknown as Record<string, unknown>);
                        if (fallback && target.src !== fallback) {
                          target.src = fallback;
                        } else if (cat.id && cat.id !== "") {
                          target.src = `/images/categories/${cat.id}.svg`;
                        } else if (cat.cover && cat.cover !== "") {
                          target.src = `/images/categories/${cat.cover.split('/').pop()}`;
                        } else {
                          target.src = "/images/placeholder.png";
                        }
                      }}
                    />
                  </div>
                </td>
                <td className="px-4 py-2 text-blue-600 underline cursor-pointer" onClick={() => router.push(`/admin/categories/${cat._id}/view`)}>
                  {cat.designation || cat.designation_fr || cat.title}
                </td>
                <td className="px-4 py-2">{cat.slug}</td>
                <td className="px-4 py-2 truncate max-w-[200px]">{cat.review ? (typeof cat.review === "string" ? cat.review : JSON.stringify(cat.review)) : "—"}</td>
                <td className="px-4 py-2 truncate max-w-[200px]">{cat.aggregateRating ? (typeof cat.aggregateRating === "string" ? cat.aggregateRating : JSON.stringify(cat.aggregateRating)) : "—"}</td>
                <td className="px-4 py-2 space-x-1">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/categories/${cat._id}/view`)}
                  >
                    👁 Vue
                  </button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/categories/${cat._id}/edit`)}
                  >
                    ✏️ Éditer
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleDelete(cat)}
                  >
                    🗑 Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                  Aucune catégorie trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm text-gray-600 w-full">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <span>Afficher</span>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={itemsPerPage}
            onChange={e => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[10, 15, 25, 50].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span>entrées par page</span>
        </div>
        <p>
          Affichage {paginated.length === 0 ? 0 : (startIndex + 1)} à {paginated.length === 0 ? 0 : Math.min(startIndex + pageItems.length, paginated.length)} de {paginated.length} entrées
        </p>
        <div className="mt-2 sm:mt-0 space-x-2">
          <button
            disabled={currentPage === 1 || loading}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ← Précédent
          </button>
          <button
            disabled={currentPage >= totalPages || totalPages === 0 || loading}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Suivant →
          </button>
        </div>
      </div>
    </div>
  );
}
