/*"use client";

import React, { useState, useEffect } from "react";
import { fetchAllBrandsForControl, updateBrandForControl, deleteBrandForControl } from "@/services/brand";
import { Brand } from "@/types/brand";

export default function BrandControlClient() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [displayedBrands, setDisplayedBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [maxDisplay, setMaxDisplay] = useState(8);
  const [sectionTitle, setSectionTitle] = useState("Nos Marques");
  const [sectionDescription, setSectionDescription] = useState("Découvrez les marques de confiance que nous proposons");
  const [showOnFrontend, setShowOnFrontend] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await fetchAllBrandsForControl();
        const brandsArray = Array.isArray(data) ? data : [];
        setBrands(brandsArray);
        setDisplayedBrands(brandsArray.slice(0, maxDisplay));
      } catch (err) {
        console.error(err);
        setBrands([]);
        setDisplayedBrands([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    if (Array.isArray(brands)) {
      setDisplayedBrands(brands.slice(0, maxDisplay));
    }
  }, [brands, maxDisplay]);

  const moveBrand = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= brands.length) return;
    const newBrands = [...brands];
    const [movedBrand] = newBrands.splice(fromIndex, 1);
    newBrands.splice(toIndex, 0, movedBrand);
    setBrands(newBrands);
  };

  const handleQuickEdit = (field: string, value: string | number, brand: Brand) => {
    if (!brand._id) return;
    setUpdating(brand._id);
    updateBrandForControl(brand._id, { ...brand, [field]: value })
      .then(() => {
        setBrands(brands.map(b => b._id === brand._id ? { ...b, [field]: value } : b));
      })
      .catch(console.error)
      .finally(() => setUpdating(null));
  };

  const handleDelete = async (brand: Brand) => {
    if (!brand._id || !confirm(`Êtes-vous sûr de vouloir supprimer "${brand.designation_fr}" ?`)) return;
    setUpdating(brand._id);
    try {
      await deleteBrandForControl(brand._id);
      setBrands(brands.filter(b => b._id !== brand._id));
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression de la marque');
    } finally {
      setUpdating(null);
    }
  };

  const openEditModal = (brand: Brand) => {
    setEditingBrand({ ...brand });
    setShowEditModal(true);
  };

  const saveEditedBrand = async () => {
    if (!editingBrand || !editingBrand._id) return;
    setUpdating(editingBrand._id);
    try {
      await updateBrandForControl(editingBrand._id, editingBrand);
      setBrands(brands.map(b => b._id === editingBrand._id ? editingBrand : b));
      setShowEditModal(false);
      setEditingBrand(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const getImageSrc = (brand: Brand) => {
    if (!brand.logo) return "/images/placeholder.png";
    if (brand.logo.startsWith('http') || brand.logo.startsWith('/')) return brand.logo;
    return `/images/brand/${brand.logo}`;
  };

  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Contrôle de la Section Marques</h1>
      
      {/* Section Configuration 
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
            <label className="block text-sm font-medium mb-2">Nombre de marques à afficher</label>
            <select
              value={maxDisplay}
              onChange={(e) => setMaxDisplay(Number(e.target.value))}
              className="w-full border p-2 rounded"
            >
              <option value={4}>4 marques</option>
              <option value={6}>6 marques</option>
              <option value={8}>8 marques</option>
              <option value={10}>10 marques</option>
              <option value={12}>12 marques</option>
              <option value={100}>Toutes les marques</option>
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

      {/* Preview Section 
      {showOnFrontend && (
        <div className="mb-8 p-6 bg-orange-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Aperçu Frontend</h2>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-orange-600 mb-2">{sectionTitle}</h3>
            <p className="text-gray-600">{sectionDescription}</p>
          </div>
          <div className="relative overflow-hidden bg-white rounded-lg p-4">
            <div className="flex items-center animate-scroll-brands">
              {displayedBrands.concat(displayedBrands).map((brand, idx) => (
                <div
                  key={`${brand._id}-${idx}`}
                  className="flex items-center justify-center p-4 transition hover:scale-105 h-20 min-w-[150px] cursor-pointer"
                  title={brand.designation_fr}
                >
                  <img
                    src={getImageSrc(brand)}
                    alt={brand.designation_fr}
                    className="object-contain w-full h-full max-h-16"
                  />
                </div>
              ))}
            </div>
          </div>
          <style jsx>{`
            @keyframes scroll-brands {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-scroll-brands {
              animation: scroll-brands 20s linear infinite;
            }
            .animate-scroll-brands:hover {
              animation-play-state: paused;
            }
          `}</style>
        </div>
      )}

      {/* Brands Management Table 
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-2 py-3 text-left">Ordre</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Logo</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Nom</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Slug</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Produits</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand, idx) => (
              <tr key={brand._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-2 py-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveBrand(idx, idx - 1)}
                      disabled={idx === 0}
                      className="px-2 py-1 bg-gray-200 rounded text-xs disabled:opacity-50"
                    >↑</button>
                    <span className="text-xs text-center">{idx + 1}</span>
                    <button
                      onClick={() => moveBrand(idx, idx + 1)}
                      disabled={idx === brands.length - 1}
                      className="px-2 py-1 bg-gray-200 rounded text-xs disabled:opacity-50"
                    >↓</button>
                  </div>
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <img src={getImageSrc(brand)} alt="Brand" className="w-12 h-8 object-contain" />
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <input
                    type="text"
                    value={brand.designation_fr || ""}
                    onChange={(e) => handleQuickEdit("designation_fr", e.target.value, brand)}
                    className="w-full border-0 bg-transparent text-sm"
                    onBlur={(e) => handleQuickEdit("designation_fr", e.target.value, brand)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <input
                    type="text"
                    value={brand.slug || ""}
                    onChange={(e) => handleQuickEdit("slug", e.target.value, brand)}
                    className="w-24 border-0 bg-transparent text-sm"
                    onBlur={(e) => handleQuickEdit("slug", e.target.value, brand)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <span className="text-sm text-gray-600">
                    {Array.isArray(brand.aromas) ? brand.aromas.length : 0} produits
                  </span>
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => openEditModal(brand)}
                      className="text-blue-600 hover:text-blue-800 text-xs"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(brand)}
                      className="text-red-600 hover:text-red-800 text-xs"
                      disabled={updating === brand._id}
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal 
      {showEditModal && editingBrand && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Modifier la marque</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom de la marque</label>
                  <input
                    type="text"
                    value={editingBrand.designation_fr || ""}
                    onChange={(e) => setEditingBrand({...editingBrand, designation_fr: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input
                    type="text"
                    value={editingBrand.slug || ""}
                    onChange={(e) => setEditingBrand({...editingBrand, slug: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Logo (chemin)</label>
                  <input
                    type="text"
                    value={editingBrand.logo || ""}
                    onChange={(e) => setEditingBrand({...editingBrand, logo: e.target.value})}
                    className="w-full border p-2 rounded"
                    placeholder="Chemin du logo"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={editingBrand.description_fr || ""}
                  onChange={(e) => setEditingBrand({...editingBrand, description_fr: e.target.value})}
                  className="w-full border p-2 rounded h-20"
                  placeholder="Description de la marque..."
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Description de couverture</label>
                <textarea
                  value={editingBrand.description_cover || ""}
                  onChange={(e) => setEditingBrand({...editingBrand, description_cover: e.target.value})}
                  className="w-full border p-2 rounded h-16"
                  placeholder="Description courte pour l'affichage..."
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
                  onClick={saveEditedBrand}
                  disabled={updating === editingBrand._id}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {updating === editingBrand._id ? "Sauvegarde..." : "Sauvegarder"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {brands.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucune marque trouvée
        </div>
      )}
    </div>
  );
}

*/