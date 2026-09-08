# xMoney Checkout SDK - Integration Examples

> Complete integration examples demonstrating how to integrate the xMoney Checkout SDK with TypeScript support and multiple payment methods.

This repository provides comprehensive code examples showing how to integrate the xMoney Checkout SDK into your web applications. Built with **SolidJS**, **Vite**, and **TypeScript**, these examples demonstrate the actual SDK initialization and configuration for various payment methods.

> The xMoney SDK is framework-agnostic and works in any modern JavaScript web application. This repository uses SolidJS for the example UI, but the SDK integration patterns apply equally to React, Vue, Angular, Svelte, or vanilla JS.

**Use this repository to learn how to:**

- Initialize and configure the xMoney SDK
- Handle payment lifecycles and callbacks
- Customize appearance and behavior
- Integrate multiple payment methods
- Implement proper error handling and state management

## ✨ SDK Methods Demonstrated

### Payment Integration Methods

- 🎨 **Payment Form** (`XMoney.paymentForm()`) - Full-featured embedded payment form with card input, Google Pay, and Apple Pay
- 💳 **Payment Card** (`XMoney.paymentCard()`) - Standalone card input element for custom checkout layouts
- 🍎 **Apple Pay** (`XMoney.applePay()`) - Native Apple Pay button integration
- 🅖 **Google Pay** (`XMoney.googlePay()`) - Native Google Pay button integration
- 💾 **Saved Card Payment** (`XMoney.savedCardPayment()`) - Payment with previously saved cards
- 🔍 **Payment Method Capabilities** (`XMoney.getPaymentMethodCapabilities()`) - Check Apple Pay / Google Pay availability

### Developer Experience

- ✅ Full TypeScript support with comprehensive type definitions
- 🎯 SolidJS reactive components
- 🎨 Customizable appearance (themes, variables, CSS rules)
- 🌍 Multi-language support (English, Greek, Romanian, Bulgarian, Hungarian, Polish)
- 🔒 Secure payment flow with checksum validation
- 📱 Responsive design with Tailwind CSS

## 🎯 Integration Steps Overview

Integrating xMoney SDK into your application requires these steps:

1. **Load the SDK** - Add the xMoney script tag to your HTML
2. **Create Payment Intent** - Call your backend to get `orderPayload` and `orderChecksum`
3. **Initialize SDK Method** - Call the appropriate `window.XMoney.*()` method
4. **Handle Callbacks** - Implement `onReady`, `onPaymentComplete`, `onError` handlers
5. **Cleanup** - Call `destroy()` when component unmounts

Each section below demonstrates these steps with complete code examples.

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd checkout-samples

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Configuration

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

```env
VITE_PUBLIC_KEY="pk_test_your_key_here"
VITE_API_BASE="https://your-api-endpoint.com"
```

### Running the App

```bash
# Development mode
npm run dev

# Production build
npm run build
```

## 📌 Implementation Reference

Check these files for complete, production-ready integration examples:

- [PaymentForm.tsx](src/components/xmoney-integrations/PaymentForm/PaymentForm.tsx) — `XMoney.paymentForm()`
- [PaymentCard.tsx](src/components/xmoney-integrations/PaymentCard/PaymentCard.tsx) — `XMoney.paymentCard()`
- [ApplePay.tsx](src/components/xmoney-integrations/ApplePay/ApplePay.tsx) — `XMoney.applePay()`
- [GooglePay.tsx](src/components/xmoney-integrations/GooglePay/GooglePay.tsx) — `XMoney.googlePay()`
- [SavedCardPayment.tsx](src/components/xmoney-integrations/SavedCardPayment/SavedCardPayment.tsx) — `XMoney.savedCardPayment()`

## 📦 Loading the SDK

Before using any SDK methods, you must load the xMoney SDK script in your HTML:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Your App</title>
  </head>
  <body>
    <div id="root"></div>

    <!-- Load xMoney SDK -->
    <script src="https://secure.xmoney.com/sdk/v2/xmoney.js"></script>

    <!-- Your app script -->
    <script src="/src/main.js" type="module"></script>
  </body>
