import { onMount, onCleanup, createSignal } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { PUBLIC_KEY } from "../../../config";

import { TransactionDetails } from "../../../types/checkout.types";
import { PaymentCardInstance } from "../../../types/xmoney-sdk/payment-card-sdk.types";
import { LoadingSpinner } from "../../ui/LoadingSpinner/LoadingSpinner";

interface PaymentCardProps {
  payload: string;
  checksum: string;
  onReady?: (instance: PaymentCardInstance | null) => void;
  onPaymentComplete?: (result: TransactionDetails) => void;
  onError?: (error: any) => void;
  onPaymentProcessing?: (isProcessing: boolean) => void;
  hideSubmitButton?: boolean;
}

export function PaymentCard(props: PaymentCardProps): JSX.Element {
  let paymentCardInstance: PaymentCardInstance | undefined;
  const [isReady, setIsReady] = createSignal(false);
  const containerId = `container-${Math.random().toString(36).substring(2, 15)}`;

  let isPending = false;

  onMount(async () => {
    if (!props.payload || !props.checksum) {
      console.error("No payload or checksum provided to PaymentCard");
      return;
    }

    paymentCardInstance = await window.XMoney.paymentCard({
      container: containerId,
      options: {
        appearance: {
          theme: "dark",
        },
      },
      card: {
        savedCards: {
          enabled: true,
          optInVisible: true,
        },
        cardHolderName: {
          visible: true,
        },
        inputs: {
          grouping: "spaced",
        },
        submitButton: {
          visible: !props.hideSubmitButton,
        },
      },

      orderChecksum: props.checksum,
      orderPayload: props.payload,
      publicKey: PUBLIC_KEY,

      onReady: () => {
        setIsReady(true);
        props.onReady?.(paymentCardInstance!);
      },
      onError: (err) => {
        props.onError?.(err);
      },
      onPaymentProcessing: (isProcessing) => {
        console.log("PaymentCard payment processing:", isProcessing);
        props.onPaymentProcessing?.(isProcessing);
      },
      onPaymentComplete: (result: TransactionDetails) => {
        props.onPaymentComplete?.(result);
      },
    });
  });

  onCleanup(() => {
    paymentCardInstance?.destroy?.();
    props.onReady?.(null);
  });

  return (
    <div>
      {(!isReady() || isPending) && (
        <LoadingSpinner size="md" message="Loading payment card elements..." />
      )}

      <div
        id={containerId}
        style={{
          opacity: isReady() && !isPending ? 1 : 0,
          display: isReady() && !isPending ? "block" : "none",
        }}
      />
    </div>
  );
}
