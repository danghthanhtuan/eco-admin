

import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface TransactionModel extends BaseModel {
  id: number;
  transactionID: number;
  customerPhone: string;
  orderCode: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  paymentType: number;
  note: string;
  totalAmount: string;
  createdDate: string;

  orderID: number;
  status: number;
 
  orderItems : OrderItems[];
}

export interface OrderItems { 
    orderID: number;
    productId: number;
    quantity: number;
    buyPrice: number;
    promotionPrice: number;
    productName: string;
}
