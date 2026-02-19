import { For, Show } from "solid-js";
import { SAVED_CARDS } from "../constants";

interface PrettySavedCardsProps {
  selectedId: number;
  onSelect: (id: number) => void;
}

export function PrettySavedCards(props: PrettySavedCardsProps) {
  return (
    <div class="flex flex-col gap-3">
      <For each={SAVED_CARDS}>
        {(card) => {
          const isSelected = () => props.selectedId === card.id;
          const isVisa = card.type.toLowerCase() === "visa";

          return (
            <button
              type="button"
              class={`relative w-full rounded-2xl p-0 cursor-pointer transition-all duration-300 text-left border-0 outline-none group ${
                isSelected()
                  ? "shadow-[0_8px_24px_rgba(124,77,255,0.18)]"
                  : "shadow-sm hover:shadow-md"
              }`}
              onClick={() => props.onSelect(card.id)}
            >
              <div
                class={`relative overflow-hidden rounded-2xl p-5 transition-all duration-300 ${
                  isSelected()
                    ? isVisa
                      ? "bg-gradient-to-br from-[#1A1F71] via-[#2a2f91] to-[#4a4fb1]"
                      : "bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]"
                    : isVisa
                      ? "bg-gradient-to-br from-[#2a2f71] via-[#3a3f91] to-[#5a5fb1] opacity-70 group-hover:opacity-90"
                      : "bg-gradient-to-br from-[#2a2a3e] via-[#26314e] to-[#1f4470] opacity-70 group-hover:opacity-90"
                }`}
              >
                <div class="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
                <div class="absolute -bottom-8 -left-4 w-20 h-20 rounded-full bg-white/5" />

                <div
                  class={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    isSelected()
                      ? "border-white bg-white"
                      : "border-white/40 bg-transparent"
                  }`}
                >
                  <Show when={isSelected()}>
                    <svg
                      class="w-3 h-3 text-[var(--color-primary-600)]"
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
                  </Show>
                </div>

                <div class="flex items-center justify-between mb-5">
                  {isVisa ? (
                    <svg
                      class="w-14 h-8"
                      viewBox="0 0 48 32"
                      aria-hidden="true"
                    >
                      <text
                        x="2"
                        y="22"
                        font-size="16"
                        font-weight="bold"
                        font-style="italic"
                        fill="#fff"
                      >
                        VISA
                      </text>
                    </svg>
                  ) : (
                    <svg
                      class="w-12 h-8"
                      viewBox="0 0 48 32"
                      aria-hidden="true"
                    >
                      <circle
                        cx="16"
                        cy="16"
                        r="10"
                        fill="#EB001B"
                        opacity="0.9"
                      />
                      <circle
                        cx="32"
                        cy="16"
                        r="10"
                        fill="#F79E1B"
                        opacity="0.9"
                      />
                      <path
                        d="M24 6a12 12 0 0 1 0 20 12 12 0 0 1 0-20Z"
                        fill="#FF5F00"
                        opacity="0.9"
                      />
                    </svg>
                  )}
                  <div class="flex gap-1">
                    <div class="w-6 h-4 rounded-sm bg-white/15" />
                    <div class="w-6 h-4 rounded-sm bg-white/10" />
                  </div>
                </div>

                <div class="mb-4">
                  <p class="m-0 font-mono text-base font-medium text-white/95 tracking-[0.15em]">
                    {card.cardNumber}
                  </p>
                </div>

                <div class="flex items-end justify-between">
                  <div>
                    <p class="m-0 text-[10px] uppercase tracking-wider text-white/40 mb-0.5">
                      Card Holder
                    </p>
                    <p class="m-0 text-xs font-semibold text-white/90">
                      {card.nameOnCard}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="m-0 text-[10px] uppercase tracking-wider text-white/40 mb-0.5">
                      Expires
                    </p>
                    <p class="m-0 text-xs font-semibold text-white/90">
                      {card.expiryMonth}/{card.expiryYear.slice(-2)}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          );
        }}
      </For>
    </div>
  );
}
