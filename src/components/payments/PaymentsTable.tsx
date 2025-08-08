"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllPayments } from "@/services/payments";
import { Payment } from "@/types/payments";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { FaSearch } from "react-icons/fa";

const defaultItemsPerPage = 10;

const statusOptions = [
  { value: "", label: "Tous" },
  { value: "pending", label: "En attente" },
  { value: "paid", label: "Payé" },
  { value: "failed", label: "Échoué" },
];

export default function PaymentsTable() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [deletePaymentId, setDeletePaymentId] = useState<string | null>(null);
  const [deleteSelectionOpen, setDeleteSelectionOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    getAllPayments({ 
      page: currentPage, 
      limit: itemsPerPage, 
      status: statusFilter, 
      search 
    })
      .then((data) => {
        if (!ignore) {
          setPayments(data.transactions || data);
          setTotal(data.total || (Array.isArray(data.transactions) ? data.transactions.length : 0));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    return () => { ignore = true; };
  }, [currentPage, itemsPerPage, statusFilter, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const filtered = payments.filter((p) =>
    (p.orderId || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.paymentToken || "").toLowerCase().includes(search.toLowerCase())
  );

  const paginated = search ? filtered : payments;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, paginated.length);
  const currentPayments = paginated.slice(startIndex, endIndex);
  const totalPages = total === 0 ? 0 : Math.ceil(total / itemsPerPage);

  const handleDelete = (id: string) => {
    setDeletePaymentId(id);
  };

  const handleConfirmDelete = async () => {
    if (deletePaymentId) {
      // TODO: Implement delete API call
      setPayments((prev) => prev.filter(p => p._id !== deletePaymentId));
      setDeletePaymentId(null);
    }
  };

  const handleConfirmDeleteSelection = async () => {
    for (const id of selectedIds) {
      // TODO: Implement delete API call
    }
    setPayments((prev) => prev.filter(p => !p._id || !selectedIds.includes(p._id)));
    setSelectedIds([]);
    setDeleteSelectionOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      paid: "bg-teal-500 text-white",
      pending: "bg-yellow-500 text-white",
      failed: "bg-red-500 text-white"
    };
    const statusLabels = {
      paid: "Payé",
      pending: "En attente",
      failed: "Échoué"
    };
    return (
      <span className={`text-xs px-2 py-1 rounded ${statusClasses[status as keyof typeof statusClasses] || "bg-gray-200 text-gray-700"}`}>
        {statusLabels[status as keyof typeof statusLabels] || status}
      </span>
    );
  };

  const handleExport = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/payments/paymee/transactions/export?status=${statusFilter}`;
      window.open(url, "_blank");
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  return (
    <div className="bg-white rounded shadow-sm p-4 w-full max-w-[1800px] mx-auto">
      <ConfirmDeleteModal
        open={!!deletePaymentId}
        onClose={() => setDeletePaymentId(null)}
        onConfirm={handleConfirmDelete}
        productName={payments.find(p => p._id === deletePaymentId)?.orderId || "Paiement"}
      />
      <ConfirmDeleteModal
        open={deleteSelectionOpen}
        onClose={() => setDeleteSelectionOpen(false)}
        onConfirm={handleConfirmDeleteSelection}
        productName={selectedIds.length === 1
          ? (payments.find(p => p._id === selectedIds[0])?.orderId)
          : `${selectedIds.length} paiements`}
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
        <h2 className="text-xl font-semibold text-gray-700">Paiements</h2>
        <div className="flex flex-wrap gap-2 ml-auto">
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded"
            onClick={() => router.push('/admin/payments/new')}
          >
            + Ajouter nouveau
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded"
            onClick={handleExport}
          >
            📊 Exporter CSV
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
        <select 
          className="border rounded px-3 py-2 text-sm w-full sm:w-40"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Chercher par ID commande ou token"
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
                  checked={selectedIds.length > 0 && currentPayments.every(p => p._id && selectedIds.includes(p._id))}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedIds(Array.from(new Set([...selectedIds, ...currentPayments.map(p => p._id).filter((id): id is string => Boolean(id))])));
                    } else {
                      setSelectedIds(selectedIds.filter(id => !currentPayments.map(p => p._id).filter(Boolean).includes(id)));
                    }
                  }}
                />
              </th>
              <th className="px-4 py-2 text-blue-600">ID Commande</th>
              <th className="px-4 py-2">Montant</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Token de paiement</th>
              <th className="px-4 py-2">Date de création</th>
              <th className="px-4 py-2">Date de mise à jour</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentPayments.map((payment) => (
              <tr key={payment._id}>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={payment._id ? selectedIds.includes(payment._id) : false}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedIds(prev => payment._id ? [...prev, payment._id] : prev);
                      } else {
                        setSelectedIds(prev => prev.filter(id => id !== payment._id));
                      }
                    }}
                  />
                </td>
                <td className="px-4 py-2 text-blue-600 underline cursor-pointer" onClick={() => router.push(`/admin/payments/${payment._id}/view`)}>
                  {payment.orderId}
                </td>
                <td className="px-4 py-2">{payment.amount} TND</td>
                <td className="px-4 py-2">{getStatusBadge(payment.status)}</td>
                <td className="px-4 py-2 max-w-xs truncate">{payment.paymentToken || "—"}</td>
                <td className="px-4 py-2">{payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "—"}</td>
                <td className="px-4 py-2">{payment.updatedAt ? new Date(payment.updatedAt).toLocaleString() : "—"}</td>
                <td className="px-4 py-2 space-x-1">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/payments/${payment._id}/view`)}
                  >
                    👁 Vue
                  </button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/payments/${payment._id}/edit`)}
                  >
                    ✏️ Éditer
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => payment._id && handleDelete(payment._id)}
                  >
                    🗑 Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {currentPayments.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-400">
                  Aucun paiement trouvé.
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
          Affichage {total === 0 ? 0 : (startIndex + 1)} à {total === 0 ? 0 : Math.min(startIndex + currentPayments.length, total)} de {total} entrées
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
