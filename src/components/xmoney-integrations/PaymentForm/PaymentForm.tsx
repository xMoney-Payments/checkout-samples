import { onMount, onCleanup, createSignal } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

import { PUBLIC_KEY } from "../../../config";
import { TransactionDetails } from "../../../types/checkout.types";
import { XMoneyPaymentFormInstance } from "../../../types/xmoney-sdk/payment-form-sdk.types";
import { LoadingSpinner } from "../../ui/LoadingSpinner/LoadingSpinner";

interface PaymentFormProps {
  orderPayload: string;
  orderChecksum: string;
  onReady?: (instance: XMoneyPaymentFormInstance) => void;
  onPaymentComplete?: (result: TransactionDetails) => void;
  onError?: (error: any) => void;
}

export function XMoneyPaymentForm(props: PaymentFormProps): JSX.Element {
  const [paymentFormInstance, setPaymentFormInstance] =
    createSignal<XMoneyPaymentFormInstance | null>(null);
  const [isReady, setIsReady] = createSignal(false);
  const [isSubmitPending, setIsSubmitPending] = createSignal(false);
  const containerId = `container-${Math.random().toString(36).substring(2, 15)}`;

  onMount(async () => {
    const instance = await window.XMoney.paymentForm({
      container: containerId,
      card: {
        savedCards: {
          enabled: true,
          optInVisible: false,
        },
      },
      paymentMethods: {
        googlePay: { enabled: true },
        applePay: { enabled: true },
      },
      orderChecksum: props.orderChecksum,
      orderPayload: props.orderPayload,
      publicKey: PUBLIC_KEY,

      onReady: () => {
        setIsReady(true);
        if (props.onReady) {
          props.onReady(instance);
        }
      },
      onError: (err) => {
        console.error("❌ Payment error", err);
        props.onError?.(err);
      },
      onPaymentProcessing: (isProcessing) => {
        setIsSubmitPending(isProcessing);
      },
      onPaymentComplete: (result: TransactionDetails) => {
        props.onPaymentComplete?.(result);
      },
    });

    setPaymentFormInstance(instance);
  });

  onCleanup(() => {
    const instance = paymentFormInstance();
    if (instance) {
      instance.destroy();
      setPaymentFormInstance(null);
    }
  });

  return (
    <div class="payment-form-wrapper">
      {!isReady() && (
        <LoadingSpinner size="md" message="Loading payment form..." />
      )}

      <div
        id={containerId}
        style={{
          display: isReady() ? "block" : "none",
          opacity: isSubmitPending() ? "0.5" : "1",
          "pointer-events": isSubmitPending() ? "none" : "auto",
          transition: "opacity 0.2s",
        }}
      />
    </div>
  );
}
