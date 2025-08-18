"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Client } from "@/types/client";
import { fetchClients, sendBulkSmsToClients, sendSmsToClient } from "@/services/clients";
import { FaSearch } from "react-icons/fa";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { exportClientsToCsv } from "@/utils/exportCsv";

const defaultItemsPerPage = 10;

function parseCsv(text: string): Partial<Client>[] {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",");
  return lines.slice(1).map(line => {
    const values = line.split(",");
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h.trim().toLowerCase()] = values[i]?.trim();
    });
    return obj;
  });
}

export default function ClientsTable() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [deleteClient, setDeleteClient] = useState<Client | null>(null);
  const [deleteSelectionOpen, setDeleteSelectionOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [smsBulk, setSmsBulk] = useState(false);
  const [smsClient, setSmsClient] = useState<Client | null>(null);
  const [smsMessage, setSmsMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetchClients()
      .then(setClients)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filtered = clients.filter((c) =>
    (c.name || c.email || c.phone_1 || "").toLowerCase().includes(search.toLowerCase())
  );

  const paginated = search ? filtered : clients;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, paginated.length);
  const currentClients = paginated.slice(startIndex, endIndex);
  const totalPages = paginated.length === 0 ? 0 : Math.ceil(paginated.length / itemsPerPage);

  const handleDelete = (client: Client) => {
    setDeleteClient(client);
  };

  const handleConfirmDelete = async () => {
    if (deleteClient) {
      try {
        const { deleteClient: deleteClientService } = await import('@/services/clients');
        await deleteClientService(deleteClient._id);
        setClients((prev) => prev.filter(c => c._id !== deleteClient._id));
        setSelectedIds((prev) => prev.filter(id => id !== deleteClient._id));
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Erreur lors de la suppression du client');
      }
    }
    setDeleteClient(null);
  };

  const handleBulkDelete = async () => {
    try {
      const { deleteClient: deleteClientService } = await import('@/services/clients');
      for (const id of selectedIds) {
        await deleteClientService(id);
      }
      setClients((prev) => prev.filter(c => !selectedIds.includes(c._id)));
      setSelectedIds([]);
    } catch (error) {
      console.error('Error deleting clients:', error);
      alert('Erreur lors de la suppression des clients');
    }
    setDeleteSelectionOpen(false);
  };

  // Export CSV
  const handleExportCsv = () => {
    exportClientsToCsv(clients);
  };

  // Import CSV
  const handleImportCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const imported = parseCsv(text);
      setClients((prev) => [
        ...prev,
        ...imported.map((c) => ({
          _id: Math.random().toString(36).slice(2),
          email: typeof c.email === "string" && c.email ? c.email : "unknown@example.com",
          name: c.name || "",
          phone_1: c.phone_1 || "",
          adresse: c.adresse || "",
          ville: c.ville || "",
          matricule: c.matricule || "",
          subscriber: !!c.subscriber,
          // Add other fields as needed
        } as Client)
      )]);
    };
    reader.readAsText(file);
  };

  // SMS
  const openBulkSmsModal = () => {
    setSmsBulk(true);
    setSmsClient(null);
    setSmsMessage("");
    setSmsModalOpen(true);
  };
  const openClientSmsModal = (client: Client) => {
    setSmsBulk(false);
    setSmsClient(client);
    setSmsMessage("");
    setSmsModalOpen(true);
  };
  const handleSendSms = async () => {
    if (smsBulk) {
      const phones = clients.filter(c => selectedIds.includes(c._id)).map(c => c.phone_1).filter(Boolean) as string[];
      if (phones.length === 0) return alert("Aucun numéro sélectionné.");
      await sendBulkSmsToClients(phones, smsMessage);
      alert("SMS envoyés !");
    } else if (smsClient && smsClient.phone_1) {
      await sendSmsToClient(smsClient.phone_1, smsMessage);
      alert("SMS envoyé !");
    }
    setSmsModalOpen(false);
  };

  return (
    <div className="bg-white p-4 shadow-xl w-full max-w-[1800px] mx-auto">
      <ConfirmDeleteModal
        open={!!deleteClient}
        onClose={() => setDeleteClient(null)}
        onConfirm={handleConfirmDelete}
        productName={deleteClient?.name || deleteClient?.email}
      />
      <ConfirmDeleteModal
        open={deleteSelectionOpen}
        onClose={() => setDeleteSelectionOpen(false)}
        onConfirm={handleBulkDelete}
        productName={selectedIds.length === 1
          ? (clients.find(c => c._id === selectedIds[0])?.name || clients.find(c => c._id === selectedIds[0])?.email)
          : `${selectedIds.length} clients`}
      />
      {/* SMS Modal */}
      {smsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-8 w-full max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Envoyer SMS {smsBulk ? "(sélection)" : smsClient?.name}</h2>
            <textarea
              className="w-full border p-3 mb-4"
              rows={4}
              placeholder="Message..."
              value={smsMessage}
              onChange={e => setSmsMessage(e.target.value)}
            />
            <div className="flex gap-3 justify-end">
              <button
                className="bg-gray-200 px-6 py-2"
                onClick={() => setSmsModalOpen(false)}
              >Annuler</button>
              <button
                className="bg-blue-600 text-white px-6 py-2"
                onClick={handleSendSms}
                disabled={!smsMessage.trim()}
              >Envoyer</button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
        <h2 className="text-xl font-semibold text-gray-700">Clients</h2>
        <div className="flex flex-wrap gap-2 ml-auto items-center">
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImportCsv}
          />
          <button
            className="text-white text-sm px-4 py-2"
            style={{ background: '#ffc41c' }}
            onClick={() => fileInputRef.current?.click()}
          >
            Importer
          </button>
          <button
            className="text-white text-sm px-4 py-2"
            style={{ background: '#34a853' }}
            onClick={handleExportCsv}
          >
            Exporter
          </button>
          <button
            className="text-white text-sm px-4 py-2"
            style={{ background: '#ff6434' }}
            disabled={selectedIds.length === 0}
            onClick={openBulkSmsModal}
          >
            Envoyer SMS
          </button>
          <button
            className="text-white text-sm px-4 py-2"
            style={{ background: '#08448c' }}
            disabled={selectedIds.length !== 1}
            onClick={() => {
              const selectedClient = clients.find(c => c._id === selectedIds[0]);
              if (selectedClient) openClientSmsModal(selectedClient);
            }}
          >
            Envoyer SMS (client spécifique)
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2"
            onClick={() => router.push('/admin/clients/new')}
          >
            + Ajouter un client
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2"
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
            className="px-3 py-2 border w-full text-sm pr-10"
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
                  checked={selectedIds.length > 0 && currentClients.every(c => selectedIds.includes(c._id))}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedIds(Array.from(new Set([...selectedIds, ...currentClients.map(c => c._id)])));
                    } else {
                      setSelectedIds(selectedIds.filter(id => !currentClients.map(c => c._id).includes(id)));
                    }
                  }}
                />
              </th>
              <th className="px-4 py-2 text-blue-600">Nom</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Téléphone</th>
              <th className="px-4 py-2">Adresse</th>
              <th className="px-4 py-2">Ville</th>
              <th className="px-4 py-2">Matricule</th>
              <th className="px-4 py-2">Abonné</th>
              <th className="px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentClients.map((client) => (
              <tr key={client._id}>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(client._id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedIds(prev => [...prev, client._id]);
                      } else {
                        setSelectedIds(prev => prev.filter(id => id !== client._id));
                      }
                    }}
                  />
                </td>
                <td className="px-4 py-2 text-blue-600 underline cursor-pointer" onClick={() => router.push(`/admin/clients/${client._id}/view`)}>
                  {client.name}
                </td>
                <td className="px-4 py-2">{client.email}</td>
                <td className="px-4 py-2">{client.phone_1}</td>
                <td className="px-4 py-2">{client.adresse}</td>
                <td className="px-4 py-2">{client.ville}</td>
                <td className="px-4 py-2">{client.matricule ?? "—"}</td>
                <td className="px-4 py-2">
                  {client.subscriber ? (
                    <span className="text-white bg-teal-500 text-xs px-2 py-1">Oui</span>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-blue-200 text-blue-700">Non</span>
                  )}
                </td>
                <td className="px-2 py-2 space-x-1">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 text-xs"
                    onClick={() => router.push(`/admin/clients/${client._id}/edit`)}
                  >
                    ✏️ Éditer
                  </button>
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 text-xs"
                    onClick={() => router.push(`/admin/clients/${client._id}/view`)}
                  >
                    👁 Vue
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 text-xs"
                    onClick={() => handleDelete(client)}
                  >
                    🗑 Supprimer
                  </button>
                  <button
                    className="bg-blue-800 text-white px-2 py-1 text-xs"
                    onClick={() => openClientSmsModal(client)}
                  >
                    SMS
                  </button>
                </td>
              </tr>
            ))}
            {currentClients.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-400">
                  Aucun client trouvé.
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
            className="border px-2 py-1 text-sm"
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
            className="px-3 py-1 border disabled:opacity-50"
          >
            ← Précédent
          </button>
          <button
            disabled={currentPage >= totalPages || totalPages === 0 || loading}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            className="px-3 py-1 border disabled:opacity-50"
          >
            Suivant →
          </button>
        </div>
      </div>
    </div>
  );
}
