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

const emailService = {
  sendOrderConfirmation,
  sendWeeklyPromotion,
  sendOrderShipped,
};

export default emailService;


