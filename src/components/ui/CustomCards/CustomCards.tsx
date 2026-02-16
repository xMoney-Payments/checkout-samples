/** @jsxImportSource solid-js */
import { For, Setter, createEffect, createSignal } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

export interface SavedCard {
  id: number;
  customerId: number;
  type: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  nameOnCard: string;
  cardHolderCountry: string;
}

const cards: SavedCard[] = [
  {
    id: 140478,
    customerId: 62246,
    type: "visa",
    cardNumber: "411111******1111",
    expiryMonth: "12",
    expiryYear: "2028",
    nameOnCard: "John Doe",
    cardHolderCountry: "US",
  },
  {
    id: 140522,
    customerId: 62246,
    type: "mastercard",
    cardNumber: "555555******5599",
    expiryMonth: "06",
    expiryYear: "2029",
    nameOnCard: "Jane Smith",
    cardHolderCountry: "UK",
  },
];

interface CustomCardsProps {
  selectedId: number | null;
  onSelect: Setter<number>;
}

function CardBrandIcon(props: { type: string }): JSX.Element {
  const type = props.type.toLowerCase();

  if (type === "mastercard") {
    return (
      <svg class="w-12 h-8" viewBox="0 0 48 32" aria-hidden="true">
        <circle cx="16" cy="16" r="10" fill="#EB001B" />
        <circle cx="32" cy="16" r="10" fill="#F79E1B" />
        <path d="M24 6a12 12 0 0 1 0 20 12 12 0 0 1 0-20Z" fill="#FF5F00" />
      </svg>
    );
  }

  return (
    <svg class="w-12 h-8" viewBox="0 0 48 32" aria-hidden="true">
      <rect width="48" height="32" rx="4" fill="#1A1F71" />
      <text
        x="24"
        y="21"
        text-anchor="middle"
        font-size="11"
        font-weight="bold"
        fill="#fff"
      >
        VISA
      </text>
    </svg>
  );
}

export function CustomCards(props: CustomCardsProps): JSX.Element {
  return (
    <section class="flex flex-col gap-2" aria-label="Saved cards">
      <For each={cards}>
        {(card) => {
          return (
            <button
              type="button"
              class={`w-full rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all duration-200 text-left border-2 ${
                props.selectedId === card.id
                  ? "bg-[var(--color-primary-25)] border-[var(--color-primary-400)] shadow-lg"
                  : "bg-white border-[var(--color-neutral-100)] hover:border-[var(--color-neutral-200)] hover:shadow-md"
              }`}
              onClick={() => {
                props.onSelect(card.id);
              }}
            >
              <div class="flex-shrink-0">
                <CardBrandIcon type={card.type} />
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-mono text-base font-semibold text-[var(--color-neutral-900)]">
                    {card.cardNumber}
                  </span>
                </div>
                <div class="text-sm text-[var(--color-neutral-500)] mt-1">
                  {card.nameOnCard}
                </div>
              </div>

              <div class="flex-shrink-0 text-right">
                <div class="text-xs text-[var(--color-neutral-400)]">
                  Expires
                </div>
                <div class="text-sm font-semibold text-[var(--color-neutral-800)]">
                  {card.expiryMonth}/{card.expiryYear.slice(-2)}
                </div>
              </div>

              <div class="flex-shrink-0">
                <div
                  class={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    props.selectedId === card.id
                      ? "border-[var(--color-primary-500)] bg-[var(--color-primary-500)]"
                      : "border-[var(--color-neutral-200)]"
                  }`}
                >
                  {props.selectedId === card.id && (
                    <svg
                      class="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="3"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        }}
      </For>
    </section>
  );
}
