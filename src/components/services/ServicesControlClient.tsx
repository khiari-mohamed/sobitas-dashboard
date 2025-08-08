"use client";

import React, { useState } from "react";

const initialFeatures = [
  {
    icon: "Truck",
    title: "Livraison Rapide",
    description: "LIVRAISON SOUS 24 HEURES",
    bgColor: "#2c74ec"
  },
  {
    icon: "Award",
    title: "Produits Certifiés",
    description: "CERTIFIÉ PAR LE MINSTÈRE DE SANTÉ",
    bgColor: "#7c3aed"
  },
  {
    icon: "Shield",
    title: "Paiement à la livraison",
    description: "PAIEMENT SÉCURISÉ",
    bgColor: "#1cb45c"
  },
  {
    icon: "Phone",
    title: "Service SOBITAS",
    description: "73 200 169",
    bgColor: "#ff8000"
  },
];

const iconOptions = [
  { value: "Truck", label: "Truck" },
  { value: "Award", label: "Award" },
  { value: "Shield", label: "Shield" },
  { value: "Phone", label: "Phone" },
];

export default function ServicesControlClient() {
  const [features, setFeatures] = useState(initialFeatures);
  const [newFeature, setNewFeature] = useState({ icon: "Truck", title: "", description: "", bgColor: "#2c74ec" });

  const moveFeature = (idx: number, direction: -1 | 1) => {
    const newFeatures = [...features];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= features.length) return;
    [newFeatures[idx], newFeatures[targetIdx]] = [newFeatures[targetIdx], newFeatures[idx]];
    setFeatures(newFeatures);
  };

  const deleteFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const updateFeature = (idx: number, key: string, value: string) => {
    setFeatures(features.map((f, i) => i === idx ? { ...f, [key]: value } : f));
  };

  const addFeature = () => {
    setFeatures([...features, newFeature]);
    setNewFeature({ icon: "Truck", title: "", description: "", bgColor: "#2c74ec" });
  };

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Contrôle des Services Frontend</h1>
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Services affichés sur le Frontend</h2>
        <div className="flex flex-wrap gap-6 mb-6">
          {features.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center border p-4 rounded shadow-sm bg-gray-50 w-72">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg" style={{ backgroundColor: item.bgColor }}>
                <span className="text-4xl text-white">{item.icon}</span>
              </div>
              <input
                type="text"
                value={item.title}
                onChange={e => updateFeature(idx, "title", e.target.value)}
                className="text-xl font-bold text-gray-800 mb-3 w-full border p-2 rounded"
                placeholder="Titre"
              />
              <textarea
                value={item.description}
                onChange={e => updateFeature(idx, "description", e.target.value)}
                className="text-gray-600 leading-relaxed max-w-xs mx-auto text-base w-full border p-2 rounded mb-2"
                placeholder="Description"
                rows={2}
              />
              <div className="flex gap-2 mb-2 w-full">
                <select
                  value={item.icon}
                  onChange={e => updateFeature(idx, "icon", e.target.value)}
                  className="border p-2 rounded w-1/2"
                >
                  {iconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <input
                  type="color"
                  value={item.bgColor}
                  onChange={e => updateFeature(idx, "bgColor", e.target.value)}
                  className="w-12 h-12 border-none p-0 bg-transparent cursor-pointer"
                  title="Couleur de fond"
                />
              </div>
              <div className="flex gap-2">
                <button
                  className="px-2 py-1 bg-gray-200 rounded text-xs"
                  disabled={idx === 0}
                  onClick={() => moveFeature(idx, -1)}
                >↑</button>
                <button
                  className="px-2 py-1 bg-gray-200 rounded text-xs"
                  disabled={idx === features.length - 1}
                  onClick={() => moveFeature(idx, 1)}
                >↓</button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                  onClick={() => deleteFeature(idx)}
                >Supprimer</button>
              </div>
            </div>
          ))}
        </div>
        <h3 className="text-lg font-semibold mb-2">Ajouter un nouveau service</h3>
        <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
          <select
            value={newFeature.icon}
            onChange={e => setNewFeature(f => ({ ...f, icon: e.target.value }))}
            className="border p-2 rounded"
          >
            {iconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <input
            type="text"
            value={newFeature.title}
            onChange={e => setNewFeature(f => ({ ...f, title: e.target.value }))}
            className="border p-2 rounded"
            placeholder="Titre"
          />
          <input
            type="text"
            value={newFeature.description}
            onChange={e => setNewFeature(f => ({ ...f, description: e.target.value }))}
            className="border p-2 rounded"
            placeholder="Description"
          />
          <input
            type="color"
            value={newFeature.bgColor}
            onChange={e => setNewFeature(f => ({ ...f, bgColor: e.target.value }))}
            className="w-12 h-12 border-none p-0 bg-transparent cursor-pointer"
            title="Couleur de fond"
          />
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            onClick={addFeature}
            type="button"
          >Ajouter</button>
        </div>
      </div>
      <div className="text-lg text-gray-600">Les modifications ici ne sont effectives que sur le frontend. Pour gérer les services du backend, utilisez la table principale.</div>
    </div>
  );
}
