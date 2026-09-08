import { DeliveryDetailsCard } from "./DeliveryDetailsCard";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { PaymentMethodsAccordion } from "./PaymentMethodsAccordion";
import { PaymentButtons } from "./PaymentButtons";
import type { CheckoutState } from "../types";

interface CheckoutGridProps {
  state: CheckoutState;
}

export function CheckoutGrid(props: CheckoutGridProps) {
  return (
    <div class="max-w-7xl mx-auto px-3 pb-8 sm:px-6 sm:pb-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6">
        <div class="lg:col-span-4 order-3 lg:order-1 mt-0 lg:mt-6">
          <DeliveryDetailsCard />
        </div>

        <div class="lg:col-span-4 order-1 lg:order-2 mt-3 lg:mt-6">
          <PaymentMethodsAccordion state={props.state} />
        </div>

        <div class="lg:col-span-4 order-2 lg:order-3">
          <OrderSummaryCard
            state={props.state}
            paymentButtons={<PaymentButtons state={props.state} />}
          />
        </div>
      </div>
    </div>
  );
}
