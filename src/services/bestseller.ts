import axiosInstance from '../lib/axios';

export interface BestSeller {
  _id?: string;
  designation_fr: string;
  prix: number;
  promo?: number;
  qte: string;
  publier: string;
  cover?: string;
  slug?: string;
  description_fr?: string;
  description_cover?: string;
}

export interface BestSellerConfig {
  sectionTitle: string;
  sectionDescription: string;
  maxDisplay: number;
  showOnFrontend: boolean;
  productOrder: string[];
}

export async function fetchAllBestSellers(): Promise<BestSeller[]> {
  try {
    const response = await axiosInstance.get('/products/store/top');
    return response.data?.data || response.data?.products || [];
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return [];
  }
}

export async function updateBestSeller(id: string, data: Partial<BestSeller>): Promise<{ success: boolean; data: BestSeller }> {
  try {
    const response = await axiosInstance.put(`/products/admin/update/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating best seller:', error);
    throw error;
  }
}

export async function deleteBestSeller(id: string): Promise<void> {
  try {
    await axiosInstance.delete(`/products/admin/delete/${id}`);
  } catch (error) {
    console.error('Error deleting best seller:', error);
    throw error;
  }
}

export async function getBestSellerConfig(): Promise<BestSellerConfig> {
  try {
    const response = await axiosInstance.get('/products/admin/bestseller-config');
    return response.data;
  } catch (error) {
    console.error('Error fetching best seller config:', error);
    throw error;
  }
}

export async function updateBestSellerConfig(config: Partial<BestSellerConfig>): Promise<{ success: boolean; data: BestSellerConfig }> {
  try {
    const response = await axiosInstance.post('/products/admin/bestseller-config', config);
    return response.data;
  } catch (error) {
    console.error('Error updating best seller config:', error);
    throw error;
  }
}

export async function updateBestSellerOrder(productOrder: string[]): Promise<{ success: boolean; data: { productOrder: string[] } }> {
  try {
    const response = await axiosInstance.put('/products/admin/bestseller-order', { productOrder });
    return response.data;
  } catch (error) {
    console.error('Error updating best seller order:', error);
    throw error;
  }
}