</html>
```

### Environment-specific SDK URLs

```html
<!-- Production -->
<script src="https://secure.xmoney.com/sdk/v2/xmoney.js"></script>

<!-- Staging -->
<script src="https://secure-stage.xmoney.com/sdk/v2/xmoney.js"></script>
```

The SDK exposes a global `window.XMoney` object with all payment methods.

## 🔐 Creating Payment Intents

Before initializing any SDK method, you need to obtain an `orderPayload` and `orderChecksum` from your backend. This ensures secure payment processing.

### Backend Payment Intent Creation

```typescript
// POST /checkout-initialization
const createPaymentIntent = async (paymentData) => {
  const response = await fetch("https://your-api.com/checkout-initialization", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      amount: 100,
      currency: "EUR",
      publicKey: "pk_test_your_key",
      saveCard: true, // Optional
    }),
  });

  const { payload, checksum } = await response.json();
  return { payload, checksum };
};
```

### Using the Payment Intent

```typescript
const { payload, checksum } = await createPaymentIntent(paymentData);

const instance = await window.XMoney.paymentForm({
  container: "#payment-form",
  orderChecksum: checksum,
  orderPayload: payload,
  publicKey: "pk_test_your_key",
  // ... other options
});
```

> **Note:** The `orderPayload` is a Base64-encoded string containing encrypted order details. The `orderChecksum` validates the integrity of the payload. Both must be generated server-side for security.

## 📖 SDK Integration Examples

### Checking Payment Method Capabilities

Before rendering Apple Pay or Google Pay buttons, check whether the browser/device supports them:

```typescript
const capabilities = await window.XMoney.getPaymentMethodCapabilities();

if (capabilities.googlePay.supported) {
  // Render Google Pay button
}

if (capabilities.applePay.supported) {
  // Render Apple Pay button
}
```

---

### Payment Form Integration

The full-featured payment form embeds card input, Apple Pay, and Google Pay in a single component:

```typescript
const paymentFormInstance = await window.XMoney.paymentForm({
  container: "#payment-form-container", // element id or HTMLElement
  orderChecksum: "your-order-checksum",
  orderPayload: "your-base64-encoded-payload",
  publicKey: "pk_test_your_key",

  card: {
    validationMode: "onChange", // "onSubmit" | "onChange" | "onBlur" | "onTouched"
    savedCards: {
      enabled: true, // Show saved cards for returning users
      optInVisible: false, // Hide the save-card checkbox
    },
    cardHolderName: {
      visible: true, // Show the cardholder name field
    },
    inputs: {
      grouping: "spaced", // "spaced" | "condensed"
    },
    submitButton: {
      visible: true, // Show the built-in submit button
      type: "pay", // "book" | "buy" | "checkout" | "donate" | "deposit" | "order" | "pay" | "subscribe" | "topUp"
    },
  },

  paymentMethods: {
    googlePay: { enabled: true },
    applePay: { enabled: true },
  },

  options: {
    locale: "en-US", // "en-US" | "el-GR" | "ro-RO" | "bg-BG" | "hu-HU" | "pl-PL"
    appearance: {
      theme: "light", // "light" | "dark" | "custom"
      variables: {
        colorPrimary: "#009688",
      },
    },
  },

  onReady: () => {
    console.log("Payment form is ready");
  },

  onError: (err) => {
    console.error("Payment error:", err);
  },

  onPaymentProcessing: (isProcessing) => {
    console.log("Processing:", isProcessing);
  },

  onPaymentComplete: (result) => {
    console.log("Payment completed:", result);
  },
});

// Update order details (e.g. after amount change)
paymentFormInstance.updateOrder({
  orderPayload: "new-base64-payload",
  orderChecksum: "new-checksum",
});

// Programmatically submit the form
paymentFormInstance.submit();

// Validate without submitting
const { isValid, errors } = paymentFormInstance.validate();

