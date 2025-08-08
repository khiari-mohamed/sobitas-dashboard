"use client";

import React, { useState, useEffect } from "react";
import { fetchAllTestimonials, updateTestimonial, deleteTestimonial } from "@/services/testimonial";
import { Testimonial } from "@/types/testimonial";

export default function TestimonialControlClient() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [displayedTestimonials, setDisplayedTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [maxDisplay, setMaxDisplay] = useState(6);
  const [sectionTitle, setSectionTitle] = useState("Avis de nos clients");
  const [sectionDescription, setSectionDescription] = useState("Découvrez ce que pensent nos clients de PROTEINE TUNISIE. Plus de 15 ans d'expérience au service de votre performance.");
  const [showOnFrontend, setShowOnFrontend] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await fetchAllTestimonials();
        const testimonialsArray = Array.isArray(data) ? data : [];
        setTestimonials(testimonialsArray);
        setDisplayedTestimonials(testimonialsArray.filter(t => t.publier === "1" && t.comment?.trim()).slice(0, maxDisplay));
      } catch (err) {
        console.error(err);
        setTestimonials([]);
        setDisplayedTestimonials([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (Array.isArray(testimonials)) {
      setDisplayedTestimonials(testimonials.filter(t => t.publier === "1" && t.comment?.trim()).slice(0, maxDisplay));
    }
  }, [testimonials, maxDisplay]);

  const moveTestimonial = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= testimonials.length) return;
    const newTestimonials = [...testimonials];
    const [movedTestimonial] = newTestimonials.splice(fromIndex, 1);
    newTestimonials.splice(toIndex, 0, movedTestimonial);
    setTestimonials(newTestimonials);
  };

  const handleQuickEdit = (field: string, value: string | number, testimonial: Testimonial) => {
    if (!testimonial._id) return;
    setUpdating(testimonial._id);
    updateTestimonial(testimonial._id, { ...testimonial, [field]: value })
      .then(() => {
        setTestimonials(testimonials.map(t => t._id === testimonial._id ? { ...t, [field]: value } : t));
      })
      .catch(console.error)
      .finally(() => setUpdating(null));
  };

  const handlePublishToggle = async (testimonial: Testimonial) => {
    if (!testimonial._id) return;
    const newPublier = testimonial.publier === "1" ? "0" : "1";
    handleQuickEdit("publier", newPublier, testimonial);
  };

  const handleDelete = async (testimonial: Testimonial) => {
    if (!testimonial._id || !confirm(`Êtes-vous sûr de vouloir supprimer cet avis de "${testimonial.authorName}" ?`)) return;
    setUpdating(testimonial._id);
    try {
      await deleteTestimonial(testimonial._id);
      setTestimonials(testimonials.filter(t => t._id !== testimonial._id));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const openEditModal = (testimonial: Testimonial) => {
    setEditingTestimonial({ ...testimonial });
    setShowEditModal(true);
  };

  const saveEditedTestimonial = async () => {
    if (!editingTestimonial || !editingTestimonial._id) return;
    setUpdating(editingTestimonial._id);
    try {
      await updateTestimonial(editingTestimonial._id, editingTestimonial);
      setTestimonials(testimonials.map(t => t._id === editingTestimonial._id ? editingTestimonial : t));
      setShowEditModal(false);
      setEditingTestimonial(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
    ));
  };

  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Contrôle de la Section Témoignages</h1>
      
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
            <label className="block text-sm font-medium mb-2">Nombre de témoignages à afficher</label>
            <select
              value={maxDisplay}
              onChange={(e) => setMaxDisplay(Number(e.target.value))}
              className="w-full border p-2 rounded"
            >
              <option value={3}>3 témoignages</option>
              <option value={4}>4 témoignages</option>
              <option value={6}>6 témoignages</option>
              <option value={8}>8 témoignages</option>
              <option value={9}>9 témoignages</option>
              <option value={12}>12 témoignages</option>
              <option value={100}>Tous les témoignages</option>
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
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Aperçu Frontend</h2>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-orange-600 mb-2">💬 {sectionTitle}</h3>
            <p className="text-gray-600">{sectionDescription}</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex">
                {renderStars(5)}
              </div>
              <span className="text-lg font-semibold text-gray-800">4.9/5</span>
              <span className="text-gray-600">(680 avis)</span>
            </div>
          </div>
          <div className={`grid gap-4 ${
            maxDisplay === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
            maxDisplay === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
            maxDisplay <= 6 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
            maxDisplay <= 9 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
            {displayedTestimonials.map((testimonial, idx) => (
              <div key={testimonial._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-orange-600 font-bold">
                        {testimonial.authorName?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{testimonial.authorName}</h4>
                      {testimonial.authorRole && (
                        <p className="text-sm text-gray-500">{testimonial.authorRole}</p>
                      )}
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 rounded-full text-xs font-semibold text-green-800">
                    Vérifié
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {renderStars(Number(testimonial.stars) || 5)}
                </div>
                <p className="text-gray-700 leading-relaxed text-sm line-clamp-3">
                  {testimonial.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Testimonials Management Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-2 py-3 text-left">Ordre</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Auteur</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Commentaire</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Note</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Date</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Publier</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((testimonial, idx) => (
              <tr key={testimonial._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-2 py-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveTestimonial(idx, idx - 1)}
                      disabled={idx === 0}
                      className="px-2 py-1 bg-gray-200 rounded text-xs disabled:opacity-50"
                    >↑</button>
                    <span className="text-xs text-center">{idx + 1}</span>
                    <button
                      onClick={() => moveTestimonial(idx, idx + 1)}
                      disabled={idx === testimonials.length - 1}
                      className="px-2 py-1 bg-gray-200 rounded text-xs disabled:opacity-50"
                    >↓</button>
                  </div>
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-orange-600 font-bold text-xs">
                        {testimonial.authorName?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{testimonial.authorName}</div>
                      <div className="text-xs text-gray-500">{testimonial.authorRole}</div>
                    </div>
                  </div>
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <div className="max-w-xs">
                    <p className="text-sm line-clamp-2">{testimonial.comment}</p>
                  </div>
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <div className="flex items-center gap-1">
                    {renderStars(Number(testimonial.stars) || 5)}
                    <span className="text-sm ml-1">({testimonial.stars}/5)</span>
                  </div>
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <span className="text-xs text-gray-600">
                    {testimonial.created_at ? new Date(testimonial.created_at).toLocaleDateString("fr-FR") : "N/A"}
                  </span>
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <button
                    onClick={() => handlePublishToggle(testimonial)}
                    disabled={updating === testimonial._id}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      testimonial.publier === "1"
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    } ${updating === testimonial._id ? "opacity-50" : ""}`}
                  >
                    {testimonial.publier === "1" ? "Oui" : "Non"}
                  </button>
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => openEditModal(testimonial)}
                      className="text-blue-600 hover:text-blue-800 text-xs"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial)}
                      className="text-red-600 hover:text-red-800 text-xs"
                      disabled={updating === testimonial._id}
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
      {showEditModal && editingTestimonial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Modifier le témoignage</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom de l'auteur</label>
                  <input
                    type="text"
                    value={editingTestimonial.authorName}
                    onChange={(e) => setEditingTestimonial({...editingTestimonial, authorName: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rôle/Titre</label>
                  <input
                    type="text"
                    value={editingTestimonial.authorRole || ""}
                    onChange={(e) => setEditingTestimonial({...editingTestimonial, authorRole: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Note (1-5)</label>
                  <select
                    value={editingTestimonial.stars}
                    onChange={(e) => setEditingTestimonial({...editingTestimonial, stars: e.target.value})}
                    className="w-full border p-2 rounded"
                  >
                    <option value="1">1 étoile</option>
                    <option value="2">2 étoiles</option>
                    <option value="3">3 étoiles</option>
                    <option value="4">4 étoiles</option>
                    <option value="5">5 étoiles</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Commentaire</label>
                <textarea
                  value={editingTestimonial.comment}
                  onChange={(e) => setEditingTestimonial({...editingTestimonial, comment: e.target.value})}
                  className="w-full border p-2 rounded h-32"
                  placeholder="Commentaire du client..."
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
                  onClick={saveEditedTestimonial}
                  disabled={updating === editingTestimonial._id}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {updating === editingTestimonial._id ? "Sauvegarde..." : "Sauvegarder"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {testimonials.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucun témoignage trouvé
        </div>
      )}
    </div>
  );
}