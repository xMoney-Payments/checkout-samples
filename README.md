# xMoney Checkout SDK - Integration Examples

> Complete integration examples demonstrating how to integrate the xMoney Checkout SDK with TypeScript support and multiple payment methods.

This repository provides comprehensive code examples showing how to integrate the xMoney Checkout SDK into your web applications. Built with **SolidJS**, **Vite**, and **TypeScript**, these examples demonstrate the actual SDK initialization and configuration for various payment methods.

> The xMoney SDK is framework-agnostic and works in any modern JavaScript web application. This repository uses SolidJS for the example UI, but the SDK integration patterns apply equally to React, Vue, Angular, Svelte, or vanilla JS.

**Use this repository to learn how to:**

- Initialize and configure the xMoney SDK
- Handle payment lifecycles and callbacks
- Customize appearance and behavior
- Implement proper error handling and state management

## ✨ SDK Methods Demonstrated

### Payment Integration Methods

- 🎨 **Payment Form** (`XMoney.paymentForm()`) - Full-featured embedded payment form with card input

### Developer Experience

- ✅ Full TypeScript support with comprehensive type definitions
- 🎯 SolidJS reactive components
- 🎨 Customizable appearance (themes, variables, CSS rules)
- 🌍 Multi-language support (English, Greek, Romanian)
- 🔒 Secure payment flow with checksum validation
- 📱 Responsive design with Tailwind CSS

## 🎯 Integration Steps Overview

Integrating xMoney SDK into your application requires these steps:

1. **Load the SDK** - Add the xMoney script tag to your HTML
2. **Create Payment Intent** - Call your backend to get `orderPayload` and `orderChecksum`
3. **Initialize SDK Method** - Call the appropriate `window.XMoneyPaymentForm` constructor
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

Update your public API key in [`src/constants/general.constants.ts`](src/constants/general.constants.ts):

```typescript
export const PUBLIC_KEY = "pk_test_your_key_here";
export const API_BASE = "https://your-api-endpoint.com";
```

### Running the App

````bash
# Development mode
npm run dev
# or
npm start

## 📌 Implementation Reference
npm run build


## � Implementation Reference

- TypeScript type usage
- Integration with reactive frameworks

Check these files for complete, production-ready examples:

- [PaymentForm.tsx](src/components/xmoney-integrations/PaymentForm/PaymentForm.tsx)

## 📦 Loading the SDK

Before using any SDK methods, you must load the xMoney SDK script in your HTML:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Your App</title>
  </head>
  <body>
    <!-- Your app content -->
    <div id="root"></div>

    <!-- Load xMoney SDK -->
    <script src="https://secure.xmoney.com/sdk/v1/xmoney.js"></script>

    <!-- Your app script -->
    <script src="/src/main.js" type="module"></script>
  </body>
</html>
````

### Environment-specific SDK URLs

```html
<!-- Production -->
<script src="https://secure.xmoney.com/sdk/v1/xmoney.js"></script>

<!-- Staging -->
<script src="https://secure-stage.xmoney.com/sdk/v1/xmoney.js"></script>
```

The SDK exposes a global `window.XMoneyPaymentForm` constructor.

## 🔐 Creating Payment Intents

Before initializing any SDK method, you need to obtain an `orderPayload` and `orderChecksum` from your backend. This ensures secure payment processing.

### Backend Payment Intent Creation

```typescript
// Example: POST /checkout-initialization
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
// Get payment intent from your backend
const { payload, checksum } = await createPaymentIntent(paymentData);

// Use it to initialize any SDK method
const instance = new window.XMoneyPaymentForm({
  container: "#payment-form",
  orderChecksum: checksum,
  orderPayload: payload,
  publicKey: "pk_test_your_key",
  // ... other options
});
```

> **Note:** The `orderPayload` is a Base64-encoded string containing encrypted order details. The `orderChecksum` validates the integrity of the payload. Both must be generated server-side for security.

## �📖 SDK Integration Examples

### Payment Form Integration

The full payment form includes card input, Apple Pay, and Google Pay options:

```typescript
// Initialize the payment form
const paymentFormInstance = new window.XMoneyPaymentForm({
  container: "#payment-form-container", // or document.getElementById('payment-form-container')
  orderChecksum: "your-order-checksum",
  orderPayload: "your-base64-encoded-payload",
  publicKey: "pk_test_your_key",

  options: {
    buttonType: "pay",
    validationMode: "onChange",
    locale: "en-US",
    enableSavedCards: true,
    displaySaveCardOption: true,
    displaySubmitButton: true,
    appearance: {
      theme: "light",
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

  onSubmitPending: (isPending) => {
    console.log("Submit pending:", isPending);
  },

  onPaymentComplete: (result) => {
    console.log("Payment completed successfully:", result);
    // Handle successful payment
  },
});

// Update order details if needed
paymentFormInstance.updateOrder({
  orderPayload: "new-base64-payload",
  orderChecksum: "new-checksum",
});

// Cleanup when done
paymentFormInstance.destroy();
```

