"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { FaSearch } from "react-icons/fa"

import emailService, { fetchEmailTemplates, deleteEmailTemplate } from "@/services/email";

type TestEmailModalProps = {
  open: boolean;
  onClose: () => void;
  onSend: () => void;
  loading: boolean;
  error: string | null;
  email: string;
  setEmail: (email: string) => void;
};

function TestEmailModal({ open, onClose, onSend, loading, error, email, setEmail }: TestEmailModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
        <h3 className="text-lg font-semibold mb-4">Envoyer un email de test</h3>
        <input
          type="email"
          className="border p-2 rounded w-full mb-3"
          placeholder="Entrez l'email de test"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
        />
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <div className="flex justify-end gap-2 mt-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </button>
          <button
            className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
            onClick={onSend}
            disabled={loading || !email}
          >
            {loading ? "Envoi..." : "Envoyer"}
          </button>
        </div>
      </div>
    </div>
  );
}

const templateTypes = [
  {
    id: "order-confirmation",
    name: "Order Confirmation",
    subject: "Order Confirmation - Protein Tunisia",
    type: "order-confirmation",
    updated_at: "—"
  },
  {
    id: "weekly-promotion",
    name: "Weekly Promotion",
    subject: "Promotions de la semaine chez Protein Tunisia",
    type: "weekly-promotion",
    updated_at: "—"
  },
  {
    id: "order-shipped",
    name: "Order Shipped",
    subject: "Votre commande a été expédiée",
    type: "order-shipped",
    updated_at: "—"
  },
];

const defaultItemsPerPage = 10;

