declare type PaymentType = "cash" | "credit_card";

declare type OrderState = "pending" | "inProgress" | "done" | "cancelled";
declare type DeliveryState = "pending" | "cancelled" | "delivered";

declare type OrdersMetadata = {
  currentPage: number;
  totalPages: number;
  limit: number;
  totalItems: number;
};

declare type OrdersResponse = {
  message: "success";
  metadata: OrdersMetadata;
  orders: Order[];
};

declare type ApiError = {
  error: string;
  statusCode?: number;
};

declare type OrderItem = {
  _id: string;
  product: Product;
  price: number;
  quantity: number;
};

declare type Order = {
  _id: string;
  user: string;
  orderItems: OrderItem[];
  totalPrice: number;
  paymentType: PaymentType;
  isPaid: boolean;
  isDelivered: boolean;
  state: OrderState;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
};

interface OrderCardProps {
  order: Order;
}

interface OrderItemCardProps {
  item: OrderItem;
}

interface OrderItemsPreviewProps {
  items: OrderItem[];
}

interface OrderPaymentInfoProps {
  paymentType: PaymentType;
  state: OrderState;
}

interface OrderStatusBadgeProps {
  state: OrderState;
}
