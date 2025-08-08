"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchSeoPages, deleteSeoPage } from "@/services/seo-pages";
import { SeoPage } from "@/types/seo-pages";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { FaSearch } from "react-icons/fa";

const defaultItemsPerPage = 10;

export default function SeoPagesTable() {
  const [seoPages, setSeoPages] = useState<SeoPage[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [deleteSeoPageId, setDeleteSeoPageId] = useState<string | null>(null);
  const [deleteSelectionOpen, setDeleteSelectionOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetchSeoPages()
      .then((data) => {
        if (!ignore) {
          setSeoPages(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filtered = seoPages.filter((p) =>
    (p.page || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const paginated = search ? filtered : seoPages;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, paginated.length);
  const currentSeoPages = paginated.slice(startIndex, endIndex);
  const totalPages = paginated.length === 0 ? 0 : Math.ceil(paginated.length / itemsPerPage);

  const handleDelete = (id: string) => {
    setDeleteSeoPageId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteSeoPageId) {
      await deleteSeoPage(deleteSeoPageId);
      setSeoPages((prev) => prev.filter(p => p.id !== deleteSeoPageId));
      setDeleteSeoPageId(null);
    }
  };

  const handleConfirmDeleteSelection = async () => {
    for (const id of selectedIds) {
      await deleteSeoPage(id);
    }
    setSeoPages((prev) => prev.filter(p => !selectedIds.includes(p.id)));
    setSelectedIds([]);
    setDeleteSelectionOpen(false);
  };

  return (
    <div className="bg-white rounded shadow-sm p-4 w-full max-w-[1800px] mx-auto">
      <ConfirmDeleteModal
        open={!!deleteSeoPageId}
        onClose={() => setDeleteSeoPageId(null)}
        onConfirm={handleConfirmDelete}
        productName={seoPages.find(p => p.id === deleteSeoPageId)?.page || "SEO Page"}
      />
      <ConfirmDeleteModal
        open={deleteSelectionOpen}
        onClose={() => setDeleteSelectionOpen(false)}
        onConfirm={handleConfirmDeleteSelection}
        productName={selectedIds.length === 1
          ? (seoPages.find(p => p.id === selectedIds[0])?.page)
          : `${selectedIds.length} pages`}
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
        <h2 className="text-xl font-semibold text-gray-700">SEO Pages</h2>
        <div className="flex flex-wrap gap-2 ml-auto">
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded"
            onClick={() => router.push('/admin/seo_pages/new')}
          >
            + Ajouter nouveau
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
            placeholder="Chercher par page"
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
                  checked={selectedIds.length > 0 && currentSeoPages.every(p => selectedIds.includes(p.id))}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedIds(Array.from(new Set([...selectedIds, ...currentSeoPages.map(p => p.id)])));
                    } else {
                      setSelectedIds(selectedIds.filter(id => !currentSeoPages.map(p => p.id).includes(id)));
                    }
                  }}
                />
              </th>
              <th className="px-4 py-2 text-blue-600">ID</th>
              <th className="px-4 py-2">Page</th>
              <th className="px-4 py-2">Meta</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Nutrition</th>
              <th className="px-4 py-2">Questions</th>
              <th className="px-4 py-2">Zone 1</th>
              <th className="px-4 py-2">Zone 2</th>
              <th className="px-4 py-2">Zone 3</th>
              <th className="px-4 py-2">More Details</th>
              <th className="px-4 py-2">Date de création</th>
              <th className="px-4 py-2">Date de mise à jour</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentSeoPages.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(p.id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedIds(prev => [...prev, p.id]);
                      } else {
                        setSelectedIds(prev => prev.filter(id => id !== p.id));
                      }
                    }}
                  />
                </td>
                <td className="px-4 py-2 text-blue-600 underline cursor-pointer" onClick={() => router.push(`/admin/seo_pages/${p.id}/view`)}>
                  {p.id}
                </td>
                <td className="px-4 py-2">{p.page}</td>
                <td className="px-4 py-2 max-w-[200px] truncate" title={p.meta || ""}>{p.meta || "—"}</td>
                <td className="px-4 py-2 max-w-[200px] truncate" title={p.description_fr || ""}>{p.description_fr ? p.description_fr.replace(/<[^>]+>/g, "") : "—"}</td>
                <td className="px-4 py-2 max-w-[200px] truncate" title={p.nutrition_values || ""}>{p.nutrition_values ? p.nutrition_values.replace(/<[^>]+>/g, "") : "—"}</td>
                <td className="px-4 py-2 max-w-[200px] truncate" title={p.questions || ""}>{p.questions ? p.questions.replace(/<[^>]+>/g, "") : "—"}</td>
                <td className="px-4 py-2 max-w-[200px] truncate" title={p.zone1 || ""}>{p.zone1 ? p.zone1.replace(/<[^>]+>/g, "") : "—"}</td>
                <td className="px-4 py-2 max-w-[200px] truncate" title={p.zone2 || ""}>{p.zone2 ? p.zone2.replace(/<[^>]+>/g, "") : "—"}</td>
                <td className="px-4 py-2 max-w-[200px] truncate" title={p.zone3 || ""}>{p.zone3 ? p.zone3.replace(/<[^>]+>/g, "") : "—"}</td>
                <td className="px-4 py-2 max-w-[200px] truncate" title={p.more_details || ""}>{p.more_details ? p.more_details.replace(/<[^>]+>/g, "") : "—"}</td>
                <td className="px-4 py-2">{p.created_at ? new Date(p.created_at).toLocaleString() : "—"}</td>
                <td className="px-4 py-2">{p.updated_at ? new Date(p.updated_at).toLocaleString() : "—"}</td>
                <td className="px-4 py-2 space-x-1">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/seo_pages/${p.id}/view`)}
                  >
                    👁 Vue
                  </button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/seo_pages/${p.id}/edit`)}
                  >
                    ✏️ Éditer
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleDelete(p.id)}
                  >
                    🗑 Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {currentSeoPages.length === 0 && (
              <tr>
                <td colSpan={14} className="px-4 py-6 text-center text-gray-400">
                  Aucune page SEO trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
          Affichage {paginated.length === 0 ? 0 : (startIndex + 1)} à {paginated.length === 0 ? 0 : Math.min(startIndex + currentSeoPages.length, paginated.length)} de {paginated.length} entrées
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
