export interface Client {
  _id: string;
  id?: string;
  email: string;
  name?: string;
  phone_1?: string;
  phone_2?: string;
  ville?: string;
  adresse?: string;
  matricule?: string;
  subscriber?: boolean;
  isGuest?: boolean;
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
  sms?: string;
}