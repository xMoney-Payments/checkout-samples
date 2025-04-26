import { createSignal, onMount } from "solid-js";
import { classicCheckoutStyles } from "../../example/styles/index";
import "./Checkout.css";

function Checkout() {
  let xMoneyCheckout;
  const [isLoading, setIsLoading] = createSignal(true);
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [formData, setFormData] = createSignal({
    firstName: "",
    lastName: "",
    email: "",
    cardName: "",
  });
  const [errors, setErrors] = createSignal({});
  const [sdkError, setSdkError] = createSignal("");

  const validateField = (field, message) => {
    if (!formData()[field].trim()) {
      setErrors((prev) => ({ ...prev, [field]: message }));
      return false;
    }
    setErrors((prev) => ({ ...prev, [field]: "" }));
    return true;
  };

  const validateSdk = (message) => {
    if (message) {
      setSdkError(message);
      return false;
    }
    setSdkError("");
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const isFirstNameValid = validateField(
      "firstName",
      "First name is required"
    );
    const isLastNameValid = validateField("lastName", "Last name is required");
    const isEmailValid = validateField("email", "Valid email is required");
    const isCardNameValid = validateField("cardName", "Card name is required");
    const { cardNumberError, expDateError, cvvError } =
      await xMoneyCheckout.validate(true);
    const isSdkValuesValid = validateSdk(
      cardNumberError || expDateError || cvvError
    );

    if (
      !isFirstNameValid ||
      !isLastNameValid ||
      !isEmailValid ||
      !isCardNameValid ||
      !isSdkValuesValid
    ) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3001/checkout-initialization",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData(),
            amount: 1,
            currency: "EUR",
          }),
        }
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Failed to create payment intent");
      await xMoneyCheckout.submitPayment(result);
    } catch (error) {
      console.error("Error creating payment intent:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  onMount(() => {
    console.log("Initializing XMoneyCheckout");
    xMoneyCheckout = new XMoneyCheckout({
      container: "payment-widget",
      elementsOptions: { appearance: classicCheckoutStyles },
      onError: (err) => console.error("❌ Payment error", err),
      onReady: () => setIsLoading(false),
    });
  });

  return (
    <div class="v-classic">
      <div class={isLoading() ? "loading-overlay" : "loading-none"}>
        <div class="loading">Loading checkout...</div>
      </div>
      <div class={`checkout-container ${isLoading() ? "loading" : ""}`}>
        <h2>Embedded Components P.O.C.</h2>
        <form id="checkout-form">
          <h3>Personal Info</h3>
          <label>
            <span class="label-text">First Name</span>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="First Name"
              value={formData().firstName}
              onInput={(e) =>
                setFormData({ ...formData(), firstName: e.target.value })
              }
            />
            <span class="error-text">{errors().firstName}</span>
          </label>

          <label>
            <span class="label-text">Last Name</span>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Last Name"
              value={formData().lastName}
              onInput={(e) =>
                setFormData({ ...formData(), lastName: e.target.value })
              }
            />
            <span class="error-text">{errors().lastName}</span>
          </label>

          <label>
            <span class="label-text">Email Address</span>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              value={formData().email}
              onInput={(e) =>
                setFormData({ ...formData(), email: e.target.value })
              }
            />
            <span class="error-text">{errors().email}</span>
          </label>

          <h3>Card Info</h3>
          <label>
            <span class="label-text">Card Name</span>
            <input
              type="text"
              id="cardName"
              name="cardName"
              placeholder="Card Name"
              value={formData().cardName}
              onInput={(e) =>
                setFormData({ ...formData(), cardName: e.target.value })
              }
            />
            <span class="error-text">{errors().cardName}</span>
          </label>

          <div
            id="payment-widget"
            class={sdkError() ? "sdk-container error" : "sdk-container"}
          ></div>

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

export default Checkout;
