import { onMount, onCleanup, createSignal } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { lightThemeStyles } from "../../example/styles/index";
import { PUBLIC_KEY, API_BASE } from "../../constants";
import { createEffect } from "solid-js";
import {
  ICard,
  XMoneyPaymentForm,
  XMoneyPaymentFormInstance,
} from "./payment-form.types";

declare global {
  interface Window {
    XMoneyPaymentForm: XMoneyPaymentForm;
  }
}

interface PaymentFormProps {
  paymentFormInstanceRef: (instance: XMoneyPaymentFormInstance | null) => void;
  savedCards: ICard[];
  result: { payload: string; checksum: string } | null;
}

export function PaymentForm(props: PaymentFormProps): JSX.Element {
  let paymentFormInstance: XMoneyPaymentFormInstance | undefined;
  const [isReady, setIsReady] = createSignal(false);

  let intervalId: number | undefined;

  createEffect(() => {
    const base64Json = props.result?.payload;
    if (!base64Json) return;
    let orderId: string | undefined;
    try {
      const decodedJson = JSON.parse(atob(base64Json));
      orderId = decodedJson.order.orderId;
    } catch (e) {
      console.error("Failed to decode base64 JSON or parse orderId", e);
      return;
    }
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const response = await fetch(`${API_BASE}/order/${orderId}`);
        if (!response.ok) throw new Error("Failed to fetch order");
        const data = await response.json();
        if (data.data.orderStatus?.includes("complete")) {
          const resultContainer = document.getElementById("result-container");
          clearInterval(intervalId);
          paymentFormInstance?.close();
          if (!resultContainer) return;
          resultContainer.innerHTML = `
            <div class="order-complete">
              Order ${data.data.orderStatus}!
              <pre><code>${JSON.stringify(data.data, null, 2)}</code></pre>
            </div>
            `;
          props.paymentFormInstanceRef?.(null);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    };

    fetchOrder();
    intervalId = window.setInterval(fetchOrder, 6000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  });

  onMount(async () => {
    if (props.result === null) {
      console.error("No result provided to PaymentForm");
      return;
    }

    paymentFormInstance = new window.XMoneyPaymentForm({
      container: "payment-form-widget",
      elementsOptions: {
        appearance: lightThemeStyles,
        validationMode: "onChange",
        locale: "en-US",
        saveCardOption: true,
      },
      savedCards: props.savedCards,
      checksum: props.result.checksum,
      payload: props.result.payload,
      publicKey: PUBLIC_KEY,
      onReady: () => setIsReady(true),
      onError: (err: any) => console.error("❌ Payment error", err),
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
      <div id="result-container"></div>
    </div>
  );
}
