"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCoordinates, deleteCoordinate } from "@/services/coordinates";
import { Coordinates } from "@/types/coordinates";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { FaSearch } from "react-icons/fa";

const defaultItemsPerPage = 10;

export default function CoordinatesTable() {
  const [coordinates, setCoordinates] = useState<Coordinates[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [deleteCoordinateId, setDeleteCoordinateId] = useState<string | null>(null);
  const [deleteSelectionOpen, setDeleteSelectionOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetchCoordinates()
      .then((data) => {
        if (!ignore) {
          setCoordinates(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filtered = coordinates.filter((c) =>
    (c.designation_fr || c.abbreviation || c.email || c.phone_1 || c.phone_2 || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const paginated = search ? filtered : coordinates;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, paginated.length);
  const currentCoordinates = paginated.slice(startIndex, endIndex);
  const totalPages = paginated.length === 0 ? 0 : Math.ceil(paginated.length / itemsPerPage);

  const handleDelete = (id: string) => {
    setDeleteCoordinateId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteCoordinateId) {
      await deleteCoordinate(deleteCoordinateId);
      setCoordinates((prev) => prev.filter(c => c.id !== deleteCoordinateId));
      setDeleteCoordinateId(null);
    }
  };

  const handleConfirmDeleteSelection = async () => {
    for (const id of selectedIds) {
      await deleteCoordinate(id);
    }
    setCoordinates((prev) => prev.filter(c => !selectedIds.includes(c.id)));
    setSelectedIds([]);
    setDeleteSelectionOpen(false);
  };

  return (
    <div className="bg-white rounded shadow-sm p-4 w-full max-w-[1800px] mx-auto">
      <ConfirmDeleteModal
        open={!!deleteCoordinateId}
        onClose={() => setDeleteCoordinateId(null)}
        onConfirm={handleConfirmDelete}
        productName={coordinates.find(c => c.id === deleteCoordinateId)?.designation_fr || "Coordonnée"}
      />
      <ConfirmDeleteModal
        open={deleteSelectionOpen}
        onClose={() => setDeleteSelectionOpen(false)}
        onConfirm={handleConfirmDeleteSelection}
        productName={selectedIds.length === 1
          ? (coordinates.find(c => c.id === selectedIds[0])?.designation_fr)
          : `${selectedIds.length} coordonnées`}
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
        <h2 className="text-xl font-semibold text-gray-700">Coordonnées</h2>
        <div className="flex flex-wrap gap-2 ml-auto">
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded"
            onClick={() => router.push('/admin/coordinates/new')}
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
                  checked={selectedIds.length > 0 && currentCoordinates.every(c => selectedIds.includes(c.id))}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedIds(Array.from(new Set([...selectedIds, ...currentCoordinates.map(c => c.id)])));
                    } else {
                      setSelectedIds(selectedIds.filter(id => !currentCoordinates.map(c => c.id).includes(id)));
                    }
                  }}
                />
              </th>
              <th className="px-4 py-2 text-blue-600">Désignation</th>
              <th className="px-4 py-2">Logo</th>
              <th className="px-4 py-2">Logo Facture</th>
              <th className="px-4 py-2">WhatsApp</th>
              <th className="px-4 py-2">TikTok</th>
              <th className="px-4 py-2">Abbréviation</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Téléphone 1</th>
              <th className="px-4 py-2">Téléphone 2</th>
              <th className="px-4 py-2">Timbre</th>
              <th className="px-4 py-2">TVA</th>
              <th className="px-4 py-2">Copyright</th>
              <th className="px-4 py-2">Description Footer</th>
              <th className="px-4 py-2">Footer</th>
              <th className="px-4 py-2">Enregistrement</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentCoordinates.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(c.id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedIds(prev => [...prev, c.id]);
                      } else {
                        setSelectedIds(prev => prev.filter(id => id !== c.id));
                      }
                    }}
                  />
                </td>
                <td className="px-4 py-2 text-blue-600 underline cursor-pointer" onClick={() => router.push(`/admin/coordinates/${c.id}/view`)}>
                  {c.designation_fr || c.abbreviation || c.id}
                </td>
                {/* Logo */}
                <td className="px-4 py-2">
                  {c.logo ? (
                    <img src={c.logo.startsWith('/') ? c.logo : `/${c.logo}`} alt="logo" width={200} height={100} style={{ objectFit: 'contain' }} className="border rounded" />
                  ) : "—"}
                </td>
                {/* Logo Facture */}
                <td className="px-4 py-2">
                  {c.logo_facture ? (
                    <img src={c.logo_facture.startsWith('/') ? c.logo_facture : `/${c.logo_facture}`} alt="logo facture" width={200} height={100} style={{ objectFit: 'contain' }} className="border rounded" />
                  ) : "—"}
                </td>
                {/* WhatsApp */}
                <td className="px-4 py-2">
                  {c.whatsapp_link ? (
                    <a href={c.whatsapp_link} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">WhatsApp</a>
                  ) : "—"}
                </td>
                {/* TikTok */}
                <td className="px-4 py-2">
                  {c.tiktok_link ? (
                    <a href={c.tiktok_link} target="_blank" rel="noopener noreferrer" className="text-pink-600 underline">TikTok</a>
                  ) : "—"}
                </td>
                <td className="px-4 py-2">{c.abbreviation}</td>
                <td className="px-4 py-2">{c.email}</td>
                <td className="px-4 py-2">{c.phone_1}</td>
                <td className="px-4 py-2">{c.phone_2}</td>
                <td className="px-4 py-2">{c.timbre}</td>
                <td className="px-4 py-2">{c.tva}</td>
                <td className="px-4 py-2">{c.copyright}</td>
                {/* Description Footer */}
                <td className="px-4 py-2 max-w-[250px] truncate" title={c.short_description_fr}>{c.short_description_fr}</td>
                <td className="px-4 py-2 max-w-[200px] truncate" title={c.footer_ticket}>{c.footer_ticket}</td>
                <td className="px-4 py-2">{c.created_at ? new Date(c.created_at).toLocaleString() : "—"}</td>
                <td className="px-4 py-2 space-x-1">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/coordinates/${c.id}/view`)}
                  >
                    👁 Vue
                  </button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/coordinates/${c.id}/edit`)}
                  >
                    ✏️ Éditer
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleDelete(c.id)}
                  >
                    🗑 Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {currentCoordinates.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-400">
                  Aucune coordonnée trouvée.
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
          Affichage {paginated.length === 0 ? 0 : (startIndex + 1)} à {paginated.length === 0 ? 0 : Math.min(startIndex + currentCoordinates.length, paginated.length)} de {paginated.length} entrées
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
