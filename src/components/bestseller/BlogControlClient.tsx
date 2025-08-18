"use client";

import React, { useState, useEffect } from "react";
import { fetchAllBlogs, updateBlog, deleteBlog, fetchBlogConfig, saveBlogConfig } from "@/services/blog";
import { Blog } from "@/types/blog";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/ui/RichTextEditor"), { ssr: false });

export default function BlogControlClient() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [displayedBlogs, setDisplayedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [maxDisplay, setMaxDisplay] = useState(4);
  const [sectionTitle, setSectionTitle] = useState("Blog & FAQ");
  const [sectionDescription, setSectionDescription] = useState("Découvrez nos conseils d'experts et trouvez les réponses à vos questions sur la nutrition sportive");
  const [showOnFrontend, setShowOnFrontend] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsData, configData] = await Promise.all([
          fetchAllBlogs(),
          fetchBlogConfig()
        ]);
        
        const blogsArray = Array.isArray(blogsData) ? blogsData : [];
        setBlogs(blogsArray);
        
        if (configData) {
          setSectionTitle(configData.sectionTitle || "Blog & FAQ");
          setSectionDescription(configData.sectionDescription || "Découvrez nos conseils dexperts et trouvez les réponses à vos questions sur la nutrition sportive");
          setMaxDisplay(configData.maxDisplay || 4);
          setShowOnFrontend(configData.showOnFrontend !== false);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (Array.isArray(blogs)) {
      setDisplayedBlogs(blogs.filter(b => b.publier === "1").slice(0, maxDisplay));
    }
  }, [blogs, maxDisplay]);

  const moveBlog = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= blogs.length) return;
    const newBlogs = [...blogs];
    const [movedBlog] = newBlogs.splice(fromIndex, 1);
    newBlogs.splice(toIndex, 0, movedBlog);
    setBlogs(newBlogs);
  };

  const handleQuickEdit = (field: string, value: string | number, blog: Blog) => {
    if (!blog._id) return;
    setUpdating(blog._id);
    updateBlog(blog._id, { ...blog, [field]: value })
      .then(() => {
        setBlogs(blogs.map(b => b._id === blog._id ? { ...b, [field]: value } : b));
      })
      .catch(console.error)
      .finally(() => setUpdating(null));
  };

  const handlePublishToggle = async (blog: Blog) => {
    if (!blog._id) return;
    const newPublier = blog.publier === "1" ? "0" : "1";
    handleQuickEdit("publier", newPublier, blog);
  };

  const handleDelete = async (blog: Blog) => {
    if (!blog._id || !confirm(`Êtes-vous sûr de vouloir supprimer "${blog.designation_fr || blog.title}" ?`)) return;
    setUpdating(blog._id);
    try {
      await deleteBlog(blog._id);
      setBlogs(blogs.filter(b => b._id !== blog._id));
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression du blog');
    } finally {
      setUpdating(null);
    }
  };

  const openEditModal = (blog: Blog) => {
    setEditingBlog({ ...blog });
    setShowEditModal(true);
  };

  const saveEditedBlog = async () => {
    if (!editingBlog || !editingBlog._id) return;
    setUpdating(editingBlog._id);
    try {
      await updateBlog(editingBlog._id, editingBlog);
      setBlogs(blogs.map(b => b._id === editingBlog._id ? editingBlog : b));
      setShowEditModal(false);
      setEditingBlog(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const getImageSrc = (blog: Blog) => {
    if (!blog.cover) return "/images/blog/blog-01.jpg";
    if (typeof blog.cover === "string") {
      if (blog.cover.startsWith('http') || blog.cover.startsWith('/')) return blog.cover;
      return `/uploads/${blog.cover}`;
    }
    if (typeof blog.cover === "object" && blog.cover.url) {
      if (blog.cover.url.startsWith('http') || blog.cover.url.startsWith('/')) return blog.cover.url;
      return `/uploads/${blog.cover.url}`;
    }
    return "/images/blog/blog-01.jpg";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non définie";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Contrôle de la Section Blog</h1>
        
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
              onChange={(e) => { setSectionTitle(e.target.value); setHasChanges(true); }}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Nombre de articles à afficher</label>
            <select
              value={maxDisplay}
              onChange={(e) => { setMaxDisplay(Number(e.target.value)); setHasChanges(true); }}
              className="w-full border p-2 rounded"
            >
              <option value={2}>2 articles</option>
              <option value={3}>3 articles</option>
              <option value={4}>4 articles</option>
              <option value={5}>5 articles</option>
              <option value={6}>6 articles</option>
              <option value={8}>8 articles</option>
              <option value={12}>12 articles</option>
              <option value={100}>Tous les articles</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description de la section</label>
          <textarea
            value={sectionDescription}
            onChange={(e) => { setSectionDescription(e.target.value); setHasChanges(true); }}
            className="w-full border p-2 rounded h-20"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showOnFrontend}
              onChange={(e) => { setShowOnFrontend(e.target.checked); setHasChanges(true); }}
              className="mr-2"
            />
            Afficher la section sur le frontend
          </label>
          <div className="flex items-center gap-4">
            {hasChanges && (
              <span className="text-orange-600 text-sm font-medium">
                ⚠️ Changements non enregistrés
              </span>
            )}
            <button
              onClick={async () => {
                setSaving(true);
                try {
                  const config = { sectionTitle, sectionDescription, maxDisplay, showOnFrontend, blogOrder: blogs.map(b => b._id).filter(Boolean) };
                  await saveBlogConfig(config);
                  setHasChanges(false);
                  setSuccess('Configuration enregistrée avec succès!');
                  setTimeout(() => setSuccess(null), 3000);
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('blogConfigChanged', { detail: config }));
                  }
                } catch (err) {
                  setError('Erreur lors de l\'enregistrement');
                } finally {
                  setSaving(false);
                }
              }}
              disabled={!hasChanges || saving}
              className={`px-4 py-2 rounded font-medium ${
                hasChanges ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } ${saving ? "opacity-50" : ""}`}
            >
              {saving ? "Sauvegarde..." : "Appliquer les changements"}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {showOnFrontend && (
        <div className="mb-8 p-6 bg-orange-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Aperçu Frontend</h2>
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-6 shadow-lg">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-2xl font-bold text-orange-600 mb-2">{sectionTitle}</h3>
            <p className="text-gray-600">{sectionDescription}</p>
          </div>
          <div className={`grid gap-4 ${
            maxDisplay === 2 ? 'grid-cols-1 sm:grid-cols-2' :
            maxDisplay === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
            maxDisplay <= 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
            maxDisplay <= 6 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
            {displayedBlogs.map((blog, idx) => (
              <div key={blog._id} className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:border-orange-500 transition-all duration-300">
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={getImageSrc(blog)}
                    alt={blog.alt_cover || blog.designation_fr || blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>{formatDate(blog.created_at || blog.createdAt)}</span>
                  <span>📖 5 min</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2 line-clamp-2 text-lg">
                  {blog.designation_fr || blog.title}
                </h4>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {blog.description_cover || blog.meta_description_fr || blog.description}
                </p>
                <button className="w-full text-orange-600 border border-gray-200 hover:border-orange-500 font-medium py-2 px-4 rounded-lg transition-all duration-300">
                  Voir plus →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blogs Management Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-2 py-3 text-left">Ordre</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Image</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Titre</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Slug</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Auteur</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Date</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Publier</th>
              <th className="border border-gray-300 px-2 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, idx) => (
              <tr key={blog._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-2 py-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveBlog(idx, idx - 1)}
                      disabled={idx === 0}
                      className="px-2 py-1 bg-gray-200 rounded text-xs disabled:opacity-50"
                    >↑</button>
                    <span className="text-xs text-center">{idx + 1}</span>
                    <button
                      onClick={() => moveBlog(idx, idx + 1)}
                      disabled={idx === blogs.length - 1}
                      className="px-2 py-1 bg-gray-200 rounded text-xs disabled:opacity-50"
                    >↓</button>
                  </div>
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <img src={getImageSrc(blog)} alt="Blog" className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <input
                    type="text"
                    value={blog.designation_fr || blog.title || ""}
                    onChange={(e) => handleQuickEdit(blog.designation_fr ? "designation_fr" : "title", e.target.value, blog)}
                    className="w-full border-0 bg-transparent text-sm"
                    onBlur={(e) => handleQuickEdit(blog.designation_fr ? "designation_fr" : "title", e.target.value, blog)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <input
                    type="text"
                    value={blog.slug || ""}
                    onChange={(e) => handleQuickEdit("slug", e.target.value, blog)}
                    className="w-24 border-0 bg-transparent text-sm"
                    onBlur={(e) => handleQuickEdit("slug", e.target.value, blog)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <input
                    type="text"
                    value={blog.author || ""}
                    onChange={(e) => handleQuickEdit("author", e.target.value, blog)}
                    className="w-20 border-0 bg-transparent text-sm"
                    onBlur={(e) => handleQuickEdit("author", e.target.value, blog)}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <span className="text-xs text-gray-600">
                    {formatDate(blog.created_at || blog.createdAt)}
                  </span>
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <button
                    onClick={() => handlePublishToggle(blog)}
                    disabled={updating === blog._id}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      blog.publier === "1"
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    } ${updating === blog._id ? "opacity-50" : ""}`}
                  >
                    {blog.publier === "1" ? "Oui" : "Non"}
                  </button>
                </td>
                <td className="border border-gray-300 px-2 py-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => openEditModal(blog)}
                      className="text-blue-600 hover:text-blue-800 text-xs"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(blog)}
                      className="text-red-600 hover:text-red-800 text-xs"
                      disabled={updating === blog._id}
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
      {showEditModal && editingBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Modifier larticle de blog</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre</label>
                  <input
                    type="text"
                    value={editingBlog.designation_fr || editingBlog.title || ""}
                    onChange={(e) => setEditingBlog({...editingBlog, designation_fr: e.target.value, title: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input
                    type="text"
                    value={editingBlog.slug || ""}
                    onChange={(e) => setEditingBlog({...editingBlog, slug: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Auteur</label>
                  <input
                    type="text"
                    value={editingBlog.author || ""}
                    onChange={(e) => setEditingBlog({...editingBlog, author: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rôle de lauteur</label>
                  <input
                    type="text"
                    value={editingBlog.author_role || ""}
                    onChange={(e) => setEditingBlog({...editingBlog, author_role: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Description de couverture</label>
                <textarea
                  value={editingBlog.description_cover || ""}
                  onChange={(e) => setEditingBlog({...editingBlog, description_cover: e.target.value})}
                  className="w-full border p-2 rounded h-20"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Meta description</label>
                <textarea
                  value={editingBlog.meta_description_fr || ""}
                  onChange={(e) => setEditingBlog({...editingBlog, meta_description_fr: e.target.value})}
                  className="w-full border p-2 rounded h-16"
                />
              </div>
              <div className="mt-4">
                <Editor
                  value={editingBlog.content || editingBlog.description || ""}
                  onChange={(value: string) => setEditingBlog({...editingBlog, content: value, description: value})}
                  label="Contenu de l'article"
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
                  onClick={saveEditedBlog}
                  disabled={updating === editingBlog._id}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {updating === editingBlog._id ? "Sauvegarde..." : "Sauvegarder"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {blogs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucun article de blog trouvé
        </div>
      )}
    </div>
  );
}