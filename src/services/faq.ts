import axios from '../lib/axios';
import { FAQ } from '../types/faq';

// API Response interfaces to match backend structure
interface ApiResponse<T> {
  message: string;
  data: T;
}

interface DeleteResponse {
  message: string;
}

// DTO interfaces for create and update operations
export interface CreateFaqDto {
  id: string;
  question: string;
  answer: string;
}

export interface UpdateFaqDto {
  id?: string;
  question?: string;
  answer?: string;
}

// Get all FAQs
export const fetchFaqs = async (): Promise<FAQ[]> => {
  const res = await axios.get<ApiResponse<FAQ[]>>('/faqs');
  return res.data.data;
};

// Get single FAQ by MongoDB _id
export const fetchFaqById = async (id: string): Promise<FAQ> => {
  const res = await axios.get<ApiResponse<FAQ>>(`/faqs/${id}`);
  return res.data.data;
};

// Create new FAQ
export const createFaq = async (faqData: CreateFaqDto): Promise<FAQ> => {
  const res = await axios.post<ApiResponse<FAQ>>('/faqs', faqData);
  return res.data.data;
};

// Update existing FAQ by MongoDB _id
export const updateFaq = async (id: string, faqData: UpdateFaqDto): Promise<FAQ> => {
  const res = await axios.put<ApiResponse<FAQ>>(`/faqs/${id}`, faqData);
  return res.data.data;
};

// Delete FAQ by MongoDB _id
export const deleteFaq = async (id: string): Promise<string> => {
  const res = await axios.delete<DeleteResponse>(`/faqs/${id}`);
  return res.data.message;
};

// Utility functions for better UX

// Find FAQ by custom id field (not MongoDB _id)
export const findFaqByCustomId = async (customId: string): Promise<FAQ | null> => {
  const faqs = await fetchFaqs();
  return faqs.find(faq => faq.id === customId) || null;
};

// Search FAQs by question content
export const searchFaqsByQuestion = async (searchTerm: string): Promise<FAQ[]> => {
  const faqs = await fetchFaqs();
  return faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

// Search FAQs by answer content
export const searchFaqsByAnswer = async (searchTerm: string): Promise<FAQ[]> => {
  const faqs = await fetchFaqs();
  return faqs.filter(faq => 
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

// Search FAQs by both question and answer
export const searchFaqs = async (searchTerm: string): Promise<FAQ[]> => {
  const faqs = await fetchFaqs();
  const lowerSearchTerm = searchTerm.toLowerCase();
  return faqs.filter(faq => 
    faq.question.toLowerCase().includes(lowerSearchTerm) ||
    faq.answer.toLowerCase().includes(lowerSearchTerm)
  );
};

// Get FAQs sorted by custom id
export const fetchFaqsSortedById = async (): Promise<FAQ[]> => {
  const faqs = await fetchFaqs();
  return faqs.sort((a, b) => parseInt(a.id) - parseInt(b.id));
};

// Get the next available custom id for new FAQ
export const getNextFaqId = async (): Promise<string> => {
  const faqs = await fetchFaqs();
  if (faqs.length === 0) return '1';
  
  const maxId = Math.max(...faqs.map(faq => parseInt(faq.id)));
  return (maxId + 1).toString();
};

// Batch operations
export const createMultipleFaqs = async (faqsData: CreateFaqDto[]): Promise<FAQ[]> => {
  const promises = faqsData.map(faqData => createFaq(faqData));
  return Promise.all(promises);
};

export const deleteMultipleFaqs = async (ids: string[]): Promise<string[]> => {
  const promises = ids.map(id => deleteFaq(id));
  return Promise.all(promises);
};

// Error handling wrapper for better UX
export const safeFetchFaqs = async (): Promise<{ data: FAQ[] | null; error: string | null }> => {
  try {
    const data = await fetchFaqs();
    return { data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
};

export const safeCreateFaq = async (faqData: CreateFaqDto): Promise<{ data: FAQ | null; error: string | null }> => {
  try {
    const data = await createFaq(faqData);
    return { data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Failed to create FAQ' 
    };
  }
};

export const safeUpdateFaq = async (id: string, faqData: UpdateFaqDto): Promise<{ data: FAQ | null; error: string | null }> => {
  try {
    const data = await updateFaq(id, faqData);
    return { data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Failed to update FAQ' 
    };
  }
};

export const safeDeleteFaq = async (id: string): Promise<{ success: boolean; error: string | null }> => {
  try {
    await deleteFaq(id);
    return { success: true, error: null };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete FAQ' 
    };
  }
};