"use client";
import React from "react";
// import Link from "next/link";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { useRouter } from "next/navigation";
import { Category } from "@/types/category";
import { getCategoryImageWithFallback } from "@/utils/imageUtils";

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
  function getField<T = unknown>(obj: Record<string, unknown>, ...keys: string[]): T | undefined {
    for (const key of keys) {
      if (obj && obj[key] !== undefined && obj[key] !== null && obj[key] !== "") {
        return obj[key] as T;
      }
    }
    return undefined;
  }

  // Helper to render date fields
  function renderDateField(category: Record<string, unknown>) {
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
        productName={String(category.designation || category.designation_fr || category.title || 'Category')}
      />
      <div className="bg-white shadow-lg p-10 w-full max-w-screen-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-3">Couverture</h2>
        <div className="flex flex-col items-center mb-6">
          <div className="w-[300px] h-[300px] flex items-center justify-center">
            <img
              src={(() => {
                const { src } = getCategoryImageWithFallback(category as unknown as Record<string, unknown>);
                return src;
              })()}
              alt={category.alt_cover || category.designation || category.title || "Category image"}
              width={300}
              height={300}
              className="object-contain border rounded w-full h-full"
              style={{ maxWidth: 300, maxHeight: 300 }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const { fallback } = getCategoryImageWithFallback(category as unknown as Record<string, unknown>);
                if (fallback && target.src !== fallback) {
                  target.src = fallback;
                } else if (category.id && category.id !== "") {
                  target.src = `/images/categories/${category.id}.svg`;
                } else if (category.cover && category.cover !== "") {
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
        <div className="mb-6 text-lg leading-relaxed bg-gray-50 border rounded p-4">{renderHTML(category.description_fr as string)}</div>
        <Divider />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Couverture liste de produits</h3>
        <div className="flex flex-col items-center mb-6">
          <div className="w-[300px] h-[300px] flex items-center justify-center">
            <img
              src={(() => {
                const categoryObj = { cover: category.product_liste_cover };
                const { src } = getCategoryImageWithFallback(categoryObj as unknown as Record<string, unknown>);
                return src;
              })()}
              alt="Couverture liste de produits"
              width={300}
              height={300}
              className="object-contain border rounded w-full h-full"
              style={{ maxWidth: 300, maxHeight: 300 }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const categoryObj = { cover: category.product_liste_cover };
                const { fallback } = getCategoryImageWithFallback(categoryObj as unknown as Record<string, unknown>);
                if (fallback && target.src !== fallback) {
                  target.src = fallback;
                } else {
                  target.src = "/images/placeholder.png";
                }
              }}
            />
          </div>
        </div>
        <Divider />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Enregistrement</h3>
        <div className="mb-6 text-lg">
          {renderDateField(category as unknown as Record<string, unknown>)}
        </div>
        <Divider />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Alt Cover (SEO)</h3>
        <div className="mb-6 text-lg">
          {getField(category as unknown as Record<string, unknown>, "alt_cover", "altCover") || "—"}
        </div>
        <Divider />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Description Cover (SEO)</h3>
        <div className="mb-6 text-lg">
          {getField(category as unknown as Record<string, unknown>, "description_cover", "descriptionCover") || "—"}
        </div>
        <Divider />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Meta ( name;content/name;content/name;content......)</h3>
        <div className="mb-6 text-lg">
          {getField(category as unknown as Record<string, unknown>, "meta", "Meta") || "—"}
        </div>
        <Divider />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Schema description (seo)</h3>
        <div className="mb-6 text-lg">
          {getField(category as unknown as Record<string, unknown>, "schema_description", "schemaDescription") || "—"}
        </div>
        <Divider />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Valeurs nutritionnelles</h3>
        <div className="mb-6 text-lg leading-relaxed bg-gray-50 border rounded p-4">
          {renderHTML(getField(category as unknown as Record<string, unknown>, "nutrition_values", "nutritionValues") as string)}
        </div>
        <Divider />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Questions</h3>
        <div className="mb-6 text-lg leading-relaxed bg-gray-50 border rounded p-4">
          {renderHTML(getField(category as unknown as Record<string, unknown>, "questions", "Questions") as string)}
        </div>
        <Divider />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Plus de détails</h3>
        <div className="mb-6 text-lg leading-relaxed bg-gray-50 border rounded p-4">
          {renderHTML(getField(category as unknown as Record<string, unknown>, "more_details", "moreDetails") as string)}
        </div>
        <Divider />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Sous-catégories</h3>
        <div className="mb-6 text-lg">
          {Array.isArray(getField(category as unknown as Record<string, unknown>, "subCategories", "subcategories")) && (getField(category as unknown as Record<string, unknown>, "subCategories", "subcategories") as unknown[]).length > 0 ? (
            <ul className="list-disc ml-6">
              {(getField(category as unknown as Record<string, unknown>, "subCategories", "subcategories") as Record<string, unknown>[]).map((sub: Record<string, unknown>, idx: number) => (
                <li key={String(sub._id || sub.slug || idx)}>
                  {String(getField(sub, "designation_fr", "designation", "name") || sub.slug || sub._id)}
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
