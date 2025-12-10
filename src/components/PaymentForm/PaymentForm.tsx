import { onMount, onCleanup, createSignal } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { lightThemeStyles } from "../../example/styles/index";
import { PUBLIC_KEY } from "../../constants";
import {
  XMoneyPaymentForm,
  XMoneyPaymentFormInstance,
  XMoneyPaymentFormConfig,
} from "./payment-form.types";
import { TransactionResult } from "../TransactionResult/TransactionResult";
import { TransactionDetails } from "../../types/checkout.types";

declare global {
  interface Window {
    XMoneyPaymentForm: XMoneyPaymentForm;
  }
}

interface PaymentFormProps {
  paymentFormInstanceRef: (instance: XMoneyPaymentFormInstance | null) => void;
  result: { payload: string; checksum: string } | null;
  onClose: () => void;
}

export function PaymentForm(props: PaymentFormProps): JSX.Element {
  let paymentFormInstance: XMoneyPaymentFormInstance | undefined;
  const [isReady, setIsReady] = createSignal(false);
  const [transactionResult, setTransactionResult] = createSignal<any>(null);

  let intervalId: number | undefined;

  onMount(async () => {
    if (props.result === null) {
      console.error("No result provided to PaymentForm");
      return;
    }

    paymentFormInstance = new window.XMoneyPaymentForm({
      container: "payment-form-widget",
      options: {
        buttonType: "pay",
        appearance: lightThemeStyles,
        googlePay: {
          enabled: true,
        },
        applePay: {
          enabled: true,
        },
      },
      orderChecksum: props.result.checksum,
      orderPayload: props.result.payload,
      publicKey: PUBLIC_KEY,

      onReady: () => setIsReady(true),
      onError: (err) => console.error("❌ Payment error", err),
      onPaymentComplete: (result: TransactionDetails) => {
        setTransactionResult(result);
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
    });

    props.paymentFormInstanceRef(paymentFormInstance);
  });

  onCleanup(() => {
    paymentFormInstance?.destroy?.();
    intervalId && clearInterval(intervalId);
  });

  return (
    <div
      class="payment-form-container"
      style={{
        position: "relative",
        "border-radius": "8px",
        "min-height": "150px",
      }}
    >
      {!isReady() && (
        <div class="loading-overlay" style={{ "border-radius": "8px" }}>
          <span>Loading payment form...</span>
        </div>
      )}

      <div id="payment-form-widget" style={{ opacity: isReady() ? 1 : 0 }} />

      {transactionResult() && (
        <TransactionResult
          result={transactionResult()}
          onRetry={() => window.location.reload()}
        />
      )}
    </div>
  );
}
