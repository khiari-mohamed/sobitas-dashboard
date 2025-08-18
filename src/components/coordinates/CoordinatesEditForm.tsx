"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCoordinateById, updateCoordinate } from "@/services/coordinates";
import { Coordinates } from "@/types/coordinates";
import RichTextEditor from "@/components/ui/RichTextEditor";

const initialState: Partial<Coordinates> = {
  id: "",
  designation_fr: "",
  abbreviation: "",
  matricule: "",
  rib: "",
  email: "",
  adresse_fr: "",
  phone_1: "",
  phone_2: "",
  cover: "",
  site_web: "",
  facebook_link: "",
  youtube_link: "",
  favicon: "",
  logo: "",
  logo_facture: "",
  logo_footer: "",
  short_description_fr: "",
  description_fr: "",
  created_by: "",
  updated_by: "",
  created_at: "",
  updated_at: "",
  timbre: "",
  tva: "",
  short_description_ticket: "",
  footer_ticket: "",
  registre_commerce: "",
  note: "",
  twitter_link: "",
  instagram_link: "",
  linkedin_link: "",
  a_propos: "",
  frais_livraison: "",
  social_media_text_fr: "",
  newsletter_text_fr: "",
  store_text_fr: "",
  appstore_link: "",
  playstore_link: "",
  gelocalisation: "",
  copyright: "",
  whatsapp_link: "",
  tiktok_link: "",
  title_faq: ""
};

