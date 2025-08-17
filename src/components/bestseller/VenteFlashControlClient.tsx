"use client";

import React, { useState, useEffect } from "react";
import { fetchAllVenteFlash, updateVenteFlash, deleteVenteFlash, createVenteFlash, uploadImage } from "@/services/venteFlash";
import { VenteFlash } from "@/types/venteflash";
import dynamic from "next/dynamic";
import styles from './VenteFlashControl.module.css';
import { getVenteFlashConfig, saveVenteFlashConfig } from '@/utils/venteFlashConfig';

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<VenteFlash>>({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [registering, setRegistering] = useState(false);

  const fetchProducts = async () => {
    try {
      setError(null);
      const data = await fetchAllVenteFlash();
      const productsArray = Array.isArray(data) ? data : [];
      setProducts(productsArray);
      setDisplayedProducts(productsArray.slice(0, maxDisplay));
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des produits');
      setProducts([]);
      setDisplayedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // Load saved configuration
    const config = getVenteFlashConfig();
    setMaxDisplay(config.maxDisplay);
    setSectionTitle(config.sectionTitle);
    setSectionDescription(config.sectionDescription);
    setShowOnFrontend(config.showOnFrontend);
  }, []);

  // Save configuration when it changes
  useEffect(() => {
    saveVenteFlashConfig({
      maxDisplay,
      sectionTitle,
      sectionDescription,
      showOnFrontend
    });
    setHasChanges(true);
  }, [maxDisplay, sectionTitle, sectionDescription, showOnFrontend]);

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
      
      // Try to detect frontend URL dynamically
      const ports = ['3000', '3001', '4000', '5000', '8080'];
      const protocols = ['http', 'https'];
      const hosts = ['localhost', 'protein.tn', window.location.hostname];
      
      let success = false;
      
      for (const protocol of protocols) {
        for (const host of hosts) {
          if (host === 'localhost') {
            for (const port of ports) {
              try {
                const url = `${protocol}://${host}:${port}/api/vente-flash-config`;
                const response = await fetch(url, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(configData)
                });
                if (response.ok) {
                  success = true;
                  break;
                }
              } catch (e) {
                continue;
              }
            }
          } else {
            try {
              const url = `${protocol}://${host}/api/vente-flash-config`;
              const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(configData)
              });
              if (response.ok) {
                success = true;
                break;
              }
            } catch (e) {
              continue;
            }
          }
          if (success) break;
        }
        if (success) break;
      }
      
      setHasChanges(false);
      setSuccess(success ? 'Configuration enregistrée avec succès!' : 'Configuration sauvegardée localement');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      setError('Erreur lors de l\'enregistrement');
    } finally {
      setRegistering(false);
    }
  };

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

  const handleQuickEdit = async (field: string, value: string | number, product: VenteFlash) => {
    if (!product._id) return;
    setUpdating(product._id);
    setError(null);
    try {
      await updateVenteFlash(product._id, { [field]: value });
      setProducts(products.map(p => p._id === product._id ? { ...p, [field]: value } : p));
      setSuccess('Produit mis à jour avec succès');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la mise à jour');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (product: VenteFlash) => {
    if (!product._id || !confirm(`Êtes-vous sûr de vouloir supprimer "${product.designation_fr}" ?`)) return;
    setUpdating(product._id);
    setError(null);
    try {
      await deleteVenteFlash(product._id);
      setProducts(products.filter(p => p._id !== product._id));
      setShowEditModal(false);
      setEditingProduct(null);
      setSuccess('Produit supprimé avec succès');
      setTimeout(() => setSuccess(null), 3000);
      setHasChanges(true);
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la suppression');
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

  const handleImageUpload = async (file: File, isEdit = false) => {
    setUploading(true);
    try {
      const result = await uploadImage(file);
      const imageUrl = result.url;
      if (isEdit && editingProduct) {
        setEditingProduct({ ...editingProduct, cover: imageUrl });
      } else {
        setNewProduct({ ...newProduct, cover: imageUrl });
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const createNewProduct = async () => {
    setUpdating('creating');
    setError(null);
    try {
      const productData = {
        ...newProduct,
        id: String(Date.now()),
        slug: newProduct.slug || newProduct.designation_fr?.toLowerCase().replace(/\s+/g, '-') || `product-${Date.now()}`,
      };
      const created = await createVenteFlash(productData);
      setProducts([...products, created]);
      setNewProduct({});
      setShowCreateModal(false);
      setSuccess('Produit créé avec succès');
      setTimeout(() => setSuccess(null), 3000);
      setHasChanges(true);
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la création du produit');
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Contrôle de la Section Ventes Flash</h1>
      
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
        <div className="flex gap-2">
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Actualisation...' : '🔄 Actualiser'}
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Nouveau Produit Flash
          </button>
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
              onChange={(e) => setSectionTitle(e.target.value)}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          {hasChanges && (
            <span className="text-orange-600 text-sm font-medium">
              ⚠️ Changements non enregistrés
            </span>
          )}
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
      <div className={`${styles['table-container']} overflow-x-auto`}>
        <table className={`${styles.table} w-full border-collapse border border-gray-300`}>
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
                    <div className="relative group">
                      <img src={getImageSrc(product)} alt="Product" className="w-12 h-12 object-cover rounded" />
                      {updating === product._id ? (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                          <div className={`${styles['loading-spinner']} w-4 h-4 border-2 border-white border-t-transparent rounded-full`}></div>
                        </div>
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded flex items-center justify-center">
                            <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">📷</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                setUpdating(product._id!);
                                handleImageUpload(e.target.files[0]).then(() => {
                                  if (newProduct.cover) {
                                    handleQuickEdit('cover', newProduct.cover, product);
                                    setNewProduct({});
                                  }
                                });
                              }
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            title="Changer l'image"
                            disabled={updating === product._id}
                          />
                        </>
                      )}
                    </div>
                  </td>
                  <td className="border border-gray-300 px-2 py-3">
                    <input
                      type="text"
                      value={product.designation_fr || ''}
                      onChange={(e) => {
                        const updatedProducts = products.map(p => 
                          p._id === product._id ? { ...p, designation_fr: e.target.value } : p
                        );
                        setProducts(updatedProducts);
                      }}
                      className="w-full border-0 bg-transparent text-sm"
                      onBlur={(e) => handleQuickEdit("designation_fr", e.target.value, product)}
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-3">
                    <input
                      type="number"
                      value={product.prix || ''}
                      onChange={(e) => {
                        const updatedProducts = products.map(p => 
                          p._id === product._id ? { ...p, prix: Number(e.target.value) } : p
                        );
                        setProducts(updatedProducts);
                      }}
                      className="w-16 border-0 bg-transparent text-sm"
                      onBlur={(e) => handleQuickEdit("prix", Number(e.target.value), product)}
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-3">
                    <input
                      type="number"
                      value={product.promo || ""}
                      onChange={(e) => {
                        const updatedProducts = products.map(p => 
                          p._id === product._id ? { ...p, promo: Number(e.target.value) } : p
                        );
                        setProducts(updatedProducts);
                      }}
                      className="w-16 border-0 bg-transparent text-sm"
                      onBlur={(e) => handleQuickEdit("promo", Number(e.target.value), product)}
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
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold z-10"
            >
              ×
            </button>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 pr-8">Modifier le produit en vente flash</h3>
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
                  <label className="block text-sm font-medium mb-1">Pack</label>
                  <input
                    type="text"
                    value={editingProduct.pack || ""}
                    onChange={(e) => setEditingProduct({...editingProduct, pack: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Note</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={editingProduct.note || ""}
                    onChange={(e) => setEditingProduct({...editingProduct, note: Number(e.target.value)})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image de couverture</label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], true)}
                      className="w-full border p-2 rounded"
                      disabled={uploading}
                    />
                    <input
                      type="text"
                      value={editingProduct.cover || ""}
                      onChange={(e) => setEditingProduct({...editingProduct, cover: e.target.value})}
                      className="w-full border p-2 rounded"
                      placeholder="Ou entrez l'URL de l'image"
                    />
                    {editingProduct.cover && (
                      <img src={getImageSrc(editingProduct)} alt="Preview" className="w-20 h-20 object-cover rounded" />
                    )}
                  </div>
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
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => handleDelete(editingProduct)}
                  disabled={updating === editingProduct._id}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  🗑️ Supprimer
                </button>
                <div className="flex gap-4">
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
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => {
                setShowCreateModal(false);
                setNewProduct({});
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold z-10"
            >
              ×
            </button>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 pr-8">Créer un nouveau produit flash</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Désignation</label>
                  <input
                    type="text"
                    value={newProduct.designation_fr || ""}
                    onChange={(e) => setNewProduct({...newProduct, designation_fr: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Prix original</label>
                  <input
                    type="number"
                    value={newProduct.prix || ""}
                    onChange={(e) => setNewProduct({...newProduct, prix: Number(e.target.value)})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Prix flash</label>
                  <input
                    type="number"
                    value={newProduct.promo || ""}
                    onChange={(e) => setNewProduct({...newProduct, promo: Number(e.target.value)})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date d'expiration</label>
                  <input
                    type="datetime-local"
                    value={newProduct.promo_expiration_date || ""}
                    onChange={(e) => setNewProduct({...newProduct, promo_expiration_date: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input
                    type="text"
                    value={newProduct.slug || ""}
                    onChange={(e) => setNewProduct({...newProduct, slug: e.target.value})}
                    className="w-full border p-2 rounded"
                    placeholder="Auto-généré si vide"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pack</label>
                  <input
                    type="text"
                    value={newProduct.pack || ""}
                    onChange={(e) => setNewProduct({...newProduct, pack: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Image de couverture</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    className="w-full border p-2 rounded"
                    disabled={uploading}
                  />
                  <input
                    type="text"
                    value={newProduct.cover || ""}
                    onChange={(e) => setNewProduct({...newProduct, cover: e.target.value})}
                    className="w-full border p-2 rounded"
                    placeholder="Ou entrez l'URL de l'image"
                  />
                  {newProduct.cover && (
                    <img src={newProduct.cover} alt="Preview" className="w-20 h-20 object-cover rounded" />
                  )}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Description de couverture</label>
                <textarea
                  value={newProduct.description_cover || ""}
                  onChange={(e) => setNewProduct({...newProduct, description_cover: e.target.value})}
                  className="w-full border p-2 rounded h-20"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewProduct({});
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Annuler
                </button>
                <button
                  onClick={createNewProduct}
                  disabled={updating === 'creating' || uploading}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {updating === 'creating' ? "Création..." : uploading ? "Upload..." : "Créer"}
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