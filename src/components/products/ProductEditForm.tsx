"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import axios from "@/lib/axios";

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
  product: Record<string, unknown>;
  setProduct?: (p: Record<string, unknown>) => void;
  topExtraButton?: React.ReactNode;
}

export default function ProductEditForm({ product }: ProductEditFormProps) {
  const router = useRouter();
  const [form, setForm] = React.useState(product);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = React.useState(false);

  const handleChange = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // (Autofill logic removed; only present in create page)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, newCover: e.target.files![0] }));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm((prev) => ({
        ...prev,
        newGallery: Array.from(e.target.files!),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const hasFiles = form.newCover || (Array.isArray(form.newGallery) && form.newGallery.length > 0);
      
      if (hasFiles) {
        // Use FormData for file uploads
        const formData = new FormData();
        formData.append('designation', String(form.designation_fr || ''));
        formData.append('description', String(form.description_fr || ''));
        formData.append('price', String(form.prix || 0));
        formData.append('oldPrice', String(form.promo || 0));
        formData.append('inStock', String(form.inStock || true));
        formData.append('status', String(form.publier === '1' || form.publier === true));
        formData.append('brand', String(form.brand || ''));
        formData.append('codaBar', String(form.code_product || ''));
        formData.append('smallDescription', String(form.meta_description_fr || ''));
        formData.append('question', String(form.questions || ''));
        formData.append('venteflashDate', String(form.promo_expiration_date || ''));
        formData.append('subCategoryIds', JSON.stringify([]));
        formData.append('nutritionalValues', JSON.stringify([]));
        formData.append('variant', JSON.stringify([{title: form.designation_fr || 'Default', inStock: true}]));
        
        const features = [];
        if (form.new_product === '1' || form.new_product === true) features.push('new-product');
        if (form.best_seller === '1' || form.best_seller === true) features.push('best-seller');
        if (form.pack === '1' || form.pack === true) features.push('pack');
        formData.append('features', JSON.stringify(features));
        
        if (form.newCover) formData.append('mainImage', form.newCover as File);
        if (Array.isArray(form.newGallery) && form.newGallery.length > 0) {
          form.newGallery.forEach((file: File) => formData.append('images', file));
        }
        
        const response = await axios.put(`/products/admin/update/${product._id || product.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        if (response.data) {
          alert('Produit mis à jour avec succès!');
          router.push('/produits');
        }
      } else {
        // Use JSON for text-only updates - match DTO exactly
        const payload = {
          designation: form.designation_fr || '',
          description: form.description_fr || '',
          prix: form.prix || 0,
          promo: form.promo || 0,
          smallDescription: form.meta_description_fr || '',
          brand: form.brand || '',
          status: form.publier === '1' || form.publier === true,
          question: form.questions || '',
          venteflashDate: form.promo_expiration_date || '',
          codaBar: form.code_product || '',
          inStock: form.inStock !== false,
          subCategoryIds: [],
          nutritionalValues: [],
          variant: [{title: form.designation_fr || 'Default', inStock: true}],
          features: []
        };
        
        const response = await axios.put(`/products/admin/update/${product._id || product.id}`, payload, {
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (response.data) {
          alert('Produit mis à jour avec succès!');
          router.push('/produits');
        }
      }
    } catch (error: unknown) {
      console.error('Error updating product:', error);
      alert('Erreur lors de la mise à jour: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const mainImage =
    form.newCover
      ? URL.createObjectURL(form.newCover as File)
      : String((form.mainImage as Record<string, unknown>)?.url || (form.cover ? `/${String(form.cover).replace(/^\/+/ , "")}` : "/images/placeholder.png"));

  const renderField = (field: Record<string, unknown>) => {
    const key = field.key as string;
    const label = field.label as string;
    const type = field.type as string;
    const inputType = field.inputType as string;
    const rows = field.rows as number;

    if (type === "cover") {
      return (
        <div key={key} className="mb-6">
          <label className="block text-xl font-semibold mb-2">{label}</label>
          <Image
            src={String(mainImage)}
            alt={String(form.alt_cover || "Image produit")}
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
            value={String(form[key] ?? "")}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        </div>
      );
    }

    if (type === "richtext") {
      return (
        <div key={key} className="mb-6">
          <Editor
            value={String(form[key] ?? "")}
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
          value={String(form[key] ?? "")}
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
          disabled={loading}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 rounded text-xl"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  );
}
