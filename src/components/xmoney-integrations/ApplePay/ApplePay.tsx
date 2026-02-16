import { createSignal, onMount, onCleanup, JSX } from "solid-js";

import { PUBLIC_KEY } from "../../../constants";
import { TransactionDetails } from "../../../types/checkout.types";
import { XMoneyApplePayInstance } from "../../../types/xmoney-sdk/apple-pay-sdk.types";

interface ApplePayProps {
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
        onPaymentProcessing: (isProcessing) => {
          console.log("Apple Pay payment processing:", isProcessing);
        },
        onPaymentComplete: (result: TransactionDetails) => {
          props.onPaymentComplete?.(result);
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
