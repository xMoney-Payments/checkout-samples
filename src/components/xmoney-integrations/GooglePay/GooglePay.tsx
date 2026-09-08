import { createSignal, createEffect, onMount, onCleanup, JSX } from "solid-js";

import { PUBLIC_KEY } from "../../../config";
import { TransactionDetails } from "../../../types/checkout.types";
import { GooglePayInstance } from "../../../types/xmoney-sdk/google-pay-sdk.types";
import type { GooglePayAppearance } from "../../../types/xmoney-sdk/sdk-base.types";

const DEFAULT_APPEARANCE: GooglePayAppearance = {
  color: "black",
  type: "plain",
  radius: 12,
  height: 48,
  borderType: "no_border",
};

interface GooglePayProps {
  payload: string;
  checksum: string;
  appearance?: GooglePayAppearance;
  onReady?: (instance: GooglePayInstance | null) => void;
  onPaymentComplete?: (result: TransactionDetails) => void;
  onError?: (error: any) => void;
  onPaymentProcessing?: (isProcessing: boolean) => void;
}

export function GooglePay(props: GooglePayProps): JSX.Element {
  const [isLoading, setIsLoading] = createSignal(true);
  const [isReady, setIsReady] = createSignal(false);
  const containerId = `google-pay-${Math.random().toString(36).substring(2, 15)}`;
  let googlePayInstance: GooglePayInstance | undefined;
  let initialPayload: string | null = null;

  const appearance = () => props.appearance ?? DEFAULT_APPEARANCE;
  const buttonHeight = () => appearance().height ?? DEFAULT_APPEARANCE.height!;

  onMount(async () => {
    try {
      if (!window.XMoney?.googlePay) {
        setIsLoading(false);
        return;
      }

      initialPayload = props.payload;
      googlePayInstance = await window.XMoney.googlePay({
        container: containerId,
        orderChecksum: props.checksum,
        orderPayload: props.payload,
        publicKey: PUBLIC_KEY,
        options: {
          appearance: appearance(),
        },
        onReady: () => {
          setIsReady(true);
          setIsLoading(false);
          props.onReady?.(googlePayInstance!);
        },
        onError: (err) => {
          console.error("❌ Google Pay error", err);
          setIsLoading(false);
          props.onError?.(err);
        },
        onPaymentProcessing: (isProcessing) => {
          props.onPaymentProcessing?.(isProcessing);
        },
        onPaymentComplete: (result: TransactionDetails) => {
          props.onPaymentComplete?.(result);
        },
      });
    } catch (err) {
      console.error("❌ Google Pay initialization error", err);
      setIsLoading(false);
      props.onError?.(err);
    }
  });

  createEffect(() => {
    const payload = props.payload;
    const checksum = props.checksum;
    if (!googlePayInstance || !initialPayload || payload === initialPayload)
      return;
    initialPayload = payload;
    googlePayInstance.updateOrder({
      orderPayload: payload,
      orderChecksum: checksum,
    });
  });

  onCleanup(() => {
    googlePayInstance?.destroy?.();
    props.onReady?.(null);
  });

  return (
    <div class="relative w-full" style={{ height: `${buttonHeight()}px` }}>
      {isLoading() && (
        <div>
          <div
            class="w-full rounded-md bg-[linear-gradient(90deg,var(--color-neutral-100),var(--color-neutral-200),var(--color-neutral-100))] bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite]"
            style={{ height: `${buttonHeight()}px` }}
          />
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
