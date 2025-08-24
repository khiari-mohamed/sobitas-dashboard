"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { Brand } from "@/types/brand";
import { getBrandById } from "@/services/brand";
import { getBrandImageWithFallback } from "@/utils/imageUtils";

function renderHTML(html: string | null | undefined) {
  if (!html) return <span className="text-gray-400">—</span>;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function Divider() {
  return <hr className="my-6 border-gray-200" />;
}

export default function BrandViewClient({ id }: { id: string }) {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    getBrandById(id)
      .then(setBrand)
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setShowDelete(false);
    try {
      const { deleteBrand } = await import('@/utils/brands');
      await deleteBrand(id);
      router.push('/admin/brands');
    } catch (error) {
      console.error('Error deleting brand:', error);
      alert('Erreur lors de la suppression de la marque');
    }
  };

  if (loading || !brand) {
    return <div className="px-2 sm:px-6 lg:px-12 py-8">Chargement...</div>;
  }

  return (
    <div className="px-2 sm:px-6 lg:px-12 py-8">
      {/* Top Buttons */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => router.push(`/admin/brands/${id}/edit`)}
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
          onClick={() => router.push("/admin/brands")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaArrowLeft /> Retourner à la liste
        </button>
      </div>
      <ConfirmDeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        productName={brand.designation_fr}
      />
      <div className="bg-white rounded-xl shadow-lg p-10 w-full">
        {/* Logo */}
        <h2 className="text-3xl font-extrabold text-gray-800 mb-3">Logo</h2>
        <div className="flex flex-col items-center mb-6">
          <div className="w-[735px] h-[212px] flex items-center justify-center">
            <img
              src={(() => {
                const { src } = getBrandImageWithFallback(brand as unknown as Record<string, unknown>);
                return src;
              })()}
              alt={brand.designation_fr || "Logo"}
              width={735}
              height={212}
              className="object-contain border rounded w-full h-full"
              style={{ maxWidth: 735, maxHeight: 212 }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const { fallback } = getBrandImageWithFallback(brand as unknown as Record<string, unknown>);
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
        {/* Désignation_fr */}
        <h2 className="text-3xl font-extrabold text-gray-800 mb-3">Désignation_fr</h2>
        <div className="text-2xl text-gray-900 mb-6 font-semibold">{brand.designation_fr || "—"}</div>
        <Divider />
        {/* Alt Cover (SEO) */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Alt Cover (SEO)</h3>
        <div className="mb-6 text-lg">{brand.alt_cover || "—"}</div>
        <Divider />
        {/* Description Cover (SEO) */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Description Cover (SEO)</h3>
        <div className="mb-6 text-lg">{brand.description_cover || "—"}</div>
        <Divider />
        {/* Meta */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Meta ( name:content/name:content/name:content......)</h3>
        <div className="mb-6 text-lg">{brand.meta || "—"}</div>
        <Divider />
        {/* Schema description (seo) */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Schema description (seo)</h3>
        <div className="mb-6 text-lg">{renderHTML(brand.content_seo)}</div>
        <Divider />
        {/* Review (seo) */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Review (seo)</h3>
        <div className="mb-6 text-lg">{renderHTML(brand.review)}</div>
        <Divider />
        {/* AggregateRating (seo) */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">AggregateRating (seo)</h3>
        <div className="mb-6 text-lg">{brand.aggregateRating || "—"}</div>
        <Divider />
        {/* Description (FR) */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Description (FR)</h3>
        <div className="mb-6 text-lg leading-relaxed bg-gray-50 border rounded p-4">{renderHTML(brand.description_fr)}</div>
        <Divider />
        {/* Nutrition Values */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Nutrition Values</h3>
        <div className="mb-6 text-lg">{renderHTML(brand.nutrition_values)}</div>
        <Divider />
        {/* Questions */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Questions</h3>
        <div className="mb-6 text-lg">{renderHTML(brand.questions)}</div>
        <Divider />
        {/* Plus de détails */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Plus de détails</h3>
        <div className="mb-6 text-lg">{renderHTML(brand.more_details)}</div>
        <Divider />
        {/* Slug */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Slug</h3>
        <div className="mb-6 text-lg">{brand.slug || "—"}</div>
        <Divider />
        {/* ID fields */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">ID</h3>
        <div className="mb-6 text-lg">{brand.id || brand._id || "—"}</div>
        <Divider />
        {/* Aromas */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Aromas</h3>
        <div className="mb-6 text-lg">{Array.isArray(brand.aromas) && brand.aromas.length > 0 ? brand.aromas.join(", ") : "—"}</div>
        <Divider />
        {/* Dates */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Créé le</h3>
        <div className="mb-6 text-lg">{brand.created_at ? new Date(brand.created_at).toLocaleString() : "-"}</div>
        <Divider />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Modifié le</h3>
        <div className="mb-6 text-lg">{brand.updated_at ? new Date(brand.updated_at).toLocaleString() : "-"}</div>
      </div>
    </div>
  );
}
