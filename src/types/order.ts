
/**
 * Order type matching the backend Commande schema.
 * Adjust optional/required fields as needed.
 */
export interface Order {
  id: string;
  user_id?: string;
  remise?: string;
  prix_ht: string;
  prix_ttc: string;
  tva?: string;
  timbre?: string;
  etat: string;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  nom: string;
  prenom: string;
  adresse1?: string;
  adresse2?: string;
  email: string;
  phone: string;
  pays: string;
  region?: string;
  ville?: string;
  code_postale?: string;
  note?: string;
  livraison?: string;
  frais_livraison?: string;
  livraison_nom?: string;
  livraison_no?: string;
  livraison_prenom?: string;
  livraison_adresse1?: string;
  livraison_adresse2?: string;
  livraison_email?: string;
  livraison_phone?: string;
  livraison_pays?: string;
  livraison_region?: string;
  livraison_ville?: string;
  livraison_code_postale?: string;
  numero: string;
  historique?: string;
  paymentMethod?: string;
  cart?: any; // Adjust type if you have a CartItem type
  type: string;
  billing_localite?: string;
  gouvernorat?: string;
}
