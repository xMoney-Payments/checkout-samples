import { createSignal, onMount, onCleanup, createEffect } from "solid-js";
import { createPaymentIntent } from "../../../api";
import { CURRENCY, INITIAL_FORM_DATA, PUBLIC_KEY } from "../../../constants";
import { TransactionDetails } from "../../../types/checkout.types";
import { XMoneyPaymentCardInstance } from "../../../types/xmoney-sdk/payment-card-sdk.types";
import { XMoneyGooglePayInstance } from "../../../types/xmoney-sdk/google-pay-sdk.types";
import { XMoneyApplePayInstance } from "../../../types/xmoney-sdk/apple-pay-sdk.types";

import type { CheckoutState } from "../types";
import type { OrderItem, IntentResult, PaymentMethodType } from "../types";
import type { SavedCardControls } from "../types";
import { PIZZA_MENU, DEFAULT_SAVED_CARD_ID } from "../constants";

const DELIVERY_THRESHOLD = 30;
const DELIVERY_FEE = 3.99;
const UPDATE_ORDER_DEBOUNCE_MS = 500;

function totalFromItems(items: OrderItem[]): number {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  return subtotal + (subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE);
}

export function useCheckoutState(): CheckoutState {
  const [intentResult, setIntentResult] = createSignal<IntentResult | null>(null);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [paymentResult, setPaymentResult] =
    createSignal<TransactionDetails | null>(null);
  const [isGooglePaySupported, setIsGooglePaySupported] = createSignal(false);
  const [isApplePaySupported, setIsApplePaySupported] = createSignal(false);
  const [activeMethod, setActiveMethodSignal] =
    createSignal<PaymentMethodType>("card");
  const [isProcessing, setIsProcessing] = createSignal(false);
  const [paymentCardInstance, setPaymentCardInstance] =
    createSignal<XMoneyPaymentCardInstance | null>(null);
  const [savedCardPaymentInstance, setSavedCardPaymentInstance] =
    createSignal<SavedCardControls | null>(null);
  const [googlePayInstance, setGooglePayInstance] =
    createSignal<XMoneyGooglePayInstance | null>(null);
  const [applePayInstance, setApplePayInstance] =
    createSignal<XMoneyApplePayInstance | null>(null);
  const [selectedSavedCardId, setSelectedSavedCardId] =
    createSignal(DEFAULT_SAVED_CARD_ID);
  const [isCardReady, setIsCardReady] = createSignal(false);
  const [isSavedCardReady, setIsSavedCardReady] = createSignal(false);
  const [isUpdatingOrder, setIsUpdatingOrder] = createSignal(false);
  const [orderItems, setOrderItems] = createSignal<OrderItem[]>(
    PIZZA_MENU.map((item) => ({ ...item, quantity: 1 })),
  );

  const totalAmount = () => totalFromItems(orderItems());
  const isActiveMethodReady = () => {
    switch (activeMethod()) {
      case "card":
        return isCardReady();
      case "saved-card":
        return isSavedCardReady();
      default:
        return true;
    }
  };

  const handleQuantityChange = (id: number, delta: number) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item,
      ),
    );
  };

  const handlePaymentComplete = (data: unknown) => {
    setIsProcessing(false);
    setPaymentResult(data as TransactionDetails);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentError = (err: unknown) => {
    console.error("Payment error:", err);
    setIsProcessing(false);
    setError("Payment failed. Please try a different method or try again.");
  };

  let initialAmount: number | null = null;
  let updateOrderTimeout: ReturnType<typeof setTimeout> | null = null;

  const runOrderUpdate = async (amount: number) => {
    setIsUpdatingOrder(true);
    try {
      const intent = await createPaymentIntent({
        ...INITIAL_FORM_DATA,
        amount: Math.round(amount * 100) / 100,
        currency: CURRENCY,
        publicKey: PUBLIC_KEY,
      });
      const global = { payload: intent.payload, checksum: intent.checksum };
      setIntentResult(global);
      initialAmount = amount;
      const order = {
        orderPayload: global.payload,
        orderChecksum: global.checksum,
      };
      paymentCardInstance()?.updateOrder(order);
      savedCardPaymentInstance()?.updateOrder(order);
      googlePayInstance()?.updateOrder(order);
      applePayInstance()?.updateOrder(order);
    } catch (err) {
      console.error("Failed to update order:", err);
      setError("Failed to update order amount. Please try again.");
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  /** Flush any pending order update so intentResult() is current (e.g. before switching payment method). */
  const flushOrderUpdate = (): Promise<void> => {
    const amount = totalAmount();
    if (initialAmount === null || amount === initialAmount) return Promise.resolve();
    if (updateOrderTimeout) {
      clearTimeout(updateOrderTimeout);
      updateOrderTimeout = null;
    }
    initialAmount = amount;
    return runOrderUpdate(amount);
  };

  const setActiveMethod = (newMethod: PaymentMethodType) => {
    flushOrderUpdate().then(() => setActiveMethodSignal(newMethod));
  };

  onMount(async () => {
    try {
      const supported =
        await window.XMoney.getPaymentMethodCapabilities();
      setIsGooglePaySupported(supported.googlePay.supported);
      setIsApplePaySupported(supported.applePay.supported);

      const intent = await createPaymentIntent({
        ...INITIAL_FORM_DATA,
        amount: Math.round(totalAmount() * 100) / 100,
        currency: CURRENCY,
        publicKey: PUBLIC_KEY,
      });
      setIntentResult({ payload: intent.payload, checksum: intent.checksum });
      initialAmount = totalAmount();
    } catch (err) {
      console.error("Failed to initialize payment:", err);
      setError("Failed to load payment methods. Please refresh and try again.");
    } finally {
      setIsLoading(false);
    }
  });

  createEffect(() => {
    const amount = totalAmount();
    if (initialAmount === null || amount === initialAmount) return;

    if (updateOrderTimeout) clearTimeout(updateOrderTimeout);
    updateOrderTimeout = setTimeout(() => {
      updateOrderTimeout = null;
      runOrderUpdate(amount);
    }, UPDATE_ORDER_DEBOUNCE_MS);
  });

  onCleanup(() => {
    if (updateOrderTimeout) clearTimeout(updateOrderTimeout);
  });

  return {
    intentResult,
    isLoading,
    error,
    setError,
    paymentResult,
    isGooglePaySupported,
    isApplePaySupported,
    activeMethod,
    setActiveMethod,
    isProcessing,
    orderItems,
    isUpdatingOrder,
    paymentCardInstance,
    savedCardPaymentInstance,
    googlePayInstance,
    applePayInstance,
    selectedSavedCardId,
    isCardReady,
    isSavedCardReady,
    isActiveMethodReady,
    handleQuantityChange,
    handlePaymentComplete,
    handlePaymentError,
    setPaymentCardInstance,
    setSavedCardPaymentInstance,
    setGooglePayInstance,
    setApplePayInstance,
    setSelectedSavedCardId,
    setIsCardReady,
    setIsSavedCardReady,
    setIsProcessing,
  };
}
