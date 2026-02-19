import type { JSX } from "solid-js/jsx-runtime";
import type { XMoneyPaymentCardInstance } from "../../types/xmoney-sdk/payment-card-sdk.types";
import type { XMoneyGooglePayInstance } from "../../types/xmoney-sdk/google-pay-sdk.types";
import type { XMoneyApplePayInstance } from "../../types/xmoney-sdk/apple-pay-sdk.types";
import type { TransactionDetails } from "../../types/checkout.types";

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

/** Global intent result (payload + checksum) passed to all payment components and instances. */
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

export interface SavedCardControls {
  pay: (cardId: number) => void;
  updateOrder: (order: { orderPayload: string; orderChecksum: string }) => void;
}

export interface CheckoutAccordionItemProps {
  id: PaymentMethodType;
  title: string;
  subtitle: string;
  icon: JSX.Element;
  isOpen: boolean;
  onToggle: () => void;
  children: JSX.Element;
}

export interface OrderSummaryCardProps {
  items: OrderItem[];
  onQuantityChange: (id: number, delta: number) => void;
  paymentButtons: JSX.Element;
  isProcessing: boolean;
  isUpdatingOrder: boolean;
}

export interface PaymentButtonsProps {
  intentResult: IntentResult | null;
  activeMethod: () => PaymentMethodType;
  isActiveMethodReady: () => boolean;
  isProcessing: () => boolean;
  savedCardPaymentInstance: () => SavedCardControls | null;
  selectedSavedCardId: () => number;
  onPlaceOrder: () => void;
  onPayWithSavedCard: () => void;
  onPaymentComplete: (data: unknown) => void;
  onPaymentError: (err: unknown) => void;
  onGooglePayReady?: (instance: XMoneyGooglePayInstance | null) => void;
  onApplePayReady?: (instance: XMoneyApplePayInstance | null) => void;
  setIsProcessing: (value: boolean) => void;
}

/** State and handlers returned by useCheckoutState */
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
  orderItems: () => OrderItem[];
  isUpdatingOrder: () => boolean;
  paymentCardInstance: () => XMoneyPaymentCardInstance | null;
  savedCardPaymentInstance: () => SavedCardControls | null;
  googlePayInstance: () => XMoneyGooglePayInstance | null;
  applePayInstance: () => XMoneyApplePayInstance | null;
  selectedSavedCardId: () => number;
  isCardReady: () => boolean;
  isSavedCardReady: () => boolean;
  isActiveMethodReady: () => boolean;
  handleQuantityChange: (id: number, delta: number) => void;
  handlePaymentComplete: (data: unknown) => void;
  handlePaymentError: (err: unknown) => void;
  setPaymentCardInstance: (v: XMoneyPaymentCardInstance | null) => void;
  setSavedCardPaymentInstance: (v: SavedCardControls | null) => void;
  setGooglePayInstance: (v: XMoneyGooglePayInstance | null) => void;
  setApplePayInstance: (v: XMoneyApplePayInstance | null) => void;
  setSelectedSavedCardId: (v: number) => void;
  setIsCardReady: (v: boolean) => void;
  setIsSavedCardReady: (v: boolean) => void;
  setIsProcessing: (v: boolean) => void;
}
