import { createSignal, onMount, onCleanup, createEffect } from "solid-js";
import { createPaymentIntent } from "../../../api";
import { CURRENCY, INITIAL_FORM_DATA } from "../../../constants";
import { PUBLIC_KEY } from "../../../config";
import { TransactionDetails } from "../../../types/checkout.types";
import { PaymentCardInstance } from "../../../types/xmoney-sdk/payment-card-sdk.types";
import { GooglePayInstance } from "../../../types/xmoney-sdk/google-pay-sdk.types";
import { ApplePayInstance } from "../../../types/xmoney-sdk/apple-pay-sdk.types";

import type { CheckoutState, OrderItem, PaymentMethodType } from "../types";
import { PIZZA_MENU, DELIVERY_THRESHOLD, DELIVERY_FEE } from "../constants";
import { SavedCardPaymentInstance } from "../../../types/xmoney-sdk/saved-card-payment-sdk.types";
import type {
  PaymentChangeEvent,
  ValidationEvent,
} from "../../../types/xmoney-sdk/sdk-base.types";
import { formatFieldValidationErrors } from "../../_shared/formatPaymentError";

const UPDATE_ORDER_DEBOUNCE_MS = 500;
const DEFAULT_CARD_BUTTON_LABEL = "Place Order";

function computeTotal(items: OrderItem[]): number {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  return subtotal + (subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE);
}

export function useCheckoutState(): CheckoutState {
  const [intentResult, setIntentResult] = createSignal<{
    payload: string;
    checksum: string;
  } | null>(null);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [paymentResult, setPaymentResult] =
    createSignal<TransactionDetails | null>(null);
  const [isGooglePaySupported, setIsGooglePaySupported] = createSignal(false);
  const [isApplePaySupported, setIsApplePaySupported] = createSignal(false);
  const [activeMethod, setActiveMethod] =
    createSignal<PaymentMethodType>("card");
  const [isProcessing, setIsProcessing] = createSignal(false);
  const [isUpdatingOrder, setIsUpdatingOrder] = createSignal(false);
  const [isCardReady, setIsCardReady] = createSignal(false);
  const [isSavedCardReady, setIsSavedCardReady] = createSignal(false);
  const [selectedSavedCardId, setSelectedSavedCardId] = createSignal<
    number | null
  >(null);
  const [orderItems, setOrderItems] = createSignal<OrderItem[]>(
    PIZZA_MENU.map((item) => ({ ...item, quantity: 1 })),
  );

  const [paymentCardInstance, setPaymentCardInstance] =
    createSignal<PaymentCardInstance | null>(null);
  const [savedCardPaymentInstance, setSavedCardPaymentInstance] =
    createSignal<SavedCardPaymentInstance | null>(null);
  const [googlePayInstance, setGooglePayInstance] =
    createSignal<GooglePayInstance | null>(null);
  const [applePayInstance, setApplePayInstance] =
    createSignal<ApplePayInstance | null>(null);
  const [cardButtonLabel, setCardButtonLabel] = createSignal(
    DEFAULT_CARD_BUTTON_LABEL,
  );
  const [isCardValid, setIsCardValid] = createSignal(false);

  const totalAmount = () => computeTotal(orderItems());

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

  const handlePlaceOrder = async () => {
    const instance = paymentCardInstance();
    if (!instance) return;

    setError(null);
    try {
      const result = await instance.validate();
      setIsCardValid(result.isValid);
      if (!result.isValid) {
        const messages =
          formatFieldValidationErrors(result.fields) ||
          Object.values(result.errors)
            .map((fieldError) => fieldError?.message)
            .filter(Boolean)
            .join(" ");
        setError(messages || "Please check your card details and try again.");
        return;
      }
      instance.submit();
    } catch (err) {
      handlePaymentError(err);
    }
  };

  const handlePaymentChange = (event: PaymentChangeEvent) => {
    setCardButtonLabel(event.button.label);
  };

  const handleCardValidation = (event: ValidationEvent) => {
    setIsCardValid(event.isValid);
  };

  const handlePayWithSavedCard = () => {
    const instance = savedCardPaymentInstance();
    const cardId = selectedSavedCardId();
    if (instance && cardId) {
      setIsProcessing(true);
      instance.pay({ cardId });
    }
  };

  let lastSyncedAmount: number | null = null;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const updateAllInstances = async (amount: number) => {
    setIsUpdatingOrder(true);
    try {
      const intent = await createPaymentIntent({
        ...INITIAL_FORM_DATA,
        amount: Math.round(amount * 100) / 100,
        currency: CURRENCY,
        publicKey: PUBLIC_KEY,
      });
      const result = { payload: intent.payload, checksum: intent.checksum };
      setIntentResult(result);
      lastSyncedAmount = amount;

      const order = {
        orderPayload: result.payload,
        orderChecksum: result.checksum,
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

  onMount(async () => {
    try {
      const supported = await window.XMoney.getPaymentMethodCapabilities();
      setIsGooglePaySupported(supported.googlePay.supported);
      setIsApplePaySupported(supported.applePay.supported);

      const amount = Math.round(totalAmount() * 100) / 100;
      const intent = await createPaymentIntent({
        ...INITIAL_FORM_DATA,
        amount,
        currency: CURRENCY,
        publicKey: PUBLIC_KEY,
      });
      setIntentResult({ payload: intent.payload, checksum: intent.checksum });
      lastSyncedAmount = totalAmount();
    } catch (err) {
      console.error("Failed to initialize payment:", err);
      setError("Failed to load payment methods. Please refresh and try again.");
    } finally {
      setIsLoading(false);
    }
  });

  createEffect(() => {
    const amount = totalAmount();
    if (lastSyncedAmount === null || amount === lastSyncedAmount) return;

    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      updateAllInstances(amount);
    }, UPDATE_ORDER_DEBOUNCE_MS);
  });

  onCleanup(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
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
    setIsProcessing,
    orderItems,
    isUpdatingOrder,
    isActiveMethodReady,
    handleQuantityChange,
    handlePaymentComplete,
    handlePaymentError,
    handlePlaceOrder,
    handlePayWithSavedCard,
    handlePaymentChange,
    handleCardValidation,
    cardButtonLabel,
    isCardValid,
    savedCardPaymentInstance,
    selectedSavedCardId,
    setPaymentCardInstance,
    setSavedCardPaymentInstance,
    setGooglePayInstance,
    setApplePayInstance,
    setSelectedSavedCardId,
    setIsCardReady,
    setIsSavedCardReady,
  };
}
