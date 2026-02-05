import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import "./Payments.css";

import { createPaymentIntent, getSessionToken } from "../../api";
import { PaymentForm } from "../../components/PaymentForm/PaymentForm";
import {
  LoadingSpinner,
  LoadingOverlay,
} from "../../components/LoadingSpinner/LoadingSpinner";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import { PageContainer } from "../../components/PageContainer/PageContainer";

import { CURRENCY, PUBLIC_KEY } from "../../constants";

import {
  darkThemeStyles,
  lightThemeStyles,
  customThemeStylesPurple,
  customThemeStylesGreen,
  customThemeStylesBlue,
} from "../../example/styles";
import { FormData, Locale, Theme } from "./payments.types";
import { XMoneyPaymentFormInstance } from "../../types/xmoney-sdk/payment-form-sdk.types";

const initialFormData: FormData = {
  firstName: "customer_firstName",
  lastName: "customer_lastName",
  email: "customer.email@xmoney.com",
  cardId: "",
};

export function Payments(): JSX.Element {
  const [paymentFormInstance, setPaymentFormInstance] =
    createSignal<XMoneyPaymentFormInstance | null>(null);

  const [isLoading, setIsLoading] = createSignal(true);
  const [isUpdate, setIsUpdate] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [formData, setFormData] = createSignal<FormData>(initialFormData);
  const [locale, setLocale] = createSignal<Locale>("en-US");
  const [theme, setTheme] = createSignal<Theme>("light");
  const [paymentResult, setPaymentResult] = createSignal<any>(null);
  const [result, setResult] = createSignal<{
    payload: string;
    checksum: string;
  } | null>(null);

  let amount = 30;
  let debounceTimeout: number | null = null;

  onMount(async () => {
    try {
      const paymentParams = {
        ...formData(),
        amount,
        currency: CURRENCY,
        publicKey: PUBLIC_KEY,
      };

      const intentResult = await createPaymentIntent(paymentParams);

      setResult(intentResult);
      setError(null);
    } catch (err) {
      console.error("Failed to create payment intent:", err);
      setError("Failed to initialize payment. Please refresh and try again.");
    } finally {
      setIsLoading(false);
    }
  });

  onCleanup(() => {
    const instance = paymentFormInstance();
    if (instance) {
      instance.destroy();
    }
    setPaymentFormInstance(null);
    setFormData(initialFormData);
    setResult(null);
  });

  function updateTheme(selected: Theme) {
    const appearanceMap: Record<Theme, any> = {
      light: lightThemeStyles,
      dark: darkThemeStyles,
      customGreen: customThemeStylesGreen,
      customBlue: customThemeStylesBlue,
      customPurpule: customThemeStylesPurple,
    };

    const instance = paymentFormInstance();
    instance?.updateAppearance(appearanceMap[selected]);
  }

  function handlePaymentComplete(paymentData: any) {
    console.log("Payment completed:", paymentData);
    setPaymentResult(paymentData);

    // Show success message
    setTimeout(() => {
      alert(
        `Payment successful!\nMethod: ${paymentData.method}\nAmount: ${paymentData.amount} ${paymentData.currency}`,
      );
    }, 300);
  }

  function handlePaymentError(error: any) {
    console.error("Payment error:", error);
    alert("Payment failed. Please try again.");
  }

  async function updateAmount(newAmount: number) {
    if (debounceTimeout) clearTimeout(debounceTimeout);

    debounceTimeout = window.setTimeout(async () => {
      setIsUpdate(true);
      setError(null);

      try {
        const paymentParams = {
          ...formData(),
          amount: newAmount,
          currency: CURRENCY,
          publicKey: PUBLIC_KEY,
        };

        const intent = await createPaymentIntent(paymentParams);
        const instance = paymentFormInstance();
        instance?.updateOrder({
          orderPayload: intent.payload,
          orderChecksum: intent.checksum,
        });

        setResult(intent);
      } catch (err) {
        console.error("Failed to update amount:", err);
        setError("Failed to update amount. Please try again.");
      } finally {
        setIsUpdate(false);
      }
    }, 500);
  }

  return (
    <PageContainer>
      <div class="v-payments">
        <Show when={error()} fallback={null}>
          <ErrorAlert
            title="Error"
            message={error()!}
            onDismiss={() => setError(null)}
            variant="banner"
          />
        </Show>

        <Show when={isLoading()}>
          <LoadingSpinner size="large" message="Initializing payment form..." />
        </Show>

        <Show when={!isLoading() && result()}>
          <div class="checkout-container">
            <div class="checkout-header">
              <div>
                <label>Locale </label>
                <select
                  value={locale()}
                  onChange={(e) => {
                    const lang = e.currentTarget.value as Locale;
                    setLocale(lang);
                    const instance = paymentFormInstance();
                    instance?.updateLocale(lang);
                  }}
                >
                  <option value="en-US">English</option>
                  <option value="ro-RO">Romanian</option>
                  <option value="el-GR">Greek</option>
                </select>
              </div>

              <div>
                <label>Theme </label>
                <select
                  value={theme()}
                  onChange={(e) => {
                    const selected = e.currentTarget.value as Theme;
                    setTheme(selected);
                    updateTheme(selected);
                  }}
                >
                  <option value="light">Light (Default)</option>
                  <option value="dark">Dark</option>
                  <option value="customGreen">Custom Green</option>
                  <option value="customBlue">Custom Blue</option>
                  <option value="customPurpule">Custom Purple</option>
                </select>
              </div>

              <div>
                <label>Amount ({CURRENCY}) </label>
                <input
                  type="number"
                  min={1}
                  value={amount}
                  onInput={(e) => {
                    amount = Number(e.currentTarget.value);
                    updateAmount(amount);
                  }}
                  style={{ width: "80px" }}
                />
              </div>
            </div>

            <div
              style={{
                opacity: isUpdate() ? 0.5 : 1,
                "pointer-events": isUpdate() ? "none" : "auto",
                transition: "opacity 0.2s",
                position: "relative",
              }}
            >
              <PaymentForm
                paymentFormInstanceRef={(instance) => {
                  setPaymentFormInstance(instance);
                }}
                result={result()!}
                onClose={() => {
                  document.querySelector(".checkout-header")?.remove();
                }}
              />
              {isUpdate() && (
                <LoadingOverlay size="medium" message="Updating..." />
              )}
            </div>
          </div>
        </Show>
      </div>
    </PageContainer>
  );
}
