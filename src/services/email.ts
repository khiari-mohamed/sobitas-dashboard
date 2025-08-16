// services/email.ts
import axiosInstance from '../lib/axios';
import {
  OrderConfirmationPayload,
  WeeklyPromotionPayload,
  OrderShippedPayload,
} from '../types/email';

const EMAIL_BASE = '/email';

export const sendOrderConfirmation = async (payload: OrderConfirmationPayload): Promise<{ message: string }> => {
  const { data } = await axiosInstance.post<{ message: string }>(
    `${EMAIL_BASE}/send-order-confirmation`,
    payload
  );
  return data;
};

export const sendWeeklyPromotion = async (payload: WeeklyPromotionPayload): Promise<{ message: string }> => {
  const { data } = await axiosInstance.post<{ message: string }>(
    `${EMAIL_BASE}/send-weekly-promotion`,
    payload
  );
  return data;
};

export const sendOrderShipped = async (payload: OrderShippedPayload): Promise<{ message: string }> => {
  const { data } = await axiosInstance.post<{ message: string }>(
    `${EMAIL_BASE}/send-order-shipped`,
    payload
  );
  return data;
};

export const fetchEmailTemplates = async (): Promise<any[]> => {
  const { data } = await axiosInstance.get(`${EMAIL_BASE}/templates`);
  return data;
};

export const deleteEmailTemplate = async (type: string): Promise<void> => {
  await axiosInstance.delete(`${EMAIL_BASE}/templates/${type}`);
};

const emailService = {
  sendOrderConfirmation,
  sendWeeklyPromotion,
  sendOrderShipped,
  fetchEmailTemplates,
  deleteEmailTemplate,
};

export default emailService;


