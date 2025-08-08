import { FileText, Users, Archive } from "lucide-react";
import EspaceStatistiques from '@/components/EspaceStatistiques';
export default function HomePage() {
  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold text-[#222A3F] mb-6">
        Bienvenue sur le tableau de bord SOBITAS
      </h1>

      {/* Search Client History */}
      <div className="bg-white p-6 rounded shadow-sm border mb-8">
        <form className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Label */}
          <label className="text-sm font-semibold text-black whitespace-nowrap">
            Chercher l'historique de votre Client
          </label>

          {/* Input with up/down arrows */}
          <div className="relative w-full md:w-[400px]">
            <input
              type="text"
              placeholder="Numéro de téléphone"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 text-gray-400">
              <svg
                className="w-3 h-3 hover:text-black cursor-pointer"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5.23 12.21L10 7.44l4.77 4.77-1.06 1.06L10 9.56l-3.71 3.71-1.06-1.06z" />
              </svg>
              <svg
                className="w-3 h-3 hover:text-black cursor-pointer"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M14.77 7.79L10 12.56 5.23 7.79l1.06-1.06L10 10.44l3.71-3.71 1.06 1.06z" />
              </svg>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-[#FF6600] hover:bg-[#e65c00] text-white text-sm font-medium rounded transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1011.5 19.5a7.5 7.5 0 005.15-2.85z"
              />
            </svg>
            Chercher
          </button>
        </form>
      </div>

      
   {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Commandes */}
        <div className="relative rounded overflow-hidden shadow bg-cover bg-center h-72" style={{ backgroundImage: "url('/commandes-bg.jpg')" }}>
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-center px-4">
            <div className="bg-black bg-opacity-50 rounded-full p-4 mb-4">
              <FileText className="w-10 h-10" />
            </div>
            <p className="text-2xl font-semibold mb-1">784</p>
            <p className="text-sm mb-4">Nouvelle Commandes</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded">
              Consulter la liste des commandes
            </button>
          </div>
        </div>
          {/* Clients */}
        <div className="relative rounded overflow-hidden shadow bg-cover bg-center h-72" style={{ backgroundImage: "url('/clients-bg.jpg')" }}>
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-center px-4">
            <div className="bg-black bg-opacity-50 rounded-full p-4 mb-4">
              <Users className="w-10 h-10" />
            </div>
            <p className="text-2xl font-semibold mb-1">4408</p>
            <p className="text-sm mb-4">Clients</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded">
              Consulter la liste des clients
            </button>
          </div>
        </div> {/* Produits */}
        <div className="relative rounded overflow-hidden shadow bg-cover bg-center h-72" style={{ backgroundImage: "url('/produits-bg.jpg')" }}>
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-center px-4">
            <div className="bg-black bg-opacity-50 rounded-full p-4 mb-4">
              <Archive className="w-10 h-10" />
            </div>
            <p className="text-2xl font-semibold mb-1">319</p>
            <p className="text-sm mb-4">Produits</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded">
              Consulter la liste des produits
            </button>
          </div>
        </div>
      </div>

      {/* Espace Statistiques */}
      <EspaceStatistiques />
    </section>
  );
}
