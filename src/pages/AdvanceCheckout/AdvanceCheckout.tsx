import { Show } from "solid-js";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner/LoadingSpinner";
import { ErrorAlert } from "../../components/ui/ErrorAlert/ErrorAlert";
import { PaymentSuccessCard } from "../../components/ui/PaymentSuccessCard/PaymentSuccessCard";
import { CheckoutGrid } from "./components/CheckoutGrid";
import { useCheckoutState } from "./hooks/useCheckoutState";

export function AdvanceCheckout() {
  const state = useCheckoutState();

  return (
    <div class="min-h-screen">
      <div class="max-w-7xl mx-auto px-6">
        <Show when={state.error()}>
          <ErrorAlert
            title="Payment Error"
            message={state.error()!}
            onDismiss={() => state.setError(null)}
            variant="banner"
          />
        </Show>
        <Show when={state.paymentResult()}>
          <PaymentSuccessCard result={state.paymentResult()!} />
        </Show>
      </div>

      <Show when={state.isLoading()}>
        <div class="max-w-7xl mx-auto px-6 py-12">
          <LoadingSpinner size="lg" message="Preparing your checkout..." />
        </div>
      </Show>

      <Show
        when={
          !state.isLoading() && !state.paymentResult() && state.intentResult()
        }
      >
        <CheckoutGrid state={state} />
      </Show>
    </div>
  );
}
