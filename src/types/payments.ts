export interface Payment {
  _id?: string;
  orderId: string;
  amount: number;
  status: string;
  paymentToken?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
