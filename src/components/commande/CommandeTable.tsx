"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Commande } from "@/types/commande";
import commandeService from "@/services/commande";
import { FaSearch } from "react-icons/fa";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";

const defaultItemsPerPage = 10;

export default function CommandeTable() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [deleteCommande, setDeleteCommande] = useState<Commande | null>(null);
  const [deleteSelectionOpen, setDeleteSelectionOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [totalCommandes, setTotalCommandes] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch commandes from backend
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    commandeService.fetchCommandes()
      .then((data: Commande[]) => {
        if (!ignore) {
          setCommandes(data);
          setTotalCommandes(data.length);
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

  // Filtering on frontend for search
  const filtered = commandes.filter((c) => {
    const s = search.toLowerCase();
    return (
      c.numero?.toLowerCase().includes(s) ||
      c.nom?.toLowerCase().includes(s) ||
      c.prenom?.toLowerCase().includes(s) ||
      c.email?.toLowerCase().includes(s) ||
      c.phone?.toLowerCase().includes(s) ||
      c.etat?.toLowerCase().includes(s)
    );
  });

  // Pagination
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleDelete = (commande: Commande) => {
    setDeleteCommande(commande);
  };

  const handleConfirmDelete = async () => {
    if (!deleteCommande) return;
    const commandeId = deleteCommande.id || deleteCommande._id;
    if (!commandeId) return;
    try {
      await commandeService.deleteCommande(commandeId);
      setCommandes((prev) => prev.filter(c => c.id !== deleteCommande.id && c._id !== deleteCommande._id));
      setSelectedIds((prev) => prev.filter(id => id !== (deleteCommande.id || deleteCommande._id)));
    } catch (err) {
      // Optionally show error
    }
    setDeleteCommande(null);
  };

  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      try {
        await commandeService.deleteCommande(id);
      } catch {}
    }
    setCommandes((prev) => prev.filter(c => !selectedIds.includes(c.id) && !selectedIds.includes(c._id)));
    setSelectedIds([]);
    setDeleteSelectionOpen(false);
  };

  return (
    <div className="bg-white rounded shadow-sm p-4 w-full max-w-[1800px] mx-auto">
      <ConfirmDeleteModal
        open={!!deleteCommande}
        onClose={() => setDeleteCommande(null)}
        onConfirm={handleConfirmDelete}
        productName={deleteCommande?.numero || deleteCommande?.nom || deleteCommande?.prenom}
      />
      <ConfirmDeleteModal
        open={deleteSelectionOpen}
        onClose={() => setDeleteSelectionOpen(false)}
        onConfirm={handleBulkDelete}
        productName={selectedIds.length === 1
          ? (commandes.find(c => c.id === selectedIds[0] || c._id === selectedIds[0])?.numero || "Commande")
          : `${selectedIds.length} commandes`}
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
        <h2 className="text-xl font-semibold text-gray-700">Commandes</h2>
        <div className="flex flex-wrap gap-2 ml-auto">
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded"
            onClick={() => router.push('/admin/commande/new')}
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
                      .map(c => c._id || c.id)
                      .filter((id): id is string => !!id)
                      .every(id => selectedIds.includes(id))
                  }
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedIds(Array.from(new Set([
                        ...selectedIds,
                        ...paginated.map(c => c._id || c.id).filter((id): id is string => !!id)
                      ])));
                    } else {
                      setSelectedIds(selectedIds.filter(id => !paginated.map(c => (c._id || c.id)!).includes(id)));
                    }
                  }}
                />
              </th>
              <th className="px-4 py-2 text-blue-600">Numéro</th>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Prénom</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Téléphone</th>
              <th className="px-4 py-2">Livraison</th>
              <th className="px-4 py-2">Total TTC</th>
              <th className="px-4 py-2">État</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.map((commande) => {
              const rowId: string = (commande._id ?? commande.id ?? "").toString();
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
                  <td className="px-4 py-2 text-blue-600 underline cursor-pointer" onClick={() => router.push(`/admin/commande/${rowId || ''}/view`)}>
                    {commande.numero}
                  </td>
                  <td className="px-4 py-2">{commande.nom}</td>
                  <td className="px-4 py-2">{commande.prenom}</td>
                  <td className="px-4 py-2">{commande.email}</td>
                  <td className="px-4 py-2">{commande.phone}</td>
                  <td className="px-4 py-2">
                    <span
                      className="text-xs px-2 py-1 rounded font-semibold"
                      style={{ background: '#28a4f4', color: '#fff', display: 'inline-block', minWidth: 40, textAlign: 'center' }}
                    >
                      {commande.livraison === "1" ? "Oui" : "Non"}
                    </span>
                  </td>
                  <td className="px-4 py-2">{commande.prix_ttc}</td>
                  <td className="px-4 py-2">
                    <span className="text-xs px-2 py-1 rounded font-semibold"
                      style={{ background: commande.etat === "nouvelle_commande" ? "#f08c14" : "#3074fc", color: "#fff" }}>
                      {commande.etat}
                    </span>
                  </td>
                  <td className="px-4 py-2">{commande.created_at ? new Date(commande.created_at).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-2 space-x-1">
                    <button
                      className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                      onClick={() => router.push(`/admin/commande/${rowId}/view`)}
                    >
                      👁 Vue
                    </button>
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                      onClick={() => router.push(`/admin/commande/${rowId || ''}/edit`)}
                    >
                      ✏️ Éditer
                    </button>
                    <button
                      className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                      onClick={() => { if (rowId) router.push(`/admin/commande/${rowId}/documents`); }}
                    >
                      📄 Facture & Documents
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                      onClick={() => handleDelete(commande)}
                    >
                      🗑 Supprimer
                    </button>
                  </td>
                </tr>
              );
            })}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-6 text-center text-gray-400">
                  Aucune commande trouvée.
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
