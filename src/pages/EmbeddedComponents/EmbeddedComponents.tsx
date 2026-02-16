import { createSignal, onMount, Show } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import {
  Accordion,
  AccordionItem,
} from "../../components/ui/Accordion/Accordion";
import { GooglePay } from "../../components/xmoney-integrations/GooglePay/GooglePay";
import { ApplePay } from "../../components/xmoney-integrations/ApplePay/ApplePay";
import { createPaymentIntent } from "../../api";
import { CURRENCY, INITIAL_FORM_DATA, PUBLIC_KEY } from "../../constants";
import { CardElements } from "../../components/xmoney-integrations/CardElements/CardElements";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner/LoadingSpinner";
import { ErrorAlert } from "../../components/ui/ErrorAlert/ErrorAlert";
import { PageContainer } from "../../components/ui/PageContainer/PageContainer";
import { SavedCardPayment } from "../../components/xmoney-integrations/SavedCardPayment/SavedCardPayment";
import applePayBadge from "../../assets/apple-pay.png";
import googlePayBadge from "../../assets/google-pay.png";
import savedCardBadge from "../../assets/saved-card.png";
import creditDebitBadge from "../../assets/credit-debit-card.png";

export function EmbeddedComponents(): JSX.Element {
  const [result, setResult] = createSignal<{
    payload: string;
    checksum: string;
  } | null>(null);
  const [amount] = createSignal(30);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [paymentResult, setPaymentResult] = createSignal<any>(null);
  const [isGooglePaySupported, setIsGooglePaySupported] = createSignal(false);
  const [isApplePaySupported, setIsApplePaySupported] = createSignal(false);

  onMount(async () => {
    try {
      const supportedMethods =
        await window.XMoney.getPaymentMethodCapabilities();
      console.log("Supported payment methods:", supportedMethods);
      setIsGooglePaySupported(supportedMethods.googlePay.supported);
      setIsApplePaySupported(supportedMethods.applePay.supported);

      const paymentParams = {
        ...INITIAL_FORM_DATA,
        amount: amount(),
        currency: CURRENCY,
        publicKey: PUBLIC_KEY,
      };

      const intentResult = await createPaymentIntent(paymentParams);

      setResult(intentResult);
      setError(null);
    } catch (err) {
      console.error("Failed to initialize payment methods:", err);
      setError("Failed to load payment methods. Please refresh and try again.");
    } finally {
      setIsLoading(false);
    }
  });

  function handlePaymentComplete(paymentData: any) {
    console.log("Payment completed:", paymentData);
    setPaymentResult(paymentData);
    setError(null);
  }

  function handlePaymentError(error: any) {
    console.error("Payment error:", error);
    setError(
      "Payment processing failed. Please try a different method or try again.",
    );
  }

  return (
    <PageContainer>
      <div class="w-full max-w-3xl mx-auto px-4 md:px-0">
        <Show when={error()}>
          <ErrorAlert
            title="Payment Error"
            message={error()!}
            onDismiss={() => setError(null)}
            variant="banner"
          />
        </Show>

        <div class="inline-flex items-center gap-3 py-3 px-5 rounded-full mb-8 w-full md:w-auto justify-center md:justify-start ">
          <span class="text-sm opacity-90">Total Amount</span>
          <span class="text-xl font-bold">
            {amount().toFixed(2)} {CURRENCY}
          </span>
        </div>

        <Show when={paymentResult()}>
          <div class="flex items-center bg-green-500/80 md:flex-row flex-col gap-4 py-5 px-6 rounded-xl mb-8 shadow-md text-center md:text-left animate-[slideInDown_0.35s_ease] text-white">
            <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
              ✓
            </div>
            <div>
              <h3 class="m-0 mb-1 text-lg font-semibold">
                Payment Successful!
              </h3>
              <p class="m-0 text-sm opacity-95 leading-relaxed">
                Your payment of {paymentResult().amount}{" "}
                {paymentResult().currency} via {paymentResult().method} was
                processed successfully.
              </p>
            </div>
          </div>
        </Show>

        <Show when={isLoading()}>
          <LoadingSpinner size="lg" message="Loading payment methods..." />
        </Show>

        <Show when={!isLoading() && result()}>
          <div class="mb-12">
            <Accordion defaultIndex={0}>
              <AccordionItem
                title="Saved Cards"
                subtitle="Pay securely with your saved card"
                icon={
                  <img
                    src={savedCardBadge}
                    alt="Saved card"
                    class="h-7 w-9 object-contain"
                  />
                }
                index={0}
              >
                <SavedCardPayment
                  payload={result()!.payload}
                  checksum={result()!.checksum}
                  onPaymentComplete={handlePaymentComplete}
                  onError={handlePaymentError}
                />
              </AccordionItem>
              <AccordionItem
                title="Credit/Debit Card"
                subtitle="Pay securely with your card"
                icon={
                  <img
                    src={creditDebitBadge}
                    alt="Credit or debit card"
                    class="h-7 w-9 object-contain"
                  />
                }
                index={1}
              >
                <CardElements
                  payload={result()!.payload}
                  checksum={result()!.checksum}
                  onPaymentComplete={handlePaymentComplete}
                  onError={handlePaymentError}
                />
              </AccordionItem>

              {isGooglePaySupported() && (
                <AccordionItem
                  title="Google Pay"
                  subtitle="Fast checkout with Google"
                  icon={
                    <img
                      src={googlePayBadge}
                      alt="Google Pay"
                      class="h-10 w-14 object-contain"
                    />
                  }
                  index={3}
                >
                  {result() && (
                    <GooglePay
                      payload={result()!.payload}
                      checksum={result()!.checksum}
                      onPaymentComplete={handlePaymentComplete}
                      onError={handlePaymentError}
                    />
                  )}
                </AccordionItem>
              )}

              {isApplePaySupported() && (
                <AccordionItem
                  title="Apple Pay"
                  subtitle="Secure payment with Apple"
                  icon={
                    <img
                      src={applePayBadge}
                      alt="Apple Pay"
                      class="h-10 w-14 object-contain"
                    />
                  }
                  index={4}
                >
                  {result() && (
                    <ApplePay
                      payload={result()!.payload}
                      checksum={result()!.checksum}
                      onPaymentComplete={handlePaymentComplete}
                      onError={handlePaymentError}
                    />
                  )}
                </AccordionItem>
              )}
            </Accordion>
          </div>
        </Show>
      </div>
    </PageContainer>
  );
}
