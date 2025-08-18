"use client";
import React, { useEffect, useState, use } from "react";
import TicketCaisse from "@/components/facture/TicketCaisse";
import factureService from "@/services/facture";
import { Facture } from "@/types/facture";
import "@/components/facture/ticket-print.css";

export default function TicketPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Facture | null>(null);

  useEffect(() => {
    factureService.fetchFactureById(id).then(setOrder);
  }, [id]);

  useEffect(() => {
    if (order) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [order]);

  if (!order) return null;

  return (
    <div style={{ width: "80mm", height: "250mm", margin: "0 auto" }}>
      <TicketCaisse order={order as unknown as Record<string, unknown>} hideButton />
    </div>
  );
}
