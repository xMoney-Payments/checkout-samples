import { createSignal, onMount, onCleanup, JSX } from "solid-js";

import { PUBLIC_KEY } from "../../../constants";
import { TransactionDetails } from "../../../types/checkout.types";
import { XMoneyGooglePayInstance } from "../../../types/xmoney-sdk/google-pay-sdk.types";

interface GooglePayProps {
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
        onPaymentProcessing: (isProcessing) => {
          console.log("Google Pay payment processing:", isProcessing);
        },
        onPaymentComplete: (result: TransactionDetails) => {
          props.onPaymentComplete?.(result);
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
    <div class="relative w-full h-10">
      {isLoading() && (
        <div>
          <div class="w-full h-6 rounded-md bg-[linear-gradient(90deg,var(--color-neutral-100),var(--color-neutral-200),var(--color-neutral-100))] bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite]" />
        </div>
      )}
      {error() && (
        <div class="flex flex-col items-center gap-3 p-10 text-center">
          <div class="text-5xl">⚠️</div>
          <p>{error()}</p>
          <p class="!text-sm !font-normal text-[color:var(--color-neutral-500)]">
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
