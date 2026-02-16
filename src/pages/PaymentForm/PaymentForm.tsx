import { createSignal, onMount, Show } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

import { createPaymentIntent } from "../../api";
import { XMoneyPaymentForm } from "../../components/xmoney-integrations/PaymentForm/PaymentForm";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner/LoadingSpinner";
import { ErrorAlert } from "../../components/ui/ErrorAlert/ErrorAlert";
import { PageContainer } from "../../components/ui/PageContainer/PageContainer";
import { TransactionResult } from "../../components/ui/TransactionResult/TransactionResult";

import { CURRENCY, PUBLIC_KEY } from "../../constants";

import { CustomerInformation } from "./payments.types";
import { XMoneyPaymentFormInstance } from "../../types/xmoney-sdk/payment-form-sdk.types";
import { TransactionDetails } from "../../types/checkout.types";
import { PaymentFormConfig } from "./components/PaymentFormConfig/PaymentFormConfig";

const initialFormData: CustomerInformation = {
  firstName: "customer_firstName",
  lastName: "customer_lastName",
  email: "customer.email@xmoney.com",
};

const INITIAL_AMOUNT = 30;

export function Payments(): JSX.Element {
  const [paymentFormInstance, setPaymentFormInstance] =
    createSignal<XMoneyPaymentFormInstance | null>(null);
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

      instance.updateOrder({
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

  function handleRetry() {
    setTransactionResult(null);
    window.location.reload();
  }

  onMount(() => {
    initializePayment();
  });

  return (
    <PageContainer>
      <Show when={transactionResult()}>
        <TransactionResult
          result={transactionResult()!}
          onRetry={handleRetry}
        />
      </Show>

      <Show when={error()}>
        <ErrorAlert
          title="Error"
          message={error()!}
          onDismiss={() => setError(null)}
          variant="banner"
        />
      </Show>

      <Show when={isInitializing()}>
        <LoadingSpinner size="lg" message="Initializing payment form..." />
      </Show>

      <Show when={!isInitializing() && !transactionResult() && order()}>
        <div class="max-w-2xl mx-auto p-6 rounded-2xl border bg-white shadow-[0_18px_40px_rgba(22,20,26,0.08)] border-[color:var(--color-neutral-100)]">
          <PaymentFormConfig
            paymentFormInstance={paymentFormInstance()}
            amount={amount()}
            onAmountChange={handleAmountChange}
            onAppearanceChange={(appearance) =>
              paymentFormInstance()?.updateAppearance(appearance)
            }
            onLocaleChange={(locale) =>
              paymentFormInstance()?.updateLocale(locale)
            }
            disabled={isUpdatingOrder()}
          />

          <div
            class="pt-6 mt-6 border-t border-[color:var(--color-neutral-100)]"
            style={{
              opacity: isUpdatingOrder() ? "0.5" : "1",
              "pointer-events": isUpdatingOrder() ? "none" : "auto",
              transition: "opacity 0.2s",
            }}
          >
            <XMoneyPaymentForm
              orderPayload={order()!.payload}
              orderChecksum={order()!.checksum}
              onReady={setPaymentFormInstance}
              onPaymentComplete={handlePaymentComplete}
              onError={(err) => setError(String(err))}
            />
          </div>
        </div>
      </Show>
    </PageContainer>
  );
}
