"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchAllPacks, deletePack } from "@/services/pack";
import { Pack } from "@/types/pack";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { FaSearch } from "react-icons/fa";

const defaultItemsPerPage = 10;

export default function PacksTable() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [deletePackId, setDeletePackId] = useState<string | null>(null);
  const [deleteSelectionOpen, setDeleteSelectionOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetchAllPacks()
      .then((data) => {
        if (!ignore) {
          setPacks(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filtered = packs.filter((p) =>
    (p.designation_fr || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const paginated = search ? filtered : packs;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, paginated.length);
  const currentPacks = paginated.slice(startIndex, endIndex);
  const totalPages = paginated.length === 0 ? 0 : Math.ceil(paginated.length / itemsPerPage);

  const handleDelete = (id: string) => {
    setDeletePackId(id);
  };

  const handleConfirmDelete = async () => {
    if (deletePackId) {
      try {
        await deletePack(deletePackId);
        setPacks((prev) => prev.filter(p => p._id !== deletePackId));
        setDeletePackId(null);
      } catch (error) {
        console.error("Error deleting pack:", error);
      }
    }
  };

  const handleConfirmDeleteSelection = async () => {
    try {
      for (const id of selectedIds) {
        await deletePack(id);
      }
      setPacks((prev) => prev.filter(p => !p._id || !selectedIds.includes(p._id)));
      setSelectedIds([]);
      setDeleteSelectionOpen(false);
    } catch (error) {
      console.error("Error deleting packs:", error);
    }
  };

  const getPackImage = (pack: Pack, index: number) => {
    if (pack.mainImage?.url) return pack.mainImage.url;
    if (pack.cover && pack.cover !== "undefined") {
      if (pack.cover.startsWith('http') || pack.cover.startsWith('/')) {
        return pack.cover;
      }
      return `/${pack.cover.replace(/^\/+/, "")}`;
    }
    return "/images/placeholder.png";
  };

  return (
    <div className="bg-white rounded shadow-sm p-4 w-full max-w-[1800px] mx-auto">
      <ConfirmDeleteModal
        open={!!deletePackId}
        onClose={() => setDeletePackId(null)}
        onConfirm={handleConfirmDelete}
        productName={packs.find(p => p._id === deletePackId)?.designation_fr || "Pack"}
      />
      <ConfirmDeleteModal
        open={deleteSelectionOpen}
        onClose={() => setDeleteSelectionOpen(false)}
        onConfirm={handleConfirmDeleteSelection}
        productName={selectedIds.length === 1
          ? (packs.find(p => p._id === selectedIds[0])?.designation_fr)
          : `${selectedIds.length} packs`}
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
        <h2 className="text-xl font-semibold text-gray-700">Packs</h2>
        <div className="flex flex-wrap gap-2 ml-auto">
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded"
            onClick={() => router.push('/admin/packs/new')}
          >
            + Ajouter nouveau
          </button>
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white text-sm px-4 py-2 rounded"
            onClick={() => router.push('/admin/packs/control')}
          >
            🎛️ Contrôler
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
            placeholder="Chercher par désignation"
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
                  checked={selectedIds.length > 0 && currentPacks.every(p => p._id && selectedIds.includes(p._id))}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedIds(Array.from(new Set([...selectedIds, ...currentPacks.map(p => p._id).filter((id): id is string => Boolean(id))])));
                    } else {
                      setSelectedIds(selectedIds.filter(id => !currentPacks.map(p => p._id).filter(Boolean).includes(id)));
                    }
                  }}
                />
              </th>
              <th className="px-4 py-2 text-blue-600">Désignation</th>
              <th className="px-4 py-2">Couverture</th>
              <th className="px-4 py-2">Slug</th>
              <th className="px-2 py-2">Qte</th>
              <th className="px-2 py-2">Prix</th>
              <th className="px-2 py-2">Promo</th>
              <th className="px-2 py-2">Publier</th>
              <th className="px-2 py-2">Pack</th>
              <th className="px-2 py-2">New Product</th>
              <th className="px-2 py-2">Etat de stock</th>
              <th className="px-2 py-2">Meilleures ventes</th>
              <th className="px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentPacks.map((pack, index) => (
              <tr key={pack._id}>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={pack._id ? selectedIds.includes(pack._id) : false}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedIds(prev => pack._id ? [...prev, pack._id] : prev);
                      } else {
                        setSelectedIds(prev => prev.filter(id => id !== pack._id));
                      }
                    }}
                  />
                </td>
                <td className="px-4 py-2 text-blue-600 underline cursor-pointer" onClick={() => router.push(`/admin/packs/${pack._id}/view`)}>
                  {pack.designation_fr}
                </td>
                <td className="px-4 py-2">
                  <div className="flex justify-center items-center">
                    <Image
                      src={getPackImage(pack, index)}
                      alt="cover"
                      width={100}
                      height={100}
                      className="rounded object-contain border border-gray-200 shadow"
                      style={{ width: 100, height: 100 }}
                    />
                  </div>
                </td>
                <td className="px-4 py-2">{pack.slug || "—"}</td>
                <td className="px-2 py-2">{pack.qte || "—"}</td>
                <td className="px-2 py-2">{pack.prix || "—"}</td>
                <td className="px-2 py-2">{pack.promo || "—"}</td>
                <td className="px-2 py-2">
                  <span className={`text-xs px-2 py-1 rounded ${pack.publier === "1" ? "bg-teal-500 text-white" : "bg-blue-200 text-blue-700"}`}>
                    {pack.publier === "1" ? "Publié" : "Non publié"}
                  </span>
                </td>
                <td className="px-2 py-2">
                  <span className={`text-xs px-2 py-1 rounded ${pack.pack === "1" ? "bg-teal-500 text-white" : "bg-blue-200 text-blue-700"}`}>
                    {pack.pack === "1" ? "Oui" : "Non"}
                  </span>
                </td>
                <td className="px-2 py-2">
                  <span className={`text-xs px-2 py-1 rounded ${pack.new_product === "1" ? "bg-teal-500 text-white" : "bg-blue-200 text-blue-700"}`}>
                    {pack.new_product === "1" ? "Oui" : "Non"}
                  </span>
                </td>
                <td className="px-2 py-2">
                  <span className={`text-xs px-2 py-1 rounded ${pack.rupture === "1" ? "bg-red-200 text-red-700" : "bg-green-200 text-green-700"}`}>
                    {pack.rupture === "1" ? "Rupture" : "En Stock"}
                  </span>
                </td>
                <td className="px-2 py-2">
                  <span className={`text-xs px-2 py-1 rounded ${pack.best_seller === "1" ? "bg-teal-500 text-white" : "bg-blue-200 text-blue-700"}`}>
                    {pack.best_seller === "1" ? "Oui" : "Non"}
                  </span>
                </td>
                <td className="px-2 py-2 space-x-1">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/packs/${pack._id}/view`)}
                  >
                    👁 Vue
                  </button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/packs/${pack._id}/edit`)}
                  >
                    ✏️ Éditer
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => pack._id && handleDelete(pack._id)}
                  >
                    🗑 Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {currentPacks.length === 0 && (
              <tr>
                <td colSpan={13} className="px-4 py-6 text-center text-gray-400">
                  Aucun pack trouvé.
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
          Affichage {paginated.length === 0 ? 0 : (startIndex + 1)} à {paginated.length === 0 ? 0 : Math.min(startIndex + currentPacks.length, paginated.length)} de {paginated.length} entrées
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
