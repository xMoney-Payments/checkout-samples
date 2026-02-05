import { onMount, onCleanup, createSignal } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { PUBLIC_KEY } from "../../constants";

import { TransactionResult } from "../TransactionResult/TransactionResult";
import { TransactionDetails } from "../../types/checkout.types";
import { XMoneyCardElementsInstance } from "../../types/xmoney-sdk/card-elements-sdk.types";
import { LoadingOverlay } from "../LoadingSpinner/LoadingSpinner";

interface CardElementsProps {
  result: { payload: string; checksum: string } | null;
  onClose: () => void;
}

export function CardElements(props: CardElementsProps): JSX.Element {
  let cardElementsInstance: XMoneyCardElementsInstance | undefined;
  const [isReady, setIsReady] = createSignal(false);
  const [transactionResult, setTransactionResult] = createSignal<any>(null);
  const containerId = `container-${Math.random().toString(36).substring(2, 15)}`;

  let isPending = false;

  onMount(async () => {
    if (props.result === null) {
      console.error("No result provided to PaymentForm");
      return;
    }

    cardElementsInstance = await window.XMoney.cardElements({
      container: containerId,
      options: {
        buttonType: "pay",
      },
      orderChecksum: props.result.checksum,
      orderPayload: props.result.payload,
      publicKey: PUBLIC_KEY,

      onReady: () => setIsReady(true),
      onError: (err) => console.error("❌ Payment error", err),
      onSubmitPending: (pending) => {
        isPending = pending;
      },
      onPaymentComplete: (result: TransactionDetails) => {
        setTransactionResult(result);
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
    });
  });

  onCleanup(() => {
    cardElementsInstance?.destroy?.();
  });

  return (
    <div
      class="payment-form-container"
      style={{
        position: "relative",
        "border-radius": "8px",
        "min-height": "200px",
      }}
    >
      {(!isReady() || isPending) && (
        <LoadingOverlay size="medium" message="Loading card elements..." />
      )}

      <div
        id={containerId}
        style={{
          opacity: isReady() && !isPending ? 1 : 0,
          display: isReady() && !isPending ? "block" : "none",
        }}
      />

      <button
        class="close-button"
        onClick={async () =>
          console.log(await cardElementsInstance?.validateForm())
        }
      >
        Validate Form
      </button>

      {transactionResult() && (
        <TransactionResult
          result={transactionResult()}
          onRetry={() => window.location.reload()}
        />
      )}
    </div>
  );
}
