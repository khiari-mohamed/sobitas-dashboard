import React, { useRef } from "react";
import { QRCode } from "react-qrcode-logo";

const COMPANY = {
  logo: "/images/logo/logo.png",
  name: "SOBITAS",
  address: "Rue Ribat, 4000 Sousse Tunisie",
  tel: "+21627612500 / +21673200169",
  website: "WWW.PROTEIN.TN",
};

function getProductArray(order: Record<string, unknown>): Record<string, unknown>[] {
  if (!order) return [];
  if (Array.isArray(order.items)) return order.items;
  if (Array.isArray(order.cart)) return order.cart;
  if (Array.isArray(order.products)) return order.products;
  return [];
}

const TicketCaisse = ({ order, hideButton = false }: { order: Record<string, unknown>, hideButton?: boolean }) => {
  const ticketRef = useRef<HTMLDivElement>(null);
  if (!order) return null;
  const items = getProductArray(order);
  const date = order.created_at ? new Date(String(order.created_at)).toLocaleDateString("fr-FR") : "";
  const time = order.created_at ? new Date(String(order.created_at)).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "";
  const total = Number(order.prix_ttc || order.total || 0);
  const remise = Number(order.remise || 0);
  const totalHT = Number(order.prix_ht || 0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Instructional message removed as requested */}
      {!hideButton && (
        <button
          type="button"
          className="print-hide mb-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow"
          onClick={() => window.print()}
        >
          🖨️ Imprimer le ticket
        </button>
      )}
      <div
        ref={ticketRef}
        className="ticket-paper-outer bg-[#f5f5f5] flex justify-center items-start print:bg-white"
        style={{ width: "90mm", minWidth: "90mm", maxWidth: "90mm", padding: 0, margin: 0 }}
      >
        <div
          className="ticket-root bg-white border border-dashed border-gray-400 flex flex-col items-center text-center shadow"
          style={{ width: "80mm", minWidth: "80mm", maxWidth: "80mm", margin: "10mm auto", padding: 10 }}
        >
          {/* Logo */}
          <div className="ticket-logo w-full text-center mb-2">
            <img
              src={COMPANY.logo}
              alt="Logo"
              width={120}
              height={32}
              className="mx-auto object-contain bg-transparent"
              style={{ maxHeight: 32, maxWidth: "60mm" }}
              loading="lazy"
            />
          </div>
          {/* Header Info */}
          <div className="ticket-header-info text-center mb-2">
            <div className="font-bold text-sm uppercase mb-1">BIENVENUE CHEZ {COMPANY.name}</div>
            <div className="text-xs mb-1">Adresse: {COMPANY.address}</div>
            <div className="text-xs mb-1">Tel: {COMPANY.tel}</div>
          </div>
          <div className="w-full text-center my-2 border-b border-dashed border-gray-400">-----------------------</div>
          {/* Date & Time */}
          <div className="ticket-meta w-full text-center text-xs mb-2 flex justify-center">
            <span>{date}</span>
            <span className="ml-2">{time}</span>
          </div>
          {/* Items Table */}
          <table className="w-full text-xs mb-2 border-collapse">
            <thead>
              <tr>
                <th className="text-left font-bold border-b border-gray-300 py-1">Produit</th>
                <th className="text-center font-bold border-b border-gray-300 py-1">QTE</th>
                <th className="text-right font-bold border-b border-gray-300 py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item: Record<string, unknown>, idx: number) => (
                  <tr key={idx}>
                    <td className="text-left py-1 border-b border-dashed border-gray-200">{String(item.name || item.title)}</td>
                    <td className="text-center py-1 border-b border-dashed border-gray-200">{String(item.qty ?? item.quantity ?? 1)}</td>
                    <td className="text-right py-1 border-b border-dashed border-gray-200">{Number(item.price).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center text-gray-400 py-2">Aucun article</td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Totals */}
          <div className="w-full my-2 text-xs">
            <div className="flex justify-between w-full my-1"><span>Total</span><span>{total.toFixed(2)}</span></div>
            <div className="flex justify-between w-full my-1"><span>Remise</span><span>{remise.toFixed(2)}</span></div>
            <div className="flex justify-between w-full my-1"><span>Total HT</span><span>{totalHT.toFixed(2)}</span></div>
          </div>
          <div className="w-full text-center my-2 border-b border-dashed border-gray-400">--------------</div>
          <div className="w-full text-center text-xs font-bold my-2">{COMPANY.name} vous remercie de votre visite</div>
          <div className="w-full text-center my-2 border-b border-dashed border-gray-400">---------------</div>
          <div className="w-full text-center text-xs font-bold mt-1">
            <div className="uppercase mb-1">NOTRE SITE WEB</div>
            <div>{COMPANY.website}</div>
          </div>
          {/* QR code at the bottom */}
          <div className="mt-6 flex justify-center w-full">
            <div className="flex flex-col items-center">
              <QRCode value={order.numero ? `https://protein.tn/commande/${order.numero}` : ""} size={40} logoImage={COMPANY.logo} />
              <div className="text-[10px] text-gray-700 mt-1">Scan pour vérifier</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCaisse;
