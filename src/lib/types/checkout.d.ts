declare type CheckoutStep = {
  setStep: React.Dispatch<React.SetStateAction<string>>;
};

declare type AddressCardProps = {
  selectedAddress: boolean;
  city: string;
  phone: string;
  street: string;
};

declare type ShippingAddressProps = {
  setStep: React.Dispatch<React.SetStateAction<string>>;
  id: string;
  setId: React.Dispatch<React.SetStateAction<string>>;
  setStreet: React.Dispatch<React.SetStateAction<string>>;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  setLat: React.Dispatch<React.SetStateAction<string>>;
  setLong: React.Dispatch<React.SetStateAction<string>>;
};

declare type Address = {
  _id: string;
  street: string;
  phone: string;
  city: string;
  lat?: string;
  long?: string;
  username?: string;
};

declare type GetAddressesResponse = {
  message: string;
  addresses: Address[];
};

declare type PayMethodProps = {
  index: number;
  image: string;
  title: string;
  description: string;
  selectedMethod: boolean;
};

declare type PaymentMethodProps = {
  setStep: React.Dispatch<React.SetStateAction<string>>;
  id: string;
};

declare type CheckoutPayload = {
  street: string;
  phone: string;
  city: string;
  lat: string;
  long: string;
};

declare type ShippingAddressPayload = {
  street: string;
  phone: string;
  city: string;
  lat: string;
  long: string;
};

// Payload sent to POST /api/orders per the new backend's Swagger doc:
//   { addressId, paymentMethod, couponCode?, notes? }
// (was: an inline shippingAddress object + a "/orders/checkout" endpoint
// that doesn't exist anymore - addresses are now a separate saved resource,
// referenced here by id, and card payments go through a dedicated
// create-intent/confirm flow instead of a redirect.)
declare type PaymentMethod = "CASH_ON_DELIVERY" | "CREDIT_CARD";

declare type CreateOrderPayload = {
  addressId: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  notes?: string;
};
