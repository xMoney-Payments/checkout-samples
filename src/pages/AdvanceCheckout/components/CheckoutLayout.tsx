import { Show } from "solid-js";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner/LoadingSpinner";
import { ErrorAlert } from "../../../components/ui/ErrorAlert/ErrorAlert";
import { PaymentSuccessBanner } from "./PaymentSuccessBanner";
import { CheckoutGrid } from "./CheckoutGrid";
import type { CheckoutState } from "../types";

interface CheckoutLayoutProps {
  state: CheckoutState;
}

export function CheckoutLayout(props: CheckoutLayoutProps) {
  const state = props.state;

  return (
    <>
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
          <PaymentSuccessBanner result={state.paymentResult()!} />
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
    </>
  );
}
