import { createSignal, onMount, onCleanup, JSX } from "solid-js";
import "./ApplePay.css";

import { PUBLIC_KEY } from "../../constants";
import { TransactionDetails } from "../../types/checkout.types";
import { XMoneyApplePayInstance } from "../../types/xmoney-sdk/apple-pay-sdk.types";

interface ApplePayProps {
  amount: number;
  currency: string;
  payload: string;
  checksum: string;
  onPaymentComplete?: (result: any) => void;
  onError?: (error: any) => void;
}

export function ApplePay(props: ApplePayProps): JSX.Element {
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [isReady, setIsReady] = createSignal(false);
  const containerId = `apple-pay-${Math.random().toString(36).substring(2, 15)}`;
  let applePayInstance: XMoneyApplePayInstance;

  onMount(async () => {
    try {
      if (!window.XMoney?.applePay) {
        setError("Apple Pay SDK is not loaded");
        setIsLoading(false);
        return;
      }

      applePayInstance = await window.XMoney.applePay({
        container: containerId,

        orderChecksum: props.checksum,
        orderPayload: props.payload,
        publicKey: PUBLIC_KEY,
        onReady: () => {
          setIsReady(true);
          setIsLoading(false);
        },
        onError: (err) => {
          console.error("❌ Apple Pay error", err);
          setError("Failed to initialize Apple Pay");
          setIsLoading(false);
          props.onError?.(err);
        },
        onPaymentComplete: (result: TransactionDetails) => {
          console.log("✅ Apple Pay payment complete", result);
          props.onPaymentComplete?.({
            method: "apple_pay",
            currency: props.currency,
            status: "success",
            ...result,
          });
        },
      });
    } catch (err) {
      console.error("❌ Apple Pay initialization error", err);
      setError("Failed to initialize Apple Pay");
      setIsLoading(false);
      props.onError?.(err);
    }
  });

  onCleanup(() => {
    applePayInstance?.destroy?.();
  });

  return (
    <div class="apple-pay-container">
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
            Apple Pay requires Safari on Mac or iOS device
          </p>
        </div>
      )}
      <div
        id={containerId}
        style={{
          opacity: isReady() ? 1 : 0,
        }}
      ></div>
    </div>
  );
}
