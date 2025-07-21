import { createSignal } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import "./Checkout.css";
import { PersonalInfo } from "../../components/PersonalInfo/PersonalInfo";
import { XMoneyCheckoutWidget } from "../../components/EmbededComponents/EmbededComponents";
import { SavedCards } from "../../components/SavedCards/SavedCards";
import { createPaymentIntent } from "../../api";
import { API_BASE, PUBLIC_KEY, USER_ID } from "../../constants";

declare global {
  interface Window {
    XMoneySavedCards: any;
  }
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  cardId: string;
  saveCard: boolean;
}

interface Card {
  id: string;
}

export default function Checkout(): JSX.Element {
  let checkoutInstance: any;
  let savedCardsInstance: any;

  const [showOtherCard, setShowOtherCard] = createSignal<boolean>(false);
  const [isSubmitting, setIsSubmitting] = createSignal<boolean>(false);
  const [formData, setFormData] = createSignal<FormData>({
    firstName: "customer_firstName",
    lastName: "customer_lastName",
    email: "customer.email@xmoney.com",
    cardId: "",
    saveCard: false,
  });

  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [sdkError, setSdkError] = createSignal<string>("");

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

    let isSdkValid = true;

    if (!data.cardId) {
      const { cardNumberError, expDateError, cvvError } =
        checkoutInstance?.validate?.(true) ?? {};

      isSdkValid = validateSdk(cardNumberError || expDateError || cvvError);
    }

    return isFirstNameValid && isLastNameValid && isEmailValid && isSdkValid;
  }

  async function submitSelectedPayment({
    usingSavedCard,
    payload,
    checksum,
  }: {
    usingSavedCard: boolean;
    payload: string;
    checksum: string;
  }) {
    if (usingSavedCard) {
      await savedCardsInstance?.submitPayment?.({ payload, checksum });
    } else {
      await checkoutInstance?.submitPayment?.({
        payload,
        checksum,
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
        payload: result.payload,
        checksum: result.checksum,
      });
    } catch (err) {
      console.error("❌ Payment submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div class="v-classic">
      <div class={`checkout-container`}>
        <h2>Embedded Components</h2>
        <form id="checkout-form">
          <PersonalInfo
            personalInfo={{
              firstName: formData().firstName,
              lastName: formData().lastName,
              email: formData().email,
            }}
            errors={errors()}
            setFormData={(fields) =>
              setFormData((formDataValues) => ({
                ...formDataValues,
                ...fields,
              }))
            }
          />

          <h3>Credit / Debit Card</h3>
          <SavedCards
            userId={USER_ID}
            publicKey={PUBLIC_KEY}
            onCardSelect={(card: Card) => {
              setFormData({ ...formData(), cardId: card.id });
            }}
            onOtherCardSelect={() => {
              setFormData({ ...formData(), cardId: "" });
              setShowOtherCard(true);
            }}
            savedCardsInstanceRef={(instance: any) => {
              savedCardsInstance = instance;
            }}
          />

          {showOtherCard() && !formData().cardId && (
            <>
              <XMoneyCheckoutWidget
                sdkError={sdkError()}
                setSdkError={setSdkError}
                checkoutInstanceRef={(instance: any) => {
                  checkoutInstance = instance;
                }}
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

          <span class="total">Total: 3954 EUR</span>
          <button
            type="button"
            class="pay-button"
            onClick={handleSubmit}
            disabled={isSubmitting()}
          >
            {isSubmitting() ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
