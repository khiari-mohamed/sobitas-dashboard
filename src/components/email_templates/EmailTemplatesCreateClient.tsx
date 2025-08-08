"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { FaArrowLeft } from "react-icons/fa";

const templateTypes = [
  { id: "order-confirmation", name: "Order Confirmation" },
  { id: "weekly-promotion", name: "Weekly Promotion" },
  { id: "order-shipped", name: "Order Shipped" },
  { id: "custom", name: "Custom (Nouveau)" },
];

const samplePayloads: Record<string, any> = {
  "order-confirmation": {
    customerName: "Test User",
    orderNumber: "CMD-TEST",
    customerEmail: "test@example.com",
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
  },
  "weekly-promotion": {
    customerName: "Test User",
    customerEmail: "test@example.com",
    unsubscribeLink: "https://protein.tn/unsubscribe",
    promotionsLink: "https://protein.tn/promotions",
    promotions: [
      { name: "Produit Promo", oldPrice: 100, promoPrice: 80, discountPercentage: 20 },
    ],
  },
  "order-shipped": {
    customerName: "Test User",
    orderNumber: "CMD-TEST",
    customerEmail: "test@example.com",
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
  },
};

export default function EmailTemplatesCreateClient() {
  const [type, setType] = useState<string>(templateTypes[0].id);
  const [customType, setCustomType] = useState<string>("");
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editorValue, setEditorValue] = useState<string>("");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setHtml("");
    if (type === "custom") {
      setHtml("");
      setEditorValue("");
      setLoading(false);
      return;
    }
    axiosInstance.post("/email/preview", {
      type,
      payload: samplePayloads[type] || {},
    })
      .then(res => {
        setHtml(res.data.html);
        setEditorValue(res.data.html);
      })
      .catch(() => setError("Impossible de prévisualiser ce template."))
      .finally(() => setLoading(false));
  }, [type]);

  const handleSave = async () => {
    setSaveStatus("Enregistrement...");
    try {
      const templateType = type === "custom" ? customType.trim() : type;
      if (!templateType) {
        setSaveStatus("Veuillez saisir un nom pour le template personnalisé.");
        return;
      }
      await axiosInstance.post("/email/create-template", {
        type: templateType,
        html: editorValue,
      });
      setSaveStatus("Template créé avec succès !");
    } catch (e) {
      setSaveStatus("Erreur lors de la création du template.");
    }
  };

  if (loading) return <div className="text-center py-12">Chargement...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="px-2 sm:px-6 lg:px-12 py-8">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          💾 Enregistrer
        </button>
        <button
          onClick={() => window.history.back()}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaArrowLeft /> Retourner à la liste
        </button>
        {saveStatus && <span className="text-green-700 ml-4">{saveStatus}</span>}
      </div>
      <div className="bg-white shadow-lg p-10 w-full max-w-[1600px] mx-auto border">
        <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Type de template</h2>
        <select
        value={type}
        onChange={e => setType(e.target.value)}
        className="border p-3 rounded text-lg"
        >
        {templateTypes.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
        </select>
        {type === "custom" && (
        <input
        type="text"
        value={customType}
        onChange={e => setCustomType(e.target.value)}
        placeholder="Nom du template personnalisé (ex: bienvenue-client)"
        className="mt-4 border p-3 rounded text-lg w-full max-w-md"
        />
        )}
        </div>
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Aperçu du rendu</h2>
          <div className="w-full border bg-gray-50 rounded overflow-x-auto mb-8" style={{ minHeight: 400, maxHeight: 900 }}>
            <iframe
              title="Email Preview"
              srcDoc={editorValue}
              style={{ width: "100%", minHeight: 400, border: "none", background: "#f9f9f9" }}
              sandbox="allow-same-origin"
            />
          </div>
        </div>
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Éditer le HTML du template</h2>
          <RichTextEditor
            value={editorValue}
            onChange={setEditorValue}
            label=""
          />
          {type === "custom" && (
            <div className="text-gray-500 text-sm mt-2">
              Utilisez n'importe quel HTML pour créer un template personnalisé. Le nom du template sera utilisé comme identifiant.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
