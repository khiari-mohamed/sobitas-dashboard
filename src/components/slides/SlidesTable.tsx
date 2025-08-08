"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchSlides, deleteSlide } from "@/services/slides";
import { Slide } from "@/types/slides";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { FaSearch } from "react-icons/fa";

const defaultItemsPerPage = 10;

export default function SlidesTable() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [deleteSlideId, setDeleteSlideId] = useState<string | null>(null);
  const [deleteSelectionOpen, setDeleteSelectionOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetchSlides()
      .then((data) => {
        if (!ignore) {
          setSlides(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filtered = slides.filter((s) =>
    (s.id || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const paginated = search ? filtered : slides;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, paginated.length);
  const currentSlides = paginated.slice(startIndex, endIndex);
  const totalPages = paginated.length === 0 ? 0 : Math.ceil(paginated.length / itemsPerPage);

  const handleDelete = (id: string) => {
    setDeleteSlideId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteSlideId) {
      await deleteSlide(deleteSlideId);
      setSlides((prev) => prev.filter(s => s.id !== deleteSlideId));
      setDeleteSlideId(null);
    }
  };

  const handleConfirmDeleteSelection = async () => {
    for (const id of selectedIds) {
      await deleteSlide(id);
    }
    setSlides((prev) => prev.filter(s => !selectedIds.includes(s.id)));
    setSelectedIds([]);
    setDeleteSelectionOpen(false);
  };

  return (
    <div className="bg-white rounded shadow-sm p-4 w-full max-w-[1800px] mx-auto">
      <ConfirmDeleteModal
        open={!!deleteSlideId}
        onClose={() => setDeleteSlideId(null)}
        onConfirm={handleConfirmDelete}
        productName={slides.find(s => s.id === deleteSlideId)?.id || "Slide"}
      />
      <ConfirmDeleteModal
        open={deleteSelectionOpen}
        onClose={() => setDeleteSelectionOpen(false)}
        onConfirm={handleConfirmDeleteSelection}
        productName={selectedIds.length === 1
          ? (slides.find(s => s.id === selectedIds[0])?.id)
          : `${selectedIds.length} slides`}
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
        <h2 className="text-xl font-semibold text-gray-700">Slides</h2>
        <div className="flex flex-wrap gap-2 ml-auto">
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded"
            onClick={() => router.push('/admin/slides/new')}
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
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded"
            onClick={() => router.push('/admin/slides/control')}
          >
            Contrôle Frontend
          </button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Chercher par ID"
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
                  checked={selectedIds.length > 0 && currentSlides.every(s => selectedIds.includes(s.id))}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedIds(Array.from(new Set([...selectedIds, ...currentSlides.map(s => s.id)])));
                    } else {
                      setSelectedIds(selectedIds.filter(id => !currentSlides.map(s => s.id).includes(id)));
                    }
                  }}
                />
              </th>
              <th className="px-4 py-2 text-blue-600">ID</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Désignation</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Bouton</th>
              <th className="px-4 py-2">Lien</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Text Color</th>
              <th className="px-4 py-2">Text Weight</th>
              <th className="px-4 py-2">Enregistrement</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentSlides.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(s.id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedIds(prev => [...prev, s.id]);
                      } else {
                        setSelectedIds(prev => prev.filter(id => id !== s.id));
                      }
                    }}
                  />
                </td>
                <td className="px-4 py-2 text-blue-600 underline cursor-pointer" onClick={() => router.push(`/admin/slides/${s.id}/view`)}>
                  {s.id}
                </td>
                <td className="px-4 py-2">{s.cover ? <img src={`/${s.cover}`} alt="slide cover" width={200} height={100} className="object-contain border rounded" /> : "—"}</td>
                <td className="px-4 py-2">{s.designation_fr || "—"}</td>
                <td className="px-4 py-2 max-w-[200px] truncate" title={s.description_fr || ""}>{s.description_fr || "—"}</td>
                <td className="px-4 py-2">{s.btn_text_fr || "—"}</td>
                <td className="px-4 py-2">{s.btn_link ? <a href={s.btn_link} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">{s.btn_link}</a> : "—"}</td>
                <td className="px-4 py-2">{s.position || "—"}</td>
                <td className="px-4 py-2">{s.type || "—"}</td>
                <td className="px-4 py-2">{s.text_color || "��"}</td>
                <td className="px-4 py-2">{s.text_weight || "—"}</td>
                <td className="px-4 py-2">{s.created_at ? new Date(s.created_at).toLocaleString() : "—"}</td>
                <td className="px-4 py-2 space-x-1">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/slides/${s.id}/view`)}
                  >
                    👁 Vue
                  </button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/slides/${s.id}/edit`)}
                  >
                    ✏️ Éditer
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleDelete(s.id)}
                  >
                    🗑 Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {currentSlides.length === 0 && (
              <tr>
                <td colSpan={13} className="px-4 py-6 text-center text-gray-400">
                  Aucun slide trouvé.
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
          Affichage {paginated.length === 0 ? 0 : (startIndex + 1)} à {paginated.length === 0 ? 0 : Math.min(startIndex + currentSlides.length, paginated.length)} de {paginated.length} entrées
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
