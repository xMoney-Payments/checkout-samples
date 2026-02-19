import { onMount, onCleanup, createSignal } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { PUBLIC_KEY } from "../../../constants";

import { TransactionDetails } from "../../../types/checkout.types";
import { XMoneyPaymentCardInstance } from "../../../types/xmoney-sdk/payment-card-sdk.types";
import { LoadingSpinner } from "../../ui/LoadingSpinner/LoadingSpinner";

interface PaymentCardProps {
  payload: string;
  checksum: string;
  onPaymentComplete?: (result: any) => void;
  onError?: (error: any) => void;
  onReady?: (instance: XMoneyPaymentCardInstance) => void;
  onPaymentProcessing?: (isProcessing: boolean) => void;
  hideSubmitButton?: boolean;
}

export function PaymentCard(props: PaymentCardProps): JSX.Element {
  let paymentCardInstance: XMoneyPaymentCardInstance | undefined;
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
      card: {
        savedCards: {
          enabled: false,
          optInVisible: true,
        },
        submitButton: {
          visible: !props.hideSubmitButton,
        },
        // cardHolderVerification: {
        //   name: {
        //     firstName: "John",
        //     middleName: "Middle",
        //     lastName: "Doe",
        //   },
        //   onCardHolderVerification: (verificationResult) => {
        //     console.log("Card holder verification result:", verificationResult);
        //     return true;
        //   },
        // },
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
  });

  return (
    <div class="">
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
