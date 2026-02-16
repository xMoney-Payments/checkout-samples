import { onMount, onCleanup, createSignal } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { PUBLIC_KEY } from "../../../constants";

import { TransactionDetails } from "../../../types/checkout.types";
import { XMoneyCardElementsInstance } from "../../../types/xmoney-sdk/card-elements-sdk.types";
import { LoadingSpinner } from "../../ui/LoadingSpinner/LoadingSpinner";

interface CardElementsProps {
  payload: string;
  checksum: string;
  onPaymentComplete?: (result: any) => void;
  onError?: (error: any) => void;
}

export function CardElements(props: CardElementsProps): JSX.Element {
  let cardElementsInstance: XMoneyCardElementsInstance | undefined;
  const [isReady, setIsReady] = createSignal(false);
  const containerId = `container-${Math.random().toString(36).substring(2, 15)}`;

  let isPending = false;

  onMount(async () => {
    if (!props.payload || !props.checksum) {
      console.error("No payload or checksum provided to CardElements");
      return;
    }

    cardElementsInstance = await window.XMoney.paymentCard({
      container: containerId,
      options: {
        buttonType: "pay",
        enableSavedCards: true,
        displaySaveCardOption: false,
      },
      orderChecksum: props.checksum,
      orderPayload: props.payload,
      publicKey: PUBLIC_KEY,

      onReady: () => setIsReady(true),
      onError: (err) => {
        props.onError?.(err);
      },
      onPaymentProcessing: (isProcessing) => {
        console.log("Card Elements payment processing:", isProcessing);
      },
      onPaymentComplete: (result: TransactionDetails) => {
        props.onPaymentComplete?.(result);
      },
    });
  });

  onCleanup(() => {
    cardElementsInstance?.destroy?.();
  });

  return (
    <div class="">
      {(!isReady() || isPending) && (
        <LoadingSpinner size="md" message="Loading card elements..." />
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
