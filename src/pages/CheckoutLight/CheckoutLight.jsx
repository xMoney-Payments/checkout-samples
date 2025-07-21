import { createSignal, onMount } from "solid-js";
import "./CheckoutLight.css";
import { PUBLIC_KEY } from "../../constants";

function CheckoutLight() {
  let xMoneyCheckout;
  const [isLoading, setIsLoading] = createSignal(true);
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [formData, setFormData] = createSignal({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [errors, setErrors] = createSignal({});

  const validateField = (field, message) => {
    if (!formData()[field].trim()) {
      setErrors((prev) => ({ ...prev, [field]: message }));
      return false;
    }
    setErrors((prev) => ({ ...prev, [field]: "" }));
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
    const { isValid } = await xMoneyCheckout.validate(true);
    const isSdkValuesValid = isValid;
    if (
      !isFirstNameValid ||
      !isLastNameValid ||
      !isEmailValid ||
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
            publicKey: PUBLIC_KEY,
          }),
        }
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Failed to create payment intent");
      await xMoneyCheckout.submitPayment({
        payload: result.payload,
        checksum: result.checksum,
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  onMount(() => {
    xMoneyCheckout = new XMoneyCheckout({
      container: "xMoney-checkout-light",
      publicKey: PUBLIC_KEY,
      onError: (err) => console.error("❌ Payment error", err),
      onReady: () => setIsLoading(false),
    });
  });

  return (
    <div class="v-light">
      <div class={isLoading() ? "loading-overlay" : "loading-none"}>
        <div class="loading">Loading checkout...</div>
      </div>
      <div class={`checkout-container ${isLoading() ? "loading" : ""}`}>
        <h2>Embedded Components Single Card Input</h2>
        <form id="checkout-form">
          <h3>Personal Info</h3>
          <lapel>First name</lapel>
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
          <span class="error">{errors().firstName}</span>

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
          <span class="error">{errors().lastName}</span>

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
          <span class="error">{errors().email}</span>

          <h3>Card Info</h3>

          <div id="xMoney-checkout-light" class="sdk-container"></div>

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

export default CheckoutLight;
