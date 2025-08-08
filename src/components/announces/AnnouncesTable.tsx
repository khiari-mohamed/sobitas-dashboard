"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAnnonces, deleteAnnonce } from "@/services/annonces";
import { Annonce } from "@/types/annonces";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { FaSearch } from "react-icons/fa";

const defaultItemsPerPage = 10;

export default function AnnouncesTable() {
  const [announces, setAnnounces] = useState<Annonce[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [deleteAnnonceId, setDeleteAnnonceId] = useState<string | null>(null);
  const [deleteSelectionOpen, setDeleteSelectionOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetchAnnonces()
      .then((data) => {
        if (!ignore) {
          setAnnounces(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filtered = announces.filter((a) =>
    (a.id || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const paginated = search ? filtered : announces;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, paginated.length);
  const currentAnnounces = paginated.slice(startIndex, endIndex);
  const totalPages = paginated.length === 0 ? 0 : Math.ceil(paginated.length / itemsPerPage);

  const handleDelete = (id: string) => {
    setDeleteAnnonceId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteAnnonceId) {
      await deleteAnnonce(deleteAnnonceId);
      setAnnounces((prev) => prev.filter(a => a.id !== deleteAnnonceId));
      setDeleteAnnonceId(null);
    }
  };

  const handleConfirmDeleteSelection = async () => {
    for (const id of selectedIds) {
      await deleteAnnonce(id);
    }
    setAnnounces((prev) => prev.filter(a => !selectedIds.includes(a.id)));
    setSelectedIds([]);
    setDeleteSelectionOpen(false);
  };

  return (
    <div className="bg-white rounded shadow-sm p-4 w-full max-w-[1800px] mx-auto">
      <ConfirmDeleteModal
        open={!!deleteAnnonceId}
        onClose={() => setDeleteAnnonceId(null)}
        onConfirm={handleConfirmDelete}
        productName={announces.find(a => a.id === deleteAnnonceId)?.id || "Annonce"}
      />
      <ConfirmDeleteModal
        open={deleteSelectionOpen}
        onClose={() => setDeleteSelectionOpen(false)}
        onConfirm={handleConfirmDeleteSelection}
        productName={selectedIds.length === 1
          ? (announces.find(a => a.id === selectedIds[0])?.id)
          : `${selectedIds.length} annonces`}
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
        <h2 className="text-xl font-semibold text-gray-700">Annonces</h2>
        <div className="flex flex-wrap gap-2 ml-auto">
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded"
            onClick={() => router.push('/admin/announces/new')}
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
                  checked={selectedIds.length > 0 && currentAnnounces.every(a => selectedIds.includes(a.id))}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedIds(Array.from(new Set([...selectedIds, ...currentAnnounces.map(a => a.id)])));
                    } else {
                      setSelectedIds(selectedIds.filter(id => !currentAnnounces.map(a => a.id).includes(id)));
                    }
                  }}
                />
              </th>
              <th className="px-4 py-2 text-blue-600">ID</th>
              <th className="px-4 py-2">Image 1</th>
              <th className="px-4 py-2">Image 2</th>
              <th className="px-4 py-2">Image 3</th>
              <th className="px-4 py-2">Image 4</th>
              <th className="px-4 py-2">Image 5</th>
              <th className="px-4 py-2">Image 6</th>
              <th className="px-4 py-2">Lien 1</th>
              <th className="px-4 py-2">Lien 2</th>
              <th className="px-4 py-2">Lien 3</th>
              <th className="px-4 py-2">Lien 4</th>
              <th className="px-4 py-2">Lien 5</th>
              <th className="px-4 py-2">Lien 6</th>
              <th className="px-4 py-2">Default Cover</th>
              <th className="px-4 py-2">Enregistrement</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentAnnounces.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(a.id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedIds(prev => [...prev, a.id]);
                      } else {
                        setSelectedIds(prev => prev.filter(id => id !== a.id));
                      }
                    }}
                  />
                </td>
                <td className="px-4 py-2 text-blue-600 underline cursor-pointer" onClick={() => router.push(`/admin/announces/${a.id}/view`)}>
                  {a.id}
                </td>
                <td className="px-4 py-2">{a.image_1 ? <img src={`/${a.image_1}`} alt="img1" width={100} height={60} className="object-contain border rounded" style={{ display: 'block', margin: '0 auto' }} /> : "—"}</td>
                <td className="px-4 py-2">{a.image_2 ? <img src={`/${a.image_2}`} alt="img2" width={100} height={60} className="object-contain border rounded" style={{ display: 'block', margin: '0 auto' }} /> : "—"}</td>
                <td className="px-4 py-2">{a.image_3 ? <img src={`/${a.image_3}`} alt="img3" width={100} height={60} className="object-contain border rounded" style={{ display: 'block', margin: '0 auto' }} /> : "—"}</td>
                <td className="px-4 py-2">{a.image_4 ? <img src={`/${a.image_4}`} alt="img4" width={100} height={60} className="object-contain border rounded" style={{ display: 'block', margin: '0 auto' }} /> : "—"}</td>
                <td className="px-4 py-2">{a.image_5 ? <img src={`/${a.image_5}`} alt="img5" width={100} height={60} className="object-contain border rounded" style={{ display: 'block', margin: '0 auto' }} /> : "—"}</td>
                <td className="px-4 py-2">{a.image_6 ? <img src={`/${a.image_6}`} alt="img6" width={100} height={60} className="object-contain border rounded" style={{ display: 'block', margin: '0 auto' }} /> : "—"}</td>
                <td className="px-4 py-2">{a.link_img_1 ? <a href={a.link_img_1} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">Lien 1</a> : "—"}</td>
                <td className="px-4 py-2">{a.link_img_2 ? <a href={a.link_img_2} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">Lien 2</a> : "—"}</td>
                <td className="px-4 py-2">{a.link_img_3 ? <a href={a.link_img_3} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">Lien 3</a> : "—"}</td>
                <td className="px-4 py-2">{a.link_img_4 ? <a href={a.link_img_4} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">Lien 4</a> : "—"}</td>
                <td className="px-4 py-2">{a.link_img_5 ? <a href={a.link_img_5} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">Lien 5</a> : "—"}</td>
                <td className="px-4 py-2">{a.link_img_6 ? <a href={a.link_img_6} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">Lien 6</a> : "—"}</td>
                <td className="px-4 py-2">{a.products_default_cover ? <img src={`/${a.products_default_cover}`} alt="default cover" width={100} height={60} className="object-contain border rounded" style={{ display: 'block', margin: '0 auto' }} /> : "—"}</td>
                <td className="px-4 py-2">{a.created_at ? new Date(a.created_at).toLocaleString() : "—"}</td>
                <td className="px-4 py-2 space-x-1">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/announces/${a.id}/view`)}
                  >
                    👁 Vue
                  </button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/announces/${a.id}/edit`)}
                  >
                    ✏️ Éditer
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleDelete(a.id)}
                  >
                    🗑 Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {currentAnnounces.length === 0 && (
              <tr>
                <td colSpan={17} className="px-4 py-6 text-center text-gray-400">
                  Aucune annonce trouvée.
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
          Affichage {paginated.length === 0 ? 0 : (startIndex + 1)} à {paginated.length === 0 ? 0 : Math.min(startIndex + currentAnnounces.length, paginated.length)} de {paginated.length} entrées
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
