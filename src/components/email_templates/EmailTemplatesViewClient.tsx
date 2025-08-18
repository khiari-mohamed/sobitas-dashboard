"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaArrowLeft } from "react-icons/fa";
import axiosInstance from "@/lib/axios";

const samplePayloads: Record<string, Record<string, unknown>> = {
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

const templateTypes = [
  { id: "order-confirmation", name: "Order Confirmation" },
  { id: "weekly-promotion", name: "Weekly Promotion" },
  { id: "order-shipped", name: "Order Shipped" },
];

export default function EmailTemplatesViewClient({ id }: { id: string }) {
  const router = useRouter();
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const template = templateTypes.find(t => t.id === id);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setHtml(null);
    axiosInstance.post("/email/preview", {
      type: id,
      payload: samplePayloads[id] || {},
    })
      .then(res => setHtml(res.data.html))
      .catch(() => setError("Impossible de prévisualiser ce template."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-12">Chargement...</div>;
  if (error || !html) return <div className="text-center py-12 text-red-500">{error || "Template introuvable"}</div>;

  return (
    <div className="px-2 sm:px-6 lg:px-12 py-8">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          onClick={() => router.push(`/admin/email_templates/${id}/edit`)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaEdit /> Éditer
        </button>
        <button
          onClick={() => router.push("/admin/email_templates")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaArrowLeft /> Retourner à la liste
        </button>
      </div>
      <div className="bg-white shadow-lg p-10 w-full max-w-[1600px] mx-auto border">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Prévisualisation du template : {template?.name || id}</h2>
        <div className="w-full border bg-gray-50 rounded overflow-x-auto" style={{ minHeight: 400, maxHeight: 900 }}>
          <iframe
            title="Email Preview"
            srcDoc={html}
            style={{ width: "100%", minHeight: 400, border: "none", background: "#f9f9f9" }}
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
