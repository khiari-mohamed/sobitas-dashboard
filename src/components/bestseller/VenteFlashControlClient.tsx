"use client";

import React, { useState, useEffect } from "react";
import { fetchAllVenteFlash, updateVenteFlash, deleteVenteFlash } from "@/services/venteFlash";
import { VenteFlash } from "@/types/venteflash";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/ui/RichTextEditor"), { ssr: false });

export default function VenteFlashControlClient() {
  const [products, setProducts] = useState<VenteFlash[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<VenteFlash[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<VenteFlash | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [maxDisplay, setMaxDisplay] = useState(4);
  const [sectionTitle, setSectionTitle] = useState("Ventes Flash");
  const [sectionDescription, setSectionDescription] = useState("Profitez de nos offres exclusives avant qu'il ne soit trop tard!");
  const [showOnFrontend, setShowOnFrontend] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await fetchAllVenteFlash();
        const productsArray = Array.isArray(data) ? data : [];
        setProducts(productsArray);
        setDisplayedProducts(productsArray.slice(0, maxDisplay));
      } catch (err) {
        console.error(err);
        setProducts([]);
        setDisplayedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (Array.isArray(products)) {
      setDisplayedProducts(products.slice(0, maxDisplay));
    }
  }, [products, maxDisplay]);

  const moveProduct = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= products.length) return;
    const newProducts = [...products];
    const [movedProduct] = newProducts.splice(fromIndex, 1);
    newProducts.splice(toIndex, 0, movedProduct);
    setProducts(newProducts);
  };

  const handleQuickEdit = (field: string, value: string | number, product: VenteFlash) => {
    if (!product._id) return;
    setUpdating(product._id);
    updateVenteFlash(product._id, { ...product, [field]: value })
      .then(() => {
        setProducts(products.map(p => p._id === product._id ? { ...p, [field]: value } : p));
      })
      .catch(console.error)
      .finally(() => setUpdating(null));
  };

  const handleDelete = async (product: VenteFlash) => {
    if (!product._id || !confirm(`Êtes-vous sûr de vouloir supprimer "${product.designation_fr}" ?`)) return;
    setUpdating(product._id);
    try {
      await deleteVenteFlash(product._id);
      setProducts(products.filter(p => p._id !== product._id));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const openEditModal = (product: VenteFlash) => {
    setEditingProduct({ ...product });
    setShowEditModal(true);
  };

  const saveEditedProduct = async () => {
    if (!editingProduct || !editingProduct._id) return;
    setUpdating(editingProduct._id);
    try {
      await updateVenteFlash(editingProduct._id, editingProduct);
      setProducts(products.map(p => p._id === editingProduct._id ? editingProduct : p));
      setShowEditModal(false);
      setEditingProduct(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const getImageSrc = (product: VenteFlash) => {
    if (!product.cover || product.cover === "undefined") return "/images/placeholder.png";
    if (product.cover.startsWith('http') || product.cover.startsWith('/')) return product.cover;
    return `https://admin.protein.tn/storage/app/public/${product.cover}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non définie";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Contrôle de la Section Ventes Flash</h1>
      
      {/* Section Configuration */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Configuration de la Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Titre de la section</label>
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Nombre de produits à afficher</label>
            <select
              value={maxDisplay}
              onChange={(e) => setMaxDisplay(Number(e.target.value))}
              className="w-full border p-2 rounded"
            >
              <option value={2}>2 produits</option>
              <option value={3}>3 produits</option>
              <option value={4}>4 produits</option>
              <option value={5}>5 produits</option>
              <option value={6}>6 produits</option>
              <option value={8}>8 produits</option>
              <option value={12}>12 produits</option>
              <option value={100}>Tous les produits</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description de la section</label>
          <textarea
            value={sectionDescription}
            onChange={(e) => setSectionDescription(e.target.value)}
            className="w-full border p-2 rounded h-20"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showOnFrontend}
              onChange={(e) => setShowOnFrontend(e.target.checked)}
              className="mr-2"
            />
            Afficher la section sur le frontend
          </label>
        </div>
      </div>

      {/* Preview Section */}
      {showOnFrontend && (
        <div className="mb-8 p-6 bg-red-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Aperçu Frontend</h2>
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-6 shadow-lg">
              <span className="text-2xl">⏰</span>
            </div>
            <h3 className="text-2xl font-bold text-red-600 mb-2">{sectionTitle}</h3>
            <p className="text-gray-600">{sectionDescription}</p>
          </div>
          <div className={`grid gap-4 ${
            maxDisplay === 2 ? 'grid-cols-1 sm:grid-cols-2' :
            maxDisplay === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
            maxDisplay <= 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
            maxDisplay <= 6 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6' :
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
            {displayedProducts.map((product, idx) => {
              const prixNum = Number(product.prix) || 0;
              const promoNum = Number(product.promo) || 0;
              const hasPromo = !!promoNum && promoNum < prixNum;
              return (
                <div key={product._id} className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="relative aspect-square bg-gray-100 rounded mb-3 overflow-hidden">
                    <img
                      src={getImageSrc(product)}
                      alt={product.designation_fr}
                      className="w-full h-full object-cover"
                    />
                    {hasPromo && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                        -{Math.round(((prixNum - promoNum) / prixNum) * 100)}%
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                      Flash
                    </div>
                  </div>
                  <h4 className="font-semibold text-sm mb-2 line-clamp-2">{product.designation_fr}</h4>
                  <div className="text-center">
                    {hasPromo ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-red-600 font-bold">{product.promo} TND</span>
                        <span className="text-gray-500 line-through text-sm">{product.prix} TND</span>
                      </div>
                    ) : (
                      <span className="text-red-600 font-bold">{product.prix} TND</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Products Management Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-2 py-3 text-left">Ordre</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Image</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Désignation</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Prix</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Promo</th>
              <th className="border border-gray-300 px-2 py-3 text-left">% Réduction</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Expiration</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => {
              const prixNum = Number(product.prix) || 0;
              const promoNum = Number(product.promo) || 0;
              const discountPercent = prixNum > 0 ? Math.round(((prixNum - promoNum) / prixNum) * 100) : 0;
              const isExpired = product.promo_expiration_date ? new Date(product.promo_expiration_date) < new Date() : false;
              
              return (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-2 py-3">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveProduct(idx, idx - 1)}
                        disabled={idx === 0}
                        className="px-2 py-1 bg-gray-200 rounded text-xs disabled:opacity-50"
                      >↑</button>
                      <span className="text-xs text-center">{idx + 1}</span>
                      <button
                        onClick={() => moveProduct(idx, idx + 1)}
                        disabled={idx === products.length - 1}
                        className="px-2 py-1 bg-gray-200 rounded text-xs disabled:opacity-50"
                      >↓</button>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-2 py-3">
                    <img src={getImageSrc(product)} alt="Product" className="w-12 h-12 object-cover rounded" />
                  </td>
                  <td className="border border-gray-300 px-2 py-3">
                    <input
                      type="text"
                      value={product.designation_fr}
                      onChange={(e) => handleQuickEdit("designation_fr", e.target.value, product)}
                      className="w-full border-0 bg-transparent text-sm"
                      onBlur={(e) => handleQuickEdit("designation_fr", e.target.value, product)}
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-3">
                    <input
                      type="number"
                      value={product.prix}
                      onChange={(e) => handleQuickEdit("prix", e.target.value, product)}
                      className="w-16 border-0 bg-transparent text-sm"
                      onBlur={(e) => handleQuickEdit("prix", e.target.value, product)}
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-3">
                    <input
                      type="number"
                      value={product.promo || ""}
                      onChange={(e) => handleQuickEdit("promo", e.target.value, product)}
                      className="w-16 border-0 bg-transparent text-sm"
                      onBlur={(e) => handleQuickEdit("promo", e.target.value, product)}
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-3">
                    <span className="text-red-600 font-bold text-sm">-{discountPercent}%</span>
                  </td>
                  <td className="border border-gray-300 px-2 py-3">
                    <div className="text-xs">
                      <div className={isExpired ? "text-red-600 font-bold" : "text-gray-600"}>
                        {formatDate(product.promo_expiration_date)}
                      </div>
                      {isExpired && <div className="text-red-500 text-xs">Expiré</div>}
                    </div>
                  </td>
                  <td className="border border-gray-300 px-2 py-3">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => openEditModal(product)}
                        className="text-blue-600 hover:text-blue-800 text-xs"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="text-red-600 hover:text-red-800 text-xs"
                        disabled={updating === product._id}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Modifier le produit en vente flash</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Désignation</label>
                  <input
                    type="text"
                    value={editingProduct.designation_fr}
                    onChange={(e) => setEditingProduct({...editingProduct, designation_fr: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Prix original</label>
                  <input
                    type="number"
                    value={editingProduct.prix}
                    onChange={(e) => setEditingProduct({...editingProduct, prix: Number(e.target.value)})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Prix flash</label>
                  <input
                    type="number"
                    value={editingProduct.promo || ""}
                    onChange={(e) => setEditingProduct({...editingProduct, promo: Number(e.target.value)})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date d'expiration</label>
                  <input
                    type="datetime-local"
                    value={editingProduct.promo_expiration_date ? new Date(editingProduct.promo_expiration_date).toISOString().slice(0, 16) : ""}
                    onChange={(e) => setEditingProduct({...editingProduct, promo_expiration_date: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image de couverture</label>
                  <input
                    type="text"
                    value={editingProduct.cover || ""}
                    onChange={(e) => setEditingProduct({...editingProduct, cover: e.target.value})}
                    className="w-full border p-2 rounded"
                    placeholder="Chemin de l'image"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input
                    type="text"
                    value={editingProduct.slug || ""}
                    onChange={(e) => setEditingProduct({...editingProduct, slug: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Description de couverture</label>
                <textarea
                  value={editingProduct.description_cover || ""}
                  onChange={(e) => setEditingProduct({...editingProduct, description_cover: e.target.value})}
                  className="w-full border p-2 rounded h-20"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Annuler
                </button>
                <button
                  onClick={saveEditedProduct}
                  disabled={updating === editingProduct._id}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {updating === editingProduct._id ? "Sauvegarde..." : "Sauvegarder"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {products.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucun produit en vente flash trouvé
        </div>
      )}
    </div>
  );
}