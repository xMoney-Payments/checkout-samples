import { CheckoutLayout } from "./components/CheckoutLayout";
import { useCheckoutState } from "./hooks/useCheckoutState";

export function AdvanceCheckout() {
  const state = useCheckoutState();

  return (
    <div class="min-h-screen">
      <CheckoutLayout state={state} />
    </div>
  );
}
