import axiosInstance from '../lib/axios';
import { Review } from "../types/reviews";

const RESOURCE = '/reviews';

export async function getReviewsByProduct(productId: string): Promise<Review[]> {
  const { data } = await axiosInstance.get<Review[]>(`${RESOURCE}/product/${productId}`);
  return data;
}

export async function postReview(review: Partial<Review>): Promise<Review> {
  const { data } = await axiosInstance.post<Review>(RESOURCE, review);
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

export const createReview = async (review: Omit<Review, '_id'>): Promise<Review> => {
  const { data } = await axiosInstance.post<Review>(RESOURCE, review);
  return data;
};

export const updateReview = async (id: string, review: Partial<Review>): Promise<Review> => {
  const { data } = await axiosInstance.patch<Review>(`${RESOURCE}/${id}`, review);
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
