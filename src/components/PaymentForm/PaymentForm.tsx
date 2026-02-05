import { onMount, onCleanup, createSignal } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

import { PUBLIC_KEY } from "../../constants";

import { TransactionResult } from "../TransactionResult/TransactionResult";
import { TransactionDetails } from "../../types/checkout.types";
import { XMoneyPaymentFormInstance } from "../../types/xmoney-sdk/payment-form-sdk.types";
import { LoadingOverlay } from "../LoadingSpinner/LoadingSpinner";

interface PaymentFormProps {
  paymentFormInstanceRef: (instance: XMoneyPaymentFormInstance | null) => void;
  sessionToken: string;
  result: { payload: string; checksum: string } | null;
  onClose: () => void;
}

export function PaymentForm(props: PaymentFormProps): JSX.Element {
  const [paymentFormInstance, setPaymentFormInstance] =
    createSignal<XMoneyPaymentFormInstance | null>(null);
  const [isReady, setIsReady] = createSignal(false);
  const [transactionResult, setTransactionResult] = createSignal<any>(null);
  const containerId = `container-${Math.random().toString(36).substring(2, 15)}`;

  let isPending = false;

  onMount(async () => {
    if (props.result === null) {
      console.error("No result provided to PaymentForm");
      return;
    }

    const instance = await window.XMoney.paymentForm({
      container: containerId,
      options: {
        buttonType: "pay",
        cardHolderVerification: {
          name: { firstName: "John", middleName: "M", lastName: "Michael" },
          onCardHolderVerification: (verificationResult) => {
            console.log("Card Holder Verification Result:", verificationResult);
            // Example: Require full match for cardholder name
            return true;
          },
        },
        googlePay: { enabled: true },
        applePay: { enabled: true },
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

    setPaymentFormInstance(instance);
    props.paymentFormInstanceRef(instance);
  });

  onCleanup(() => {
    const instance = paymentFormInstance();
    if (instance) {
      console.log("Destroying PaymentForm instance");
      instance.destroy();
      setPaymentFormInstance(null);
    }
    props.paymentFormInstanceRef(null);
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
      {!isReady() && (
        <LoadingOverlay size="medium" message="Loading payment form..." />
      )}

      <div
        id={containerId}
        style={{
          opacity: isReady() && !isPending ? 1 : 0,
          display: isReady() && !isPending ? "block" : "none",
        }}
      />

      {transactionResult() && (
        <TransactionResult
          result={transactionResult()}
          onRetry={() => window.location.reload()}
        />
      )}
    </div>
  );
}
