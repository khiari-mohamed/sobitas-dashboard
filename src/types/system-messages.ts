// types/system-messages.ts
export interface SystemMessage {
  id: string;
  msg_welcome?: string;
  msg_etat_commande?: string;
  msg_passez_commande?: string;
  created_at?: string;
  updated_at?: string;
  _id?: string; // MongoDB document id
}