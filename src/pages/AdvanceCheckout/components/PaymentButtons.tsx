import { Show } from "solid-js";
import { GooglePay } from "../../../components/xmoney-integrations/GooglePay/GooglePay";
import { ApplePay } from "../../../components/xmoney-integrations/ApplePay/ApplePay";
import type { PaymentButtonsProps } from "../types";

const spinnerStyle = {
  animation: "spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite",
  "border-top-color": "var(--color-primary-500)",
  "border-left-color": "var(--color-primary-400)",
} as const;

export function PaymentButtons(props: PaymentButtonsProps) {
  const intent = props.intentResult;
  if (!intent) return null;

  return (
    <div class="flex flex-col gap-3">
      <Show when={!props.isActiveMethodReady() && !props.isProcessing()}>
        <div class="flex items-center justify-center gap-3 py-4">
          <div
            class="w-5 h-5 rounded-full border-2 border-solid border-transparent"
            style={spinnerStyle}
          />
          <span class="text-sm text-[var(--color-neutral-400)]">
            Loading payment method...
          </span>
        </div>
      </Show>

      <Show when={props.isProcessing()}>
        <div class="flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[var(--color-primary-25)] border border-[var(--color-primary-100)]">
          <div
            class="w-4 h-4 rounded-full border-2 border-solid border-transparent"
            style={spinnerStyle}
          />
          <span class="text-sm font-medium text-[var(--color-primary-700)]">
            Processing your payment...
          </span>
        </div>
      </Show>

      <Show
        when={
          props.activeMethod() === "card" &&
          props.isActiveMethodReady() &&
          !props.isProcessing()
        }
      >
        <button
          type="button"
          class="w-full py-3.5 px-6 rounded-xl font-semibold text-white text-sm
            bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-500)]
            hover:from-[var(--color-primary-700)] hover:to-[var(--color-primary-600)]
            active:scale-[0.98] transition-all duration-200 shadow-[0_4px_14px_rgba(124,77,255,0.3)]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          disabled={!props.isActiveMethodReady()}
          onClick={props.onPlaceOrder}
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
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Place Order</span>
          </div>
        </button>
      </Show>

      <Show
        when={
          props.activeMethod() === "saved-card" &&
          props.isActiveMethodReady() &&
          !props.isProcessing()
        }
      >
        <button
          type="button"
          class="w-full py-3.5 px-6 rounded-xl font-semibold text-white text-sm
            bg-gradient-to-r from-[var(--color-green-600)] to-[var(--color-green-500)]
            hover:from-[var(--color-green-700)] hover:to-[var(--color-green-600)]
            active:scale-[0.98] transition-all duration-200 shadow-[0_4px_14px_rgba(123,186,14,0.3)]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          disabled={
            !props.savedCardPaymentInstance() || !props.selectedSavedCardId()
          }
          onClick={props.onPayWithSavedCard}
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

      <Show when={props.activeMethod() === "google-pay"}>
        <GooglePay
          payload={intent.payload}
          checksum={intent.checksum}
          onReady={props.onGooglePayReady}
          onPaymentComplete={props.onPaymentComplete}
          onError={props.onPaymentError}
        />
      </Show>

      <Show when={props.activeMethod() === "apple-pay"}>
        <ApplePay
          payload={intent.payload}
          checksum={intent.checksum}
          onReady={props.onApplePayReady}
          onPaymentComplete={props.onPaymentComplete}
          onError={props.onPaymentError}
        />
      </Show>

      <div class="flex items-center justify-center gap-2 mt-2">
        <svg
          class="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-green-600)"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span class="text-xs text-[var(--color-neutral-400)]">
          Secured by xMoney
        </span>
      </div>
    </div>
  );
}
