import axiosInstance from '../lib/axios';
import { Payment } from "../types/payments";

const RESOURCE = '/admin/payments/paymee/transactions';

export async function getAllPayments(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  from?: string;
  to?: string;
}): Promise<{ transactions: Payment[]; total: number }> {
  const { data } = await axiosInstance.get(RESOURCE, { params });
  return data;
}

export const fetchPaymentById = async (id: string): Promise<Payment> => {
  const { data } = await axiosInstance.get(`${RESOURCE}/${id}`);
  return data;
};

export const createPayment = async (payment: Omit<Payment, '_id'>): Promise<Payment> => {
  const { data } = await axiosInstance.post('/payments/payme/create', payment);
  return data;
};

export const updatePayment = async (id: string, payment: Partial<Payment>): Promise<Payment> => {
  const { data } = await axiosInstance.patch(`${RESOURCE}/${id}`, payment);
  return data;
};

export const deletePayment = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${RESOURCE}/${id}`);
};

const paymentsService = {
  getAllPayments,
  fetchPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
};

export default paymentsService;
