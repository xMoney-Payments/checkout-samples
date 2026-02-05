import { createSignal, onMount, onCleanup, JSX } from "solid-js";
import "./GooglePay.css";

import { PUBLIC_KEY } from "../../constants";
import { TransactionDetails } from "../../types/checkout.types";
import { XMoneyGooglePayInstance } from "../../types/xmoney-sdk/google-pay-sdk.types";

interface GooglePayProps {
  amount: number;
  currency: string;
  payload: string;
  checksum: string;
  onPaymentComplete?: (result: any) => void;
  onError?: (error: any) => void;
}

export function GooglePay(props: GooglePayProps): JSX.Element {
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [isReady, setIsReady] = createSignal(false);
  const containerId = `google-pay-${Math.random().toString(36).substring(2, 15)}`;
  let googlePayInstance: XMoneyGooglePayInstance | undefined;

  onMount(async () => {
    try {
      if (!window.XMoney?.googlePay) {
        setError("Google Pay SDK is not loaded");
        setIsLoading(false);
        return;
      }

      googlePayInstance = await window.XMoney.googlePay({
        container: containerId,
        orderChecksum: props.checksum,
        orderPayload: props.payload,
        publicKey: PUBLIC_KEY,
        onReady: () => {
          setIsReady(true);
          setIsLoading(false);
        },
        onError: (err) => {
          console.error("❌ Google Pay error", err);
          setError("Failed to initialize Google Pay");
          setIsLoading(false);
          props.onError?.(err);
        },
        onPaymentComplete: (result: TransactionDetails) => {
          console.log("✅ Google Pay payment complete", result);
          props.onPaymentComplete?.({
            method: "google_pay",
            currency: props.currency,
            status: "success",
            ...result,
          });
        },
      });
    } catch (err) {
      console.error("❌ Google Pay initialization error", err);
      setError("Failed to initialize Google Pay");
      setIsLoading(false);
      props.onError?.(err);
    }
  });

  onCleanup(() => {
    googlePayInstance?.destroy?.();
  });

  return (
    <div class="google-pay-container">
      {isLoading() && (
        <div class="payment-loading">
          <div class="skeleton"></div>
        </div>
      )}
      {error() && (
        <div class="payment-error">
          <div class="error-icon">⚠️</div>
          <p>{error()}</p>
          <p class="error-hint">
            Google Pay requires Chrome browser or compatible device
          </p>
        </div>
      )}
      <div
        id={containerId}
        style={{
          opacity: isReady() ? 1 : 0,
        }}
      />
    </div>
  );
}
