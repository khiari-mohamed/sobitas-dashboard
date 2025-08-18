import React from "react";
import { QRCode } from "react-qrcode-logo";
import n2words from "n2words";

const COMPANY = {
  logo: "/images/logo/logo.png",
  name: "sobitas",
  email: "contact@protein.tn",
  address: "Rue Ribat, 4000 Sousse Tunisie",
  tel: "+216 73 200 169"
};
const ORANGE = "#FF4301";

function numberToFrenchWords(n: number): string {
  return n2words(n, { lang: "fr" });
}

function getProductArray(order: Record<string, unknown>): Record<string, unknown>[] {
  if (!order) return [];
  if (Array.isArray(order.cart) && order.cart.length > 0) return order.cart;
  if (Array.isArray(order.products) && order.products.length > 0) return order.products;
  if (Array.isArray(order.items) && order.items.length > 0) return order.items;
  if (order.cart && typeof order.cart === "object" && !Array.isArray(order.cart)) return [order.cart as Record<string, unknown>];
  if (order.products && typeof order.products === "object" && !Array.isArray(order.products)) return [order.products as Record<string, unknown>];
  if (order.items && typeof order.items === "object" && !Array.isArray(order.items)) return [order.items as Record<string, unknown>];
  return [];
}

const FactureBoutique = ({ order, printRef }: { order: Record<string, unknown>; printRef?: React.Ref<HTMLDivElement> }) => {
  if (!order) return null;
  const cart = getProductArray(order);
  const totalHT = Number(order.prix_ht || 0);
  const totalTVA = Number(order.tva || totalHT * 0.19);
  const totalTimbre = Number(order.timbre || 1);
  const totalTTC = Number(order.prix_ttc || 0);
  const totalTTCInt = Math.floor(totalTTC);
  const totalTTCDec = Math.round((totalTTC - totalTTCInt) * 100);
  const totalTTCWords =
    numberToFrenchWords(totalTTCInt).charAt(0).toUpperCase() +
    numberToFrenchWords(totalTTCInt).slice(1) +
    (totalTTCDec > 0
      ? " TND et " + numberToFrenchWords(totalTTCDec) + " millimes"
      : " TND");
  const billing = {
    nom: order.nom || "",
    prenom: order.prenom || "",
    adresse1: order.adresse1 || "",
    adresse2: order.adresse2 || "",
    ville: order.ville || "",
    code_postale: order.code_postale || "",
    pays: order.pays || "",
    email: order.email || "",
    phone: order.phone || "",
  };
  const shipping = {
    nom: order.livraison_nom || "",
    prenom: order.livraison_prenom || "",
    adresse1: order.livraison_adresse1 || "",
    adresse2: order.livraison_adresse2 || "",
    ville: order.livraison_ville || "",
    code_postale: order.livraison_code_postale || "",
    pays: order.livraison_pays || "",
    phone: order.livraison_phone || "",
  };
  const dateEmission = order.created_at
    ? new Date(String(order.created_at)).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "";

  return (
    <div>
      {/* Print Button above the document */}
     <div className="flex justify-center print-hide mb-4 w-full">

        <button
          type="button"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow"
          onClick={() => window.print()}
        >
          🖨️ Imprimer le document
        </button>
      </div>
      <div ref={printRef} className="bg-white p-8 rounded-xl shadow-xl w-full max-w-2xl mx-auto print:shadow-none print:border-none print:rounded-none print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col items-start">
            <div className="w-28 h-28 flex items-center justify-center mb-1" style={{ marginTop: '-32px' }}>
              <img src={COMPANY.logo} alt="Logo" style={{ objectFit: "contain", width: "100%", height: "100%" }} loading="lazy" />
            </div>
            <div className="text-xs text-gray-700 leading-tight">
              <div className="mb-0.5 font-bold">{COMPANY.name}</div>
              <div className="mb-0.5">{COMPANY.address}</div>
              <div>{COMPANY.email}</div>
              <div>{COMPANY.tel}</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-extrabold text-right" style={{ color: ORANGE, letterSpacing: "1px" }}>
              FACTURE BOUTIQUE
            </span>
            <span className="text-xs text-gray-700 mt-2">Date démission : {dateEmission}</span>
            <span className="text-xs text-gray-700">N° : <span className="font-semibold">{String(order.numero)}</span></span>
          </div>
        </div>
        <div className="w-full h-0.5 mb-4" style={{ background: ORANGE, borderRadius: 2 }} />
        {/* Billing and Shipping */}
        <div className="flex flex-row justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="font-semibold text-sm text-blue-700 mb-1">Facturé à</div>
            <div className="text-xs text-gray-700 leading-tight">
              <div>{String(billing.prenom)} {String(billing.nom)}</div>
              <div>{String(billing.adresse1)}</div>
              <div>{String(billing.pays)}</div>
              <div>Email : {String(billing.email)}</div>
              <div>Tél : {String(billing.phone)}</div>
            </div>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm text-blue-700 mb-1">Livraison</div>
            <div className="text-xs text-gray-700 leading-tight">
              <div>{String(shipping.prenom)} {String(shipping.nom)}</div>
              <div>{String(shipping.adresse1)}</div>
              {shipping.adresse2 && <div>{String(shipping.adresse2)}</div>}
              <div>{String(shipping.ville)}{shipping.code_postale ? `, ${String(shipping.code_postale)}` : ""}</div>
              <div>{String(shipping.pays)}</div>
              <div>Tél : {String(shipping.phone || "N/A")}</div>
            </div>
          </div>
        </div>
        {/* Table: Products */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full min-w-[320px] border rounded-lg overflow-hidden shadow-sm text-xs">
            <thead>
              <tr className="bg-[#FF4301] text-white">
                <th className="p-1 text-left font-semibold">Produit</th>
                <th className="p-1 text-right font-semibold">Quantité</th>
                <th className="p-1 text-right font-semibold">PU HT</th>
                <th className="p-1 text-right font-semibold">TVA</th>
                <th className="p-1 text-right font-semibold">Total HT</th>
              </tr>
            </thead>
            <tbody>
              {cart.length > 0 ? (
                cart.map((item: Record<string, unknown>, idx: number) => (
                  <tr key={idx} className="border-t hover:bg-orange-50">
                    <td className="p-1">{String(item.title || item.name || item.product_name || "Produit")}</td>
                    <td className="p-1 text-right">{String(item.quantity ?? item.qty ?? 1)}</td>
                    <td className="p-1 text-right">{Number(item.price ?? item.unit_price ?? 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</td>
                    <td className="p-1 text-right">{item.tva ? Number(item.tva).toLocaleString("fr-TN", { style: "currency", currency: "TND" }) : "0,000 TND"}</td>
                    <td className="p-1 text-right">{(Number(item.price ?? item.unit_price ?? 0) * Number(item.quantity ?? item.qty ?? 1)).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-2">
                    Aucun produit trouvé dans cette commande.<br />
                    <span className="text-xs text-red-400">Vérifiez la structure de la commande dans la console.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Totals: right side */}
        <div className="flex flex-col items-end space-y-1 mb-6 text-xs">
          <div className="flex justify-between w-56"><span className="font-medium">Total HT :</span><span>{totalHT.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</span></div>
          <div className="flex justify-between w-56"><span className="font-medium">TVA :</span><span>{totalTVA.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</span></div>
          <div className="flex justify-between w-56"><span className="font-medium">TIMBRE :</span><span>{totalTimbre.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</span></div>
          <div className="flex justify-between w-56 pt-2" style={{ borderTop: `2px solid ${ORANGE}` }}><span className="font-bold">Total TTC :</span><span className="font-bold">{totalTTC.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</span></div>
        </div>
        {/* Note Section with orange pipe */}
        <div className="mb-4 flex items-center gap-3">
        <div style={{ width: 6, minWidth: 6, height: 40, background: ORANGE, borderRadius: 4 }} />
        <div className="flex flex-col items-start">
        <span className="text-xs font-medium">Note:</span>
        <span className="italic text-orange-700 font-semibold text-xs">
        Arrête la présente facture à la somme de : {totalTTCWords}
        </span>
        </div>
        </div>
        {/* QR code */}
        <div className="flex justify-end items-end mb-6">
          <div className="flex flex-col items-center">
            <QRCode value={order.numero ? `https://votresite.com/commande/${order.numero}` : ""} size={48} logoImage={COMPANY.logo} />
            <span className="text-xs text-gray-700 mt-1">Scan pour vérifier</span>
          </div>
        </div>
        {/* Footer with RIB and copyright */}
        <div className="flex flex-row justify-between items-end mt-6 border-t pt-3 text-xs">
          <div className="bg-white border border-orange-400 rounded-lg px-3 py-2 shadow text-xs text-gray-800 font-semibold flex items-center gap-2">
            <span className="text-orange-600 font-bold">Bank BAN RIB:</span>
            <span>03507065011500468753</span>
          </div>
          <div className="text-gray-700 text-right flex-1 ml-4">
            © {new Date().getFullYear()} {COMPANY.name}. Tous droits réservés.
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactureBoutique;
