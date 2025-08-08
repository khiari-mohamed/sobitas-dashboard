"use client";
import React, { useEffect, useState } from "react";
import TicketCaisse from "@/components/facture/TicketCaisse";
import factureService from "@/services/facture";
import "@/components/facture/ticket-print.css";

export default function TicketPrintPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [order, setOrder] = useState<any>(null);

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
      <TicketCaisse order={order} hideButton />
    </div>
  );
}
