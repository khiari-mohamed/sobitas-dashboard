"use client";

import React, { useState, useEffect } from "react";
import { fetchAllCategoriesForControl, updateCategoryForControl, deleteCategoryForControl } from "@/services/category";
import { Category } from "@/types/category";

export default function CategoryControlClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [displayedCategories, setDisplayedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [maxDisplay, setMaxDisplay] = useState(6);
  const [sectionTitle, setSectionTitle] = useState("Parcourir par catégorie");
  const [sectionDescription, setSectionDescription] = useState("Découvrez nos différentes catégories de produits");
  const [showOnFrontend, setShowOnFrontend] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetchAllCategoriesForControl();
        const categoriesArray = Array.isArray(data) ? data : [];
        setCategories(categoriesArray);
        setDisplayedCategories(categoriesArray.slice(0, maxDisplay));
      } catch (err) {
        console.error(err);
        setCategories([]);
        setDisplayedCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (Array.isArray(categories)) {
      setDisplayedCategories(categories.slice(0, maxDisplay));
    }
  }, [categories, maxDisplay]);

  const moveCategory = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= categories.length) return;
    const newCategories = [...categories];
    const [movedCategory] = newCategories.splice(fromIndex, 1);
    newCategories.splice(toIndex, 0, movedCategory);
    setCategories(newCategories);
  };

  const handleQuickEdit = (field: string, value: string | number, category: Category) => {
    if (!category._id) return;
    setUpdating(category._id);
    updateCategoryForControl(category._id, { ...category, [field]: value })
      .then(() => {
        setCategories(categories.map(c => c._id === category._id ? { ...c, [field]: value } : c));
      })
      .catch(console.error)
      .finally(() => setUpdating(null));
  };

  const handleDelete = async (category: Category) => {
    if (!category._id || !confirm(`Êtes-vous sûr de vouloir supprimer "${category.designation_fr || category.designation}" ?`)) return;
    setUpdating(category._id);
    try {
      await deleteCategoryForControl(category._id);
      setCategories(categories.filter(c => c._id !== category._id));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const openEditModal = (category: Category) => {
    setEditingCategory({ ...category });
    setShowEditModal(true);
  };

  const saveEditedCategory = async () => {
    if (!editingCategory || !editingCategory._id) return;
    setUpdating(editingCategory._id);
    try {
      await updateCategoryForControl(editingCategory._id, editingCategory);
      setCategories(categories.map(c => c._id === editingCategory._id ? editingCategory : c));
      setShowEditModal(false);
      setEditingCategory(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const getImageSrc = (category: Category) => {
    if (category.image?.url) {
      if (category.image.url.startsWith('http') || category.image.url.startsWith('/')) {
        return category.image.url;
      }
      return `https://admin.protein.tn/storage/app/public/${category.image.url}`;
    }
    if (category.cover) {
      if (category.cover.startsWith('http') || category.cover.startsWith('/')) {
        return category.cover;
      }
      return `https://admin.protein.tn/storage/app/public/${category.cover}`;
    }
    return "/images/placeholder.png";
  };

  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Contrôle de la Section Catégories</h1>
      
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
            <label className="block text-sm font-medium mb-2">Nombre de catégories à afficher</label>
            <select
              value={maxDisplay}
              onChange={(e) => setMaxDisplay(Number(e.target.value))}
              className="w-full border p-2 rounded"
            >
              <option value={3}>3 catégories</option>
              <option value={4}>4 catégories</option>
              <option value={5}>5 catégories</option>
              <option value={6}>6 catégories</option>
              <option value={8}>8 catégories</option>
              <option value={10}>10 catégories</option>
              <option value={100}>Toutes les catégories</option>
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
        <div className="mb-8 p-6 bg-orange-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Aperçu Frontend</h2>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-orange-600 mb-2">{sectionTitle}</h3>
            <p className="text-gray-600">{sectionDescription}</p>
          </div>
          <div className={`grid gap-6 ${
            maxDisplay === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
            maxDisplay === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
            maxDisplay === 5 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' :
            maxDisplay <= 6 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6' :
            maxDisplay <= 8 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
          }`}>
            {displayedCategories.map((category, idx) => (
              <div key={category._id} className="flex flex-col items-center group">
                <div className="w-[120px] h-[120px] rounded-full flex items-center justify-center mb-3 bg-orange-500 shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <img
                    src={getImageSrc(category)}
                    alt={category.designation_fr || category.designation}
                    className="w-[70px] h-[70px] object-contain filter brightness-0 invert"
                  />
                </div>
                <h4 className="font-medium text-center text-gray-800 text-sm group-hover:text-orange-600 transition-colors">
                  {category.designation_fr || category.designation}
                </h4>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories Management Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-2 py-3 text-left">Ordre</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Image</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Désignation</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Slug</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Produits</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, idx) => (
              <tr key={category._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-2 py-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveCategory(idx, idx - 1)}
                      disabled={idx === 0}
                      className="px-2 py-1 bg-gray-200 rounded text-xs disabled:opacity-50"
                    >↑</button>
                    <span className="text-xs text-center">{idx + 1}</span>
                    <button
                      onClick={() => moveCategory(idx, idx + 1)}
                      disabled={idx === categories.length - 1}
                      className="px-2 py-1 bg-gray-200 rounded text-xs disabled:opacity-50"
                    >↓</button>
                  </div>
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                    <img 
                      src={getImageSrc(category)} 
                      alt="Category" 
                      className="w-8 h-8 object-contain filter brightness-0 invert" 
                    />
                  </div>
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <input
                    type="text"
                    value={category.designation_fr || category.designation || ""}
                    onChange={(e) => handleQuickEdit(category.designation_fr ? "designation_fr" : "designation", e.target.value, category)}
                    className="w-full border-0 bg-transparent text-sm"
                    onBlur={(e) => handleQuickEdit(category.designation_fr ? "designation_fr" : "designation", e.target.value, category)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <input
                    type="text"
                    value={category.slug || ""}
                    onChange={(e) => handleQuickEdit("slug", e.target.value, category)}
                    className="w-24 border-0 bg-transparent text-sm"
                    onBlur={(e) => handleQuickEdit("slug", e.target.value, category)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <span className="text-sm text-gray-600">
                    {Array.isArray(category.products) ? category.products.length : 0} produits
                  </span>
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => openEditModal(category)}
                      className="text-blue-600 hover:text-blue-800 text-xs"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      className="text-red-600 hover:text-red-800 text-xs"
                      disabled={updating === category._id}
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

      {/* Edit Modal */}
      {showEditModal && editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Modifier la catégorie</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Désignation</label>
                  <input
                    type="text"
                    value={editingCategory.designation_fr || editingCategory.designation || ""}
                    onChange={(e) => setEditingCategory({...editingCategory, designation_fr: e.target.value, designation: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input
                    type="text"
                    value={editingCategory.slug || ""}
                    onChange={(e) => setEditingCategory({...editingCategory, slug: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={editingCategory.description_fr || ""}
                  onChange={(e) => setEditingCategory({...editingCategory, description_fr: e.target.value})}
                  className="w-full border p-2 rounded h-20"
                  placeholder="Description de la catégorie..."
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Description de couverture</label>
                <textarea
                  value={editingCategory.description_cover || ""}
                  onChange={(e) => setEditingCategory({...editingCategory, description_cover: e.target.value})}
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
                  onClick={saveEditedCategory}
                  disabled={updating === editingCategory._id}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {updating === editingCategory._id ? "Sauvegarde..." : "Sauvegarder"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {categories.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucune catégorie trouvée
        </div>
      )}
    </div>
  );
}