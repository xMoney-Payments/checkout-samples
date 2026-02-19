import { Show } from "solid-js";
import { PaymentCard } from "../../../components/xmoney-integrations/PaymentCard/PaymentCard";
import { SavedCardPayment } from "../../../components/xmoney-integrations/SavedCardPayment/SavedCardPayment";
import { CheckoutAccordionItem } from "./CheckoutAccordionItem";
import {
  CreditCardIcon,
  SavedCardIcon,
  GooglePayIcon,
  ApplePayIcon,
} from "./PaymentMethodIcons";
import { PrettySavedCards } from "./PrettySavedCards";
import { PaymentMethodsPanel } from "./PaymentMethodsPanel";
import type { CheckoutState } from "../types";
import type { IntentResult } from "../types";

const WALLET_HINT =
  "Button will appear in the order summary when you're ready.";

interface PaymentMethodsAccordionProps {
  state: CheckoutState;
  intentResult: IntentResult;
}

export function PaymentMethodsAccordion(props: PaymentMethodsAccordionProps) {
  const { state, intentResult } = props;

  return (
    <PaymentMethodsPanel>
      <CheckoutAccordionItem
        id="card"
        title="Credit / Debit Card"
        subtitle="Visa, Mastercard, Maestro"
        icon={<CreditCardIcon />}
        isOpen={state.activeMethod() === "card"}
        onToggle={() => state.setActiveMethod("card")}
      >
        <PaymentCard
          payload={intentResult.payload}
          checksum={intentResult.checksum}
          hideSubmitButton
          onReady={(instance) => {
            state.setPaymentCardInstance(instance);
            state.setIsCardReady(true);
          }}
          onPaymentProcessing={state.setIsProcessing}
          onPaymentComplete={state.handlePaymentComplete}
          onError={state.handlePaymentError}
        />
      </CheckoutAccordionItem>

      <CheckoutAccordionItem
        id="saved-card"
        title="Saved Cards"
        subtitle="Pay with a previously saved card"
        icon={<SavedCardIcon />}
        isOpen={state.activeMethod() === "saved-card"}
        onToggle={() => state.setActiveMethod("saved-card")}
      >
        <SavedCardPayment
          payload={intentResult.payload}
          checksum={intentResult.checksum}
          hideButton
          onReady={(controls) => {
            state.setSavedCardPaymentInstance(controls);
            state.setIsSavedCardReady(true);
          }}
          onCardSelect={state.setSelectedSavedCardId}
          customCardRenderer={(p) => (
            <PrettySavedCards selectedId={p.selectedId} onSelect={p.onSelect} />
          )}
          onPaymentComplete={(data) => {
            state.setIsProcessing(false);
            state.handlePaymentComplete(data);
          }}
          onError={(err) => {
            state.setIsProcessing(false);
            state.handlePaymentError(err);
          }}
        />
      </CheckoutAccordionItem>

      <Show when={state.isGooglePaySupported()}>
        <CheckoutAccordionItem
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
        </CheckoutAccordionItem>
      </Show>

      <Show when={state.isApplePaySupported()}>
        <CheckoutAccordionItem
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
        </CheckoutAccordionItem>
      </Show>
    </PaymentMethodsPanel>
  );
}
