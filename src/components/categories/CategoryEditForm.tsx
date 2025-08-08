"use client";
import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { updateCategory, deleteCategory } from "@/services/categories";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { Category } from "@/types/category";

const Editor = dynamic(() => import("@/components/ui/RichTextEditor"), { ssr: false });

// Helper to get a value from both camelCase and snake_case
function getField<T = any>(obj: any, ...keys: string[]): T | undefined {
  for (const key of keys) {
    if (obj && obj[key] !== undefined && obj[key] !== null && obj[key] !== "") {
      return obj[key];
    }
  }
  return undefined;
}

type FieldOrderItem = {
  key: string;
  label: string;
  type: "input" | "cover" | "textarea" | "richtext";
  rows?: number;
};

const FIELD_ORDER: FieldOrderItem[] = [
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

export default function CategoryEditForm({ category }: { category: Category }) {
  const router = useRouter();
  // Normalize all fields for both camelCase and snake_case
  const initialForm: Category = {
    ...category,
    designation: getField(category, "designation", "designation_fr") ?? "",
    designation_fr: getField(category, "designation_fr", "designation") ?? "",
    slug: getField(category, "slug") ?? "",
    cover: getField(category, "cover") ?? "",
    cover_liste_produits: getField(category, "cover_liste_produits") ?? "",
    alt_cover: getField(category, "alt_cover", "altCover") ?? "",
    description_fr: getField(category, "description_fr", "description") ?? "",
    nutrition_values: getField(category, "nutrition_values", "nutritionValues") ?? "",
    questions: getField(category, "questions", "Questions") ?? "",
    more_details: getField(category, "more_details", "moreDetails") ?? "",
    description_cover: getField(category, "description_cover", "descriptionCover") ?? "",
    meta: getField(category, "meta", "Meta") ?? "",
    schema_description: getField(category, "schema_description", "schemaDescription") ?? "",
    content_seo: getField(category, "content_seo", "contentSeo") ?? "",
    review: getField(category, "review") ?? "",
    aggregateRating: getField(category, "aggregateRating") ?? "",
    zone1: getField(category, "zone1") ?? "",
    zone2: getField(category, "zone2") ?? "",
    zone3: getField(category, "zone3") ?? "",
  };

  const [form, setForm] = useState<Category>({ ...initialForm });
  const [image, setImage] = useState<File | null>(null);
  const [imageListeProduits, setImageListeProduits] = useState<File | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputListeProduitsRef = useRef<HTMLInputElement>(null);

  const handleChange = (key: FieldType, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleFileChangeListeProduits = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageListeProduits(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCategory(form._id, form, image);
    router.push("/admin/categories");
  };

  const handleDelete = async () => {
    setShowDelete(false);
    await deleteCategory(form._id);
    router.push("/admin/categories");
  };

  let mainImage = image
    ? URL.createObjectURL(image)
    : form.id && form.id !== ""
      ? `/images/categories/${form.id}.svg`
      : form.cover
      ? `/images/categories/${form.cover.split('/').pop()}`
      : "/images/placeholder.png";

  let mainImageListeProduits = imageListeProduits
    ? URL.createObjectURL(imageListeProduits)
    : form.cover_liste_produits
    ? `/images/categories/${form.cover_liste_produits.split('/').pop()}`
    : "/images/placeholder.png";

  const renderField = (field: typeof FIELD_ORDER[number]) => {
    const { key, label, type, rows } = field;
    if (type === "cover") {
      if (key === "cover_liste_produits") {
        return (
          <div key={key} className="mb-6">
            <label className="block text-xl font-semibold mb-2">{label}</label>
            <Image
              src={mainImageListeProduits}
              alt={form.alt_cover || form.designation || form.title || "Category image"}
              width={200}
              height={200}
              className="border rounded object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (form.cover_liste_produits) {
                  target.src = `/images/categories/${form.cover_liste_produits.split('/').pop()}`;
                } else {
                  target.src = "/images/placeholder.png";
                }
              }}
            />
            <input
              ref={fileInputListeProduitsRef}
              type="file"
              accept="image/*"
              className="mt-2"
              onChange={handleFileChangeListeProduits}
            />
          </div>
        );
      }
      return (
        <div key={key} className="mb-6">
          <label className="block text-xl font-semibold mb-2">{label}</label>
          <Image
            src={mainImage}
            alt={form.alt_cover || form.designation || form.title || "Category image"}
            width={200}
            height={200}
            className="border rounded object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (form.cover) {
                target.src = `/images/categories/${form.cover.split('/').pop()}`;
              } else {
                target.src = "/images/placeholder.png";
              }
            }}
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
            value={form[key as keyof Category] ?? ""}
            onChange={(e) => handleChange(key as FieldType, e.target.value)}
          />
        </div>
      );
    }
    if (type === "richtext") {
      return (
        <div key={key} className="mb-6">
          <label className="block text-xl font-semibold mb-2">{label}</label>
          <Editor
            value={form[key as keyof Category] ?? ""}
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
          value={form[key as keyof Category] ?? ""}
          onChange={(e) => handleChange(key as FieldType, e.target.value)}
        />
      </div>
    );
  };

  // Subcategories edit (simple text list for now)
  const renderSubCategories = () => {
    const subCategories = getField(form, "subCategories", "subcategories");
    return (
      <div className="mb-6">
        <label className="block text-xl font-semibold mb-2">Sous-catégories</label>
        {Array.isArray(subCategories) && subCategories.length > 0 ? (
          <ul className="list-disc ml-6">
            {subCategories.map((sub: any, idx: number) => (
              <li key={sub._id || sub.slug || idx}>
                {getField(sub, "designation_fr", "designation", "name") || sub.slug || sub._id}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-400">—</div>
        )}
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
        <button
          type="button"
          onClick={() => setShowDelete(true)}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          Supprimer
        </button>
      </div>
      <ConfirmDeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        productName={form.designation || form.designation_fr || form.title}
      />
      <form onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Modifier la catégorie</h1>
        {FIELD_ORDER.map(renderField)}
        {renderSubCategories()}
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
