import { createSignal, Show } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { SimpleExample } from "../_shared/SimpleExample";
import { AmountBar } from "../_shared/AmountBar";
import { usePaymentIntent } from "../_shared/usePaymentIntent";
import { formatFieldValidationErrors } from "../_shared/formatPaymentError";
import { PaymentCard } from "../../components/xmoney-integrations/PaymentCard/PaymentCard";
import { INITIAL_FORM_DATA } from "../../constants";
import type { PaymentCardInstance } from "../../types/xmoney-sdk/payment-card-sdk.types";

const DEFAULT_PAY_LABEL = "Pay now";

export function PaymentCardPage(): JSX.Element {
  const checkout = usePaymentIntent();
  const [useCustomSubmit, setUseCustomSubmit] = createSignal(false);
  const [savedCardsEnabled, setSavedCardsEnabled] = createSignal(false);
  const [cardInstance, setCardInstance] =
    createSignal<PaymentCardInstance | null>(null);
  const [isValidating, setIsValidating] = createSignal(false);
  const [isCardValid, setIsCardValid] = createSignal(false);
  const [payButtonLabel, setPayButtonLabel] = createSignal(DEFAULT_PAY_LABEL);

  function resetCardState() {
    setCardInstance(null);
    setIsCardValid(false);
    setPayButtonLabel(DEFAULT_PAY_LABEL);
    checkout.setError(null);
  }

  async function handleCustomPay() {
    const instance = cardInstance();
    if (!instance) return;

    setIsValidating(true);
    checkout.setError(null);

    try {
      const result = await instance.validate();
      setIsCardValid(result.isValid);
      if (!result.isValid) {
        const messages =
          formatFieldValidationErrors(result.fields) ||
          Object.values(result.errors)
            .map((fieldError) => fieldError?.message)
            .filter(Boolean)
            .join(" ");
        checkout.setError(
          messages || "Please check your card details and try again.",
        );
        return;
      }
      instance.submit();
    } catch (err) {
      checkout.handlePaymentError(err);
    } finally {
      setIsValidating(false);
    }
  }

  return (
    <SimpleExample
      title="Payment Card"
      description="Standalone card input for a custom checkout layout. Toggle saved cards, or hide the built-in submit button and call validate() then submit() yourself."
      sdkMethod="XMoney.paymentCard()"
      integrationPath="src/components/xmoney-integrations/PaymentCard/PaymentCard.tsx"
      error={checkout.error()}
      onDismissError={() => checkout.setError(null)}
      transactionResult={checkout.transactionResult()}
      isLoading={checkout.isLoading()}
      loadingMessage="Loading payment card..."
    >
      <Show when={checkout.order()}>
        <div class="mb-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[var(--color-neutral-100)] shadow-[0_4px_24px_rgba(22,20,26,0.06)] bg-gradient-to-r from-[var(--color-yellow-50)] to-white">
          <AmountBar amount={INITIAL_FORM_DATA.amount} embedded />
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <OptionToggle
              checked={savedCardsEnabled()}
              label="Saved cards"
              description="List saved cards and show the save opt-in"
              onChange={(checked) => {
                setSavedCardsEnabled(checked);
                resetCardState();
              }}
            />
            <OptionToggle
              checked={useCustomSubmit()}
              label="Custom pay button"
              description="Hide submit and call validate() then submit()"
              onChange={(checked) => {
                setUseCustomSubmit(checked);
                resetCardState();
              }}
            />
          </div>
        </div>
        <div class="p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-[var(--color-neutral-100)] bg-white">
          <Show when={`${savedCardsEnabled()}-${useCustomSubmit()}`} keyed>
            <PaymentCard
              payload={checkout.order()!.payload}
              checksum={checkout.order()!.checksum}
              hideSubmitButton={useCustomSubmit()}
              savedCardsEnabled={savedCardsEnabled()}
              onReady={setCardInstance}
              onPaymentComplete={checkout.handlePaymentComplete}
              onError={checkout.handlePaymentError}
              onPaymentChange={(event) => {
                debugger;
                setPayButtonLabel(event.button.label);
              }}
              onValidation={(event) => {
                setIsCardValid(event.isValid);
              }}
            />
          </Show>
          <Show when={useCustomSubmit()}>
            <button
              type="button"
              class="w-full py-3.5 px-6 rounded-xl font-semibold text-white text-sm mt-4
                bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-500)]
                hover:from-[var(--color-primary-700)] hover:to-[var(--color-primary-600)]
                active:scale-[0.98] transition-all duration-200 shadow-[0_4px_14px_rgba(124,77,255,0.3)]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              disabled={!cardInstance() || isValidating() || !isCardValid()}
              onClick={handleCustomPay}
            >
              {isValidating() ? "Validating..." : payButtonLabel()}
            </button>
          </Show>
        </div>
      </Show>
    </SimpleExample>
  );
}

function OptionToggle(props: {
  checked: boolean;
  label: string;
  description: string;
  onChange: (checked: boolean) => void;
}): JSX.Element {
  return (
    <label class="flex items-start gap-2.5 p-3 rounded-xl bg-white/80 border border-[var(--color-neutral-100)] cursor-pointer">
      <input
        type="checkbox"
        checked={props.checked}
        onChange={(event) => props.onChange(event.currentTarget.checked)}
        class="w-4 h-4 mt-0.5 shrink-0"
      />
      <span>
        <span class="block text-sm font-semibold text-[var(--color-neutral-800)]">
          {props.label}
        </span>
        <span class="block text-xs text-[var(--color-neutral-500)] mt-0.5 leading-snug">
          {props.description}
        </span>
      </span>
    </label>
  );
}
