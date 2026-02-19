import { Show } from "solid-js";
import { PaymentCard } from "../../../components/xmoney-integrations/PaymentCard/PaymentCard";
import { SavedCardPayment } from "../../../components/xmoney-integrations/SavedCardPayment/SavedCardPayment";
import { AccordionItem } from "../../../components/ui/AccordionItem/AccordionItem";
import {
  SectionCard,
  PaymentMethodCardIcon,
} from "../../../components/ui/SectionCard/SectionCard";
import {
  CreditCardIcon,
  SavedCardIcon,
  GooglePayIcon,
  ApplePayIcon,
} from "../../../components/ui/PaymentMethodIcons/PaymentMethodIcons";
import type { CheckoutState } from "../types";

const WALLET_HINT =
  "Button will appear in the order summary when you're ready.";

interface PaymentMethodsAccordionProps {
  state: CheckoutState;
}

export function PaymentMethodsAccordion(props: PaymentMethodsAccordionProps) {
  const { state } = props;
  const intent = () => state.intentResult()!;

  return (
    <SectionCard
      icon={<PaymentMethodCardIcon />}
      iconBg="bg-[var(--color-blue-100)]"
      headerBg="bg-gradient-to-r from-[var(--color-blue-50)] to-white"
      title="Payment Method"
      subtitle="Choose how you'd like to pay"
    >
      <div class="p-5 flex flex-col gap-3">
        <AccordionItem
          id="card"
          title="Credit / Debit Card"
          subtitle="Visa, Mastercard, Maestro"
          icon={<CreditCardIcon />}
          isOpen={state.activeMethod() === "card"}
          onToggle={() => state.setActiveMethod("card")}
        >
          <PaymentCard
            payload={intent().payload}
            checksum={intent().checksum}
            hideSubmitButton
            onReady={(instance) => {
              state.setPaymentCardInstance(instance);
              state.setIsCardReady(true);
            }}
            onPaymentProcessing={state.setIsProcessing}
            onPaymentComplete={state.handlePaymentComplete}
            onError={state.handlePaymentError}
          />
        </AccordionItem>

        <AccordionItem
          id="saved-card"
          title="Saved Cards"
          subtitle="Pay with a previously saved card"
          icon={<SavedCardIcon />}
          isOpen={state.activeMethod() === "saved-card"}
          onToggle={() => state.setActiveMethod("saved-card")}
        >
          <SavedCardPayment
            payload={intent().payload}
            checksum={intent().checksum}
            hideButton
            onReady={(instance) => {
              state.setSavedCardPaymentInstance(instance);
              state.setIsSavedCardReady(true);
            }}
            onCardSelect={state.setSelectedSavedCardId}
            onPaymentComplete={state.handlePaymentComplete}
            onError={state.handlePaymentError}
          />
        </AccordionItem>

        <Show when={state.isGooglePaySupported()}>
          <AccordionItem
            id="google-pay"
            title="Google Pay"
            subtitle="Fast checkout with Google"
            icon={<GooglePayIcon />}
            isOpen={state.activeMethod() === "google-pay"}
            onToggle={() => state.setActiveMethod("google-pay")}
          >
            <p class="text-center py-4 text-sm text-[var(--color-neutral-500)] m-0">
              {WALLET_HINT}
            </p>
          </AccordionItem>
        </Show>

        <Show when={state.isApplePaySupported()}>
          <AccordionItem
            id="apple-pay"
            title="Apple Pay"
            subtitle="Secure payment with Apple"
            icon={<ApplePayIcon />}
            isOpen={state.activeMethod() === "apple-pay"}
            onToggle={() => state.setActiveMethod("apple-pay")}
          >
            <p class="text-center py-4 text-sm text-[var(--color-neutral-500)] m-0">
              {WALLET_HINT}
            </p>
          </AccordionItem>
        </Show>
      </div>
    </SectionCard>
  );
}