// Cleanup on unmount
paymentFormInstance.destroy();
```

---

### Payment Card Integration

Renders only the card input element — useful when building a custom multi-method checkout:

```typescript
const paymentCardInstance = await window.XMoney.paymentCard({
  container: "#payment-card-container",
  orderChecksum: "your-order-checksum",
  orderPayload: "your-base64-encoded-payload",
  publicKey: "pk_test_your_key",

  card: {
    validationMode: "onChange",
    savedCards: {
      enabled: false,
      optInVisible: true, // Show the save-card checkbox
    },
    cardHolderName: {
      visible: true,
    },
    inputs: {
      grouping: "condensed", // Compact card-style layout
    },
    submitButton: {
      visible: true, // Show or hide the built-in submit button
      type: "pay",
    },
  },

  options: {
    locale: "en-US",
    appearance: {
      theme: "dark",
      variables: {
        colorPrimary: "#1976d2",
      },
    },
  },

  onReady: () => {
    console.log("Payment card ready");
  },

  onError: (err) => {
    console.error("Payment card error:", err);
  },

  onPaymentProcessing: (isProcessing) => {
    console.log("Processing:", isProcessing);
  },

  onPaymentComplete: (result) => {
    console.log("Payment successful:", result);
  },
});

// Programmatically submit
paymentCardInstance.submit();

// Validate fields
const { isValid, errors } = await paymentCardInstance.validate();

// Cleanup
paymentCardInstance.destroy();
```

---

### Apple Pay Integration

```typescript
const applePayInstance = await window.XMoney.applePay({
  container: "#apple-pay-button",
  orderChecksum: "your-order-checksum",
  orderPayload: "your-base64-encoded-payload",
  publicKey: "pk_test_your_key",

  options: {
    locale: "en-US",
    appearance: {
      style: "black", // "white" | "black" | "white-outline"
      radius: 12,
      type: "pay", // "add-money" | "book" | "buy" | "checkout" | "contribute" |
      // "continue" | "donate" | "order" | "plain" | "pay" |
      // "reload" | "rent" | "set-up" | "subscribe" | "support" | "tip" | "top-up"
    },
  },

  onReady: () => {
    console.log("Apple Pay button ready");
  },

  onError: (err) => {
    console.error("Apple Pay error:", err);
  },

  onPaymentProcessing: (isProcessing) => {
    console.log("Processing:", isProcessing);
  },

  onPaymentComplete: (result) => {
    console.log("Apple Pay payment completed:", result);
  },
});

// Update order if amount/details change
applePayInstance.updateOrder({
  orderPayload: "new-base64-payload",
  orderChecksum: "new-checksum",
});

// Cleanup
applePayInstance.destroy();
```

---

### Google Pay Integration

```typescript
const googlePayInstance = await window.XMoney.googlePay({
  container: "#google-pay-button",
  orderChecksum: "your-order-checksum",
  orderPayload: "your-base64-encoded-payload",
  publicKey: "pk_test_your_key",

  options: {
    locale: "en-US",
    appearance: {
      color: "black", // "white" | "black"
      radius: 12,
      type: "pay", // "book" | "buy" | "checkout" | "donate" | "order" | "plain" | "pay" | "subscribe"
      borderType: "no_border", // "default_border" | "no_border"
    },
  },

  onReady: () => {
    console.log("Google Pay button ready");
  },

  onError: (err) => {
    console.error("Google Pay error:", err);
  },

  onPaymentProcessing: (isProcessing) => {
    console.log("Processing:", isProcessing);
  },

  onPaymentComplete: (result) => {
    console.log("Google Pay payment completed:", result);
  },
});

// Update order if amount/details change
googlePayInstance.updateOrder({
  orderPayload: "new-base64-payload",
  orderChecksum: "new-checksum",
});

// Cleanup
googlePayInstance.destroy();
```

---

### Saved Card Payment

The saved card method has no `container` — it operates headlessly and you trigger payment programmatically with a card ID:

```typescript
const savedCardInstance = await window.XMoney.savedCardPayment({
  orderChecksum: "your-order-checksum",
  orderPayload: "your-base64-encoded-payload",
  publicKey: "pk_test_your_key",

  onReady: () => {
    console.log("Saved card payment ready");
  },

  onError: (err) => {
    console.error("Saved card payment error:", err);
  },

  onPaymentProcessing: (isProcessing) => {
    console.log("Processing:", isProcessing);
  },

  onPaymentComplete: (result) => {
    console.log("Payment successful:", result);
  },
});

