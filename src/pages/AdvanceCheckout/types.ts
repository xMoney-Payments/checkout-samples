import type { XMoneyPaymentCardInstance } from "../../types/xmoney-sdk/payment-card-sdk.types";
import type { XMoneyGooglePayInstance } from "../../types/xmoney-sdk/google-pay-sdk.types";
import type { XMoneyApplePayInstance } from "../../types/xmoney-sdk/apple-pay-sdk.types";
import type { TransactionDetails } from "../../types/checkout.types";
import { XMoneySavedCardPaymentInstance } from "../../types/xmoney-sdk/saved-card-payment-sdk.types";

export interface PizzaItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface OrderItem extends PizzaItem {
  quantity: number;
}

export type PaymentMethodType =
  | "card"
  | "saved-card"
  | "google-pay"
  | "apple-pay"
  | "payment-form";

export interface IntentResult {
  payload: string;
  checksum: string;
}

export interface SavedCardData {
  id: number;
  type: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  nameOnCard: string;
}

export interface CheckoutState {
  intentResult: () => IntentResult | null;
  isLoading: () => boolean;
  error: () => string | null;
  setError: (v: string | null) => void;
  paymentResult: () => TransactionDetails | null;
  isGooglePaySupported: () => boolean;
  isApplePaySupported: () => boolean;
  activeMethod: () => PaymentMethodType;
  setActiveMethod: (m: PaymentMethodType) => void;
  isProcessing: () => boolean;
  setIsProcessing: (v: boolean) => void;
  orderItems: () => OrderItem[];
  isUpdatingOrder: () => boolean;
  isActiveMethodReady: () => boolean;
  handleQuantityChange: (id: number, delta: number) => void;
  handlePaymentComplete: (data: unknown) => void;
  handlePaymentError: (err: unknown) => void;
  handlePlaceOrder: () => void;
  handlePayWithSavedCard: () => void;
  setPaymentCardInstance: (v: XMoneyPaymentCardInstance | null) => void;
  setSavedCardPaymentInstance: (
    v: XMoneySavedCardPaymentInstance | null,
  ) => void;
  setGooglePayInstance: (v: XMoneyGooglePayInstance | null) => void;
  setApplePayInstance: (v: XMoneyApplePayInstance | null) => void;
  setSelectedSavedCardId: (v: number | null) => void;
  setIsCardReady: (v: boolean) => void;
  setIsSavedCardReady: (v: boolean) => void;
  selectedSavedCardId: () => number | null;
  savedCardPaymentInstance: () => XMoneySavedCardPaymentInstance | null;
}