export default function CoordinatesEditForm({ id }: { id: string }) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Coordinates>>(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFacturePreview, setLogoFacturePreview] = useState<string | null>(null);
  const [logoFooterPreview, setLogoFooterPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const logoFactureInputRef = useRef<HTMLInputElement>(null);
  const logoFooterInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCoordinateById(id)
      .then((coordinate) => {
        setForm(coordinate);
        if (coordinate.logo) {
          const logoPath = coordinate.logo.startsWith('/') ? coordinate.logo : `/${coordinate.logo}`;
          setLogoPreview(logoPath);
        }
        if (coordinate.logo_facture) {
          const logoFacturePath = coordinate.logo_facture.startsWith('/') ? coordinate.logo_facture : `/${coordinate.logo_facture}`;
          setLogoFacturePreview(logoFacturePath);
        }
        if (coordinate.logo_footer) {
          const logoFooterPath = coordinate.logo_footer.startsWith('/') ? coordinate.logo_footer : `/${coordinate.logo_footer}`;
          setLogoFooterPreview(logoFooterPath);
        }
      })
      .catch(() => setError("Coordonnée introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setForm({ ...form, [key]: file });
      const reader = new FileReader();
      reader.onload = () => {
        if (key === "logo") setLogoPreview(reader.result as string);
        if (key === "logo_facture") setLogoFacturePreview(reader.result as string);
        if (key === "logo_footer") setLogoFooterPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // You may need to handle file upload separately if backend expects multipart/form-data
      await updateCoordinate(id, form);
      router.push("/admin/coordinates");
    } catch (err: unknown) {
      setError((err as Error).message || "Erreur lors de la modification de la coordonnée");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Chargement...</div>;

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Modifier la coordonnée</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ID (readonly) */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">ID</label>
          <input type="text" name="id" value={form.id || ""} readOnly className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed" />
        </div>
        {/* Désignation */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Désignation</label>
          <input type="text" name="designation_fr" value={form.designation_fr || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        {/* Abbréviation */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Abbréviation</label>
          <input type="text" name="abbreviation" value={form.abbreviation || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        {/* Matricule */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Matricule</label>
          <input type="text" name="matricule" value={form.matricule || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        {/* RIB */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">RIB</label>
          <input type="text" name="rib" value={form.rib || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        {/* Email */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Email</label>
          <input type="email" name="email" value={form.email || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        {/* Adresse */}
        <div className="mb-6 col-span-1 md:col-span-2">
          <label className="block text-xl font-semibold mb-2">Adresse</label>
          <textarea name="adresse_fr" value={form.adresse_fr || ""} onChange={handleChange} className="w-full border p-4 text-base" rows={2} />
        </div>
        {/* Phone 1 */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Téléphone 1</label>
          <input type="text" name="phone_1" value={form.phone_1 || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        {/* Phone 2 */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Téléphone 2</label>
          <input type="text" name="phone_2" value={form.phone_2 || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        {/* Site web */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Site web</label>
          <input type="text" name="site_web" value={form.site_web || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        {/* Facebook */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Facebook</label>
          <input type="text" name="facebook_link" value={form.facebook_link || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        {/* Youtube */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Youtube</label>
          <input type="text" name="youtube_link" value={form.youtube_link || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        {/* Favicon */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Favicon</label>
          <input type="text" name="favicon" value={form.favicon || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        {/* Logo (upload + preview) */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Logo</label>
          <input type="file" ref={logoInputRef} accept="image/*" onChange={e => handleLogoChange(e, "logo")} className="w-full border p-2 text-base" />
          {logoPreview && <img src={logoPreview} alt="logo preview" className="mt-2 border rounded" style={{ width: 200, height: 100, objectFit: 'contain' }} />}
        </div>
        {/* Logo Facture (upload + preview) */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Logo Facture</label>
          <input type="file" ref={logoFactureInputRef} accept="image/*" onChange={e => handleLogoChange(e, "logo_facture")} className="w-full border p-2 text-base" />
          {logoFacturePreview && <img src={logoFacturePreview} alt="logo facture preview" className="mt-2 border rounded" style={{ width: 200, height: 100, objectFit: 'contain' }} />}
        </div>
        {/* Logo Footer (upload + preview) */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Logo Footer</label>
          <input type="file" ref={logoFooterInputRef} accept="image/*" onChange={e => handleLogoChange(e, "logo_footer")} className="w-full border p-2 text-base" />
          {logoFooterPreview && <img src={logoFooterPreview} alt="logo footer preview" className="mt-2 border rounded" style={{ width: 200, height: 100, objectFit: 'contain' }} />}
        </div>
        {/* Short Description Footer (rich text) */}
        <div className="mb-6 col-span-1 md:col-span-2">
          <RichTextEditor
            value={form.short_description_fr || ""}
            onChange={value => setForm({ ...form, short_description_fr: value })}
            label="Description Footer (court)"
          />
        </div>
        {/* Description (rich text) */}
        <div className="mb-6 col-span-1 md:col-span-2">
          <RichTextEditor
            value={form.description_fr || ""}
            onChange={value => setForm({ ...form, description_fr: value })}
            label="Description (longue)"
          />
        </div>
        {/* All other fields */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Created By</label>
          <input type="text" name="created_by" value={form.created_by || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Updated By</label>
          <input type="text" name="updated_by" value={form.updated_by || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Timbre</label>
          <input type="text" name="timbre" value={form.timbre || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">TVA</label>
          <input type="text" name="tva" value={form.tva || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Short Description Ticket</label>
          <input type="text" name="short_description_ticket" value={form.short_description_ticket || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Footer Ticket</label>
          <input type="text" name="footer_ticket" value={form.footer_ticket || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Registre Commerce</label>
          <input type="text" name="registre_commerce" value={form.registre_commerce || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Note</label>
          <input type="text" name="note" value={form.note || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Twitter</label>
          <input type="text" name="twitter_link" value={form.twitter_link || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Instagram</label>
          <input type="text" name="instagram_link" value={form.instagram_link || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">LinkedIn</label>
          <input type="text" name="linkedin_link" value={form.linkedin_link || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">À propos</label>
          <input type="text" name="a_propos" value={form.a_propos || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Frais Livraison</label>
          <input type="text" name="frais_livraison" value={form.frais_livraison || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Social Media Text</label>
          <input type="text" name="social_media_text_fr" value={form.social_media_text_fr || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Newsletter Text</label>
          <input type="text" name="newsletter_text_fr" value={form.newsletter_text_fr || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Store Text</label>
          <input type="text" name="store_text_fr" value={form.store_text_fr || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">App Store Link</label>
          <input type="text" name="appstore_link" value={form.appstore_link || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Play Store Link</label>
          <input type="text" name="playstore_link" value={form.playstore_link || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6 col-span-1 md:col-span-2">
          <label className="block text-xl font-semibold mb-2">Géolocalisation (iframe HTML)</label>
          <textarea name="gelocalisation" value={form.gelocalisation || ""} onChange={handleChange} className="w-full border p-4 text-base" rows={2} />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Copyright</label>
          <input type="text" name="copyright" value={form.copyright || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">WhatsApp</label>
          <input type="text" name="whatsapp_link" value={form.whatsapp_link || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">TikTok</label>
          <input type="text" name="tiktok_link" value={form.tiktok_link || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Titre FAQ</label>
          <input type="text" name="title_faq" value={form.title_faq || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        {/* created_at (readonly) */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Date de création</label>
          <input type="text" name="created_at" value={form.created_at ? new Date(form.created_at).toLocaleString() : "—"} readOnly className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed" />
        </div>
        {/* updated_at (readonly) */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Date de mise à jour</label>
          <input type="text" name="updated_at" value={form.updated_at ? new Date(form.updated_at).toLocaleString() : "—"} readOnly className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed" />
        </div>
        {error && <div className="text-red-500 mb-4 col-span-2">{error}</div>}
        <div className="col-span-1 md:col-span-2">
          <button type="submit" className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-xl border-none" disabled={loading}>
            {loading ? "Modification..." : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}
