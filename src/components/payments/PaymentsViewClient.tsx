"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { getAllPayments } from "@/services/payments";
import { Payment } from "@/types/payments";

function Divider() {
  return <hr className="my-6 border-gray-200" />;
}

export default function PaymentsViewClient({ id }: { id: string }) {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const data = await getAllPayments({});
        const payments = data.transactions || data;
        const foundPayment = payments.find((p: Payment) => p._id === id);
        if (foundPayment) {
          setPayment(foundPayment);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPayment();
  }, [id]);

  const handleDelete = () => {
    setShowDelete(false);
    // TODO: Replace with real delete logic
    alert("Paiement supprimé (placeholder)");
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
      <span className={`text-xs px-2 py-1 rounded font-semibold ${statusClasses[status as keyof typeof statusClasses] || "bg-gray-200 text-gray-700"}`}>
        {statusLabels[status as keyof typeof statusLabels] || status}
      </span>
    );
  };

  if (!payment) {
    return <div className="p-8">Chargement...</div>;
  }

  return (
    <div className="px-2 sm:px-6 lg:px-12 py-8">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <Link
          href={`/admin/payments/${id}/edit`}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaEdit /> Éditer
        </Link>
        <button
          type="button"
          onClick={() => setShowDelete(true)}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaTrash /> Supprimer
        </button>
        <Link
          href="/admin/payments"
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaArrowLeft /> Retourner à la liste
        </Link>
      </div>
      <ConfirmDeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        productName={payment.orderId || "Paiement"}
      />

      <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-3">ID Commande</h2>
        <div className="text-2xl text-gray-900 mb-6 font-semibold">{payment.orderId}</div>
        <Divider />

        <h3 className="text-2xl font-bold text-gray-700 mb-3">Montant</h3>
        <div className="mb-6 text-lg">{payment.amount} TND</div>
        <Divider />

        <h3 className="text-2xl font-bold text-gray-700 mb-3">Statut</h3>
        <div className="mb-6 text-lg">{getStatusBadge(payment.status)}</div>
        <Divider />

        <h3 className="text-2xl font-bold text-gray-700 mb-3">Token de paiement</h3>
        <div className="mb-6 text-lg bg-gray-50 border rounded p-4">
          {payment.paymentToken || <span className="text-gray-400">Aucun token</span>}
        </div>
        <Divider />

        <h3 className="text-2xl font-bold text-gray-700 mb-3">Date de création</h3>
        <div className="mb-6 text-lg">{payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "—"}</div>
        <Divider />

        <h3 className="text-2xl font-bold text-gray-700 mb-3">Date de mise à jour</h3>
        <div className="mb-6 text-lg">{payment.updatedAt ? new Date(payment.updatedAt).toLocaleString() : "—"}</div>
      </div>
    </div>
  );
}
