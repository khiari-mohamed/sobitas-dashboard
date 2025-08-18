"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";

function renderHTML(html: string | null | undefined) {
  if (!html) return <span className="text-gray-400">—</span>;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function getCategory(cat: Record<string, unknown>): string {
  if (!cat) return "—";
  if (typeof cat === "string") return cat;
  return String(cat.designation_fr || cat.designation || cat.title || cat.slug || cat._id || JSON.stringify(cat) || "—");
}

function getBrand(product: Record<string, unknown>): string {
  if (typeof product.brand === "object" && product.brand) {
    const brand = product.brand as Record<string, unknown>;
    return String(brand.designation_fr || brand.designation || brand.title || brand.slug || brand._id || JSON.stringify(brand));
  }
  return String(product.brand || product.brand_id || "—");
}

function getDate(product: Record<string, unknown>, key: string): string {
  return String(product[key] || product[key.replace('_', '')] || "—");
}

function Divider() {
  return <hr className="my-6 border-gray-200" />;
}

function LargeTextSection({ title, content }: { title: string; content: string | null | undefined }) {
  return (
    <>
      <h3 className="text-3xl font-extrabold text-gray-700 mb-3">{title}</h3>
      <div className="mb-6 text-lg leading-relaxed bg-gray-50 border rounded p-4">
        {renderHTML(content)}
      </div>
    </>
  );
}

function Highlight({ value, yes, no, yesClass, noClass }: { value: boolean, yes: string, no: string, yesClass: string, noClass: string }) {
  return (
    <span className={`text-xs px-2 py-1 rounded font-semibold ${value ? yesClass : noClass}`}>{value ? yes : no}</span>
  );
}

export default function ProductViewClient({ product, id }: { product: Record<string, unknown>; id: string }) {
  const mainImage = (product.mainImage as Record<string, unknown>)?.url
    || (product.cover ? "/" + String(product.cover).replace(/^\/+/, "") : null);
  const galleryImages = Array.isArray(product.images) ? product.images : [];
  const subCategories = Array.isArray(product.subCategory)
    ? product.subCategory.map(getCategory).filter(Boolean)
    : [];

  const [showDelete, setShowDelete] = React.useState(false);

  const handleDelete = () => {
    setShowDelete(false);
    // TODO: Replace with real delete logic
    alert("Produit supprimé (placeholder)");
  };

  return (
    <div className="px-2 sm:px-6 lg:px-12 py-8">
      {/* Top Buttons */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <Link
          href={`/admin/produits/${id}/edit`}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaEdit /> Éditer
        </Link>
        <button
          type="button"
          onClick={() => setShowDelete(true)}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaTrash /> Supprimer
        </button>
        <Link
          href="/produits"
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaArrowLeft /> Retourner à la liste
        </Link>
      </div>
      <ConfirmDeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        productName={String(product.designation_fr || product.title || product.designation)}
      />

      <div className="bg-white shadow-lg p-10 w-full max-w-screen-2xl mx-auto">
        {/* Désignation */}
        <h2 className="text-3xl font-extrabold text-gray-800 mb-3">Désignation</h2>
        <div className="text-2xl text-gray-900 mb-6 font-semibold">{String(product.designation_fr || product.title || product.designation || "—")}</div>
        <Divider />

        {/* Couverture */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Couverture</h3>
        <div className="flex flex-col items-center mb-6">
          <div className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] flex items-center justify-center">
            <Image
              src={String(mainImage || "/images/placeholder.png")}
              alt={String(product.designation_fr || product.title || "Product image")}
              width={500}
              height={500}
              className="object-contain border rounded w-full h-full"
              style={{ maxWidth: 500, maxHeight: 500 }}
            />
          </div>
          {galleryImages.length > 0 && (
            <div className="flex gap-3 flex-wrap mt-4">
              {galleryImages.map((img: Record<string, unknown>, idx: number) => (
                <Image
                  key={idx}
                  src={String((img as Record<string, unknown>).url || "/images/placeholder.png")}
                  alt={`Gallery ${idx + 1}`}
                  width={80}
                  height={80}
                  className="rounded border object-cover"
                />
              ))}
            </div>
          )}
        </div>
        <Divider />

        {/* Sous-catégories */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">sous-catégories</h3>
        <div className="mb-6 text-lg">{subCategories.join(", ") || "—"}</div>
        <Divider />

        {/* Sous-catégorie ID */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Sous-catégorie ID</h3>
        <div className="mb-6 text-lg">{String(product.sous_categorie_id ?? product.sousCategorieId ?? "—")}</div>
        <Divider />

        {/* Marque */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Marque</h3>
        <div className="mb-6 text-lg">{getBrand(product)}</div>
        <Divider />

        {/* Brand ID */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Brand ID</h3>
        <div className="mb-6 text-lg">{String(product.brand_id ?? product.brandId ?? "—")}</div>
        <Divider />

        {/* Qte */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Qte</h3>
        <div className="mb-6 text-lg">{String(product.qte ?? product.quantity ?? "—")}</div>
        <Divider />

        {/* Prix */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Prix</h3>
        <div className="mb-6 text-lg">{String(product.prix ?? product.price ?? "—")}</div>
        <Divider />

        {/* Prix HT */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Prix HT</h3>
        <div className="mb-6 text-lg">{String(product.prix_ht ?? product.prixHt ?? "—")}</div>
        <Divider />

        {/* Promo */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Promo</h3>
        <div className="mb-6 text-lg">{String(product.promo ?? product.promoHt ?? product.oldPrice ?? "—")}</div>
        <Divider />

        {/* Promo HT */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Promo HT</h3>
        <div className="mb-6 text-lg">{String(product.promo_ht ?? product.promoHt ?? "—")}</div>
        <Divider />

        {/* Date d&apos;expiration du promo (Ventes Flash) */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Date d&apos;expiration du promo (Ventes Flash)</h3>
        <div className="mb-6 text-lg">{String(product.promo_expiration_date ?? "—")}</div>
        <Divider />

        {/* Meta Description */}
        <LargeTextSection title="Meta Description" content={String(product.meta_description_fr || '')} />
        <Divider />

        {/* Description */}
        <LargeTextSection title="Description" content={String((product.description_fr || product.description || product.descriptionFr) || '')} />
        <Divider />

        {/* Questions */}
        <LargeTextSection title="Questions" content={String(product.questions || '')} />
        <Divider />

        {/* Nutrition Values */}
        <LargeTextSection title="Nutrition Values" content={String(product.nutrition_values || '')} />
        <Divider />

        {/* Content SEO */}
        <LargeTextSection title="Content SEO" content={String((product.content_seo ?? product.contentSeo) || '')} />
        <Divider />

        {/* Publier */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Publier</h3>
        <div className="mb-6 text-lg">
          <Highlight
            value={!!(product.publier === "1" || product.status)}
            yes="Publier"
            no="Non"
            yesClass="bg-teal-500 text-white"
            noClass="bg-blue-200 text-blue-700"
          />
        </div>
        <Divider />

        {/* Slug */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Slug</h3>
        <div className="mb-6 text-lg">{String(product.slug ?? "—")}</div>
        <Divider />

        {/* Pack */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Pack</h3>
        <div className="mb-6 text-lg">
          <Highlight
            value={!!(product.pack === "1")}
            yes="Oui"
            no="Non"
            yesClass="bg-teal-500 text-white"
            noClass="bg-blue-200 text-blue-700"
          />
        </div>
        <Divider />

        {/* Gallery */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Gallery</h3>
        <div className="mb-6 text-lg">Télécharger</div>
        <Divider />

        {/* New Product */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">New Product</h3>
        <div className="mb-6 text-lg">
          <Highlight
            value={!!(product.new_product === "1")}
            yes="Oui"
            no="Non"
            yesClass="bg-orange-500 text-white"
            noClass="bg-blue-200 text-blue-700"
          />
        </div>
        <Divider />

        {/* isFeatured */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">isFeatured</h3>
        <div className="mb-6 text-lg">
          <Highlight
            value={!!(product.isFeatured === "1")}
            yes="Oui"
            no="Non"
            yesClass="bg-purple-500 text-white"
            noClass="bg-blue-200 text-blue-700"
          />
        </div>
        <Divider />

        {/* isNewArrival */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">isNewArrival</h3>
        <div className="mb-6 text-lg">
          <Highlight
            value={!!(product.isNewArrival === "1")}
            yes="Oui"
            no="Non"
            yesClass="bg-indigo-500 text-white"
            noClass="bg-blue-200 text-blue-700"
          />
        </div>
        <Divider />

        {/* Etat de stock */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Etat de stock</h3>
        <div className="mb-6 text-lg">
          <span className={
            product.rupture === "1"
              ? "text-xs px-2 py-1 rounded bg-blue-200 text-blue-700 font-semibold"
              : "text-xs px-2 py-1 rounded bg-green-200 text-green-700 font-semibold"
          }>
            {product.rupture === "1" ? "Rupture" : "En Stock"}
          </span>
        </div>
        <Divider />

        {/* Nombre d&apos;etoiles */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Nombre d&apos;etoiles</h3>
        <div className="mb-6 text-lg">{String(product.note ?? "—")}</div>
        <Divider />

        {/* Meilleures ventes */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Meilleures ventes</h3>
        <div className="mb-6 text-lg">
          <Highlight
            value={!!(product.best_seller === "1")}
            yes="Oui"
            no="Non"
            yesClass="bg-yellow-500 text-white"
            noClass="bg-blue-200 text-blue-700"
          />
        </div>
        <Divider />

        {/* bestSellerSection */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">bestSellerSection</h3>
        <div className="mb-6 text-lg">
          <Highlight
            value={!!product.bestSellerSection}
            yes="Oui"
            no="Non"
            yesClass="bg-yellow-600 text-white"
            noClass="bg-blue-200 text-blue-700"
          />
        </div>
        <Divider />

        {/* inStock */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">inStock</h3>
        <div className="mb-6 text-lg">
          <Highlight
            value={!!product.inStock}
            yes="Oui"
            no="Non"
            yesClass="bg-green-500 text-white"
            noClass="bg-red-200 text-red-700"
          />
        </div>
        <Divider />

        {/* Aromas */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">aromas</h3>
        <div className="mb-6 text-lg">{Array.isArray(product.aroma_ids) ? product.aroma_ids.join(", ") : "—"}</div>
        <Divider />

        {/* Tags */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">tags</h3>
        <div className="mb-6 text-lg">Pas de résultats.</div>
        <Divider />

        {/* Meta (name;content/name;content...) */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Meta ( name;content/name;content/name;content......)</h3>
        <div className="mb-6 text-lg">{String(product.meta ?? "—")}</div>
        <Divider />

        {/* Code Produit */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Code Produit</h3>
        <div className="mb-6 text-lg">{String(product.code_product ?? "—")}</div>
        <Divider />

        {/* Alt Cover (SEO) */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Alt Cover (SEO)</h3>
        <div className="mb-6 text-lg">{String(product.alt_cover ?? "—")}</div>
        <Divider />

        {/* Description Cover (SEO) */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Description Cover (SEO)</h3>
        <div className="mb-6 text-lg">{String(product.description_cover ?? "—")}</div>
        <Divider />

        {/* Enregistrement */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Enregistrement</h3>
        <div className="mb-6 text-lg">{String(product.updated_at ?? "—")}</div>
        <Divider />

        {/* Schema description (seo) */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Schema description (seo)</h3>
        <div className="mb-6 text-lg"><pre className="whitespace-pre-wrap text-base">{String(product.schema_description ?? "—")}</pre></div>
        <Divider />

        {/* Review (SEO) */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Review (SEO)</h3>
        <div className="mb-6 text-lg">{String(product.review ?? "—")}</div>
        <Divider />

        {/* AggregateRating (SEO) */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">AggregateRating ( SEO)</h3>
        <div className="mb-6 text-lg">{String(product.aggregateRating ?? "—")}</div>
        <Divider />

        {/* Tabilation Zone 1-4 */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Tabilation Zone 1</h3>
        <div className="mb-6 text-lg">{String(product.zone1 ?? "—")}</div>
        <Divider />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Tabilation Zone2</h3>
        <div className="mb-6 text-lg">{String(product.zone2 ?? "—")}</div>
        <Divider />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Tabilation Zone3</h3>
        <div className="mb-6 text-lg">{String(product.zone3 ?? "—")}</div>
        <Divider />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Tabilation Zone4</h3>
        <div className="mb-6 text-lg">{String(product.zone4 ?? "—")}</div>
        <Divider />

        {/* Créé le */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Créé le</h3>
        <div className="mb-6 text-lg">{getDate(product, 'created_at')}</div>
        <Divider />

        {/* Créé par */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Créé par</h3>
        <div className="mb-6 text-lg">{String(product.created_by ?? product.createdBy ?? "—")}</div>
        <Divider />

        {/* Modifié par */}
        <h3 className="text-2xl font-bold text-gray-700 mb-3">Modifié par</h3>
        <div className="mb-6 text-lg">{String(product.updated_by ?? product.updatedBy ?? "—")}</div>
      </div>
    </div>
  );
}
