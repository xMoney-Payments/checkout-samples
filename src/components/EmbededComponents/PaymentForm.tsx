import { onMount, onCleanup, createSignal } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { classicCheckoutStyles } from "../../example/styles/index";

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
  checkoutInstanceRef: (instance: any) => void;
  savedCards: any[];
  result: any;
}

export function PaymentForm(props: PaymentFormProps): JSX.Element {
  let checkoutInstance: any;
  const [isReady, setIsReady] = createSignal(false);

  const resetSdk = (): void => {
    checkoutInstance?.destroy?.();
    const container = document.getElementById("payment-widget");
    if (container) container.innerHTML = "";

    checkoutInstance = new window.XMoneyPaymentForm({
      container: "payment-widget",
      elementsOptions: { appearance: classicCheckoutStyles },
      onError: (err: any) => console.error("❌ Payment error", err),
      onReady: () => setIsReady(true),
      savedCards: props.savedCards,
      checksum: props.result?.checksum,
      json: props.result?.json,
    });

    props.checkoutInstanceRef(checkoutInstance);
  };

  onMount(() => {
    resetSdk();
  });

  onCleanup(() => {
    checkoutInstance?.destroy?.();
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
        id="payment-widget"
        class={props.sdkError ? "sdk-container error" : "sdk-container"}
        style={{ opacity: isReady() ? 1 : 0 }}
      />
    </div>
  );
}
