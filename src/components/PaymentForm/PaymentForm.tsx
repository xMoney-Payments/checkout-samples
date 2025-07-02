import { onMount, onCleanup, createSignal } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { customThemeStyles } from "../../example/styles/index";
import { PUBLIC_KEY } from "../../constants";

declare global {
  interface Window {
    XMoneyPaymentForm: any;
  }
}

interface PaymentFormProps {
  paymentFormInstanceRef: (instance: any) => void;
  savedCards: any;
  result: any;
}

export function PaymentForm(props: PaymentFormProps): JSX.Element {
  let paymentFormInstance: any;
  const [isReady, setIsReady] = createSignal(false);

  onMount(async () => {
    paymentFormInstance = new window.XMoneyPaymentForm({
      container: "payment-form-widget",
      elementsOptions: customThemeStyles,
      savedCards: props.savedCards.data,
      checksum: props.result.checksum,
      jsonRequest: props.result.payload,
      publicKey: PUBLIC_KEY,
      onReady: () => setIsReady(true),
      onError: (err: any) => console.error("❌ Payment error", err),
    });
  });

  onCleanup(() => {
    paymentFormInstance?.destroy?.();
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
    </div>
  );
}
