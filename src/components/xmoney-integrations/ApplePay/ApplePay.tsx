import { createSignal, createEffect, onMount, onCleanup, JSX } from "solid-js";

import { PUBLIC_KEY } from "../../../constants";
import { TransactionDetails } from "../../../types/checkout.types";
import { XMoneyApplePayInstance } from "../../../types/xmoney-sdk/apple-pay-sdk.types";

interface ApplePayProps {
  payload: string;
  checksum: string;
  onReady?: (instance: XMoneyApplePayInstance | null) => void;
  onPaymentComplete?: (result: TransactionDetails) => void;
  onError?: (error: any) => void;
}

export function ApplePay(props: ApplePayProps): JSX.Element {
  const [isLoading, setIsLoading] = createSignal(true);
  const [isReady, setIsReady] = createSignal(false);
  const containerId = `apple-pay-${Math.random().toString(36).substring(2, 15)}`;
  let applePayInstance: XMoneyApplePayInstance;
  let initialPayload: string | null = null;

  onMount(async () => {
    try {
      if (!window.XMoney?.applePay) {
        setIsLoading(false);
        return;
      }

      initialPayload = props.payload;
      applePayInstance = await window.XMoney.applePay({
        container: containerId,

        orderChecksum: props.checksum,
        orderPayload: props.payload,
        publicKey: PUBLIC_KEY,
        onReady: () => {
          setIsReady(true);
          setIsLoading(false);
          props.onReady?.(applePayInstance!);
        },
        onError: (err) => {
          console.error("❌ Apple Pay error", err);
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
      setIsLoading(false);
      props.onError?.(err);
    }
  });

  createEffect(() => {
    const payload = props.payload;
    const checksum = props.checksum;
    if (!applePayInstance || !initialPayload || payload === initialPayload)
      return;
    initialPayload = payload;
    applePayInstance.updateOrder({
      orderPayload: payload,
      orderChecksum: checksum,
    });
  });

  onCleanup(() => {
    applePayInstance?.destroy?.();
    props.onReady?.(null);
  });

  return (
    <div class="relative w-full h-10">
      {isLoading() && (
        <div>
          <div class="w-full h-6 rounded-md bg-[linear-gradient(90deg,var(--color-neutral-100),var(--color-neutral-200),var(--color-neutral-100))] bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite]" />
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