### TypeScript Support

Import types for full autocomplete and type safety:

```typescript
import {
  XMoneyPaymentFormConfig,
  XMoneyPaymentFormInstance,
} from "./types/xmoney-sdk/payment-form-sdk.types";

import { TransactionDetails } from "./types/checkout.types";

const config: XMoneyPaymentFormConfig = {
  container: "#payment-form",
  orderChecksum: checksum,
  orderPayload: payload,
  publicKey: PUBLIC_KEY,
  onPaymentComplete: (result: TransactionDetails) => {
    console.log(result.transactionId);
  },
};

const instance: XMoneyPaymentFormInstance = new window.XMoneyPaymentForm(
  config,
);
```

## 🎨 Customization

### Appearance Customization

All payment methods support appearance customization:

```typescript
const config = {
  options: {
    appearance: {
      theme: "dark", // "light" | "dark" | "custom"
      variables: {
        colorPrimary: "#009688",
        colorBackground: "#ffffff",
        fontFamily: "Inter, system-ui, sans-serif",
      },
      rules: {
        ".xmoney-input": {
        ".xmoney-input:hover": {
          "box-shadow": "0 2px 4px rgba(0,0,0,0.1)",
        },
      },
    },
    locale: "en-US", // "en-US" | "el-GR" | "ro-RO"
    buttonType: "pay", // "book" | "buy" | "checkout" | "donate" | "order" | "pay" | "subscribe" | "topUp"
  },
};
```

### Button Customization

Apple Pay and Google Pay buttons can be customized:

```typescript
// Apple Pay
appearance: {
  style: "black", // "white" | "black" | "white-outline"
  radius: 12,
  type: "pay" // "add-money" | "book" | "buy" | "checkout" | "donate" | etc.
}

// Google Pay
appearance: {
  color: "black", // "white" | "black"
  radius: 12,
  type: "pay", // "book" | "buy" | "checkout" | "donate" | "order" | "plain" | "pay" | "subscribe"
  borderType: "no_border" // "default_border" | "no_border"
}
```

## 📁 Project Structure

````
checkout-samples/
├── src/
│   │   │   ├── payment-form-sdk.types.ts
│   │   └── xmoney-global.d.ts       # Global SDK declarations
│   ├── pages/                       # Example pages showcasing integrations
│   ├── api/                         # Payment intent creation utilities
│   ├── constants/                   # Configuration (API keys, etc.)
│   └── example/                     # Styling examples (appearance config)
├── index.html                       # SDK script loading
├── package.json
├── vite.config.js
└── tsconfig.json

**Key directories:**

- **`src/components/xmoney-integrations/`** - Real-world SDK integration implementations
- **`src/types/xmoney-sdk/`** - Complete TypeScript type definitions with JSDoc
- **`src/api/`** - Backend communication examples

## 🔧 Configuration Options

### Common Configuration (All Methods)

```typescript
interface XMoneyBaseConfig {
  container: string | HTMLElement; // Required: Container selector or element
  orderChecksum: string; // Required: Order checksum for validation
  orderPayload: string; // Required: Base64-encoded order data
  publicKey: string; // Required: Your public API key

  onReady?: () => void; // Called when SDK is ready
  onError?: (err: Error) => void; // Called on errors
  onPaymentComplete?: (data) => void; // Called on successful payment
}
````

### Payment Form Specific Options

```typescript
interface XMoneyPaymentFormConfig extends XMoneyBaseConfig {
  options?: {
    validationMode?: "onSubmit" | "onChange" | "onBlur" | "onTouched";
    enableSavedCards?: boolean;
    displaySaveCardOption?: boolean;
    displaySubmitButton?: boolean;
    enableBackgroundRefresh?: boolean;
    cardHolderVerification?: {
      name: { firstName: string; middleName: string; lastName: string };
      email: string;
      phone: string;
    };
  };
}
```

## 📚 TypeScript Support

This project includes comprehensive TypeScript definitions for all SDK integrations. The types are located in [`src/types/xmoney-sdk/`](src/types/xmoney-sdk/) and provide:

- Full autocomplete support
- Type safety for all configuration options
- Detailed JSDoc documentation
- Interface definitions for SDK instances

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
For a working example, see https://demo.xmoney.com/.
For SDK support, contact your xMoney representative.

---

Built with [SolidJS](https://solidjs.com) and [Vite](https://vitejs.dev)
