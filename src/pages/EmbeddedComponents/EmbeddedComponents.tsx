import { createSignal, onMount, Show } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { createPaymentIntent } from "../../api";
import { CURRENCY, INITIAL_FORM_DATA, PUBLIC_KEY } from "../../constants";
import type { TransactionDetails } from "../../types/checkout.types";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner/LoadingSpinner";
import { ErrorAlert } from "../../components/ui/ErrorAlert/ErrorAlert";
import { PaymentSuccessCard } from "../../components/ui/PaymentSuccessCard/PaymentSuccessCard";
import {
  SectionCard,
  PaymentMethodCardIcon,
} from "../../components/ui/SectionCard/SectionCard";
import { AccordionItem } from "../../components/ui/AccordionItem/AccordionItem";
import {
  CreditCardIcon,
  SavedCardIcon,
  GooglePayIcon,
  ApplePayIcon,
} from "../../components/ui/PaymentMethodIcons/PaymentMethodIcons";
import { PaymentCard } from "../../components/xmoney-integrations/PaymentCard/PaymentCard";
import { SavedCardPayment } from "../../components/xmoney-integrations/SavedCardPayment/SavedCardPayment";
import { GooglePay } from "../../components/xmoney-integrations/GooglePay/GooglePay";
import { ApplePay } from "../../components/xmoney-integrations/ApplePay/ApplePay";
import { SecureInfo } from "../../components/ui/SecureInfo/SecureInfo";

type PaymentMethod = "saved-card" | "card" | "google-pay" | "apple-pay";

export function EmbeddedComponents(): JSX.Element {
  const [intentResult, setIntentResult] = createSignal<{
    payload: string;
    checksum: string;
  } | null>(null);
  const [amount] = createSignal(30);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [paymentResult, setPaymentResult] =
    createSignal<TransactionDetails | null>(null);
  const [isGooglePaySupported, setIsGooglePaySupported] = createSignal(false);
  const [isApplePaySupported, setIsApplePaySupported] = createSignal(false);
  const [activeMethod, setActiveMethod] =
    createSignal<PaymentMethod>("saved-card");

  onMount(async () => {
    try {
      const supported = await window.XMoney.getPaymentMethodCapabilities();
      setIsGooglePaySupported(supported.googlePay.supported);
      setIsApplePaySupported(supported.applePay.supported);

      const intent = await createPaymentIntent({
        ...INITIAL_FORM_DATA,
        amount: amount(),
        currency: CURRENCY,
        publicKey: PUBLIC_KEY,
      });
      setIntentResult(intent);
    } catch (err) {
      console.error("Failed to initialize payment methods:", err);
      setError("Failed to load payment methods. Please refresh and try again.");
    } finally {
      setIsLoading(false);
    }
  });

  function handlePaymentComplete(data: TransactionDetails) {
    setPaymentResult(data);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handlePaymentError(err: unknown) {
    console.error("Payment error:", err);
    setError(
      "Payment processing failed. Please try a different method or try again.",
    );
  }

  return (
    <div class="min-h-screen">
      <div class="max-w-xl mx-auto px-6">
        <Show when={error()}>
          <ErrorAlert
            title="Payment Error"
            message={error()!}
            onDismiss={() => setError(null)}
            variant="banner"
          />
        </Show>

        <Show when={paymentResult()}>
          <PaymentSuccessCard result={paymentResult()!} />
        </Show>
      </div>

      <Show when={isLoading()}>
        <div class="max-w-xl mx-auto px-6 py-12">
          <LoadingSpinner size="lg" message="Loading payment methods..." />
        </div>
      </Show>

      <Show when={!isLoading() && !paymentResult() && intentResult()}>
        <div class="max-w-xl mx-auto px-6 pb-12 mt-6">
          {/* Amount display */}
          <div class="mb-6 flex items-center justify-between p-4 rounded-2xl bg-white border border-[var(--color-neutral-100)] shadow-[0_4px_24px_rgba(22,20,26,0.06)]">
            <span class="text-sm text-[var(--color-neutral-500)]">
              Total Amount
            </span>
            <span class="text-xl font-bold text-[var(--color-neutral-900)]">
              {amount().toFixed(2)} {CURRENCY}
            </span>
          </div>

          <SectionCard
            icon={<PaymentMethodCardIcon />}
            iconBg="bg-[var(--color-blue-100)]"
            headerBg="bg-gradient-to-r from-[var(--color-blue-50)] to-white"
            title="Payment Method"
            subtitle="Choose how you'd like to pay"
          >
            <div class="p-5 flex flex-col gap-3">
              <AccordionItem
                id="saved-card"
                title="Saved Cards"
                subtitle="Pay with a previously saved card"
                icon={<SavedCardIcon />}
                isOpen={activeMethod() === "saved-card"}
                onToggle={() => setActiveMethod("saved-card")}
              >
                <SavedCardPayment
                  payload={intentResult()!.payload}
                  checksum={intentResult()!.checksum}
                  onPaymentComplete={handlePaymentComplete}
                  onError={handlePaymentError}
                />
              </AccordionItem>

              <AccordionItem
                id="card"
                title="Credit / Debit Card"
                subtitle="Visa, Mastercard, Maestro"
                icon={<CreditCardIcon />}
                isOpen={activeMethod() === "card"}
                onToggle={() => setActiveMethod("card")}
              >
                <PaymentCard
                  payload={intentResult()!.payload}
                  checksum={intentResult()!.checksum}
                  onPaymentComplete={handlePaymentComplete}
                  onError={handlePaymentError}
                />
              </AccordionItem>

              <Show when={isGooglePaySupported()}>
                <AccordionItem
                  id="google-pay"
                  title="Google Pay"
                  subtitle="Fast checkout with Google"
                  icon={<GooglePayIcon />}
                  isOpen={activeMethod() === "google-pay"}
                  onToggle={() => setActiveMethod("google-pay")}
                >
                  <GooglePay
                    payload={intentResult()!.payload}
                    checksum={intentResult()!.checksum}
                    onPaymentComplete={handlePaymentComplete}
                    onError={handlePaymentError}
                  />
                </AccordionItem>
              </Show>

              <Show when={isApplePaySupported()}>
                <AccordionItem
                  id="apple-pay"
                  title="Apple Pay"
                  subtitle="Secure payment with Apple"
                  icon={<ApplePayIcon />}
                  isOpen={activeMethod() === "apple-pay"}
                  onToggle={() => setActiveMethod("apple-pay")}
                >
                  <ApplePay
                    payload={intentResult()!.payload}
                    checksum={intentResult()!.checksum}
                    onPaymentComplete={handlePaymentComplete}
                    onError={handlePaymentError}
                  />
                </AccordionItem>
              </Show>
            </div>
          </SectionCard>

          <SecureInfo />
        </div>
      </Show>
    </div>
  );
}
