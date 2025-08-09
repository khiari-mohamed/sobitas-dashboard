"use client";
import { FileText, Users, Archive } from "lucide-react";
import EspaceStatistiques from '@/components/EspaceStatistiques';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import authService from "@/services/auth";

export default function HomePage() {
  const router = useRouter();
  const [searchPhone, setSearchPhone] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    orders: 0,
    clients: 0,
    products: 0
  });

  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      router.replace('/login');
      return;
    }
    setIsLoading(false);
  }, [router]);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, clientsRes, productsRes] = await Promise.all([
          axios.get("/commande").catch(() => ({ data: [] })),
          axios.get("/clients").catch(() => ({ data: [] })),
          axios.get("/produits").catch(() => axios.get("/products").catch(() => ({ data: [] })))
        ]);
        
        setStats({
          orders: Array.isArray(ordersRes.data) ? ordersRes.data.length : ordersRes.data?.data?.length || 0,
          clients: Array.isArray(clientsRes.data) ? clientsRes.data.length : clientsRes.data?.data?.length || 0,
          products: productsRes.data?.data?.pagination?.total || 
                   productsRes.data?.data?.pagination?.totalItems || 
                   productsRes.data?.data?.pagination?.totalCount || 
                   productsRes.data?.data?.products?.length || 0
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Handle client search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPhone.trim()) return;
    
    setIsSearching(true);
    try {
      const searchTerm = searchPhone.trim();
      
      // Get all clients and commandes
      const [clientsResponse, commandesResponse] = await Promise.allSettled([
        axios.get('/clients'),
        axios.get('/commande')
      ]);
      
      let allClients: any[] = [];
      let allCommandes: any[] = [];
      
      // Get clients data
      if (clientsResponse.status === 'fulfilled') {
        allClients = clientsResponse.value.data?.data || [];
      }
      
      // Get commandes data
      if (commandesResponse.status === 'fulfilled') {
        allCommandes = Array.isArray(commandesResponse.value.data) ? commandesResponse.value.data : [];
      }
      
      const searchLower = searchTerm.toLowerCase();
      const cleanSearchTerm = searchTerm.replace(/\D/g, '');
      
      // Search in clients table
      const matchingClients = allClients.filter(client => {
        const clientName = client.name || '';
        const clientPhone1 = client.phone_1 || '';
        const clientEmail = client.email || '';
        const cleanPhone1 = clientPhone1.replace(/\D/g, '');
        
        return (
          clientPhone1 === searchTerm ||
          clientEmail.toLowerCase() === searchLower ||
          clientName.toLowerCase().includes(searchLower) ||
          clientPhone1.includes(searchTerm) ||
          clientEmail.toLowerCase().includes(searchLower) ||
          (cleanSearchTerm && (
            cleanPhone1 === cleanSearchTerm ||
            cleanPhone1.includes(cleanSearchTerm) ||
            cleanPhone1.endsWith(cleanSearchTerm)
          ))
        );
      });
      
      // Search in commandes for clients not in clients table
      const commandeClients = allCommandes.filter(commande => {
        const email = commande.email || '';
        const phone = commande.phone || '';
        const nom = commande.nom || '';
        const prenom = commande.prenom || '';
        const fullName = `${nom} ${prenom}`.trim();
        const cleanPhone = phone.replace(/\D/g, '');
        
        return (
          phone === searchTerm ||
          email.toLowerCase() === searchLower ||
          nom.toLowerCase().includes(searchLower) ||
          prenom.toLowerCase().includes(searchLower) ||
          fullName.toLowerCase().includes(searchLower) ||
          phone.includes(searchTerm) ||
          (cleanSearchTerm && (
            cleanPhone === cleanSearchTerm ||
            cleanPhone.includes(cleanSearchTerm) ||
            cleanPhone.endsWith(cleanSearchTerm)
          ))
        );
      });
      
      // Combine clients and commande clients
      const filteredClients = [...matchingClients, ...commandeClients];
      
      if (filteredClients.length > 0) {
        // Redirect to historique page with search results
        router.push(`/admin/historique?search=${encodeURIComponent(searchTerm)}`);
      } else {
        alert("Aucun client trouvé avec ce numéro de téléphone ou nom");
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Erreur lors de la recherche du client");
    } finally {
      setIsSearching(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold text-[#222A3F] mb-6">
        Bienvenue sur le tableau de bord SOBITAS
      </h1>

      {/* Search Client History */}
      <div className="bg-white p-6 rounded shadow-sm border mb-8 flex flex-col items-center justify-center">

        <form onSubmit={handleSearch} className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Label */}
          <label className="text-sm font-semibold text-black whitespace-nowrap">
            Chercher l'historique de votre Client
          </label>

          {/* Input with up/down arrows */}
          <div className="relative w-full md:w-[400px]">
            <input
              type="text"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              placeholder="Numéro de téléphone ou nom"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              disabled={isSearching}
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
            disabled={isSearching || !searchPhone.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-[#FF6600] hover:bg-[#e65c00] text-white text-sm font-medium rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
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
            {isSearching ? "Recherche..." : "Chercher"}
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
            <p className="text-2xl font-semibold mb-1">{stats.orders}</p>
            <p className="text-sm mb-4">Nouvelles Commandes</p>
            <button 
              onClick={() => router.push('/admin/commande')}
              className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded transition"
            >
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
            <p className="text-2xl font-semibold mb-1">{stats.clients}</p>
            <p className="text-sm mb-4">Clients</p>
            <button 
              onClick={() => router.push('/admin/clients')}
              className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded transition"
            >
              Consulter la liste des clients
            </button>
          </div>
        </div>
        {/* Produits */}
        <div className="relative rounded overflow-hidden shadow bg-cover bg-center h-72" style={{ backgroundImage: "url('/produits-bg.jpg')" }}>
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-center px-4">
            <div className="bg-black bg-opacity-50 rounded-full p-4 mb-4">
              <Archive className="w-10 h-10" />
            </div>
            <p className="text-2xl font-semibold mb-1">{stats.products}</p>
            <p className="text-sm mb-4">Produits</p>
            <button 
              onClick={() => router.push('/produits')}
              className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded transition"
            >
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
