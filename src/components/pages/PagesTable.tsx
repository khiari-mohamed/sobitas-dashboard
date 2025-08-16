"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchPages, deletePage } from "@/services/page";
import { Page } from "@/types/page";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { FaSearch } from "react-icons/fa";

const defaultItemsPerPage = 10;

export default function PagesTable() {
  const [pages, setPages] = useState<Page[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [deletePageId, setDeletePageId] = useState<string | null>(null);
  const [deleteSelectionOpen, setDeleteSelectionOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetchPages()
      .then((data) => {
        if (!ignore) {
          setPages(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filtered = pages.filter((page) =>
    (page.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (page.slug || "").toLowerCase().includes(search.toLowerCase()) ||
    (page.body || "").toLowerCase().includes(search.toLowerCase())
  );

  const paginated = search ? filtered : pages;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, paginated.length);
  const currentPages = paginated.slice(startIndex, endIndex);
  const totalPages = paginated.length === 0 ? 0 : Math.ceil(paginated.length / itemsPerPage);

  const handleDelete = (id: string) => {
    setDeletePageId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePage(deletePageId!);
      setPages((prev) => prev.filter(p => p._id !== deletePageId));
      setDeletePageId(null);
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  const handleConfirmDeleteSelection = async () => {
    try {
      await Promise.all(selectedIds.map(id => deletePage(id)));
      setPages((prev) => prev.filter(p => !selectedIds.includes(p._id)));
      setSelectedIds([]);
      setDeleteSelectionOpen(false);
    } catch (error) {
      console.error('Error deleting pages:', error);
    }
  };

  return (
    <div className="bg-white rounded shadow-sm p-4 w-full max-w-[1800px] mx-auto">
      <ConfirmDeleteModal
        open={!!deletePageId}
        onClose={() => setDeletePageId(null)}
        onConfirm={handleConfirmDelete}
        productName={pages.find(p => p._id === deletePageId)?.title || "Page"}
      />
      <ConfirmDeleteModal
        open={deleteSelectionOpen}
        onClose={() => setDeleteSelectionOpen(false)}
        onConfirm={handleConfirmDeleteSelection}
        productName={selectedIds.length === 1
          ? (pages.find(p => p._id === selectedIds[0])?.title)
          : `${selectedIds.length} pages`}
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
        <h2 className="text-xl font-semibold text-gray-700">Pages</h2>
        <div className="flex flex-wrap gap-2 ml-auto">
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded"
            onClick={() => router.push('/admin/pages/new')}
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
                  checked={selectedIds.length > 0 && currentPages.every(p => selectedIds.includes(p._id))}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedIds(Array.from(new Set([...selectedIds, ...currentPages.map(p => p._id)])));
                    } else {
                      setSelectedIds(selectedIds.filter(id => !currentPages.map(p => p._id).includes(id)));
                    }
                  }}
                />
              </th>
              <th className="px-4 py-2 text-blue-600">Titre</th>
              <th className="px-4 py-2">Slug</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Enregistrement</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentPages.map((page) => (
              <tr key={page._id}>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(page._id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedIds(prev => [...prev, page._id]);
                      } else {
                        setSelectedIds(prev => prev.filter(id => id !== page._id));
                      }
                    }}
                  />
                </td>
                <td className="px-4 py-2 text-blue-600 underline cursor-pointer" onClick={() => router.push(`/admin/pages/${page._id}/view`)}>
                  {page.title}
                </td>
                <td className="px-4 py-2">{page.slug}</td>
                <td className="px-4 py-2">
                  <span className={
                    page.status === "ACTIVE"
                      ? "text-xs px-2 py-1 rounded bg-teal-500 text-white"
                      : "text-xs px-2 py-1 rounded bg-blue-200 text-blue-700"
                  }>
                    {page.status === "ACTIVE" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {page.createdAt ? new Date(page.createdAt).toLocaleString() : "—"}
                </td>
                <td className="px-4 py-2 space-x-1">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/pages/${page._id}/view`)}
                  >
                    👁 Vue
                  </button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/pages/${page._id}/edit`)}
                  >
                    ✏️ Éditer
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleDelete(page._id)}
                  >
                    🗑 Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {currentPages.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  Aucune page trouvée.
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
          Affichage {paginated.length === 0 ? 0 : (startIndex + 1)} à {paginated.length === 0 ? 0 : Math.min(startIndex + currentPages.length, paginated.length)} de {paginated.length} entrées
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
