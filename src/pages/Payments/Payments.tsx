import { createSignal, onCleanup, onMount } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import "./Payments.css";
import { createPaymentIntent } from "../../api";
import { PaymentForm } from "../../components/EmbededComponents/PaymentForm";

declare global {
  interface Window {
    XMoneySavedCards: any;
  }
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  cardName: string;
  cardId: string;
  saveCard: boolean;
}

const API_BASE = "http://localhost:3001";
const USER_ID = 61433;
const PUBLIC_KEY = "pk_test_8389";

export function Payments(): JSX.Element {
  let paymentFormInstance: any;

  const [isLoading, setIsLoading] = createSignal(true);
  const [formData, setFormData] = createSignal<FormData>({
    firstName: "Danut",
    lastName: "Ilie",
    email: "danut.ilie@xmoney.com",
    cardName: "Danut Ilie",
    cardId: "",
    saveCard: false,
  });

  const [sdkError, setSdkError] = createSignal<string>("");
  const [savedCards, setSavedCards] = createSignal<any[]>([]);
  const [result, setResult] = createSignal<any>(null);

  onMount(async () => {
    const { fetchSavedCards } = await import("../../api");
    const savedCards = await fetchSavedCards(USER_ID);
    const data = formData();

    const paymentParams = {
      ...data,
      amount: 30,
      currency: "EUR",
      publicKey: PUBLIC_KEY,
    };

    const result = await createPaymentIntent(API_BASE, paymentParams);

    setSavedCards(savedCards);
    setResult(result);
    setIsLoading(false);
  });

  onCleanup(() => {
    paymentFormInstance?.destroy?.();
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      cardName: "",
      cardId: "",
      saveCard: false,
    });
  });

  return (
    <div class="v-classic">
      <div class={`checkout-container`}>
        <h2>Payments</h2>
        {!isLoading() && (
          <PaymentForm
            sdkError={sdkError()}
            setSdkError={setSdkError}
            setIsLoading={setIsLoading}
            paymentFormInstanceRef={(instance: any) => {
              paymentFormInstance = instance;
            }}
            savedCards={savedCards()}
            result={result()}
          />
        )}
      </div>
    </div>
  );
}
