"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { fetchFactures, deleteFacture } from "@/services/facture";
import { Facture } from "@/types/facture";

const defaultItemsPerPage = 10;

export default function FactureTable() {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [deleteFactureObj, setDeleteFactureObj] = useState<Facture | null>(null);
  const [deleteSelectionOpen, setDeleteSelectionOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [totalFactures, setTotalFactures] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams?.get("tab") || "facture";

  // Fetch factures from backend
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetchFactures()
      .then((data: Facture[]) => {
        if (!ignore) {
          setFactures(data);
          setTotalFactures(data.length);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    return () => { ignore = true; };
  }, []);

  // Reset to first page on search
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Sort by created_at descending (newest first)
  const sortedFactures = [...factures].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateB - dateA;
  });

  // Filtering on frontend for search
  const filtered = sortedFactures.filter((f) => {
    const s = search.toLowerCase();
    return (
      f.numero?.toLowerCase().includes(s) ||
      f.nom?.toLowerCase().includes(s) ||
      f.prenom?.toLowerCase().includes(s) ||
      f.email?.toLowerCase().includes(s) ||
      f.etat?.toLowerCase().includes(s)
    );
  });

  // Pagination
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleDelete = (facture: Facture) => {
    setDeleteFactureObj(facture);
  };

  const handleConfirmDelete = async () => {
    if (!deleteFactureObj) return;
    try {
      await deleteFacture(deleteFactureObj.id || deleteFactureObj._id);
      setFactures((prev) => prev.filter(f => f.id !== deleteFactureObj.id && f._id !== deleteFactureObj._id));
      setSelectedIds((prev) => prev.filter(id => id !== (deleteFactureObj.id || deleteFactureObj._id)));
    } catch (err) {
      // Optionally show error
    }
    setDeleteFactureObj(null);
  };

  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      try {
        await deleteFacture(id);
      } catch {}
    }
    setFactures((prev) => prev.filter(f => !selectedIds.includes(f.id) && !selectedIds.includes(f._id)));
    setSelectedIds([]);
    setDeleteSelectionOpen(false);
  };

  return (
    <div className="bg-white rounded shadow-sm p-4 w-full max-w-[1800px] mx-auto">
      <ConfirmDeleteModal
        open={!!deleteFactureObj}
        onClose={() => setDeleteFactureObj(null)}
        onConfirm={handleConfirmDelete}
        productName={deleteFactureObj?.numero || deleteFactureObj?.nom || deleteFactureObj?.prenom}
      />
      <ConfirmDeleteModal
        open={deleteSelectionOpen}
        onClose={() => setDeleteSelectionOpen(false)}
        onConfirm={handleBulkDelete}
        productName={selectedIds.length === 1
          ? (factures.find(f => f.id === selectedIds[0] || f._id === selectedIds[0])?.numero || "Facture")
          : `${selectedIds.length} factures`}
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
        <h2 className="text-xl font-semibold text-gray-700">Factures</h2>
        <div className="flex flex-wrap gap-2 ml-auto">
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded"
            onClick={() => router.push('/admin/facture/new')}
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
      {/* Filters */}
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
                  checked={
                    selectedIds.length > 0 &&
                    paginated
                      .map(f => f._id || f.id)
                      .filter((id): id is string => !!id)
                      .every(id => selectedIds.includes(id))
                  }
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedIds(Array.from(new Set([
                        ...selectedIds,
                        ...paginated.map(f => f._id || f.id).filter((id): id is string => !!id)
                      ])));
                    } else {
                      setSelectedIds(selectedIds.filter(id => !paginated.map(f => (f._id || f.id)!).includes(id)));
                    }
                  }}
                />
              </th>
              <th className="px-4 py-2 text-blue-600">Numéro</th>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Prénom</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Total TTC</th>
              <th className="px-4 py-2">État</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.map((facture) => {
              const rowId: string = (facture._id ?? facture.id ?? "").toString();
              return (
                <tr key={rowId}>
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={typeof rowId === 'string' && selectedIds.includes(rowId)}
                      onChange={e => {
                        if (e.target.checked) {
                          if (typeof rowId === 'string') setSelectedIds(prev => [...prev, rowId]);
                        } else {
                          if (typeof rowId === 'string') setSelectedIds(prev => prev.filter(id => id !== rowId));
                        }
                      }}
                    />
                  </td>
                  <td className="px-4 py-2 text-blue-600 underline cursor-pointer" onClick={() => {
                    const safeId = rowId || "";
                    if (tab === "facture" || !tab) {
                      router.push(`/admin/facture/${safeId}/view`);
                    } else {
                      router.push(`/admin/facture/${safeId}/document?doc=${tab}`);
                    }
                  }}>
                    {facture.numero}
                  </td>
                  <td className="px-4 py-2">{facture.nom}</td>
                  <td className="px-4 py-2">{facture.prenom}</td>
                  <td className="px-4 py-2">{facture.email}</td>
                  <td className="px-4 py-2">{facture.prix_ttc}</td>
                  <td className="px-4 py-2">
                    <span className="text-xs px-2 py-1 rounded font-semibold"
                      style={{ background: facture.etat === "payée" ? "#28a745" : "#f08c14", color: "#fff" }}>
                      {facture.etat}
                    </span>
                  </td>
                  <td className="px-4 py-2">{facture.created_at ? new Date(facture.created_at).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-2 space-x-1">
                    <button
                      className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                      onClick={() => {
                        const safeId = rowId || "";
                        if (tab === "facture" || !tab) {
                          router.push(`/admin/facture/${safeId}/view`);
                        } else {
                          router.push(`/admin/facture/${safeId}/document?doc=${tab}`);
                        }
                      }}
                    >
                      👁 Vue
                    </button>
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                      onClick={() => {
                        const safeId = rowId || "";
                        if (tab === "facture" || !tab) {
                          router.push(`/admin/facture/${safeId}/edit`);
                        } else {
                          router.push(`/admin/facture/${safeId}/document/edit?doc=${tab}`);
                        }
                      }}
                    >
                      ✏️ Éditer
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                      onClick={() => handleDelete(facture)}
                    >
                      🗑 Supprimer
                    </button>
                  </td>
                </tr>
              );
            })}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-gray-400">
                  Aucune facture trouvée.
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
          Affichage {filtered.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage + 1)} à {filtered.length === 0 ? 0 : Math.min(currentPage * itemsPerPage, filtered.length)} de {filtered.length} entrées
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
