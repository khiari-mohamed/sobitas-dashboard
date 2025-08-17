"use client";

import React, { useState, useEffect } from "react";
import { fetchAllNewArrivals, updateNewArrival, deleteNewArrival, getNewArrivalConfig, updateNewArrivalConfig, updateNewArrivalOrder } from "@/services/newarrival";
import { NewArrival } from "@/types/newarrival";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/ui/RichTextEditor"), { ssr: false });

export default function NewArrivalControlClient() {
  const [products, setProducts] = useState<NewArrival[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<NewArrival[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<NewArrival | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [registering, setRegistering] = useState(false);
  
  // Configuration state
  const [sectionTitle, setSectionTitle] = useState("Nouveautés");
  const [sectionDescription, setSectionDescription] = useState("Découvrez nos nouveaux produits fraîchement arrivés !");
  const [maxDisplay, setMaxDisplay] = useState(100);
  const [showOnFrontend, setShowOnFrontend] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsData = await fetchAllNewArrivals();
        const productsArray = Array.isArray(productsData) ? productsData : [];
        setProducts(productsArray);
        
        // Fetch configuration
        const config = await getNewArrivalConfig();
        setSectionTitle(config.sectionTitle || "Nouveautés");
        setSectionDescription(config.sectionDescription || "Découvrez nos nouveaux produits fraîchement arrivés !");
        setMaxDisplay(config.maxDisplay || 100);
        setShowOnFrontend(config.showOnFrontend !== false);
        
        // Apply order if exists
        if (config.productOrder && config.productOrder.length > 0) {
          const orderedProducts = [];
          const productMap = new Map(productsArray.map(p => [p._id!, p]));
          
          for (const id of config.productOrder) {
            if (productMap.has(id)) {
              orderedProducts.push(productMap.get(id)!);
              productMap.delete(id);
            }
          }
          orderedProducts.push(...Array.from(productMap.values()));
          setProducts(orderedProducts);
        }
        
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (Array.isArray(products)) {
      setDisplayedProducts(products.filter(p => p.publier === "1").slice(0, maxDisplay));
    }
  }, [products, maxDisplay]);

  const updateConfig = (updates: Partial<any>) => {
    if (updates.sectionTitle !== undefined) setSectionTitle(updates.sectionTitle);
    if (updates.sectionDescription !== undefined) setSectionDescription(updates.sectionDescription);
    if (updates.maxDisplay !== undefined) setMaxDisplay(updates.maxDisplay);
    if (updates.showOnFrontend !== undefined) setShowOnFrontend(updates.showOnFrontend);
    setHasChanges(true);
  };

  const registerChanges = async () => {
    setRegistering(true);
    setError(null);
    try {
      const configData = {
        sectionTitle,
        sectionDescription,
        maxDisplay,
        showOnFrontend,
        products: displayedProducts
      };
      
      // Save to backend
      await updateNewArrivalConfig({
        sectionTitle,
        sectionDescription,
        maxDisplay,
        showOnFrontend,
        productOrder: products.map(p => p._id!).filter(Boolean)
      });
      
      setHasChanges(false);
      setSuccess('Configuration enregistrée avec succès!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      setError('Erreur lors de l\'enregistrement');
    } finally {
      setRegistering(false);
    }
  };

  const moveProduct = async (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= products.length) return;
    const newProducts = [...products];
    const [movedProduct] = newProducts.splice(fromIndex, 1);
    newProducts.splice(toIndex, 0, movedProduct);
    setProducts(newProducts);
    setHasChanges(true);
    
    // Save new order
    try {
      await updateNewArrivalOrder(newProducts.map(p => p._id!).filter(Boolean));
      // Clear frontend cache
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('products-new-products');
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleQuickEdit = (field: string, value: string | number, product: NewArrival) => {
    if (!product._id) return;
    setUpdating(product._id);
    updateNewArrival(product._id, { ...product, [field]: value })
      .then(() => {
        setProducts(products.map(p => p._id === product._id ? { ...p, [field]: value } : p));
        setHasChanges(true);
        // Clear frontend cache
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('products-new-products');
        }
      })
      .catch(console.error)
      .finally(() => setUpdating(null));
  };

  const handlePublishToggle = async (product: NewArrival) => {
    if (!product._id) return;
    const newPublier = product.publier === "1" ? "0" : "1";
    handleQuickEdit("publier", newPublier, product);
  };

  const handleDelete = async (product: NewArrival) => {
    if (!product._id || !confirm(`Êtes-vous sûr de vouloir supprimer "${product.designation_fr}" ?`)) return;
    setUpdating(product._id);
    try {
      await deleteNewArrival(product._id);
      setProducts(products.filter(p => p._id !== product._id));
      setHasChanges(true);
      setSuccess('Produit supprimé avec succès');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la suppression');
    } finally {
      setUpdating(null);
    }
  };

  const openEditModal = (product: NewArrival) => {
    setEditingProduct({ ...product });
    setShowEditModal(true);
  };

  const saveEditedProduct = async () => {
    if (!editingProduct || !editingProduct._id) return;
    setUpdating(editingProduct._id);
    try {
      await updateNewArrival(editingProduct._id, editingProduct);
      setProducts(products.map(p => p._id === editingProduct._id ? editingProduct : p));
      setShowEditModal(false);
      setEditingProduct(null);
      setHasChanges(true);
      setSuccess('Produit modifié avec succès');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la modification');
    } finally {
      setUpdating(null);
    }
  };

  const getImageSrc = (product: NewArrival) => {
    if (!product.cover || product.cover === "undefined") return "/images/placeholder.png";
    if (product.cover.startsWith('http') || product.cover.startsWith('/')) return product.cover;
    return `https://admin.protein.tn/storage/app/public/${product.cover}`;
  };

  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Contrôle de la Section Nouveautés</h1>
        
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {hasChanges && (
          <button
            onClick={registerChanges}
            disabled={registering}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 animate-pulse"
          >
            {registering ? 'Enregistrement...' : '💾 Enregistrer les changements'}
          </button>
        )}
      </div>
      
      {/* Section Configuration */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Configuration de la Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Titre de la section</label>
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => updateConfig({ sectionTitle: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Nombre de produits à afficher</label>
            <select
              value={maxDisplay}
              onChange={(e) => updateConfig({ maxDisplay: Number(e.target.value) })}
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
            onChange={(e) => updateConfig({ sectionDescription: e.target.value })}
            className="w-full border p-2 rounded h-20"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showOnFrontend}
              onChange={(e) => updateConfig({ showOnFrontend: e.target.checked })}
              className="mr-2"
            />
            Afficher la section sur le frontend
          </label>
          {hasChanges && (
            <span className="text-orange-600 text-sm font-medium">
              ⚠️ Changements non enregistrés
            </span>
          )}
        </div>
      </div>

      {/* Preview Section */}
      {showOnFrontend && (
        <div className="mb-8 p-6 bg-yellow-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Aperçu Frontend</h2>
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-6 shadow-lg">
              <span className="text-2xl">🆕</span>
            </div>
            <h3 className="text-2xl font-bold text-orange-600 mb-2">{sectionTitle}</h3>
            <p className="text-gray-600">{sectionDescription}</p>
          </div>
          <div className={`grid gap-4 ${
            displayedProducts.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
            displayedProducts.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' :
            displayedProducts.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto' :
            displayedProducts.length >= 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
            'grid-cols-1'
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
                      New
                    </div>
                  </div>
                  <h4 className="font-semibold text-sm mb-2 line-clamp-2">{product.designation_fr}</h4>
                  <div className="text-center">
                    {hasPromo ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-orange-600 font-bold">{product.promo} TND</span>
                        <span className="text-gray-500 line-through text-sm">{product.prix} TND</span>
                      </div>
                    ) : (
                      <span className="text-orange-600 font-bold">{product.prix} TND</span>
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
              <th className="border border-gray-300 px-2 py-3 text-left">Qté</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Publier</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => {
              const prixNum = Number(product.prix) || 0;
              const promoNum = Number(product.promo) || 0;
              const discountPercent = prixNum > 0 ? Math.round(((prixNum - promoNum) / prixNum) * 100) : 0;
              
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
                    <input
                      type="number"
                      value={product.qte}
                      onChange={(e) => handleQuickEdit("qte", e.target.value, product)}
                      className="w-16 border-0 bg-transparent text-sm"
                      onBlur={(e) => handleQuickEdit("qte", e.target.value, product)}
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-3">
                    <button
                      onClick={() => handlePublishToggle(product)}
                      disabled={updating === product._id}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.publier === "1"
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      } ${updating === product._id ? "opacity-50" : ""}`}
                    >
                      {product.publier === "1" ? "Oui" : "Non"}
                    </button>
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
              <h3 className="text-xl font-bold mb-4">Modifier le nouveau produit</h3>
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
                  <label className="block text-sm font-medium mb-1">Prix</label>
                  <input
                    type="number"
                    value={editingProduct.prix}
                    onChange={(e) => setEditingProduct({...editingProduct, prix: Number(e.target.value)})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Promo</label>
                  <input
                    type="number"
                    value={editingProduct.promo || ""}
                    onChange={(e) => setEditingProduct({...editingProduct, promo: Number(e.target.value)})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantité</label>
                  <input
                    type="number"
                    value={editingProduct.qte}
                    onChange={(e) => setEditingProduct({...editingProduct, qte: e.target.value})}
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
              <div className="mt-4">
                <Editor
                  value={editingProduct.description_fr || ""}
                  onChange={(value: string) => setEditingProduct({...editingProduct, description_fr: value})}
                  label="Description complète"
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
          Aucun nouveau produit trouvé
        </div>
      )}
    </div>
  );
}