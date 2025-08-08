"use client";
import React from "react";

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName?: string;
}

export default function ConfirmDeleteModal({ open, onClose, onConfirm, productName }: ConfirmDeleteModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl sm:max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirmer la suppression</h2>
        <p className="mb-6 text-gray-700 text-lg">
          Êtes-vous sûr de vouloir supprimer <b>{productName || "ce produit"}</b> ? Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-3 flex-wrap">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded text-lg"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            style={{ background: '#FF4500' }}
            className="hover:brightness-90 text-white font-semibold px-6 py-3 rounded text-lg"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
