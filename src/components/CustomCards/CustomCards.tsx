/** @jsxImportSource solid-js */
import { For, createEffect, createSignal } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import "./CustomCards.css";

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

interface CustomCardsProps {
  cards: SavedCard[];
  title?: string;
  selectedId?: number | null;
  onSelect?: (card: SavedCard) => void;
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

function formatCardNumber(cardNumber: string) {
  return cardNumber.replace(/(.{4})/g, "$1 ").trim();
}

function isExpired(expiryMonth: string, expiryYear: string) {
  const year = Number(expiryYear);
  const month = Number(expiryMonth) - 1;
  if (Number.isNaN(year) || Number.isNaN(month)) return false;
  const expDate = new Date(year, month + 1, 0, 23, 59, 59);
  return expDate.getTime() < Date.now();
}

function isExpiringSoon(expiryMonth: string, expiryYear: string) {
  const year = Number(expiryYear);
  const month = Number(expiryMonth) - 1;
  if (Number.isNaN(year) || Number.isNaN(month)) return false;
  const now = new Date();
  const expDate = new Date(year, month + 1, 0, 23, 59, 59);
  const diffMonths =
    (expDate.getFullYear() - now.getFullYear()) * 12 +
    (expDate.getMonth() - now.getMonth());
  return diffMonths >= 0 && diffMonths <= 3;
}

function CardBrandIcon(props: { type: string }): JSX.Element {
  const type = props.type.toLowerCase();

  if (type === "mastercard") {
    return (
      <svg class="card-brand-icon" viewBox="0 0 48 32" aria-hidden="true">
        <circle cx="20" cy="16" r="12" fill="#EB001B" />
        <circle cx="28" cy="16" r="12" fill="#F79E1B" />
        <path d="M24 6a12 12 0 0 1 0 20 12 12 0 0 1 0-20Z" fill="#FF5F00" />
      </svg>
    );
  }

  return (
    <svg class="card-brand-icon" viewBox="0 0 48 32" aria-hidden="true">
      <rect width="48" height="32" rx="6" fill="#1A1F71" />
      <text
        x="24"
        y="21"
        text-anchor="middle"
        font-size="12"
        font-weight="700"
        fill="#fff"
      >
        VISA
      </text>
    </svg>
  );
}

export function CustomCards(props: CustomCardsProps): JSX.Element {
  const [activeId, setActiveId] = createSignal<number | null>(
    props.selectedId ?? props.cards[0]?.id ?? null,
  );

  createEffect(() => {
    if (props.selectedId !== undefined) {
      setActiveId(props.selectedId);
    }
  });

  return (
    <section class="custom-cards" aria-label="Saved cards">
      <div class="custom-cards-header">
        <div>
          <h2>{props.title ?? "Saved cards"}</h2>
          <p>Pick a card to continue your checkout</p>
        </div>
        <button class="custom-cards-add" type="button">
          + Add new
        </button>
      </div>

      <div class="custom-cards-grid">
        <For each={props.cards}>
          {(card) => {
            const expired = () => isExpired(card.expiryMonth, card.expiryYear);
            const expiringSoon = () =>
              !expired() && isExpiringSoon(card.expiryMonth, card.expiryYear);

            return (
              <button
                type="button"
                class={`card-item card-${card.type.toLowerCase()} ${
                  activeId() === card.id ? "active" : ""
                } ${expired() ? "expired" : ""} ${
                  expiringSoon() ? "expiring" : ""
                }`}
                onClick={() => {
                  setActiveId(card.id);
                  props.onSelect?.(card);
                }}
              >
                <div class="card-top">
                  <div class="card-chip">
                    <span class="chip-line" />
                    <span class="chip-line" />
                    <span class="chip-line" />
                  </div>
                  <div class="card-contactless">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M7 8c3.9 3.9 3.9 10.1 0 14"
                        stroke="currentColor"
                        stroke-width="2"
                        fill="none"
                        stroke-linecap="round"
                      />
                      <path
                        d="M12 6c4.9 4.9 4.9 12.1 0 17"
                        stroke="currentColor"
                        stroke-width="2"
                        fill="none"
                        stroke-linecap="round"
                      />
                    </svg>
                  </div>
                </div>

                <div class="card-number">
                  {formatCardNumber(card.cardNumber)}
                </div>

                <div class="card-meta">
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

                <div class="card-footer">
                  <div class="card-country">
                    <span class="flag" aria-hidden="true">
                      {getCountryFlag(card.cardHolderCountry)}
                    </span>
                    <span>{card.cardHolderCountry}</span>
                  </div>
                  <CardBrandIcon type={card.type} />
                </div>

                {(expired() || expiringSoon()) && (
                  <div class="card-status">
                    {expired() ? "Expired" : "Expires soon"}
                  </div>
                )}
              </button>
            );
          }}
        </For>
      </div>
    </section>
  );
}
