"use client";

import { useSearchParams } from "next/navigation";
import FactureCreateClient from "@/components/facture/FactureCreateClient";
import TicketCaisseCreate from "@/components/facture/TicketCaisseCreate";
import BonCommandeCreate from "@/components/facture/BonCommandeCreate";
import FactureTVACreate from "@/components/facture/FactureTVACreate";

export default function FactureCreatePage() {
  const searchParams = useSearchParams();
  const component = searchParams.get('component');

  if (component === 'ticket') {
    return <TicketCaisseCreate />;
  }
  
  if (component === 'bon_commande') {
    return <BonCommandeCreate />;
  }

  if (component === 'facture_tva') {
    return <FactureTVACreate />;
  }

  return <FactureCreateClient />;
}
