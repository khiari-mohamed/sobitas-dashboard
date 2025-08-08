"use client";

import React, { useState, useEffect } from "react";
import { fetchAllPacks, updatePack, deletePack } from "@/services/pack";
import { Pack } from "@/types/pack";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/ui/RichTextEditor"), { ssr: false });

export default function PacksControlClient() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [displayedPacks, setDisplayedPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingPack, setEditingPack] = useState<Pack | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [maxDisplay, setMaxDisplay] = useState(4);
  const [sectionTitle, setSectionTitle] = useState("Nos Packs Exclusifs");
  const [sectionDescription, setSectionDescription] = useState("Profitez de nos packs exclusifs pour faire des économies sur vos achats !");
  const [showOnFrontend, setShowOnFrontend] = useState(true);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const data = await fetchAllPacks();
        setPacks(data);
        setDisplayedPacks(data.filter(p => p.publier === "oui").slice(0, maxDisplay));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPacks();
  }, []);

  useEffect(() => {
    setDisplayedPacks(packs.filter(p => p.publier === "oui").slice(0, maxDisplay));
  }, [packs, maxDisplay]);

  const movePack = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= packs.length) return;
    const newPacks = [...packs];
    const [movedPack] = newPacks.splice(fromIndex, 1);
    newPacks.splice(toIndex, 0, movedPack);
    setPacks(newPacks);
  };

  const handleQuickEdit = (field: string, value: string | number, pack: Pack) => {
    if (!pack._id) return;
    setUpdating(pack._id);
    updatePack(pack._id, { ...pack, [field]: value })
      .then(() => {
        setPacks(packs.map(p => p._id === pack._id ? { ...p, [field]: value } : p));
      })
      .catch(console.error)
      .finally(() => setUpdating(null));
  };

  const handleStatusToggle = async (pack: Pack) => {
    if (!pack._id) return;
    const newStatus = pack.status === "active" ? "inactive" : "active";
    handleQuickEdit("status", newStatus, pack);
  };

  const handlePublishToggle = async (pack: Pack) => {
    if (!pack._id) return;
    const newPublier = pack.publier === "oui" ? "non" : "oui";
    handleQuickEdit("publier", newPublier, pack);
  };

  const handleDelete = async (pack: Pack) => {
    if (!pack._id || !confirm(`Êtes-vous sûr de vouloir supprimer "${pack.designation_fr}" ?`)) return;
    setUpdating(pack._id);
    try {
      await deletePack(pack._id);
      setPacks(packs.filter(p => p._id !== pack._id));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const openEditModal = (pack: Pack) => {
    setEditingPack({ ...pack });
    setShowEditModal(true);
  };

  const saveEditedPack = async () => {
    if (!editingPack || !editingPack._id) return;
    setUpdating(editingPack._id);
    try {
      await updatePack(editingPack._id, editingPack);
      setPacks(packs.map(p => p._id === editingPack._id ? editingPack : p));
      setShowEditModal(false);
      setEditingPack(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const getImageSrc = (pack: Pack) => {
    if (!pack.cover || pack.cover === "undefined") return "/images/packs/pack.webp";
    if (pack.cover.startsWith('http') || pack.cover.startsWith('/')) return pack.cover;
    return `/storage/app/public/${pack.cover}`;
  };

  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Contrôle de la Section Packs Frontend</h1>
      
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
            <label className="block text-sm font-medium mb-2">Nombre de packs à afficher</label>
            <select
              value={maxDisplay}
              onChange={(e) => setMaxDisplay(Number(e.target.value))}
              className="w-full border p-2 rounded"
            >
              <option value={2}>2 packs</option>
              <option value={3}>3 packs</option>
              <option value={4}>4 packs</option>
              <option value={5}>5 packs</option>
              <option value={6}>6 packs</option>
              <option value={8}>8 packs</option>
              <option value={12}>12 packs</option>
              <option value={100}>Tous les packs</option>
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
        <div className="mb-8 p-6 bg-purple-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Aperçu Frontend</h2>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-purple-600 mb-2">{sectionTitle}</h3>
            <p className="text-gray-600">{sectionDescription}</p>
          </div>
          <div className={`grid gap-4 ${
            maxDisplay === 2 ? 'grid-cols-1 sm:grid-cols-2' :
            maxDisplay === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
            maxDisplay <= 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
            maxDisplay <= 6 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6' :
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
            {displayedPacks.map((pack, idx) => {
              const prixNum = Number(pack.prix) || 0;
              const promoNum = Number(pack.promo) || 0;
              const hasPromo = !!promoNum && promoNum < prixNum;
              return (
                <div key={pack._id} className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="relative aspect-square bg-gray-100 rounded mb-3 overflow-hidden">
                    <img
                      src={getImageSrc(pack)}
                      alt={pack.designation_fr}
                      className="w-full h-full object-cover"
                    />
                    {hasPromo && (
                      <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                        -{Math.round(((prixNum - promoNum) / prixNum) * 100)}%
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-sm mb-2 line-clamp-2">{pack.designation_fr}</h4>
                  <div className="text-center">
                    {hasPromo ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-purple-600 font-bold">{pack.promo} TND</span>
                        <span className="text-gray-500 line-through text-sm">{pack.prix} TND</span>
                      </div>
                    ) : (
                      <span className="text-purple-600 font-bold">{pack.prix} TND</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Packs Management Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-2 py-3 text-left">Ordre</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Image</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Désignation</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Prix</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Promo</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Qté</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Statut</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Publier</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packs.map((pack, idx) => (
              <tr key={pack._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-2 py-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => movePack(idx, idx - 1)}
                      disabled={idx === 0}
                      className="px-2 py-1 bg-gray-200 rounded text-xs disabled:opacity-50"
                    >↑</button>
                    <span className="text-xs text-center">{idx + 1}</span>
                    <button
                      onClick={() => movePack(idx, idx + 1)}
                      disabled={idx === packs.length - 1}
                      className="px-2 py-1 bg-gray-200 rounded text-xs disabled:opacity-50"
                    >↓</button>
                  </div>
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <img src={getImageSrc(pack)} alt="Pack" className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <input
                    type="text"
                    value={pack.designation_fr}
                    onChange={(e) => handleQuickEdit("designation_fr", e.target.value, pack)}
                    className="w-full border-0 bg-transparent text-sm"
                    onBlur={(e) => handleQuickEdit("designation_fr", e.target.value, pack)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <input
                    type="number"
                    value={pack.prix}
                    onChange={(e) => handleQuickEdit("prix", e.target.value, pack)}
                    className="w-16 border-0 bg-transparent text-sm"
                    onBlur={(e) => handleQuickEdit("prix", e.target.value, pack)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <input
                    type="number"
                    value={pack.promo || ""}
                    onChange={(e) => handleQuickEdit("promo", e.target.value, pack)}
                    className="w-16 border-0 bg-transparent text-sm"
                    onBlur={(e) => handleQuickEdit("promo", e.target.value, pack)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <input
                    type="number"
                    value={pack.qte}
                    onChange={(e) => handleQuickEdit("qte", e.target.value, pack)}
                    className="w-16 border-0 bg-transparent text-sm"
                    onBlur={(e) => handleQuickEdit("qte", e.target.value, pack)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <button
                    onClick={() => handleStatusToggle(pack)}
                    disabled={updating === pack._id}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pack.status === "active"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    } ${updating === pack._id ? "opacity-50" : ""}`}
                  >
                    {pack.status === "active" ? "Actif" : "Inactif"}
                  </button>
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <button
                    onClick={() => handlePublishToggle(pack)}
                    disabled={updating === pack._id}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pack.publier === "oui"
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    } ${updating === pack._id ? "opacity-50" : ""}`}
                  >
                    {pack.publier === "oui" ? "Oui" : "Non"}
                  </button>
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => openEditModal(pack)}
                      className="text-blue-600 hover:text-blue-800 text-xs"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(pack)}
                      className="text-red-600 hover:text-red-800 text-xs"
                      disabled={updating === pack._id}
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
      {showEditModal && editingPack && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Modifier le pack</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Désignation</label>
                  <input
                    type="text"
                    value={editingPack.designation_fr}
                    onChange={(e) => setEditingPack({...editingPack, designation_fr: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Prix</label>
                  <input
                    type="number"
                    value={editingPack.prix}
                    onChange={(e) => setEditingPack({...editingPack, prix: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Promo</label>
                  <input
                    type="number"
                    value={editingPack.promo || ""}
                    onChange={(e) => setEditingPack({...editingPack, promo: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantité</label>
                  <input
                    type="number"
                    value={editingPack.qte}
                    onChange={(e) => setEditingPack({...editingPack, qte: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image de couverture</label>
                  <input
                    type="text"
                    value={editingPack.cover || ""}
                    onChange={(e) => setEditingPack({...editingPack, cover: e.target.value})}
                    className="w-full border p-2 rounded"
                    placeholder="Chemin de l'image"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input
                    type="text"
                    value={editingPack.slug || ""}
                    onChange={(e) => setEditingPack({...editingPack, slug: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Description de couverture</label>
                <textarea
                  value={editingPack.description_cover || ""}
                  onChange={(e) => setEditingPack({...editingPack, description_cover: e.target.value})}
                  className="w-full border p-2 rounded h-20"
                />
              </div>
              <div className="mt-4">
                <Editor
                  value={editingPack.description_fr || ""}
                  onChange={(value: string) => setEditingPack({...editingPack, description_fr: value})}
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
                  onClick={saveEditedPack}
                  disabled={updating === editingPack._id}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {updating === editingPack._id ? "Sauvegarde..." : "Sauvegarder"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {packs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucun pack trouvé
        </div>
      )}
    </div>
  );
}