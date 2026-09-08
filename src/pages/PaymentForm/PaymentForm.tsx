import { createSignal, onMount, Show } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

import { createPaymentIntent } from "../../api";
import { XMoneyPaymentForm } from "../../components/xmoney-integrations/PaymentForm/PaymentForm";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner/LoadingSpinner";
import { ErrorAlert } from "../../components/ui/ErrorAlert/ErrorAlert";
import {
  SectionCard,
  PaymentMethodCardIcon,
} from "../../components/ui/SectionCard/SectionCard";

import { CURRENCY } from "../../constants";
import { PUBLIC_KEY } from "../../config";

import { CustomerInformation } from "./payments.types";
import { PaymentFormInstance } from "../../types/xmoney-sdk/payment-form-sdk.types";
import {
  Appearance,
  CardInputGrouping,
  Locale,
} from "../../types/xmoney-sdk/sdk-base.types";
import { TransactionDetails } from "../../types/checkout.types";
import { PaymentFormConfig } from "./components/PaymentFormConfig/PaymentFormConfig";
import { PaymentSuccessCard } from "../../components/ui/PaymentSuccessCard/PaymentSuccessCard";
import { SecureInfo } from "../../components/ui/SecureInfo/SecureInfo";
import { lightThemeStyles } from "../../example/styles";

const initialFormData: CustomerInformation = {
  firstName: "customer_firstName",
  lastName: "customer_lastName",
  email: "customer.email@xmoney.com",
};

const INITIAL_AMOUNT = 30;

export function Payments(): JSX.Element {
  const [paymentFormInstance, setPaymentFormInstance] =
    createSignal<PaymentFormInstance | null>(null);
  const [isInitializing, setIsInitializing] = createSignal(true);
  const [isUpdatingOrder, setIsUpdatingOrder] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [formData] = createSignal<CustomerInformation>(initialFormData);
  const [amount, setAmount] = createSignal(INITIAL_AMOUNT);
  const [order, setOrder] = createSignal<{
    payload: string;
    checksum: string;
  } | null>(null);
  const [transactionResult, setTransactionResult] =
    createSignal<TransactionDetails | null>(null);
  const [locale, setLocale] = createSignal<Locale>("en-US");
  const [appearance, setAppearance] = createSignal<Appearance>(lightThemeStyles);
  const [inputGrouping, setInputGrouping] =
    createSignal<CardInputGrouping>("spaced");

  async function initializePayment() {
    try {
      setError(null);
      const paymentParams = {
        ...formData(),
        amount: amount(),
        currency: CURRENCY,
        publicKey: PUBLIC_KEY,
      };

      const intentResult = await createPaymentIntent(paymentParams);
      setOrder(intentResult);
    } catch (err) {
      console.error("Failed to create payment intent:", err);
      setError("Failed to initialize payment. Please refresh and try again.");
    } finally {
      setIsInitializing(false);
    }
  }

  async function handleAmountChange(newAmount: number) {
    const instance = paymentFormInstance();
    if (!instance) return;

    setIsUpdatingOrder(true);
    setError(null);

    try {
      const paymentParams = {
        ...formData(),
        amount: newAmount,
        currency: CURRENCY,
        publicKey: PUBLIC_KEY,
      };

      const intent = await createPaymentIntent(paymentParams);

      await instance.updateOrder({
        orderPayload: intent.payload,
        orderChecksum: intent.checksum,
      });

      setAmount(newAmount);
      setOrder(intent);
    } catch (err) {
      console.error("Failed to update amount:", err);
      setError("Failed to update amount. Please try again.");
    } finally {
      setIsUpdatingOrder(false);
    }
  }

  function handlePaymentComplete(result: TransactionDetails) {
    setTransactionResult(result);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  onMount(() => {
    initializePayment();
  });

  return (
    <div class="min-h-screen">
      <div class="max-w-2xl mx-auto px-6">
        <Show when={transactionResult()}>
          <PaymentSuccessCard result={transactionResult()!} />
        </Show>

        <Show when={error()}>
          <ErrorAlert
            title="Error"
            message={error()!}
            onDismiss={() => setError(null)}
            variant="banner"
          />
        </Show>
      </div>

      <Show when={isInitializing()}>
        <div class="max-w-2xl mx-auto px-6 py-12">
          <LoadingSpinner size="lg" message="Initializing payment form..." />
        </div>
      </Show>

      <Show when={!isInitializing() && !transactionResult() && order()}>
        <div class="max-w-2xl mx-auto px-6 pb-12 mt-6">
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
              class="border-t border-[color:var(--color-neutral-100)] pt-5"
              style={{
                opacity: isUpdatingOrder() ? "0.5" : "1",
                "pointer-events": isUpdatingOrder() ? "none" : "auto",
                transition: "opacity 0.2s",
              }}
            >
              <Show when={inputGrouping()} keyed>
                <XMoneyPaymentForm
                  orderPayload={order()!.payload}
                  orderChecksum={order()!.checksum}
                  locale={locale()}
                  appearance={appearance()}
                  inputGrouping={inputGrouping()}
                  onReady={setPaymentFormInstance}
                  onPaymentComplete={handlePaymentComplete}
                  onError={(err) => setError(String(err))}
                />
              </Show>
            </div>
          </SectionCard>
          <SecureInfo />
        </div>
      </Show>
    </div>
  );
}
