import { onMount, onCleanup, createSignal } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { classicCheckoutStyles } from "../../example/styles/index";
import { createPaymentIntent } from "../../api";

declare global {
  interface Window {
    XMoneyCheckout: any;
    XMoneyPaymentForm: any;
  }
}

interface PaymentFormProps {
  sdkError: string;
  setSdkError: (msg: string) => void;
  setIsLoading: (loading: boolean) => void;
  paymentFormInstanceRef: (instance: any) => void;
  savedCards: any;
  result: any;
}

export function PaymentForm(props: PaymentFormProps): JSX.Element {
  let paymentFormInstance: any;
  const [isReady, setIsReady] = createSignal(false);

  console.log(props.savedCards);
  console.log(props.result);

  onMount(async () => {
    paymentFormInstance = new window.XMoneyPaymentForm({
      container: "payment-form-widget",
      onReady: () => setIsReady(true),
      elementsOptions: { appearance: classicCheckoutStyles },
      onError: (err: any) => console.error("❌ Payment error", err),
      savedCards: props.savedCards.data,
      checksum: props.result.checksum,
      json: props.result.payload,
    });
  });

  onCleanup(() => {
    paymentFormInstance?.destroy?.();
  });

  return (
    <div
      class="embeded-components-container"
      style={{
        position: "relative",
        "border-radius": "8px",
        "min-height": "150px",
      }}
    >
      {!isReady() && (
        <div class="loading-overlay" style={{ "border-radius": "8px" }}>
          <span>Loading embeded components...</span>
        </div>
      )}
      <div
        id="payment-form-widget"
        class={props.sdkError ? "sdk-container error" : "sdk-container"}
        style={{ opacity: isReady() ? 1 : 0 }}
      />
    </div>
  );
}
