import { createSignal, Show } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";

import { createPaymentIntent } from "../../api";
import { XMoneyPaymentForm } from "../../components/xmoney-integrations/PaymentForm/PaymentForm";
import {
  SectionCard,
  PaymentMethodCardIcon,
} from "../../components/ui/SectionCard/SectionCard";
import { CURRENCY, INITIAL_FORM_DATA } from "../../constants";
import { PUBLIC_KEY } from "../../config";
import { PaymentFormConfig } from "./components/PaymentFormConfig/PaymentFormConfig";
import { lightThemeStyles } from "../../example/styles";
import { SimpleExample } from "../_shared/SimpleExample";
import { usePaymentIntent } from "../_shared/usePaymentIntent";
import type { PaymentFormInstance } from "../../types/xmoney-sdk/payment-form-sdk.types";
import type {
  Appearance,
  CardInputGrouping,
  Locale,
} from "../../types/xmoney-sdk/sdk-base.types";

const INITIAL_AMOUNT = INITIAL_FORM_DATA.amount;

export function Payments(): JSX.Element {
  const checkout = usePaymentIntent(INITIAL_AMOUNT);
  const [paymentFormInstance, setPaymentFormInstance] =
    createSignal<PaymentFormInstance | null>(null);
  const [isUpdatingOrder, setIsUpdatingOrder] = createSignal(false);
  const [amount, setAmount] = createSignal(INITIAL_AMOUNT);
  const [locale, setLocale] = createSignal<Locale>("en-US");
  const [appearance, setAppearance] = createSignal<Appearance>(lightThemeStyles);
  const [inputGrouping, setInputGrouping] =
    createSignal<CardInputGrouping>("spaced");

  async function handleAmountChange(newAmount: number) {
    const instance = paymentFormInstance();
    if (!instance) return;

    setIsUpdatingOrder(true);
    checkout.setError(null);

    try {
      const intent = await createPaymentIntent({
        ...INITIAL_FORM_DATA,
        amount: newAmount,
        currency: CURRENCY,
        publicKey: PUBLIC_KEY,
      });

      await instance.updateOrder({
        orderPayload: intent.payload,
        orderChecksum: intent.checksum,
      });

      setAmount(newAmount);
      checkout.setOrder(intent);
    } catch (err) {
      console.error("Failed to update amount:", err);
      checkout.setError("Failed to update amount. Please try again.");
    } finally {
      setIsUpdatingOrder(false);
    }
  }

  return (
    <SimpleExample
      title="Payment Form"
      description="Drop-in payment form with card, Apple Pay, and Google Pay. Use the controls to try locale, appearance, card layout, and updateOrder()."
      sdkMethod="XMoney.paymentForm()"
      integrationPath="src/components/xmoney-integrations/PaymentForm/PaymentForm.tsx"
      error={checkout.error()}
      onDismissError={() => checkout.setError(null)}
      transactionResult={checkout.transactionResult()}
      isLoading={checkout.isLoading()}
      loadingMessage="Initializing payment form..."
    >
      <Show when={checkout.order()}>
        <PaymentFormConfig
          paymentFormInstance={paymentFormInstance()}
          amount={amount()}
          onAmountChange={handleAmountChange}
          onAppearanceChange={(nextAppearance) => {
            setAppearance(nextAppearance);
            paymentFormInstance()?.updateAppearance(nextAppearance);
          }}
          onLocaleChange={(nextLocale) => {
            setLocale(nextLocale);
            paymentFormInstance()?.updateLocale(nextLocale);
          }}
          onInputGroupingChange={setInputGrouping}
          disabled={isUpdatingOrder()}
        />
        <SectionCard
          icon={<PaymentMethodCardIcon />}
          iconBg="bg-[var(--color-blue-100)]"
          headerBg="bg-gradient-to-r from-[var(--color-blue-50)] to-white"
          title="Payment Form"
          subtitle="Enter your payment details to complete the order"
        >
          <div
            class="border-t border-[color:var(--color-neutral-100)] pt-3 sm:pt-5"
            style={{
              opacity: isUpdatingOrder() ? "0.5" : "1",
              "pointer-events": isUpdatingOrder() ? "none" : "auto",
              transition: "opacity 0.2s",
            }}
          >
            <Show when={inputGrouping()} keyed>
              <XMoneyPaymentForm
                orderPayload={checkout.order()!.payload}
                orderChecksum={checkout.order()!.checksum}
                locale={locale()}
                appearance={appearance()}
                inputGrouping={inputGrouping()}
                onReady={setPaymentFormInstance}
                onPaymentComplete={checkout.handlePaymentComplete}
                onError={checkout.handlePaymentError}
              />
            </Show>
          </div>
        </SectionCard>
      </Show>
    </SimpleExample>
  );
}
