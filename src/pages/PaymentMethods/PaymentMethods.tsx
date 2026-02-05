import { createSignal, onMount, Show } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import "./PaymentMethods.css";
import { Accordion, AccordionItem } from "../../components/Accordion/Accordion";
import { GooglePay } from "../../components/GooglePay/GooglePay";
import { ApplePay } from "../../components/ApplePay/ApplePay";
import { createPaymentIntent } from "../../api";
import { CURRENCY, INITIAL_FORM_DATA, PUBLIC_KEY } from "../../constants";
import { CardElements } from "../../components/CardElements/CardElements";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import { PageContainer } from "../../components/PageContainer/PageContainer";

export function PaymentMethods(): JSX.Element {
  const [result, setResult] = createSignal<{
    payload: string;
    checksum: string;
  } | null>(null);
  const [amount] = createSignal(30);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [paymentResult, setPaymentResult] = createSignal<any>(null);

  onMount(async () => {
    try {
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
      <div class="payment-methods-page">
        <Show when={error()}>
          <ErrorAlert
            title="Payment Error"
            message={error()!}
            onDismiss={() => setError(null)}
            variant="banner"
          />
        </Show>

        <div class="payment-amount-card">
          <span class="amount-label">Total Amount:</span>
          <span class="amount-value">
            {amount().toFixed(2)} {CURRENCY}
          </span>
        </div>

        <Show when={paymentResult()}>
          <div class="payment-success-banner">
            <div class="success-icon">✓</div>
            <div class="success-content">
              <h3>Payment Successful!</h3>
              <p>
                Your payment of {paymentResult().amount}{" "}
                {paymentResult().currency} via {paymentResult().method} was
                processed successfully.
              </p>
            </div>
          </div>
        </Show>

        <Show when={isLoading()}>
          <LoadingSpinner size="large" message="Loading payment methods..." />
        </Show>

        <Show when={!isLoading() && result()}>
          <div class="payment-methods-container">
            <Accordion defaultIndex={0}>
              <AccordionItem
                title="Credit/Debit Card"
                subtitle="Pay securely with your card"
                icon="💳"
                index={0}
              >
                <CardElements
                  result={result()!}
                  onClose={() => console.log("Payment form closed")}
                />
              </AccordionItem>

              <AccordionItem
                title="Google Pay"
                subtitle="Fast checkout with Google"
                icon="🌐"
                index={1}
              >
                {result() && (
                  <GooglePay
                    amount={amount()}
                    currency={CURRENCY}
                    payload={result()!.payload}
                    checksum={result()!.checksum}
                    onPaymentComplete={handlePaymentComplete}
                    onError={handlePaymentError}
                  />
                )}
              </AccordionItem>

              <AccordionItem
                title="Apple Pay"
                subtitle="Secure payment with Apple"
                icon="🍎"
                index={2}
              >
                {result() && (
                  <ApplePay
                    amount={amount()}
                    currency={CURRENCY}
                    payload={result()!.payload}
                    checksum={result()!.checksum}
                    onPaymentComplete={handlePaymentComplete}
                    onError={handlePaymentError}
                  />
                )}
              </AccordionItem>
            </Accordion>
          </div>
        </Show>

        <div class="payment-footer">
          <div class="security-badge">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Secured by xMoney</span>
          </div>
          <p class="footer-text">
            All transactions are encrypted and secure. Your payment information
            is never stored.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