export default function EmailTemplatesTable() {
  const [templates, setTemplates] = useState<any[]>(templateTypes);
  const [testEmailLoading, setTestEmailLoading] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState<string>("");
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testModalTemplate, setTestModalTemplate] = useState<any>(null);
  const [testModalError, setTestModalError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [deleteTemplateId, setDeleteTemplateId] = useState<string | null>(null);
  const [deleteSelectionOpen, setDeleteSelectionOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetchEmailTemplates()
      .then((data) => {
        if (!ignore) {
          setTemplates(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filtered = templates.filter((t) =>
    (t.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const paginated = search ? filtered : templates;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, paginated.length);
  const currentTemplates = paginated.slice(startIndex, endIndex);
  const totalPages = paginated.length === 0 ? 0 : Math.ceil(paginated.length / itemsPerPage);

  const handleDelete = (id: string) => {
    setDeleteTemplateId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteTemplateId) {
      try {
        await deleteEmailTemplate(deleteTemplateId);
        setTemplates((prev) => prev.filter(t => t.id !== deleteTemplateId));
        setDeleteTemplateId(null);
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  const handleConfirmDeleteSelection = async () => {
    try {
      for (const id of selectedIds) {
        await deleteEmailTemplate(id);
      }
      setTemplates((prev) => prev.filter(t => !selectedIds.includes(t.id)));
      setSelectedIds([]);
      setDeleteSelectionOpen(false);
    } catch (error) {
      console.error('Error deleting templates:', error);
    }
  };

  return (
    <div className="bg-white rounded shadow-sm p-4 w-full max-w-[1800px] mx-auto">
      <ConfirmDeleteModal
        open={!!deleteTemplateId}
        onClose={() => setDeleteTemplateId(null)}
        onConfirm={handleConfirmDelete}
        productName={templates.find(t => t.id === deleteTemplateId)?.name || "Template"}
      />
      <ConfirmDeleteModal
        open={deleteSelectionOpen}
        onClose={() => setDeleteSelectionOpen(false)}
        onConfirm={handleConfirmDeleteSelection}
        productName={selectedIds.length === 1
          ? (templates.find(t => t.id === selectedIds[0])?.name)
          : `${selectedIds.length} templates`}
      />
      <TestEmailModal
        open={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        onSend={async () => {
          if (!testModalTemplate) return;
          setTestEmailLoading(testModalTemplate.id);
          setTestModalError(null);
          setTestResult(null);
          try {
            let result;
            const t = testModalTemplate;
            if (t.type === "order-confirmation") {
              result = await emailService.sendOrderConfirmation({
                to: testEmail,
                customerName: "Test User",
                customerEmail: testEmail,
                orderNumber: "CMD-TEST",
                address: "Test Address",
                city: "Test City",
                postalCode: "1000",
                phone: "21600000000",
                orderItems: [
                  { name: "Produit Test", quantity: 1, price: 10 },
                ],
                subtotal: "10",
                shippingCost: "5",
                shippingMethod: "Test Shipping",
                total: "15",
                billingLocalite: "Test Localite",
                unsubscribeLink: "https://protein.tn/unsubscribe",
              });
            } else if (t.type === "weekly-promotion") {
              result = await emailService.sendWeeklyPromotion({
                to: testEmail,
                customerName: "Test User",
                customerEmail: testEmail,
                unsubscribeLink: "https://protein.tn/unsubscribe",
                promotionsLink: "https://protein.tn/promotions",
                promotions: [
                  { name: "Produit Promo", oldPrice: 100, promoPrice: 80, discountPercentage: 20 },
                ],
              });
            } else if (t.type === "order-shipped") {
              result = await emailService.sendOrderShipped({
                to: testEmail,
                customerName: "Test User",
                orderNumber: "CMD-TEST",
                customerEmail: testEmail,
                address: "Test Address",
                city: "Test City",
                postalCode: "1000",
                phone: "21600000000",
                orderItems: [
                  { name: "Produit Test", quantity: 1, price: 10 },
                ],
                subtotal: "10",
                shippingCost: "5",
                shippingMethod: "Test Shipping",
                total: "15",
              });
            } else {
              // For custom templates, show error (no sendTestTemplate implemented)
              throw new Error("Envoi de test non supporté pour ce template personnalisé.");
            }
            setTestResult(result?.message || "Email envoyé !");
            setTestModalOpen(false);
          } catch (err: any) {
            setTestModalError(err.message || "Erreur lors de l'envoi de l'email");
          } finally {
            setTestEmailLoading(null);
          }
        }}
        loading={!!testEmailLoading}
        error={testModalError}
        email={testEmail}
        setEmail={setTestEmail}
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
        <h2 className="text-xl font-semibold text-gray-700">Templates d'emails</h2>
        <div className="flex flex-wrap gap-2 ml-auto">
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded"
            onClick={() => router.push('/admin/email_templates/new')}
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
            placeholder="Chercher par nom"
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
                  checked={selectedIds.length > 0 && currentTemplates.every(t => selectedIds.includes(t.id))}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedIds(Array.from(new Set([...selectedIds, ...currentTemplates.map(t => t.id)])));
                    } else {
                      setSelectedIds(selectedIds.filter(id => !currentTemplates.map(t => t.id).includes(id)));
                    }
                  }}
                />
              </th>
              <th className="px-4 py-2 text-blue-600">ID</th>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Sujet</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Date de mise à jour</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentTemplates.map((t) => (
              <tr key={t.id}>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(t.id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedIds(prev => [...prev, t.id]);
                      } else {
                        setSelectedIds(prev => prev.filter(id => id !== t.id));
                      }
                    }}
                  />
                </td>
                <td className="px-4 py-2 text-blue-600 underline cursor-pointer" onClick={() => router.push(`/admin/email_templates/${t.id}/view`)}>
                  {t.id}
                </td>
                <td className="px-4 py-2">{t.name}</td>
                <td className="px-4 py-2">{t.subject}</td>
                <td className="px-4 py-2">{t.type}</td>
                <td className="px-4 py-2">{t.updated_at ? new Date(t.updated_at).toLocaleString() : "—"}</td>
                <td className="px-4 py-2 space-x-1">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/email_templates/${t.id}/view`)}
                  >
                    👁 Vue
                  </button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/email_templates/${t.id}/edit`)}
                  >
                    ✏️ Éditer
                  </button>
                  <button
                    className="bg-purple-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => {
                      setTestModalTemplate(t);
                      setTestModalOpen(true);
                      setTestModalError(null);
                      setTestResult(null);
                      setTestEmail("");
                    }}
                    disabled={!!testEmailLoading}
                  >
                    Envoyer test
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleDelete(t.id)}
                  >
                    🗑 Supprimer
                  </button>
                  {testResult && testEmailLoading === null && (
                    <div className="text-xs text-green-700 mt-2">{testResult}</div>
                  )}
                </td>
              </tr>
            ))}
            {currentTemplates.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                  Aucun template trouvé.
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
          Affichage {paginated.length === 0 ? 0 : (startIndex + 1)} à {paginated.length === 0 ? 0 : Math.min(startIndex + currentTemplates.length, paginated.length)} de {paginated.length} entrées
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
