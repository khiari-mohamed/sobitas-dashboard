"use client";
import React, { useEffect, useState, use } from "react";
import { useSearchParams } from "next/navigation";
import factureService from "@/services/facture";
import DocumentEditForm from "@/components/facture/DocumentEditForm";

export default function FactureDocumentEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const doc = searchParams?.get("doc") || "bon-commande";
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    factureService.fetchFactureById(id)
      .then(setOrder)
      .catch(() => setError("Facture introuvable."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-12">Chargement...</div>;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;
  if (!order) return null;

  return (
    <div className="py-8">
      <DocumentEditForm order={order} doc={doc} />
    </div>
  );
}