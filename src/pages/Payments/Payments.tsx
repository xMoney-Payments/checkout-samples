import { createSignal, onCleanup, onMount } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import "./Payments.css";
import { PersonalInfo } from "../../components/PersonalInfo/PersonalInfo";
import { createPaymentIntent } from "../../api";
import { classicCheckoutStyles } from "../../example/styles";
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
  let checkoutInstance: any;
  let savedCardsInstance: any;

  const [showOtherCard, setShowOtherCard] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [formData, setFormData] = createSignal<FormData>({
    firstName: "Danut",
    lastName: "Ilie",
    email: "danut.ilie@xmoney.com",
    cardName: "Danut Ilie",
    cardId: "",
    saveCard: false,
  });

  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [sdkError, setSdkError] = createSignal<string>("");
  const [savedCards, setSavedCards] = createSignal<any[]>([]);
  const [result, setResult] = createSignal<any>(null);

  const validateField = (field: keyof FormData, message: string): boolean => {
    const value = formData()[field]?.toString().trim();
    if (!value) {
      setErrors((prev) => ({ ...prev, [field]: message }));
      return false;
    }
    setErrors((prev) => ({ ...prev, [field]: "" }));
    return true;
  };

  const validateSdk = (message: string | null): boolean => {
    if (message) {
      setSdkError(message);
      return false;
    }
    setSdkError("");
    return true;
  };

  function validateForm(data: FormData): boolean {
    const isFirstNameValid = validateField(
      "firstName",
      "First name is required"
    );
    const isLastNameValid = validateField("lastName", "Last name is required");
    const isEmailValid = validateField("email", "Valid email is required");

    let isCardNameValid = true;
    let isSdkValid = true;

    if (!data.cardId) {
      isCardNameValid = validateField(
        "cardName",
        "Cardholder name is required"
      );

      const { cardNumberError, expDateError, cvvError } =
        checkoutInstance?.validate?.(true) ?? {};

      isSdkValid = validateSdk(cardNumberError || expDateError || cvvError);
    }

    return (
      isFirstNameValid &&
      isLastNameValid &&
      isEmailValid &&
      isCardNameValid &&
      isSdkValid
    );
  }

  async function submitSelectedPayment({
    usingSavedCard,
    base64Checksum,
    base64Json,
    cardHolderName,
  }: {
    usingSavedCard: boolean;
    base64Json: string;
    base64Checksum: string;
    cardHolderName?: string;
  }) {
    if (usingSavedCard) {
      await savedCardsInstance?.submitPayment?.({ base64Json, base64Checksum });
    } else {
      await checkoutInstance?.submitPayment?.({
        base64Json,
        base64Checksum,
        cardHolderName,
      });
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const data = formData();

    if (!validateForm(data)) {
      setIsSubmitting(false);
      return;
    }

    try {
      const paymentParams = {
        ...data,
        amount: 30,
        currency: "EUR",
        publicKey: PUBLIC_KEY,
      };
      const result = await createPaymentIntent(API_BASE, paymentParams);

      await submitSelectedPayment({
        usingSavedCard: Boolean(data.cardId),
        base64Json: result.payload,
        base64Checksum: result.checksum,
        cardHolderName: data.cardName,
      });
    } catch (err) {
      console.error("❌ Payment submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

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

    checkoutInstance = new window.XMoneyPaymentForm({
      container: "payment-widget",
      elementsOptions: { appearance: classicCheckoutStyles },
      onError: (err: any) => console.error("❌ Payment error", err),
      savedCards: savedCards.data,
      checksum: result.checksum,
      json: result.payload,
    });

    setSavedCards(savedCards);
    setResult(result);
    console.log({ savedCards, result });
  });

  onCleanup(() => {
    savedCardsInstance?.destroy?.();
    checkoutInstance?.destroy?.();
  });

  return (
    <div class="v-classic">
      <div class={`checkout-container`}>
        <h2>Payments</h2>
        <form id="checkout-form">
          {showOtherCard() && !formData().cardId && (
            <>
              <label>
                <span class="label-text">Cardholder Name</span>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  placeholder="Cardholder Name"
                  value={formData().cardName}
                  onInput={(e) =>
                    setFormData({
                      ...formData(),
                      cardName: (e.target as HTMLInputElement).value,
                    })
                  }
                />
                <span class="error-text">{errors().cardName}</span>
              </label>

              <PaymentForm
                sdkError={sdkError()}
                setSdkError={setSdkError}
                setIsLoading={setIsLoading}
                checkoutInstanceRef={(instance: any) => {
                  checkoutInstance = instance;
                }}
                savedCards={savedCards()}
                result={result()}
              />

              <label class="checkbox-label">
                <input
                  type="checkbox"
                  id="saveCard"
                  name="saveCard"
                  checked={formData().saveCard}
                  onInput={(e) =>
                    setFormData({
                      ...formData(),
                      saveCard: (e.target as HTMLInputElement).checked,
                    })
                  }
                />
                <span>Save card</span>
              </label>
            </>
          )}

          <div id="payment-widget"></div>

          {/* <span class="total">Total: 3954 EUR</span>
          <button
            type="button"
            class="pay-button"
            onClick={handleSubmit}
            disabled={isSubmitting()}
          >
            {isSubmitting() ? "Processing..." : "Pay Now"}
          </button> */}
        </form>
      </div>
    </div>
  );
}
