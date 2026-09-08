import { createSignal, onMount } from "solid-js";
import { createPaymentIntent, type PaymentIntentResponse } from "../../api";
import { CURRENCY, INITIAL_FORM_DATA } from "../../constants";
import { PUBLIC_KEY } from "../../config";
import type { TransactionDetails } from "../../types/checkout.types";
import { formatPaymentError } from "./formatPaymentError";

export function usePaymentIntent(amount = INITIAL_FORM_DATA.amount) {
  const [order, setOrder] = createSignal<PaymentIntentResponse | null>(null);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [transactionResult, setTransactionResult] =
    createSignal<TransactionDetails | null>(null);

  onMount(async () => {
    try {
      const intent = await createPaymentIntent({
        ...INITIAL_FORM_DATA,
        amount,
        currency: CURRENCY,
        publicKey: PUBLIC_KEY,
      });
      setOrder(intent);
    } catch (err) {
      console.error("Failed to create payment intent:", err);
      setError("Failed to initialize payment. Please refresh and try again.");
    } finally {
      setIsLoading(false);
    }
  });

  function handlePaymentComplete(result: TransactionDetails) {
    setTransactionResult(result);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handlePaymentError(err: unknown) {
    console.error("Payment error:", err);
    setError(formatPaymentError(err));
  }

  return {
    order,
    setOrder,
    isLoading,
    error,
    setError,
    transactionResult,
    handlePaymentComplete,
    handlePaymentError,
  };
}
