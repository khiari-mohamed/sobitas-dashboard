"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "@/lib/axios";
import { FileText, User, Receipt, MapPin } from "lucide-react";

interface Client {
  _id: string;
  id?: string;
  name?: string;
  nom?: string;
  prenom?: string;
  telephone?: string;
  phone_1?: string;
  phone_2?: string;
  email?: string;
  adresse?: string;
  ville?: string;
  matricule?: string;
  subscriber?: boolean;
  isGuest?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Order {
  _id: string;
  id?: string;
  numero_commande?: string;
  numero?: string;
  date_commande?: string;
  created_at?: string;
  total?: number;
  prix_ttc?: string;
  prix_ht?: string;
  statut?: string;
  etat?: string;
  user_id?: string;
  nom?: string;
  prenom?: string;
  phone?: string;
  email?: string;
  billing_localite?: string;
  ville?: string;
  pays?: string;
}

interface Invoice {
  _id: string;
  id?: string;
  numero_facture?: string;
  numero?: string;
  date_facture?: string;
  created_at?: string;
  montant?: number;
  prix_ttc?: string;
  prix_ht?: string;
  statut?: string;
  etat?: string;
  user_id?: string;
  nom?: string;
  prenom?: string;
  phone?: string;
  email?: string;
  type?: string;
}

function HistoriquePageContent() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const searchClients = async () => {
      if (!searchTerm) return;
      
      setLoading(true);
      try {
        // Get all clients and commandes
        const [clientsResponse, commandesResponse] = await Promise.allSettled([
          axios.get('/clients'),
          axios.get('/commande')
        ]);
        
        let allClients: Client[] = [];
        let allCommandes: Order[] = [];
        
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
        const commandeClients = allCommandes.filter((commande: Order) => {
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
        }).map(commande => ({
          _id: `commande_${commande._id}`,
          name: `${commande.nom || ''} ${commande.prenom || ''}`.trim(),
          nom: commande.nom,
          prenom: commande.prenom,
          phone_1: commande.phone,
          email: commande.email,
          adresse: commande.billing_localite || commande.ville || commande.pays,
          isGuest: true as boolean
        }));
        
        // Combine and remove duplicates
        const allFoundClients = [...matchingClients, ...commandeClients];
        const uniqueClients = allFoundClients.filter((client, index, self) => {
          return index === self.findIndex(c => {
            if (c._id.toString().startsWith('commande_') || client._id.toString().startsWith('commande_')) {
              const phone1 = c.phone_1 || '';
              const phone2 = client.phone_1 || '';
              const email1 = c.email || '';
              const email2 = client.email || '';
              return (phone1 && phone1 === phone2) || (email1 && email1 === email2);
            }
            return c._id === client._id;
          });
        });
        
        setClients(uniqueClients);
        
        if (uniqueClients.length === 1) {
          setSelectedClient(uniqueClients[0]);
          await loadClientDetails(uniqueClients[0]._id);
        }
      } catch (error) {
        console.error("Error searching clients:", error);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };
    
    searchClients();
  }, [searchTerm]);

  const loadClientDetails = async (clientId: string) => {
    setLoadingDetails(true);
    try {
      const selectedClientData = clients.find(c => c._id === clientId);
      
      // Get all commandes
      const commandesResponse = await axios.get('/commande');
      const allCommandes = Array.isArray(commandesResponse.data) ? commandesResponse.data : [];
      
      // Get client matching criteria
      const clientEmail = selectedClientData?.email || '';
      const clientPhone1 = selectedClientData?.phone_1 || '';
      const clientName = selectedClientData?.name || '';
      const clientNom = selectedClientData?.nom || '';
      const clientPrenom = selectedClientData?.prenom || '';
      
      console.log('Loading details for client:', {
        clientId,
        selectedClientData,
        clientEmail,
        clientPhone1,
        clientName,
        clientNom,
        clientPrenom,
        totalCommandes: allCommandes.length
      });
      
      // If no client data found, try to extract from search term
      if (!clientEmail && !clientPhone1 && !clientName && !clientNom && !clientPrenom) {
        const searchTerm = new URLSearchParams(window.location.search).get('search') || '';
        console.log('No client data found, using search term:', searchTerm);
        
        // Filter commandes directly by search term
        const clientCommandes = allCommandes.filter((record: Order) => {
          const recordEmail = record.email || '';
          const recordPhone = record.phone || '';
          const recordNom = record.nom || '';
          const recordPrenom = record.prenom || '';
          const cleanSearchTerm = searchTerm.replace(/\D/g, '');
          const cleanRecordPhone = recordPhone.replace(/\D/g, '');
          
          const matches = (
            recordPhone === searchTerm ||
            recordEmail.toLowerCase() === searchTerm.toLowerCase() ||
            recordNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recordPrenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${recordNom} ${recordPrenom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (cleanSearchTerm && (
              cleanRecordPhone === cleanSearchTerm ||
              cleanRecordPhone.includes(cleanSearchTerm) ||
              cleanRecordPhone.endsWith(cleanSearchTerm)
            ))
          );
          
          if (matches) {
            console.log('Found matching commande by search term:', {
              recordId: record._id,
              recordEmail,
              recordPhone,
              recordNom,
              recordPrenom,
              numero: record.numero
            });
          }
          
          return matches;
        });
        
        console.log('Matched commandes by search term:', clientCommandes.length);
        
        // All commandes are treated as both orders and invoices
        // Since your system uses the same data for both
        const clientOrders = clientCommandes;
        const clientInvoices = clientCommandes;
        
        setOrders(clientOrders);
        setInvoices(clientInvoices);
        return;
      }
      
      // Function to check if a record matches the client
      const matchesClient = (record: Order) => {
        const recordEmail = record.email || '';
        const recordPhone = record.phone || '';
        const recordNom = record.nom || '';
        const recordPrenom = record.prenom || '';
        
        let matches = false;
        
        // For guest clients (from commandes), match exactly
        if (clientId.startsWith('commande_')) {
          matches =
            (!!clientEmail && recordEmail.toLowerCase() === clientEmail.toLowerCase()) ||
            (!!clientPhone1 && recordPhone === clientPhone1);
        } else {
          // For regular clients, match by email, phone, or name
          matches =
            (!!clientEmail && recordEmail.toLowerCase() === clientEmail.toLowerCase()) ||
            (!!clientPhone1 && recordPhone === clientPhone1) ||
            (!!clientName && !!recordNom && !!recordPrenom &&
              clientName.toLowerCase() === `${recordNom} ${recordPrenom}`.toLowerCase().trim());
        }
        
        if (matches) {
          console.log('Found matching commande:', {
            recordId: record._id,
            recordEmail,
            recordPhone,
            recordNom,
            recordPrenom,
            numero: record.numero
          });
        }
        
        return matches;
      };
      
      // Filter commandes for this client
      const clientCommandes = allCommandes.filter(matchesClient);
      
      console.log('Matched commandes:', clientCommandes.length);
      
      // All commandes are treated as both orders and invoices
      // Since your system uses the same data for both
      const clientOrders = clientCommandes;
      const clientInvoices = clientCommandes;
      
      setOrders(clientOrders);
      setInvoices(clientInvoices);
    } catch (error) {
      console.error("Error loading client details:", error);
      setOrders([]);
      setInvoices([]);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleClientSelect = async (client: Client) => {
    setSelectedClient(client);
    await loadClientDetails(client._id);
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#222A3F] mb-6">Historique Client</h1>
        <div className="text-center py-10">Recherche en cours...</div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 max-w-full overflow-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-[#222A3F] mb-4 sm:mb-6 break-words">
        Historique Client - Recherche: &quot;{searchTerm}&quot;
      </h1>

      {clients.length === 0 ? (
        <div className="bg-white p-4 sm:p-6 rounded shadow-sm border text-center">
          <p className="text-gray-600 text-sm sm:text-base">Aucun client trouvé pour &quot;{searchTerm}&quot;</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded shadow-sm border">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="truncate">Clients trouvés ({clients.length})</span>
            </h2>
            <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
              {clients.map((client) => (
                <div
                  key={client._id}
                  onClick={() => handleClientSelect(client)}
                  className={`p-2 sm:p-3 border rounded cursor-pointer transition ${
                    selectedClient?._id === client._id
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium text-sm sm:text-base truncate">{client.name || `${client.nom || ''} ${client.prenom || ''}`.trim() || 'Client sans nom'}</div>
                  <div className="text-xs sm:text-sm text-gray-600 truncate">{client.phone_1 || client.telephone || 'Téléphone non disponible'}</div>
                  {client.email && (
                    <div className="text-xs sm:text-sm text-gray-600 truncate">{client.email}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {selectedClient ? (
              <>
                <div className="bg-white p-4 sm:p-6 rounded shadow-sm border">
                  <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="truncate">Coordonnées Client</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-600">Nom complet</label>
                      <p className="font-medium text-sm sm:text-base break-words">{selectedClient.name || `${selectedClient.nom || ''} ${selectedClient.prenom || ''}`.trim() || 'Nom non disponible'}</p>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-600">Téléphone</label>
                      <p className="font-medium text-sm sm:text-base break-all">{selectedClient.phone_1 || selectedClient.telephone || 'Téléphone non disponible'}</p>
                    </div>
                    {selectedClient.email && (
                      <div className="sm:col-span-2">
                        <label className="text-xs sm:text-sm font-medium text-gray-600">Email</label>
                        <p className="font-medium text-sm sm:text-base break-all">{selectedClient.email}</p>
                      </div>
                    )}
                    {selectedClient.adresse && (
                      <div className="sm:col-span-2">
                        <label className="text-xs sm:text-sm font-medium text-gray-600">Adresse</label>
                        <p className="font-medium text-sm sm:text-base break-words">{selectedClient.adresse}</p>
                      </div>
                    )}
                  </div>
                </div>

                {loadingDetails ? (
                  <div className="text-center py-10">Chargement des détails...</div>
                ) : (
                  <>
                    <div className="bg-white p-4 sm:p-6 rounded shadow-sm border">
                      <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="truncate">Liste des Commandes ({orders.length})</span>
                      </h2>
                      {orders.length === 0 ? (
                        <p className="text-gray-600 text-sm sm:text-base">Aucune commande trouvée</p>
                      ) : (
                        <div className="overflow-x-auto -mx-4 sm:mx-0">
                          <div className="min-w-full inline-block align-middle">
                            <table className="min-w-full border-collapse border border-gray-300">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="border border-gray-300 px-2 sm:px-3 py-2 text-left text-xs sm:text-sm">N° Commande</th>
                                  <th className="border border-gray-300 px-2 sm:px-3 py-2 text-left text-xs sm:text-sm">Date</th>
                                  <th className="border border-gray-300 px-2 sm:px-3 py-2 text-left text-xs sm:text-sm">Total</th>
                                  <th className="border border-gray-300 px-2 sm:px-3 py-2 text-left text-xs sm:text-sm">Statut</th>
                                </tr>
                              </thead>
                              <tbody>
                                {orders.map((order) => (
                                  <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-2 sm:px-3 py-2 text-xs sm:text-sm break-all">{order.numero_commande || order.numero || order.id || order._id}</td>
                                    <td className="border border-gray-300 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap">
                                      {(order.date_commande || order.created_at) ? new Date(order.date_commande || order.created_at!).toLocaleDateString("fr-FR") : "Date non disponible"}
                                    </td>
                                    <td className="border border-gray-300 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap">{order.total || parseFloat(order.prix_ttc || '0') || 0} TND</td>
                                    <td className="border border-gray-300 px-2 sm:px-3 py-2">
                                      <span className={`px-1 sm:px-2 py-1 rounded text-xs ${
                                        (order.statut || order.etat) === "completed" || (order.statut || order.etat) === "livré" ? "bg-green-100 text-green-800" :
                                        (order.statut || order.etat) === "pending" || (order.statut || order.etat) === "en_cours" ? "bg-yellow-100 text-yellow-800" :
                                        "bg-gray-100 text-gray-800"
                                      } whitespace-nowrap`}>
                                        {order.statut || order.etat || "Non défini"}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-white p-4 sm:p-6 rounded shadow-sm border">
                      <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                        <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="truncate">Liste des Factures ({invoices.length})</span>
                      </h2>
                      {invoices.length === 0 ? (
                        <p className="text-gray-600 text-sm sm:text-base">Aucune facture trouvée</p>
                      ) : (
                        <div className="overflow-x-auto -mx-4 sm:mx-0">
                          <div className="min-w-full inline-block align-middle">
                            <table className="min-w-full border-collapse border border-gray-300">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="border border-gray-300 px-2 sm:px-3 py-2 text-left text-xs sm:text-sm">N° Facture</th>
                                  <th className="border border-gray-300 px-2 sm:px-3 py-2 text-left text-xs sm:text-sm">Date</th>
                                  <th className="border border-gray-300 px-2 sm:px-3 py-2 text-left text-xs sm:text-sm">Montant</th>
                                  <th className="border border-gray-300 px-2 sm:px-3 py-2 text-left text-xs sm:text-sm">Statut</th>
                                  <th className="border border-gray-300 px-2 sm:px-3 py-2 text-left text-xs sm:text-sm">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {invoices.map((invoice) => {
                                  const invoiceId = invoice._id || invoice.id;
                                  return (
                                    <tr key={invoice._id} className="hover:bg-gray-50">
                                      <td className="border border-gray-300 px-2 sm:px-3 py-2 text-blue-600 underline cursor-pointer text-xs sm:text-sm break-all" onClick={() => window.open(`/admin/facture/${invoiceId}/view`, '_blank')}>
                                        {invoice.numero_facture || invoice.numero || invoice.id || invoice._id}
                                      </td>
                                      <td className="border border-gray-300 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap">
                                        {(invoice.date_facture || invoice.created_at) ? new Date(invoice.date_facture || invoice.created_at!).toLocaleDateString("fr-FR") : "Date non disponible"}
                                      </td>
                                      <td className="border border-gray-300 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap">{invoice.montant || parseFloat(invoice.prix_ttc || '0') || 0} TND</td>
                                      <td className="border border-gray-300 px-2 sm:px-3 py-2">
                                        <span className={`px-1 sm:px-2 py-1 rounded text-xs ${
                                          (invoice.statut || invoice.etat) === "paid" || (invoice.statut || invoice.etat) === "payé" ? "bg-green-100 text-green-800" :
                                          (invoice.statut || invoice.etat) === "pending" || (invoice.statut || invoice.etat) === "en_attente" ? "bg-yellow-100 text-yellow-800" :
                                          "bg-red-100 text-red-800"
                                        } whitespace-nowrap`}>
                                          {invoice.statut || invoice.etat || "Non défini"}
                                        </span>
                                      </td>
                                      <td className="border border-gray-300 px-2 sm:px-3 py-2">
                                        <div className="flex flex-wrap gap-1">
                                          <button
                                            className="bg-blue-500 text-white px-1 sm:px-2 py-1 rounded text-xs whitespace-nowrap"
                                            onClick={() => window.open(`/admin/facture/${invoiceId}/document?doc=devis`, '_blank')}
                                          >
                                            📄 <span className="hidden sm:inline">Devis</span>
                                          </button>
                                          <button
                                            className="bg-green-600 text-white px-1 sm:px-2 py-1 rounded text-xs whitespace-nowrap"
                                            onClick={() => window.open(`/admin/facture/${invoiceId}/document?doc=bon-commande`, '_blank')}
                                          >
                                            📋 <span className="hidden sm:inline">Bon Commande</span>
                                          </button>
                                          <button
                                            className="bg-purple-600 text-white px-1 sm:px-2 py-1 rounded text-xs whitespace-nowrap"
                                            onClick={() => window.open(`/admin/facture/${invoiceId}/document?doc=facture-boutique`, '_blank')}
                                          >
                                            🧾 <span className="hidden sm:inline">Facture Boutique</span>
                                          </button>
                                          <button
                                            className="bg-indigo-600 text-white px-1 sm:px-2 py-1 rounded text-xs whitespace-nowrap"
                                            onClick={() => window.open(`/admin/facture/${invoiceId}/document?doc=facture-client`, '_blank')}
                                          >
                                            📋 <span className="hidden sm:inline">Facture Client</span>
                                          </button>
                                          <button
                                            className="bg-orange-600 text-white px-1 sm:px-2 py-1 rounded text-xs whitespace-nowrap"
                                            onClick={() => window.open(`/admin/facture/${invoiceId}/document?doc=bon-livraison`, '_blank')}
                                          >
                                            🚚 <span className="hidden sm:inline">Bon Livraison</span>
                                          </button>
                                          <button
                                            className="bg-yellow-600 text-white px-1 sm:px-2 py-1 rounded text-xs whitespace-nowrap"
                                            onClick={() => window.open(`/admin/facture/${invoiceId}/document?doc=ticket-caisse`, '_blank')}
                                          >
                                            🎫 <span className="hidden sm:inline">Ticket Caisse</span>
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="bg-white p-4 sm:p-6 rounded shadow-sm border text-center">
                <p className="text-gray-600 text-sm sm:text-base">Sélectionnez un client pour voir son historique</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HistoriquePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HistoriquePageContent />
    </Suspense>
  );
}