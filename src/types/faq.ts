export interface FAQ {
  _id: string;
  id: string;
  question: string;
  answer: string;
  created_at?: string;
  updated_at?: string;
}

// For create operations where _id and timestamps don't exist yet
export interface CreateFAQ {
  id: string;
  question: string;
  answer: string;
}

// For update operations where all fields are optional except the identifier
export interface UpdateFAQ {
  id?: string;
  question?: string;
  answer?: string;
}

// For API responses that include the FAQ data
export interface FAQResponse {
  message: string;
  data: FAQ;
}

export interface FAQListResponse {
  message: string;
  data: FAQ[];
}

// For delete operations response
export interface FAQDeleteResponse {
  message: string;
}

// Utility type for FAQ without MongoDB-specific fields (useful for forms)
export type FAQFormData = Omit<FAQ, '_id' | 'created_at' | 'updated_at'>;

// Type for FAQ search results
export interface FAQSearchResult {
  faqs: FAQ[];
  total: number;
  searchTerm: string;
}