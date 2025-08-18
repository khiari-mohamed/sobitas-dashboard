"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Aroma } from "@/types/aroma";
import { getAllAromas } from "@/services/aroma";
import { FaSearch } from "react-icons/fa";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";

const defaultItemsPerPage = 10;

export default function AromaTable() {
  const [aromas, setAromas] = useState<Aroma[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [deleteAroma, setDeleteAroma] = useState<Aroma | null>(null);
  const [deleteSelectionOpen, setDeleteSelectionOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // const [totalAromas, setTotalAromas] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    getAllAromas()
      .then((data) => {
        setAromas(data);
        // setTotalAromas(data.length);
      })
      .catch(() => setAromas([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filtered = aromas.filter((a) =>
    (a.designation_fr || "").toLowerCase().includes(search.toLowerCase())
  );

  const paginated = search ? filtered : aromas;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, paginated.length);
  const currentAromas = paginated.slice(startIndex, endIndex);
  const totalPages = paginated.length === 0 ? 0 : Math.ceil(paginated.length / itemsPerPage);

  const handleDelete = (aroma: Aroma) => {
    setDeleteAroma(aroma);
  };

  const handleConfirmDelete = async () => {
    if (deleteAroma) {
      try {
        const { deleteAroma: deleteAromaService } = await import('@/services/aroma');
        await deleteAromaService(deleteAroma._id);
        setAromas((prev) => prev.filter(a => a._id !== deleteAroma._id));
        setSelectedIds((prev) => prev.filter(id => id !== deleteAroma._id));
      } catch (error) {
        console.error('Error deleting aroma:', error);
        alert('Erreur lors de la suppression de l\'arôme');
      }
    }
    setDeleteAroma(null);
  };

  const handleBulkDelete = async () => {
    try {
      const { deleteAroma: deleteAromaService } = await import('@/services/aroma');
      for (const id of selectedIds) {
        await deleteAromaService(id);
      }
      setAromas((prev) => prev.filter(a => !selectedIds.includes(a._id)));
      setSelectedIds([]);
    } catch (error) {
      console.error('Error deleting aromas:', error);
      alert('Erreur lors de la suppression des arômes');
    }
    setDeleteSelectionOpen(false);
  };

  return (
    <div className="bg-white rounded shadow-sm p-4 w-full max-w-[1800px] mx-auto">
      <ConfirmDeleteModal
        open={!!deleteAroma}
        onClose={() => setDeleteAroma(null)}
        onConfirm={handleConfirmDelete}
        productName={deleteAroma?.designation_fr}
      />
      <ConfirmDeleteModal
        open={deleteSelectionOpen}
        onClose={() => setDeleteSelectionOpen(false)}
        onConfirm={handleBulkDelete}
        productName={selectedIds.length === 1
          ? (aromas.find(a => a._id === selectedIds[0])?.designation_fr)
          : `${selectedIds.length} arômes`}
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
        <h2 className="text-xl font-semibold text-gray-700">Arômes</h2>
        <div className="flex flex-wrap gap-2 ml-auto">
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded"
            onClick={() => router.push('/admin/aromas/new')}
          >
            + Ajouter un arôme
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
      {/* Search Bar Only */}
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
      {/* Table */}
      <div className="overflow-x-auto" style={{ maxHeight: 'none' }}>
        <table className="min-w-full border divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-[#f9fafb] text-gray-700">
            <tr>
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedIds.length > 0 && currentAromas.every(a => selectedIds.includes(a._id))}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedIds(Array.from(new Set([...selectedIds, ...currentAromas.map(a => a._id)])));
                    } else {
                      setSelectedIds(selectedIds.filter(id => !currentAromas.map(a => a._id).includes(id)));
                    }
                  }}
                />
              </th>
              <th className="px-4 py-2 text-blue-600">Désignation</th>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Créé le</th>
              <th className="px-4 py-2">Modifié le</th>
              <th className="px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentAromas.map((aroma) => (
              <tr key={aroma._id}>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(aroma._id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedIds(prev => [...prev, aroma._id]);
                      } else {
                        setSelectedIds(prev => prev.filter(id => id !== aroma._id));
                      }
                    }}
                  />
                </td>
                <td className="px-4 py-2 text-blue-600 underline cursor-pointer" onClick={() => router.push(`/admin/aromas/${aroma._id}/view`)}>
                  {aroma.designation_fr}
                </td>
                <td className="px-4 py-2">{aroma.id}</td>
                <td className="px-4 py-2">{aroma.created_at}</td>
                <td className="px-4 py-2">{aroma.updated_at}</td>
                <td className="px-2 py-2 space-x-1">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/aromas/${aroma._id}/view`)}
                  >
                    👁 Vue
                  </button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/aromas/${aroma._id}/edit`)}
                  >
                    ✏️ Éditer
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleDelete(aroma)}
                  >
                    🗑 Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {currentAromas.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  Aucun arôme trouvé.
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
          Affichage {paginated.length === 0 ? 0 : (startIndex + 1)} à {paginated.length === 0 ? 0 : Math.min(endIndex, paginated.length)} de {paginated.length} entrées
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
