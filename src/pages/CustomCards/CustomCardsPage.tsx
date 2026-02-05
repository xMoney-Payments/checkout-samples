import {
  For,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import "../../components/CustomCards/CustomCards.css";
import "./CustomCardsPage.css";
import { createPaymentIntent } from "../../api";
import { CURRENCY, INITIAL_FORM_DATA, PUBLIC_KEY } from "../../constants";

import { TransactionResult } from "../../components/TransactionResult/TransactionResult";
import { TransactionDetails } from "../../types/checkout.types";
import { XMoneySavedCardPaymentInstance } from "../../types/xmoney-sdk/saved-card-payment-sdk.types";
import {
  LoadingSpinner,
  LoadingOverlay,
} from "../../components/LoadingSpinner/LoadingSpinner";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import { PageContainer } from "../../components/PageContainer/PageContainer";

interface SavedCard {
  id: number;
  customerId: number;
  type: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  nameOnCard: string;
  cardHolderCountry: string;
}

const savedCards: SavedCard[] = [
  {
    id: 140478,
    customerId: 62246,
    type: "visa",
    cardNumber: "411111******1111",
    expiryMonth: "12",
    expiryYear: "2034",
    nameOnCard: "Danut Ilie",
    cardHolderCountry: "RO",
  },
  {
    id: 140522,
    customerId: 62246,
    type: "mastercard",
    cardNumber: "555555******5599",
    expiryMonth: "12",
    expiryYear: "2034",
    nameOnCard: "MULTIVERSX LABS S.R.L.",
    cardHolderCountry: "RO",
  },
  {
    id: 140523,
    customerId: 62246,
    type: "visa",
    cardNumber: "411111******1111",
    expiryMonth: "12",
    expiryYear: "2026",
    nameOnCard: "MULTIVERSX LABS S.R.L.",
    cardHolderCountry: "RO",
  },
  {
    id: 140526,
    customerId: 62246,
    type: "visa",
    cardNumber: "400000******1118",
    expiryMonth: "12",
    expiryYear: "2030",
    nameOnCard: "MULTIVERSX LABS S.R.L.",
    cardHolderCountry: "RO",
  },
];

function formatCardNumber(cardNumber: string) {
  return cardNumber.replace(/(.{4})/g, "$1 ").trim();
}

function getCountryFlag(code: string) {
  if (!code || code.length !== 2) return "🌍";
  const base = 0x1f1e6;
  const chars = code.toUpperCase().split("");
  return String.fromCodePoint(
    base + chars[0].charCodeAt(0) - 65,
    base + chars[1].charCodeAt(0) - 65,
  );
}

function CardBrandBadge(props: { type: string }): JSX.Element {
  return (
    <span class={`carousel-brand ${props.type.toLowerCase()}`}>
      {props.type.toUpperCase()}
    </span>
  );
}

export function CustomCardsPage(): JSX.Element {
  const [selectedCardId, setSelectedCardId] = createSignal<number | null>(
    savedCards[0]?.id ?? null,
  );
  const [isLoading, setIsLoading] = createSignal(true);
  const [isReady, setIsReady] = createSignal(false);
  const [isPending, setIsPending] = createSignal(false);
  const [transactionResult, setTransactionResult] =
    createSignal<TransactionDetails | null>(null);
  const [error, setError] = createSignal<string | null>(null);
  const [intent, setIntent] = createSignal<{
    payload: string;
    checksum: string;
  } | null>(null);

  let carouselViewport: HTMLDivElement | undefined;
  let cardElementsContainer: HTMLDivElement | undefined;
  let savedCardPaymentInstance: XMoneySavedCardPaymentInstance | null = null;

  onMount(async () => {
    try {
      const paymentParams = {
        ...INITIAL_FORM_DATA,
        amount: INITIAL_FORM_DATA.amount,
        currency: CURRENCY,
        publicKey: PUBLIC_KEY,
      };

      const result = await createPaymentIntent(paymentParams);
      setIntent(result);
      setError(null);
    } catch (err) {
      console.error("Failed to create payment intent:", err);
      setError("Failed to initialize payment. Please refresh and try again.");
    } finally {
      setIsLoading(false);
    }
  });

  onCleanup(() => {
    savedCardPaymentInstance?.destroy?.();
  });

  createEffect(async () => {
    if (!intent() || savedCardPaymentInstance || !cardElementsContainer) return;

    setIsPending(false);
    setError(null);

    savedCardPaymentInstance = await window.XMoney.savedCardPayment({
      container: cardElementsContainer,
      orderChecksum: intent()!.checksum,
      orderPayload: intent()!.payload,
      publicKey: PUBLIC_KEY,
      onReady: () => setIsReady(true),
      onError: (err) => {
        console.error("❌ Card elements error", err);
        setError("Failed to initialize payment. Please try again.");
        setIsPending(false);
      },
      onPaymentComplete: (result: TransactionDetails) => {
        setTransactionResult(result);
        setIsPending(false);
        setError(null);
      },
    });
  });

  const scrollByCard = (direction: "next" | "prev") => {
    if (!carouselViewport) return;
    const cardWidth =
      carouselViewport.querySelector<HTMLElement>(".carousel-card")
        ?.offsetWidth ?? 320;
    const gap = 16;
    const offset = direction === "next" ? cardWidth + gap : -(cardWidth + gap);
    carouselViewport.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <PageContainer>
      <div class="custom-cards-page">
        <Show when={error()}>
          <ErrorAlert
            title="Payment Error"
            message={error()!}
            onDismiss={() => setError(null)}
            variant="banner"
          />
        </Show>

        <Show when={isLoading()}>
          <LoadingSpinner size="large" message="Loading your cards..." />
        </Show>

        <Show when={!isLoading()}>
          <>
            <section
              class="custom-cards-carousel"
              aria-label="Saved cards carousel"
            >
              <button
                class="carousel-control prev"
                type="button"
                onClick={() => scrollByCard("prev")}
                aria-label="Previous card"
              >
                ←
              </button>

              <div class="carousel-viewport" ref={carouselViewport}>
                <div class="carousel-track">
                  <For each={savedCards}>
                    {(card) => (
                      <article
                        class={`card-item card-${card.type.toLowerCase()} carousel-card ${
                          selectedCardId() === card.id ? "selected" : ""
                        }`}
                        onClick={() => setSelectedCardId(card.id)}
                        role="button"
                        tabIndex={0}
                        aria-pressed={selectedCardId() === card.id}
                      >
                        <div class="carousel-card-header">
                          <span class="carousel-chip" />
                          <CardBrandBadge type={card.type} />
                        </div>

                        <div class="card-number">
                          {formatCardNumber(card.cardNumber)}
                        </div>

                        <div class="carousel-card-meta">
                          <div>
                            <span class="card-label">Card holder</span>
                            <span class="card-value">{card.nameOnCard}</span>
                          </div>
                          <div>
                            <span class="card-label">Expires</span>
                            <span class="card-value">
                              {card.expiryMonth}/{card.expiryYear.slice(-2)}
                            </span>
                          </div>
                        </div>

                        <div class="carousel-card-footer">
                          <span class="carousel-country">
                            {getCountryFlag(card.cardHolderCountry)}{" "}
                            {card.cardHolderCountry}
                          </span>
                          <span class="carousel-id">ID {card.id}</span>
                        </div>
                      </article>
                    )}
                  </For>
                </div>
              </div>

              <button
                class="carousel-control next"
                type="button"
                onClick={() => scrollByCard("next")}
                aria-label="Next card"
              >
                →
              </button>
            </section>

            <div class="card-payment-container">
              <button
                class="card-payment-button"
                disabled={!selectedCardId() || isPending()}
                onClick={() => {
                  setIsPending(true);
                  savedCardPaymentInstance?.pay(selectedCardId() || 0);
                }}
              >
                <Show when={!isPending()} fallback={<>Processing...</>}>
                  Pay {INITIAL_FORM_DATA.amount} {CURRENCY}
                </Show>
              </button>
            </div>
          </>
        </Show>

        {isPending() && (
          <LoadingOverlay size="medium" message="Processing payment..." />
        )}

        <Show when={transactionResult()}>
          <TransactionResult
            result={transactionResult()!}
            onRetry={() => {
              setTransactionResult(null);
              setError(null);
              setIsPending(false);
            }}
          />
        </Show>
      </div>
      <div ref={cardElementsContainer} />
    </PageContainer>
  );
}
