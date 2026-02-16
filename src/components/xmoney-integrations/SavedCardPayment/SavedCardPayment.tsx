import {
  For,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { TransactionDetails } from "../../../types/checkout.types";
import { XMoneySavedCardPaymentInstance } from "../../../types/xmoney-sdk/saved-card-payment-sdk.types";
import { PUBLIC_KEY } from "../../../constants";
import { LoadingSpinner } from "../../ui/LoadingSpinner/LoadingSpinner";
import { CustomCards } from "../../ui/CustomCards/CustomCards";

interface SavedCardPaymentProps {
  payload: string;
  checksum: string;
  onPaymentComplete?: (result: any) => void;
  onError?: (error: any) => void;
}

export function SavedCardPayment(props: SavedCardPaymentProps): JSX.Element {
  const [selectedCardId, setSelectedCardId] = createSignal<number>(140478);
  const [isReady, setIsReady] = createSignal(false);
  const [isPending, setIsPending] = createSignal(false);

  let savedCardPaymentInstance: XMoneySavedCardPaymentInstance | null = null;

  onCleanup(() => {
    savedCardPaymentInstance?.destroy?.();
  });

  createEffect(async () => {
    if (!props.payload || !props.checksum || savedCardPaymentInstance) return;

    savedCardPaymentInstance = await window.XMoney.savedCardPayment({
      orderChecksum: props.checksum,
      orderPayload: props.payload,
      publicKey: PUBLIC_KEY,
      onReady: () => setIsReady(true),
      onError: (err) => {
        console.error("❌ Card elements error", err);
        props.onError?.(err);
        setIsPending(false);
      },
      onPaymentComplete: (result: TransactionDetails) => {
        setIsPending(false);
        props.onPaymentComplete?.(result);
      },
    });
  });

  return (
    <div class="">
      {!isReady() && (
        <LoadingSpinner size="md" message="Loading saved cards..." />
      )}

      <div
        style={{
          display: isReady() ? "block" : "none",
        }}
      >
        <CustomCards
          selectedId={selectedCardId()}
          onSelect={setSelectedCardId}
        />
        <button
          class="w-full mt-6 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-lg shadow-md transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
          disabled={!selectedCardId() || isPending()}
          onClick={() => {
            if (!savedCardPaymentInstance || !selectedCardId()) return;
            setIsPending(true);
            savedCardPaymentInstance.pay(selectedCardId()!);
          }}
        >
          {isPending() ? "Processing..." : "Pay with Selected Card"}
        </button>
      </div>
    </div>
  );
}
