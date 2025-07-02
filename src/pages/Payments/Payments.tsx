import { createSignal, onCleanup, onMount } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import "./Payments.css";
import { createPaymentIntent } from "../../api";
import { PaymentForm } from "../../components/PaymentForm/PaymentForm";

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
    firstName: "customer_firstName",
    lastName: "customer_lastName",
    email: "customer.email@xmoney.com",
    cardName: "customer_cardName",
    cardId: "",
    saveCard: false,
  });

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
    <div class="v-payments">
      <div class={`checkout-container`}>
        {!isLoading() && (
          <PaymentForm
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
