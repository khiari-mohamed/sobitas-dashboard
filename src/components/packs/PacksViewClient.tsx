"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchAllPacks } from "@/services/pack";
import { Pack } from "@/types/pack";
import { getPackImageWithFallback } from "@/utils/imageUtils";

export default function PacksViewClient({ id }: { id: string }) {
  const router = useRouter();
  const [pack, setPack] = useState<Pack | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPack = async () => {
      try {
        const packs = await fetchAllPacks();
        const foundPack = packs.find(p => p._id === id);
        setPack(foundPack || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPack();
  }, [id]);

  // Refresh data when component mounts or id changes
  useEffect(() => {
    const handleRefresh = () => {
      const fetchPack = async () => {
        try {
          const packs = await fetchAllPacks();
          const foundPack = packs.find(p => p._id === id);
          setPack(foundPack || null);
        } catch (err) {
          console.error(err);
        }
      };
      fetchPack();
    };
    
    // Listen for navigation events to refresh data
    window.addEventListener('focus', handleRefresh);
    return () => window.removeEventListener('focus', handleRefresh);
  }, [id]);

  if (loading) return <div className="p-8">Chargement...</div>;
  if (!pack) return <div className="p-8">Pack non trouvé</div>;

  const { src: imageSrc, fallback: imageFallback } = pack ? getPackImageWithFallback(pack as unknown as Record<string, unknown>) : { src: "/images/placeholder.png", fallback: "" };

  const isPublished = pack.publier === "1" || pack.publier === "oui";

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Détails du pack</h1>
        <div className="flex gap-4">
          <button
            onClick={() => router.push(`/admin/packs/${id}/edit`)}
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
          >
            Modifier
          </button>
          <button
            onClick={() => router.push("/admin/packs")}
            className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600"
          >
            Retour
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-2">ID</h3>
          <p className="text-gray-700 mb-4">{pack.id}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Désignation</h3>
          <p className="text-gray-700 mb-4">{pack.designation_fr}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Slug</h3>
          <p className="text-gray-700 mb-4">{pack.slug}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Prix</h3>
          <p className="text-gray-700 mb-4">{pack.prix || pack.price} TND</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Promo</h3>
          <p className="text-gray-700 mb-4">{pack.promo || pack.oldPrice || "Aucune"} {(pack.promo || pack.oldPrice) && "TND"}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Quantité</h3>
          <p className="text-gray-700 mb-4">{pack.qte}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Note</h3>
          <p className="text-gray-700 mb-4">{pack.note}/5</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Publier</h3>
          <span className={`px-3 py-1 rounded-full text-sm ${
            isPublished ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {isPublished ? "Publié" : "Non publié"}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Rupture</h3>
          <span className={`px-3 py-1 rounded-full text-sm ${
            pack.rupture === "1" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`}>
            {pack.rupture === "1" ? "En rupture" : "En stock"}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Best Seller</h3>
          <span className={`px-3 py-1 rounded-full text-sm ${
            pack.best_seller === "1" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
          }`}>
            {pack.best_seller === "1" ? "Oui" : "Non"}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Nouveau Produit</h3>
          <span className={`px-3 py-1 rounded-full text-sm ${
            pack.new_product === "1" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
          }`}>
            {pack.new_product === "1" ? "Oui" : "Non"}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Ordre d&rsquo;affichage</h3>
          <p className="text-gray-700 mb-4">{pack.displayOrder || 0}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Créé le</h3>
          <p className="text-gray-700 mb-4">{new Date(pack.created_at || "").toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Image de couverture</h3>
        <img 
          src={imageSrc} 
          alt={pack.alt_cover || "Pack"} 
          className="max-w-md h-auto border rounded" 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (imageFallback && target.src !== imageFallback) {
              target.src = imageFallback;
            } else {
              target.src = "/images/placeholder.png";
            }
          }}
        />
        {pack.alt_cover && <p className="text-sm text-gray-500 mt-2">Alt: {pack.alt_cover}</p>}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Description de couverture</h3>
        <p className="text-gray-700">{pack.description_cover}</p>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Description complète</h3>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: pack.description_fr || "" }} />
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Meta Description</h3>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: pack.meta_description_fr || "" }} />
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Questions</h3>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: pack.questions || "" }} />
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Valeurs nutritionnelles</h3>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: pack.nutrition_values || "" }} />
      </div>

      {pack.meta && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Meta SEO</h3>
          <p className="text-gray-700 text-sm">{pack.meta}</p>
        </div>
      )}

      {pack.content_seo && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Contenu SEO</h3>
          <p className="text-gray-700">{pack.content_seo}</p>
        </div>
      )}

      {pack.zone1 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Zone 1</h3>
          <p className="text-gray-700">{pack.zone1}</p>
        </div>
      )}

      {pack.zone2 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Zone 2</h3>
          <p className="text-gray-700">{pack.zone2}</p>
        </div>
      )}

      {pack.zone3 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Zone 3</h3>
          <p className="text-gray-700">{pack.zone3}</p>
        </div>
      )}

      {pack.zone4 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Zone 4</h3>
          <p className="text-gray-700">{pack.zone4}</p>
        </div>
      )}
    </div>
  );
}