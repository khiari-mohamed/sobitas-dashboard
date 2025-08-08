"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SystemMessage } from "@/types/system-messages";
import systemMessagesService from "@/services/system-messages";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { FaSearch } from "react-icons/fa";

const defaultItemsPerPage = 10;

export default function SMSTable() {
  const [messages, setMessages] = useState<SystemMessage[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [deleteMessage, setDeleteMessage] = useState<SystemMessage | null>(null);
  const [deleteSelectionOpen, setDeleteSelectionOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [totalMessages, setTotalMessages] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch system messages from backend
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    systemMessagesService.fetchSystemMessages()
      .then((data) => {
        if (!ignore) {
          setMessages(data);
          setTotalMessages(data.length);
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
  const filtered = messages.filter((m) =>
    (
      m.id + " " +
      (m.msg_welcome || "") + " " +
      (m.msg_etat_commande || "") + " " +
      (m.msg_passez_commande || "")
    ).toLowerCase().includes(search.toLowerCase())
  );

  const paginated = search
    ? filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : messages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil((search ? filtered.length : totalMessages) / itemsPerPage);

  const handleDelete = (message: SystemMessage) => {
    setDeleteMessage(message);
  };

  const handleConfirmDelete = async () => {
    if (!deleteMessage) return;
    try {
      await systemMessagesService.deleteSystemMessage(deleteMessage.id);
      setMessages((prev) => prev.filter((m) => m.id !== deleteMessage.id));
      setSelectedIds((prev) => prev.filter((id) => id !== deleteMessage.id));
    } catch (e) {
      // handle error
    }
    setDeleteMessage(null);
  };

  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      try {
        await systemMessagesService.deleteSystemMessage(id);
      } catch (e) {}
    }
    setMessages((prev) => prev.filter((m) => !selectedIds.includes(m.id)));
    setSelectedIds([]);
    setDeleteSelectionOpen(false);
  };

  return (
    <div className="bg-white rounded shadow-sm p-4 w-full max-w-[1800px] mx-auto">
      <ConfirmDeleteModal
        open={!!deleteMessage}
        onClose={() => setDeleteMessage(null)}
        onConfirm={handleConfirmDelete}
        productName={deleteMessage?.id || deleteMessage?._id}
      />
      <ConfirmDeleteModal
        open={deleteSelectionOpen}
        onClose={() => setDeleteSelectionOpen(false)}
        onConfirm={handleBulkDelete}
        productName={selectedIds.length === 1
          ? (messages.find(m => m.id === selectedIds[0])?.id || messages.find(m => m.id === selectedIds[0])?._id)
          : `${selectedIds.length} messages`}
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
        <h2 className="text-xl font-semibold text-gray-700">Messages système (SMS stockés)</h2>
        <div className="flex flex-wrap gap-2 ml-auto">
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded"
            onClick={() => router.push('/admin/sms/new')}
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
        <select className="border rounded px-3 py-2 text-sm w-full sm:w-60" disabled>
          <option>Type de message</option>
        </select>
        <select className="border rounded px-3 py-2 text-sm w-full sm:w-40" disabled>
          <option>contains</option>
        </select>
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
                  checked={selectedIds.length > 0 && paginated.every(m => selectedIds.includes(m.id))}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedIds(Array.from(new Set([...selectedIds, ...paginated.map(m => m.id)])));
                    } else {
                      setSelectedIds(selectedIds.filter(id => !paginated.map(m => m.id).includes(id)));
                    }
                  }}
                />
              </th>
              <th className="px-4 py-2 text-blue-600">ID</th>
              <th className="px-4 py-2">Bienvenue</th>
              <th className="px-4 py-2">État commande</th>
              <th className="px-4 py-2">Passez commande</th>
              <th className="px-4 py-2">Créé le</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.map((message) => (
              <tr key={message.id}>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(message.id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedIds(prev => [...prev, message.id]);
                      } else {
                        setSelectedIds(prev => prev.filter(id => id !== message.id));
                      }
                    }}
                  />
                </td>
                <td className="px-4 py-2 text-blue-600 underline cursor-pointer" onClick={() => router.push(`/admin/sms/${message.id}/view`)}>
                  {message.id}
                </td>
                <td className="px-4 py-2 max-w-[300px] truncate" title={message.msg_welcome}>{message.msg_welcome}</td>
                <td className="px-4 py-2 max-w-[300px] truncate" title={message.msg_etat_commande}>{message.msg_etat_commande}</td>
                <td className="px-4 py-2 max-w-[300px] truncate" title={message.msg_passez_commande}>{message.msg_passez_commande}</td>
                <td className="px-4 py-2">{message.created_at ? new Date(message.created_at).toLocaleString() : '—'}</td>
                <td className="px-4 py-2 space-x-1">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/sms/${message.id}/view`)}
                  >
                    👁 Vue
                  </button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/sms/${message.id}/edit`)}
                  >
                    ✏️ Éditer
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleDelete(message)}
                  >
                    🗑 Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                  Aucun message trouvé.
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
          Affichage {messages.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage + 1)} à {messages.length === 0 ? 0 : Math.min(currentPage * itemsPerPage, search ? filtered.length : totalMessages)} de {search ? filtered.length : totalMessages} entrées
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