// Trigger payment with a saved card
savedCardInstance.pay({ cardId: 42 });

// Cleanup
savedCardInstance.destroy();
```

---

### Common SDK Instance Methods

All SDK instances share these base methods:

```typescript
// Update order details (use after amount/currency changes)
instance.updateOrder({
  orderPayload: "new-base64-payload",
  orderChecksum: "new-checksum",
});

// Destroy the instance and release all resources
instance.destroy();
```

---

## 🎨 Customization

### Appearance Customization

`paymentForm` and `paymentCard` support full appearance customization via `options.appearance`:

```typescript
options: {
  appearance: {
    theme: "dark", // "light" | "dark" | "custom"
    variables: {
      colorPrimary: "#009688",
      colorBackground: "#ffffff",
      fontFamily: "Inter, system-ui, sans-serif",
      brandAccent: "#00aa88", // custom vars are allowed and usable in rules
    },
    rules: {
      ".xmoney-input:hover": {
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      },
    },
  },
  locale: "en-US", // "en-US" | "el-GR" | "ro-RO" | "bg-BG" | "hu-HU" | "pl-PL"
}
```

Update appearance dynamically after initialization:

```typescript
paymentFormInstance.updateAppearance({
  theme: "dark",
  variables: { colorPrimary: "#ff5722" },
});

paymentFormInstance.updateLocale("el-GR");
```

### Card input grouping

`card.inputs.grouping` controls how card number, expiry, and CVV are laid out. It is set at initialization.

```typescript
// Spaced (default): each field is separate, with labels
card: {
  inputs: { grouping: "spaced" },
}

// Condensed: number, expiry, and CVV in a single card-style block
card: {
  inputs: { grouping: "condensed" },
}
```

### Button Customization

Apple Pay and Google Pay buttons support their own appearance options:

```typescript
// Apple Pay
options: {
  appearance: {
    style: "black",    // "white" | "black" | "white-outline"
    radius: 12,
    type: "pay",       // see full list in ApplePayConfig
  }
}

// Google Pay
options: {
  appearance: {
    color: "black",          // "white" | "black"
    radius: 12,
    type: "pay",             // "book" | "buy" | "checkout" | "donate" | "order" | "plain" | "pay" | "subscribe"
    borderType: "no_border", // "default_border" | "no_border"
  }
}
```

---

## 📁 Project Structure

```
checkout-samples/
├── src/
│   ├── components/
│   │   └── xmoney-integrations/     # SDK integration wrapper components
│   │       ├── PaymentForm/         # XMoney.paymentForm() integration
│   │       ├── PaymentCard/         # XMoney.paymentCard() integration
│   │       ├── ApplePay/            # XMoney.applePay() integration
│   │       ├── GooglePay/           # XMoney.googlePay() integration
│   │       └── SavedCardPayment/    # XMoney.savedCardPayment() integration
│   ├── types/
│   │   ├── xmoney-sdk/              # TypeScript type definitions
│   │   │   ├── sdk-base.types.ts
│   │   │   ├── payment-form-sdk.types.ts
│   │   │   ├── payment-card-sdk.types.ts
│   │   │   ├── apple-pay-sdk.types.ts
│   │   │   ├── google-pay-sdk.types.ts
│   │   │   ├── saved-card-payment-sdk.types.ts
│   │   │   └── payment-method-capabilities.types.ts
│   │   ├── xmoney-global.d.ts       # window.XMoney global declarations
│   │   └── checkout.types.ts        # Shared data models
│   ├── pages/                       # Example pages showcasing integrations
│   │   ├── PaymentForm/             # Payment Form demo page
│   │   ├── EmbeddedComponents/      # Multi-method checkout demo page
│   │   └── AdvanceCheckout/         # Advanced checkout demo page
│   ├── api/                         # Backend communication helpers
│   └── config/                      # Environment configuration
├── index.html                       # SDK script loading
├── package.json
├── vite.config.ts
└── tsconfig.json
```

**Key directories:**

- **`src/components/xmoney-integrations/`** — Real-world SDK integration implementations
- **`src/types/xmoney-sdk/`** — Complete TypeScript type definitions with JSDoc
- **`src/api/`** — Backend communication examples

---

## 🔧 Configuration Reference

### Common Configuration (All Methods)

```typescript
interface BaseConfig {
  container: string | HTMLElement; // Required (not used by savedCardPayment)
  orderChecksum: string; // Required: integrity checksum
  orderPayload: string; // Required: Base64-encoded order data
  publicKey: string; // Required: "pk_{env}_{siteId}"

