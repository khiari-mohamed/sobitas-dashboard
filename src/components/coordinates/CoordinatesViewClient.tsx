"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCoordinateById } from "@/services/coordinates";
import { Coordinates } from "@/types/coordinates";
import { FaEdit, FaArrowLeft } from "react-icons/fa";
import { getCoordinatesImageWithFallback } from "@/utils/imageUtils";

export default function CoordinatesViewClient({ id }: { id: string }) {
  const router = useRouter();
  const [coordinate, setCoordinate] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCoordinateById(id)
      .then(setCoordinate)
      .catch(() => setError("Coordonnée introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-12">Chargement...</div>;
  if (error || !coordinate) return <div className="text-center py-12 text-red-500">{error || "Coordonnée introuvable"}</div>;

  const renderField = (label: string, value: unknown, isLink = false, isImage = false, isRich = false, imageField?: string) => (
    <div className="mb-6">
      <label className="block text-xl font-semibold mb-2">{label}</label>
      {isImage && value && coordinate && imageField ? (
        <img 
          src={(() => {
            const { src } = getCoordinatesImageWithFallback(coordinate as unknown as Record<string, unknown>, imageField);
            return src;
          })()} 
          alt={label} 
          width={200} 
          height={100} 
          style={{ objectFit: 'contain' }} 
          className="border rounded"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            const { fallback } = getCoordinatesImageWithFallback(coordinate as unknown as Record<string, unknown>, imageField);
            if (fallback && target.src !== fallback) {
              target.src = fallback;
            } else {
              target.src = "/images/placeholder.png";
            }
          }}
        />
      ) : isLink && value ? (
        <a href={String(value)} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">{String(value)}</a>
      ) : isRich && value ? (
        <div className="w-full border p-4 text-base bg-gray-50 min-h-[60px]" dangerouslySetInnerHTML={{ __html: String(value) }} />
      ) : (
        <div className="w-full border p-4 text-base bg-gray-100 rounded">{String(value || "—")}</div>
      )}
    </div>
  );

  return (
    <div className="px-2 sm:px-6 lg:px-12 py-8">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          onClick={() => router.push(`/admin/coordinates/${id}/edit`)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaEdit /> Éditer
        </button>
        <button
          onClick={() => router.push("/admin/coordinates")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaArrowLeft /> Retourner à la liste
        </button>
      </div>
      <div className="bg-white shadow-lg p-10 w-full max-w-[1600px] mx-auto border">
        {renderField("ID", coordinate.id)}
        {renderField("Désignation", coordinate.designation_fr)}
        {renderField("Abbréviation", coordinate.abbreviation)}
        {renderField("Matricule", coordinate.matricule)}
        {renderField("RIB", coordinate.rib)}
        {renderField("Email", coordinate.email)}
        {renderField("Adresse", coordinate.adresse_fr)}
        {renderField("Téléphone 1", coordinate.phone_1)}
        {renderField("Téléphone 2", coordinate.phone_2)}
        {renderField("Site web", coordinate.site_web)}
        {renderField("Facebook", coordinate.facebook_link, true)}
        {renderField("Youtube", coordinate.youtube_link, true)}
        {renderField("Favicon", coordinate.favicon, false, true, false, "favicon")}
        {renderField("Logo", coordinate.logo, false, true, false, "logo")}
        {renderField("Logo Facture", coordinate.logo_facture, false, true, false, "logo_facture")}
        {renderField("Logo Footer", coordinate.logo_footer, false, true, false, "logo_footer")}
        {renderField("Description Footer (court)", coordinate.short_description_fr, false, false, true)}
        {renderField("Description (longue)", coordinate.description_fr, false, false, true)}
        {renderField("Created By", coordinate.created_by)}
        {renderField("Updated By", coordinate.updated_by)}
        {renderField("Timbre", coordinate.timbre)}
        {renderField("TVA", coordinate.tva)}
        {renderField("Short Description Ticket", coordinate.short_description_ticket)}
        {renderField("Footer Ticket", coordinate.footer_ticket)}
        {renderField("Registre Commerce", coordinate.registre_commerce)}
        {renderField("Note", coordinate.note)}
        {renderField("Twitter", coordinate.twitter_link, true)}
        {renderField("Instagram", coordinate.instagram_link, true)}
        {renderField("LinkedIn", coordinate.linkedin_link, true)}
        {renderField("À propos", coordinate.a_propos)}
        {renderField("Frais Livraison", coordinate.frais_livraison)}
        {renderField("Social Media Text", coordinate.social_media_text_fr)}
        {renderField("Newsletter Text", coordinate.newsletter_text_fr)}
        {renderField("Store Text", coordinate.store_text_fr)}
        {renderField("App Store Link", coordinate.appstore_link, true)}
        {renderField("Play Store Link", coordinate.playstore_link, true)}
        {renderField("Géolocalisation (iframe HTML)", coordinate.gelocalisation, false, false, true)}
        {renderField("Copyright", coordinate.copyright)}
        {renderField("WhatsApp", coordinate.whatsapp_link, true)}
        {renderField("TikTok", coordinate.tiktok_link, true)}
        {renderField("Titre FAQ", coordinate.title_faq)}
        {renderField("Date de création", coordinate.created_at ? new Date(coordinate.created_at).toLocaleString() : "—")}
        {renderField("Date de mise à jour", coordinate.updated_at ? new Date(coordinate.updated_at).toLocaleString() : "—")}
      </div>
    </div>
  );
}
