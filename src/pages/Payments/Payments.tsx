import { createSignal, onCleanup, onMount } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import "./Payments.css";

import { createPaymentIntent, getSessionToken } from "../../api";
import { PaymentForm } from "../../components/PaymentForm/PaymentForm";
import { XMoneyPaymentFormInstance } from "../../components/PaymentForm/payment-form.types";

import { CURRENCY, PUBLIC_KEY } from "../../constants";

import {
  darkThemeStyles,
  lightThemeStyles,
  customThemeStylesPurple,
  customThemeStylesGreen,
  customThemeStylesBlue,
} from "../../example/styles";
import { FormData, Locale, Theme } from "./payments.types";

const initialFormData: FormData = {
  firstName: "customer_firstName",
  lastName: "customer_lastName",
  email: "customer.email@xmoney.com",
  cardId: "",
};

export function Payments(): JSX.Element {
  let paymentFormInstance: XMoneyPaymentFormInstance | null = null;

  const [isLoading, setIsLoading] = createSignal(true);
  const [isUpdate, setIsUpdate] = createSignal(false);
  const [formData, setFormData] = createSignal<FormData>(initialFormData);
  const [locale, setLocale] = createSignal<Locale>("en-US");
  const [theme, setTheme] = createSignal<Theme>("light");
  const [sessionToken, setSessionToken] = createSignal<string>("");
  const [result, setResult] = createSignal<{
    payload: string;
    checksum: string;
  } | null>(null);

  let amount = 30;
  let debounceTimeout: number | null = null;

  onMount(async () => {
    const response = await getSessionToken();

    const paymentParams = {
      ...formData(),
      amount,
      currency: CURRENCY,
      publicKey: PUBLIC_KEY,
    };

    const intentResult = await createPaymentIntent(paymentParams);

    setSessionToken(response.data?.token);
    setResult(intentResult);
    setIsLoading(false);
  });

  onCleanup(() => {
    paymentFormInstance?.destroy?.();
    setFormData(initialFormData);
    setSessionToken("");
    setResult(null);
    paymentFormInstance = null;
  });

  function updateTheme(selected: Theme) {
    const appearanceMap: Record<Theme, any> = {
      light: lightThemeStyles,
      dark: darkThemeStyles,
      customGreen: customThemeStylesGreen,
      customBlue: customThemeStylesBlue,
      customPurpule: customThemeStylesPurple,
    };

    paymentFormInstance?.updateAppearance(appearanceMap[selected]);
  }

  async function updateAmount(newAmount: number) {
    if (debounceTimeout) clearTimeout(debounceTimeout);

    debounceTimeout = window.setTimeout(async () => {
      setIsUpdate(true);

      const paymentParams = {
        ...formData(),
        amount: newAmount,
        currency: CURRENCY,
        publicKey: PUBLIC_KEY,
      };

      const intent = await createPaymentIntent(paymentParams);
      paymentFormInstance?.updateOrder({
        orderPayload: intent.payload,
        orderChecksum: intent.checksum,
      });
      setResult(intent);

      setIsUpdate(false);
    }, 500);
  }

  return (
    <div class="v-payments">
      <div class="checkout-container">
        <div class="checkout-header">
          <div>
            <label>Locale </label>
            <select
              value={locale()}
              onChange={(e) => {
                const lang = e.currentTarget.value as Locale;
                setLocale(lang);
                paymentFormInstance?.updateLocale(lang);
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
            <label>Amount </label>
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
            <span>{CURRENCY}</span>
          </div>
        </div>

        <div
          style={{
            opacity: isUpdate() ? 0.5 : 1,
            "pointer-events": isUpdate() ? "none" : "auto",
            transition: "opacity 0.2s",
          }}
        >
          {!isLoading() && (
            <PaymentForm
              paymentFormInstanceRef={(instance) => {
                paymentFormInstance = instance;
              }}
              sessionToken={sessionToken()}
              result={result()}
              onClose={() => {
                document.querySelector(".checkout-header")?.remove();
              }}
            />
          )}
        </div>

        {isUpdate() && <div class="loading-overlay">Updating...</div>}
      </div>
    </div>
  );
}
