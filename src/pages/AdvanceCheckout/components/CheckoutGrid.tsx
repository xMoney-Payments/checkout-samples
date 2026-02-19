import { DeliveryDetailsCard } from "./DeliveryDetailsCard";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { PaymentMethodsAccordion } from "./PaymentMethodsAccordion";
import { PaymentButtons } from "./PaymentButtons";
import type { CheckoutState } from "../types";

interface CheckoutGridProps {
  state: CheckoutState;
}

export function CheckoutGrid(props: CheckoutGridProps) {
  const state = props.state;

  return (
    <div class="max-w-7xl mx-auto px-6 pb-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-4 mt-6">
          <DeliveryDetailsCard />
        </div>

        <div class="lg:col-span-4 mt-6">
          <PaymentMethodsAccordion state={state} intentResult={state.intentResult()!} />
        </div>

        <div class="lg:col-span-4">
          <OrderSummaryCard
            items={state.orderItems()}
            onQuantityChange={state.handleQuantityChange}
            isProcessing={state.isProcessing()}
            isUpdatingOrder={state.isUpdatingOrder()}
            paymentButtons={
              <PaymentButtons
                intentResult={state.intentResult()}
                activeMethod={state.activeMethod}
                isActiveMethodReady={state.isActiveMethodReady}
                isProcessing={state.isProcessing}
                savedCardPaymentInstance={state.savedCardPaymentInstance}
                selectedSavedCardId={state.selectedSavedCardId}
                onPlaceOrder={() => state.paymentCardInstance()?.submit()}
                onPayWithSavedCard={() => {
                  const instance = state.savedCardPaymentInstance();
                  const cardId = state.selectedSavedCardId();
                  if (instance && cardId) {
                    state.setIsProcessing(true);
                    instance.pay(cardId);
                  }
                }}
                onPaymentComplete={state.handlePaymentComplete}
                onPaymentError={state.handlePaymentError}
                onGooglePayReady={state.setGooglePayInstance}
                onApplePayReady={state.setApplePayInstance}
                setIsProcessing={state.setIsProcessing}
              />
            }
          />
        </div>
      </div>
    </div>
  );
}
