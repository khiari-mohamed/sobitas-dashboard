"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { useRouter } from "next/navigation";
import { Category } from "@/types/category";

function renderHTML(html: string | null | undefined) {
  if (!html) return <span className="text-gray-400">—</span>;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function Divider() {
  return <hr className="my-6 border-gray-200" />;
}

export default function CategoryViewClient({ category, id }: { category: Category; id: string }) {
  const router = useRouter();
  const [showDelete, setShowDelete] = React.useState(false);

  const handleDelete = () => {
    setShowDelete(false);
    // TODO: Replace with real delete logic
    alert("Catégorie supprimée (placeholder)");
  };

  // Helper to get a value from both camelCase and snake_case
  function getField<T = any>(obj: any, ...keys: string[]): T | undefined {
    for (const key of keys) {
      if (obj && obj[key] !== undefined && obj[key] !== null && obj[key] !== "") {
        return obj[key];
      }
    }
    return undefined;
  }

  // Helper to render date fields
  function renderDateField(category: any) {
    const updated = getField(category, "updatedAt", "updated_at");
    const created = getField(category, "createdAt", "created_at");
    if (updated) {
      return typeof updated === "string" ? updated : updated.toLocaleString();
    }
    if (created) {
      return typeof created === "string" ? created : created.toLocaleString();
    }
    return "—";
  }

  return (
    <div className="px-2 sm:px-6 lg:px-12 py-8">
      {/* Top Buttons */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => router.push(`/admin/categories/${id}/edit`)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaEdit /> Éditer
        </button>
        <button
          type="button"
          onClick={() => setShowDelete(true)}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaTrash /> Supprimer
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/categories")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaArrowLeft /> Retourner à la liste
        </button>
      </div>
      <ConfirmDeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        productName={category.designation || category.designation_fr || category.title}
      />
      <div className="bg-white rounded-xl shadow-lg p-10 w-full">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-3">Couverture</h2>
        <div className="flex flex-col items-center mb-6">
          <div className="w-[300px] h-[300px] flex items-center justify-center">
            <Image
              src={
                category.id && category.id !== ""
                  ? `/images/categories/${category.id}.svg`
                  : category.cover
                  ? `/images/categories/${category.cover.split('/').pop()}`
                  : "/images/placeholder.png"
              }
              alt={category.alt_cover || category.designation || category.title || "Category image"}
              width={300}
              height={300}
              className="object-contain border rounded w-full h-full"
              style={{ maxWidth: 300, maxHeight: 300 }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (category.cover) {
                  target.src = `/images/categories/${category.cover.split('/').pop()}`;
                } else {
                  target.src = "/images/placeholder.png";
                }
              }}
            />
          </div>
        </div>
        <Divider />
        <h2 className="text-3xl font-extrabold text-gray-800 mb-3">Désignation</h2>
        <div className="text-2xl text-gray-900 mb-6 font-semibold">{category.designation || category.designation_fr || category.title || "—"}</div>
        <Divider />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Description</h3>
        <div className="mb-6 text-lg leading-relaxed bg-gray-50 border rounded p-4">{renderHTML(category.description_fr)}</div>
        <Divider />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Couverture liste de produits</h3>
        <div className="flex flex-col items-center mb-6">
          <div className="w-[300px] h-[300px] flex items-center justify-center">
            <Image
              src={category.product_liste_cover ? `/images/categories/${category.product_liste_cover.split('/').pop()}` : "/images/placeholder.png"}
              alt="Couverture liste de produits"
              width={300}
              height={300}
              className="object-contain border rounded w-full h-full"
              style={{ maxWidth: 300, maxHeight: 300 }}
            />
          </div>
        </div>
        <Divider />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Enregistrement</h3>
        <div className="mb-6 text-lg">
          {renderDateField(category)}
        </div>
        <Divider />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Alt Cover (SEO)</h3>
        <div className="mb-6 text-lg">
          {getField(category, "alt_cover", "altCover") || "—"}
        </div>
        <Divider />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Description Cover (SEO)</h3>
        <div className="mb-6 text-lg">
          {getField(category, "description_cover", "descriptionCover") || "—"}
        </div>
        <Divider />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Meta ( name;content/name;content/name;content......)</h3>
        <div className="mb-6 text-lg">
          {getField(category, "meta", "Meta") || "—"}
        </div>
        <Divider />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Schema description (seo)</h3>
        <div className="mb-6 text-lg">
          {getField(category, "schema_description", "schemaDescription") || "—"}
        </div>
        <Divider />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Valeurs nutritionnelles</h3>
        <div className="mb-6 text-lg leading-relaxed bg-gray-50 border rounded p-4">
          {renderHTML(getField(category, "nutrition_values", "nutritionValues"))}
        </div>
        <Divider />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Questions</h3>
        <div className="mb-6 text-lg leading-relaxed bg-gray-50 border rounded p-4">
          {renderHTML(getField(category, "questions", "Questions"))}
        </div>
        <Divider />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Plus de détails</h3>
        <div className="mb-6 text-lg leading-relaxed bg-gray-50 border rounded p-4">
          {renderHTML(getField(category, "more_details", "moreDetails"))}
        </div>
        <Divider />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Sous-catégories</h3>
        <div className="mb-6 text-lg">
          {Array.isArray(getField(category, "subCategories", "subcategories")) && getField(category, "subCategories", "subcategories").length > 0 ? (
            <ul className="list-disc ml-6">
              {getField(category, "subCategories", "subcategories").map((sub: any, idx: number) => (
                <li key={sub._id || sub.slug || idx}>
                  {getField(sub, "designation_fr", "designation", "name") || sub.slug || sub._id}
                </li>
              ))}
            </ul>
          ) : (
            "—"
          )}
        </div>
        <Divider />
      </div>
    </div>
  );
}
