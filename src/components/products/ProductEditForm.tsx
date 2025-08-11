"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaTrash, FaArrowLeft, FaMagic } from "react-icons/fa";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { getAutofillTemplate } from "@/utils/productAutofillTemplates";

// Dynamically load TinyMCE editor (client only)
const Editor = dynamic(() => import("@/components/ui/RichTextEditor"), { ssr: false });

const FIELD_ORDER = [
  { key: "designation_fr", label: "Désignation", type: "input" },
  { key: "cover", label: "Image principale", type: "cover" },
  { key: "subCategory", label: "Sous-catégorie", type: "input" },
  { key: "sous_categorie_id", label: "Sous-catégorie ID", type: "input" },
  { key: "brand", label: "Marque", type: "input" },
  { key: "brand_id", label: "Brand ID", type: "input" },
  { key: "qte", label: "Quantité", type: "input", inputType: "number" },
  { key: "prix", label: "Prix", type: "input", inputType: "number" },
  { key: "prix_ht", label: "Prix HT", type: "input", inputType: "number" },
  { key: "promo", label: "Promo", type: "input", inputType: "number" },
  { key: "promo_ht", label: "Promo HT", type: "input", inputType: "number" },
  { key: "promo_expiration_date", label: "Date d'expiration promo", type: "input", inputType: "date" },
  { key: "meta_description_fr", label: "Meta Description", type: "richtext" },
  { key: "description_fr", label: "Description", type: "richtext" },
  { key: "questions", label: "Questions", type: "richtext" },
  { key: "nutrition_values", label: "Valeurs nutritionnelles", type: "richtext" },
  { key: "content_seo", label: "Content SEO", type: "richtext" },
  { key: "publier", label: "Publier", type: "switch" },
  { key: "slug", label: "Slug", type: "input" },
  { key: "pack", label: "Pack", type: "switch" },
  { key: "gallery", label: "Galerie d’images", type: "gallery" },
  { key: "new_product", label: "Nouveau produit", type: "switch" },
  { key: "isFeatured", label: "isFeatured", type: "switch" },
  { key: "isNewArrival", label: "isNewArrival", type: "switch" },
  { key: "rupture", label: "Rupture de stock", type: "switch" },
  { key: "note", label: "Étoiles", type: "input", inputType: "number" },
  { key: "best_seller", label: "Meilleure vente", type: "switch" },
  { key: "bestSellerSection", label: "bestSellerSection", type: "switch" },
  { key: "inStock", label: "inStock", type: "switch" },
  { key: "aroma_ids", label: "Arômes", type: "input" },
  { key: "tags", label: "Tags", type: "input" },
  { key: "meta", label: "Balises Meta (name;content...)", type: "textarea" },
  { key: "code_product", label: "Code Produit", type: "input" },
  { key: "alt_cover", label: "Texte alternatif (SEO)", type: "input" },
  { key: "description_cover", label: "Description image (SEO)", type: "input" },
  { key: "schema_description", label: "Description Schema (SEO)", type: "richtext" },
  { key: "review", label: "Avis (SEO)", type: "textarea" },
  { key: "aggregateRating", label: "AggregateRating (SEO)", type: "input" },
  { key: "zone1", label: "Zone 1", type: "input" },
  { key: "zone2", label: "Zone 2", type: "input" },
  { key: "zone3", label: "Zone 3", type: "input" },
  { key: "zone4", label: "Zone 4", type: "input" },
  { key: "created_at", label: "Créé le", type: "input", inputType: "datetime-local" },
  { key: "created_by", label: "Créé par", type: "input" },
  { key: "updated_by", label: "Modifié par", type: "input" },
];

interface ProductEditFormProps {
  product: any;
  setProduct?: (p: any) => void;
  topExtraButton?: React.ReactNode;
}

export default function ProductEditForm({ product, setProduct }: ProductEditFormProps) {
  const router = useRouter();
  const [form, setForm] = React.useState(product);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [showDelete, setShowDelete] = React.useState(false);

  const handleDelete = () => {
    setShowDelete(false);
    // TODO: Replace with real delete logic
    alert("Produit supprimé (placeholder)");
  };

  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  // (Autofill logic removed; only present in create page)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev: any) => ({ ...prev, newCover: e.target.files![0] }));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm((prev: any) => ({
        ...prev,
        newGallery: Array.from(e.target.files!),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 🔁 TODO: Send to backend
    console.log("Submitting", form);
  };

  const mainImage =
    form.newCover
      ? URL.createObjectURL(form.newCover)
      : form.mainImage?.url || (form.cover ? `/${form.cover.replace(/^\/+/ , "")}` : "/images/placeholder.png");

  const renderField = (field: any) => {
    const { key, label, type, inputType, rows } = field;

    if (type === "cover") {
      return (
        <div key={key} className="mb-6">
          <label className="block text-xl font-semibold mb-2">{label}</label>
          <Image
            src={mainImage}
            alt={form.alt_cover || "Image produit"}
            width={200}
            height={200}
            className="border rounded object-contain"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="mt-2"
            onChange={handleFileChange}
          />
        </div>
      );
    }

    if (type === "gallery") {
      return (
        <div key={key} className="mb-6">
          <label className="block text-xl font-semibold mb-2">{label}</label>
          <input
            ref={galleryInputRef}
            type="file"
            multiple
            className="mt-2"
            onChange={handleGalleryChange}
          />
        </div>
      );
    }

    if (type === "textarea") {
      return (
        <div key={key} className="mb-6">
          <label className="block text-xl font-semibold mb-2">{label}</label>
          <textarea
            rows={rows || 4}
            className="w-full border p-4 rounded text-base"
            value={form[key] ?? ""}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        </div>
      );
    }

    if (type === "richtext") {
      return (
        <div key={key} className="mb-6">
          <Editor
            value={form[key] ?? ""}
            onChange={(value: string) => handleChange(key, value)}
            label={label}
          />
        </div>
      );
    }

    if (type === "switch") {
      return (
        <div key={key} className="mb-6 flex items-center space-x-4">
          <label className="text-xl font-semibold">{label}</label>
          <input
            type="checkbox"
            checked={!!form[key]}
            onChange={(e) => handleChange(key, e.target.checked)}
            className="w-5 h-5"
          />
        </div>
      );
    }

    return (
      <div key={key} className="mb-6">
        <label className="block text-xl font-semibold mb-2">{label}</label>
        <input
          type={inputType || "text"}
          className="w-full border p-4 rounded text-base"
          value={form[key] ?? ""}
          onChange={(e) => handleChange(key, e.target.value)}
        />
      </div>
    );
  };

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-screen-2xl mx-auto">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => router.push("/produits")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaArrowLeft /> Retourner à la liste
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Modifier le produit</h1>
        {FIELD_ORDER.map(renderField)}
        <button
          type="submit"
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded text-xl"
        >
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}
