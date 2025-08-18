// types/email.ts

export interface OrderItem {
  name: string;
  quantity: number;
  price: number | string;
}

export interface OrderConfirmationPayload {
  to: string;
  customerName: string;
  orderNumber: string;
  customerEmail?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
  orderItems?: OrderItem[];
  subtotal?: string;
  shippingCost?: string;
  shippingMethod?: string;
  total?: string;
  billingLocalite?: string;
  unsubscribeLink?: string;
  subject?: string;
  html?: string;
  attachments?: Array<{ filename: string; content: string; contentType: string }>;
}

export interface WeeklyPromotionPayload {
  to: string;
  subject?: string;
  html?: string;
  customerName: string;
  customerEmail: string;
  unsubscribeLink: string;
  promotionsLink?: string;
  promotions?: {
    name: string;
    oldPrice: number;
    promoPrice: number;
    discountPercentage: number;
  }[];
  attachments?: Array<{ filename: string; content: string; contentType: string }>;
}

export interface OrderShippedPayload {
  to: string;
  subject?: string;
  html?: string;
  customerName: string;
  orderNumber: string;
  customerEmail: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  orderItems: OrderItem[];
  subtotal: string;
  shippingCost: string;
  shippingMethod: string;
  total: string;
  billingLocalite?: string;
  unsubscribeLink?: string;
  attachments?: Array<{ filename: string; content: string; contentType: string }>;
}





