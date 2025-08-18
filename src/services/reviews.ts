import axiosInstance from '../lib/axios';
import { Review } from "../types/reviews";

const RESOURCE = '/reviews';

export async function getReviewsByProduct(productId: string): Promise<Review[]> {
  const { data } = await axiosInstance.get<Review[]>(`${RESOURCE}/product/${productId}`);
  return data;
}

export async function postReview(review: Partial<Review>): Promise<Review> {
  const cleanData = Object.fromEntries(
    Object.entries(review).filter(([, value]) => value !== undefined && value !== '')
  );
  const { data } = await axiosInstance.post<Review>(RESOURCE, cleanData);
  return data;
}

export async function getAllReviews(): Promise<Review[]> {
  const { data } = await axiosInstance.get<Review[]>(RESOURCE);
  return data;
}

export const fetchReviewById = async (id: string): Promise<Review> => {
  const { data } = await axiosInstance.get<Review>(`${RESOURCE}/${id}`);
  return data;
};

export const createReview = async (review: Partial<Review>): Promise<Review> => {
  const cleanData = Object.fromEntries(
    Object.entries(review).filter(([, value]) => value !== undefined && value !== '')
  );
  const { data } = await axiosInstance.post<Review>(RESOURCE, cleanData);
  return data;
};

export const updateReview = async (id: string, review: Partial<Review>): Promise<Review> => {
  const cleanData = Object.fromEntries(
    Object.entries(review).filter(([key, value]) => 
      value !== undefined && 
      value !== '' && 
      key !== '_id' && 
      key !== '__v' && 
      key !== 'createdAt' && 
      key !== 'updatedAt'
    )
  );
  const { data } = await axiosInstance.put<Review>(`${RESOURCE}/${id}`, cleanData);
  return data;
};

export const deleteReview = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${RESOURCE}/${id}`);
};

const reviewsService = {
  getAllReviews,
  getReviewsByProduct,
  fetchReviewById,
  createReview,
  updateReview,
  deleteReview,
  postReview,
};

export default reviewsService;
