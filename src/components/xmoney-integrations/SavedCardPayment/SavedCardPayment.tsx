import { createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { Card, TransactionDetails } from "../../../types/checkout.types";
import { XMoneySavedCardPaymentInstance } from "../../../types/xmoney-sdk/saved-card-payment-sdk.types";
import { CUSTOMER_ID } from "../../../constants";
import { LoadingSpinner } from "../../ui/LoadingSpinner/LoadingSpinner";
import { CustomCards } from "../../ui/CustomCards/CustomCards";
import { getCards } from "../../../api/getCards";
import { PUBLIC_KEY } from "../../../config";

interface SavedCardPaymentProps {
  payload: string;
  checksum: string;
  onPaymentComplete?: (result: TransactionDetails) => void;
  onError?: (error: any) => void;
  onReady?: (instance: XMoneySavedCardPaymentInstance | null) => void;
  onCardSelect?: (cardId: number | null) => void;
  hideButton?: boolean;
}

export function SavedCardPayment(props: SavedCardPaymentProps): JSX.Element {
  const [selectedCardId, setSelectedCardId] = createSignal<number | null>(null);
  const [cards, setCards] = createSignal<Card[]>([]);
  const [isReady, setIsReady] = createSignal(false);
  const [isPending, setIsPending] = createSignal(false);
  const [isLoadingCards, setIsLoadingCards] = createSignal(true);

  let savedCardPaymentInstance: XMoneySavedCardPaymentInstance | null = null;

  onMount(() => {
    getCards(CUSTOMER_ID)
      .then((fetchedCards) => {
        setCards(fetchedCards);
        const firstCardId = fetchedCards[0]?.id ?? null;
        setSelectedCardId(firstCardId);
        if (firstCardId !== null) {
          props.onCardSelect?.(firstCardId);
        }
      })
      .finally(() => {
        setIsLoadingCards(false);
      });
  });

  onCleanup(() => {
    savedCardPaymentInstance?.destroy?.();
    props.onReady?.(null);
  });

  createEffect(async () => {
    if (!props.payload || !props.checksum || savedCardPaymentInstance) return;

    savedCardPaymentInstance = await window.XMoney.savedCardPayment({
      orderChecksum: props.checksum,
      orderPayload: props.payload,
      publicKey: PUBLIC_KEY,
      onReady: () => {
        setIsReady(true);
        props.onReady?.(savedCardPaymentInstance!);
      },
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
    <div class="w-full">
      <Show when={isLoadingCards() || !isReady()}>
        <LoadingSpinner size="md" message="Loading saved cards..." />
      </Show>

      <Show when={!isLoadingCards() && isReady()}>
        <CustomCards
          cards={cards()}
          selectedId={selectedCardId()}
          onSelect={(id) => {
            setSelectedCardId(id);
            props.onCardSelect?.(id);
          }}
        />
        <Show when={!props.hideButton && cards().length > 0}>
          <button
            type="button"
            class="w-full py-3.5 px-6 rounded-xl font-semibold text-white text-sm mt-4
                bg-gradient-to-r from-[var(--color-green-600)] to-[var(--color-green-500)]
                hover:from-[var(--color-green-700)] hover:to-[var(--color-green-600)]
                active:scale-[0.98] transition-all duration-200 shadow-[0_4px_14px_rgba(123,186,14,0.3)]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            disabled={!selectedCardId() || isPending()}
            onClick={() => {
              if (!savedCardPaymentInstance || !selectedCardId()) return;
              setIsPending(true);
              savedCardPaymentInstance.pay({ cardId: selectedCardId()! });
            }}
          >
            <div class="flex items-center justify-center gap-2">
              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span>Pay with Saved Card</span>
            </div>
          </button>
        </Show>
      </Show>
    </div>
  );
}
