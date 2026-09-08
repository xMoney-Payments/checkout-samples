import { Show } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { SimpleExample } from "../_shared/SimpleExample";
import { AmountBar } from "../_shared/AmountBar";
import { usePaymentIntent } from "../_shared/usePaymentIntent";
import { SavedCardPayment } from "../../components/xmoney-integrations/SavedCardPayment/SavedCardPayment";
import { INITIAL_FORM_DATA } from "../../constants";

export function SavedCardPage(): JSX.Element {
  const checkout = usePaymentIntent();

  return (
    <SimpleExample
      title="Saved Card"
      description="Pay with a previously saved card. The SDK method is headless — this page lists cards and calls pay({ cardId })."
      sdkMethod="XMoney.savedCardPayment()"
      integrationPath="src/components/xmoney-integrations/SavedCardPayment/SavedCardPayment.tsx"
      error={checkout.error()}
      onDismissError={() => checkout.setError(null)}
      transactionResult={checkout.transactionResult()}
      isLoading={checkout.isLoading()}
      loadingMessage="Loading saved cards..."
    >
      <Show when={checkout.order()}>
        <AmountBar amount={INITIAL_FORM_DATA.amount} />
        <div class="p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-[var(--color-neutral-100)] bg-white">
          <SavedCardPayment
            payload={checkout.order()!.payload}
            checksum={checkout.order()!.checksum}
            onPaymentComplete={checkout.handlePaymentComplete}
            onError={checkout.handlePaymentError}
          />
        </div>
      </Show>
    </SimpleExample>
  );
}