  onReady?: () => void;
  onError?: (err: { code: number | string; message: string } | string) => void;
  onPaymentComplete?: (data: TransactionDetails) => void;
  onPaymentProcessing?: (isProcessing: boolean) => void;
  onValidation?: (event: ValidationEvent) => void;
  options?: {
    locale?: "en-US" | "el-GR" | "ro-RO" | "bg-BG" | "hu-HU" | "pl-PL";
  };
}
```

### Payment Form (`XMoney.paymentForm()`)

```typescript
interface PaymentFormConfig extends BaseConfig {
  card?: {
    validationMode?: "onSubmit" | "onChange" | "onBlur" | "onTouched";
    savedCards?: {
      enabled?: boolean;      // default: true
      optInVisible?: boolean; // default: true
    };
    submitButton?: {
      visible?: boolean;      // default: true
      type?: "book" | "buy" | "checkout" | "donate" | "deposit" | "order" | "pay" | "subscribe" | "topUp";
    };
    cardHolderName?: {
      visible?: boolean;      // default: true
    };
    inputs?: {
      grouping?: "spaced" | "condensed"; // default: "spaced"
    };
    cardHolderVerification?: {
      name: { firstName: string; middleName: string; lastName: string };
      onCardHolderVerification: (result: CardHolderVerificationResult) => boolean;
    };
  };
  paymentMethods?: {
    googlePay?: { enabled?: boolean; appearance?: { color?: "white" | "black"; radius?: number; type?: GooglePayButtonType; borderType?: "default_border" | "no_border"; height?: number } };
    applePay?: { enabled?: boolean; appearance?: { style?: "white" | "black" | "white-outline"; radius?: number; type?: ApplePayButtonType; height?: number } };
  };
  options?: {
    locale?: "en-US" | "el-GR" | "ro-RO" | "bg-BG" | "hu-HU" | "pl-PL";
    appearance?: {
      theme?: "light" | "dark" | "custom";
      variables?: AppearanceVariables; // known tokens + custom camelCase keys
      rules?: AppearanceRules;
    };
  };
}
```

### Payment Card (`XMoney.paymentCard()`)

Same as Payment Form config, except:

- No `paymentMethods` option (card only)
- `submitButton.visible` controls button visibility

### Saved Card Payment (`XMoney.savedCardPayment()`)

No `container` field. Takes the same base options (keys, callbacks) and exposes an additional `pay` method on the instance:

```typescript
savedCardInstance.pay({ cardId: number });
```

---

## 📚 TypeScript Support

Import types for full autocomplete and type safety:

```typescript
import type {
  PaymentFormConfig,
  PaymentFormInstance,
} from "./types/xmoney-sdk/payment-form-sdk.types";
import type { TransactionDetails } from "./types/checkout.types";

const config: PaymentFormConfig = {
  container: "#payment-form",
  orderChecksum: checksum,
  orderPayload: payload,
  publicKey: PUBLIC_KEY,
  onPaymentComplete: (result: TransactionDetails) => {
    console.log(result.id, result.transactionStatus);
  },
};

const instance: PaymentFormInstance =
  await window.XMoney.paymentForm(config);
```

---

## 🔒 Security

- All payment data is handled securely by the xMoney SDK
- Order checksums validate request integrity
- No sensitive card data is stored in your application
- PCI DSS compliant integration

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Apple Pay requires Safari on macOS or iOS
- Google Pay requires Chrome or supported browsers

## 📄 License

MIT

## 🤝 Support

For full documentation, visit https://docs.xmoney.com/guides/checkout/embedded-checkout.  
For a working example, see https://demo.xmoney.com.  
For SDK support, contact your xMoney representative.

---

Built with [SolidJS](https://solidjs.com) and [Vite](https://vitejs.dev)
