import { onMount, onCleanup, createSignal } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { customThemeStyles } from "../../example/styles/index";
import { PUBLIC_KEY } from "../../constants";

declare global {
  interface Window {
    XMoneyCheckout: any;
  }
}

interface XMoneyCheckoutWidgetProps {
  sdkError: string;
  setSdkError: (msg: string) => void;
  checkoutInstanceRef: (instance: any) => void;
}

export function XMoneyCheckoutWidget(
  props: XMoneyCheckoutWidgetProps
): JSX.Element {
  let checkoutInstance: any;
  const [isReady, setIsReady] = createSignal(false);

  const resetSdk = (): void => {
    checkoutInstance?.destroy?.();
    const container = document.getElementById("payment-widget");
    if (container) container.innerHTML = "";

    checkoutInstance = new window.XMoneyCheckout({
      container: "payment-widget",
      publicKey: PUBLIC_KEY,
      elementsOptions: { appearance: customThemeStyles },
      onError: (err: any) => console.error("❌ Payment error", err),
      onReady: () => setIsReady(true),
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
