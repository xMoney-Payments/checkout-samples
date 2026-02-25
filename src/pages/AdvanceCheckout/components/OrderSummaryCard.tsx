import { For } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { CURRENCY } from "../../../constants";
import { DELIVERY_THRESHOLD, DELIVERY_FEE } from "../constants";
import { SectionCard } from "../../../components/ui/SectionCard/SectionCard";
import type { CheckoutState } from "../types";

interface OrderSummaryCardProps {
  state: CheckoutState;
  paymentButtons: JSX.Element;
}

export function OrderSummaryCard(props: OrderSummaryCardProps) {
  const items = () => props.state.orderItems();
  const subtotal = () =>
    items().reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = () => (subtotal() >= DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE);
  const total = () => subtotal() + deliveryFee();

  const isDisabled = () => props.state.isProcessing() || props.state.isUpdatingOrder();

  return (
    <SectionCard
      icon={<span class="text-lg">🛒</span>}
      iconBg="bg-[var(--color-yellow-100)]"
      headerBg="bg-gradient-to-r from-[var(--color-yellow-50)] to-white"
      title="Order Summary"
      subtitle={`${items().reduce((sum, i) => sum + i.quantity, 0)} items in your cart`}
      class="sticky top-20"
    >
      <div class="p-5 flex flex-col gap-3">
        <For each={items()}>
          {(item) => (
            <div class="flex items-center gap-3 py-2">
              <span class="text-2xl flex-shrink-0">{item.image}</span>
              <div class="flex-1 min-w-0">
                <p class="m-0 text-sm font-semibold text-[var(--color-neutral-800)] truncate">
                  {item.name}
                </p>
                <p class="m-0 text-xs text-[var(--color-neutral-400)]">
                  {item.price.toFixed(2)} {CURRENCY}
                </p>
              </div>
              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  class="w-7 h-7 rounded-lg border border-[var(--color-neutral-200)] bg-white flex items-center justify-center text-[var(--color-neutral-500)] hover:bg-[var(--color-neutral-50)] cursor-pointer transition-colors text-sm font-bold"
                  onClick={() => props.state.handleQuantityChange(item.id, -1)}
                >
                  -
                </button>
                <span class="w-6 text-center text-sm font-semibold text-[var(--color-neutral-800)]">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  class="w-7 h-7 rounded-lg border border-[var(--color-neutral-200)] bg-white flex items-center justify-center text-[var(--color-neutral-500)] hover:bg-[var(--color-neutral-50)] cursor-pointer transition-colors text-sm font-bold"
                  onClick={() => props.state.handleQuantityChange(item.id, 1)}
                >
                  +
                </button>
              </div>
            </div>
          )}
        </For>
      </div>

      <div class="px-5 pb-4">
        <div class="border-t border-dashed border-[var(--color-neutral-200)] pt-4 flex flex-col gap-2">
          <div class="flex justify-between text-sm text-[var(--color-neutral-500)]">
            <span>Subtotal</span>
            <span>
              {subtotal().toFixed(2)} {CURRENCY}
            </span>
          </div>
          <div class="flex justify-between text-sm text-[var(--color-neutral-500)]">
            <span>Delivery</span>
            <span
              class={
                deliveryFee() === 0
                  ? "text-[var(--color-green-600)] font-semibold"
                  : ""
              }
            >
              {deliveryFee() === 0
                ? "FREE"
                : `${deliveryFee().toFixed(2)} ${CURRENCY}`}
            </span>
          </div>
          <div class="border-t border-[var(--color-neutral-100)] pt-3 mt-1 flex justify-between items-center text-base font-bold text-[var(--color-neutral-900)]">
            <span>Total</span>
            <div class="flex items-center gap-2">
              {props.state.isUpdatingOrder() && (
                <div
                  class="w-3.5 h-3.5 rounded-full border-2 border-solid border-transparent flex-shrink-0"
                  style={{
                    animation: "spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite",
                    "border-top-color": "var(--color-primary-500)",
                    "border-left-color": "var(--color-primary-400)",
                  }}
                />
              )}
              <span>
                {total().toFixed(2)} {CURRENCY}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="px-5 pb-6"
        style={{
          opacity: isDisabled() ? "0.5" : "1",
          "pointer-events": isDisabled() ? "none" : "auto",
          transition: "opacity 0.2s",
        }}
      >
        {props.paymentButtons}
      </div>
    </SectionCard>
  );
}
