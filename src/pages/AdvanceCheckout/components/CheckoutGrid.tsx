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
    <div class="max-w-7xl mx-auto px-6 pb-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-4 mt-6">
          <DeliveryDetailsCard />
        </div>

        <div class="lg:col-span-4 mt-6">
          <PaymentMethodsAccordion state={props.state} />
        </div>

        <div class="lg:col-span-4">
          <OrderSummaryCard
            state={props.state}
            paymentButtons={<PaymentButtons state={props.state} />}
          />
        </div>
      </div>
    </div>
  );
}
