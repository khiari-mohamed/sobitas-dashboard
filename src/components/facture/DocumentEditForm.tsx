import React, { useState } from "react";
import factureService from "@/services/facture";

export default function DocumentEditForm({ order, doc, onSave }: { order: any; doc: string; onSave?: () => void }) {
  const [form, setForm] = useState<any>(order);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await factureService.updateFacture(form._id || form.id, form);
      setSuccess(true);
      if (onSave) onSave();
    } catch (err: any) {
      setError("Erreur lors de la mise à jour du document.");
    } finally {
      setLoading(false);
    }
  };

  // For demo: show all string/number fields
  const fields = Object.keys(form).filter(
    (key) => typeof form[key] === "string" || typeof form[key] === "number"
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Éditer le document ({doc.replace(/-/g, ' ')})</h2>
      {fields.map((key) => (
        <div key={key} className="mb-4">
          <label className="block mb-1 font-semibold capitalize">{key.replace(/_/g, ' ')}</label>
          {key === "note" || key === "historique" ? (
            <textarea
              name={key}
              value={form[key] || ""}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            />
          ) : (
            <input
              type="text"
              name={key}
              value={form[key] || ""}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            />
          )}
        </div>
      ))}
      {error && <div className="text-red-500 font-semibold">{error}</div>}
      {success && <div className="text-green-600 font-semibold">Document mis à jour avec succès.</div>}
      <button
        type="submit"
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded text-xl disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Mise à jour..." : "Enregistrer les modifications"}
      </button>
    </form>
  );
}
