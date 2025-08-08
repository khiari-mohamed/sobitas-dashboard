"use client";
import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { createCategory } from "@/services/categories";
import type { Category } from "@/types/category";

const Editor = dynamic(() => import("@/components/ui/RichTextEditor"), { ssr: false });

const emptyCategory: Omit<Category, "_id" | "id" | "image" | "product_liste_cover" | "products" | "subCategories" | "subcategories" | "createdAt" | "updatedAt" | "created_by" | "updated_by"> = {
  designation: "",
  slug: "",
  cover: "",
  cover_liste_produits: "",
  designation_fr: "",
  description_fr: "",
  alt_cover: "",
  description_cover: "",
  meta: "",
  content_seo: "",
  review: "",
  aggregateRating: "",
  nutrition_values: "",
  questions: "",
  more_details: "",
  zone1: "",
  zone2: "",
  zone3: "",
  schema_description: ""
};

const FIELD_ORDER: {
  key: string;
  label: string;
  type: string;
  rows?: number;
}[] = [
  { key: "cover", label: "Couverture", type: "cover" },
  { key: "designation", label: "Désignation", type: "input" },
  { key: "description_fr", label: "Description", type: "richtext" },
  { key: "cover_liste_produits", label: "Couverture liste de produits", type: "cover" },
  { key: "alt_cover", label: "Alt Cover (SEO)", type: "input" },
  { key: "description_cover", label: "Description Cover (SEO)", type: "textarea" },
  { key: "meta", label: "Meta ( name;content/name;content/name;content......)", type: "textarea" },
  { key: "schema_description", label: "Schema description (SEO)", type: "textarea" },
  { key: "slug", label: "Slug", type: "input" },
  { key: "review", label: "Review (SEO)", type: "textarea" },
  { key: "aggregateRating", label: "Aggregate Rating (SEO)", type: "textarea" },
  { key: "nutrition_values", label: "Valeurs nutritionnelles", type: "richtext" },
  { key: "questions", label: "Questions", type: "richtext" },
  { key: "more_details", label: "Plus de détails", type: "richtext" },
  { key: "designation_fr", label: "Nom FR", type: "input" },
  { key: "content_seo", label: "Content SEO", type: "textarea" },
  { key: "zone1", label: "Zone 1", type: "input" },
  { key: "zone2", label: "Zone 2", type: "input" },
  { key: "zone3", label: "Zone 3", type: "input" },
];

type FieldType = typeof FIELD_ORDER[number]["key"];
export default function CategoryCreateClient() {
  const router = useRouter();
  const [form, setForm] = useState<typeof emptyCategory>({ ...emptyCategory });
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (key: FieldType, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCategory(form, image);
    router.push("/admin/categories");
  };

  const mainImage = image
    ? URL.createObjectURL(image)
    : form.cover || "/images/placeholder.png";

  const renderField = (field: typeof FIELD_ORDER[number]) => {
    const { key, label, type, rows } = field;
    if (type === "cover") {
      return (
        <div key={key} className="mb-6">
          <label className="block text-xl font-semibold mb-2">{label}</label>
          <Image
            src={mainImage}
            alt={form.alt_cover || form.designation || "Category image"}
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
    if (type === "textarea") {
      return (
        <div key={key} className="mb-6">
          <label className="block text-xl font-semibold mb-2">{label}</label>
          <textarea
            rows={rows || 2}
            className="w-full border p-4 rounded text-base"
            value={form[key as keyof typeof form] ?? ""}
            onChange={(e) => handleChange(key as FieldType, e.target.value)}
          />
        </div>
      );
    }
    if (type === "richtext") {
      return (
        <div key={key} className="mb-6">
          <Editor
            value={form[key as keyof typeof form] ?? ""}
            onChange={(value: string) => handleChange(key as FieldType, value)}
            label={label}
          />
        </div>
      );
    }
    return (
      <div key={key} className="mb-6">
        <label className="block text-xl font-semibold mb-2">{label}</label>
        <input
          type="text"
          className="w-full border p-4 rounded text-base"
          value={form[key as keyof typeof form] ?? ""}
          onChange={(e) => handleChange(key as FieldType, e.target.value)}
        />
      </div>
    );
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-[1800px] mx-auto">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => router.push("/admin/categories")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaArrowLeft /> Retourner à la liste
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Ajouter une catégorie</h1>
        {FIELD_ORDER.map(renderField)}
        <button
          type="submit"
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded text-xl"
        >
          Créer la catégorie
        </button>
      </form>
    </div>
  );
}
