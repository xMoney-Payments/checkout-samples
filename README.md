# xMoney Checkout SDK — Integration Samples

Examples for integrating the xMoney Checkout SDK. The SDK is vanilla JavaScript (no bundled types); this repo is the TypeScript contract and a runnable demo.

The UI is SolidJS, but the calls in `src/components/xmoney-integrations/` are the same `window.XMoney.*` APIs you would use in React, Vue, or plain HTML.

**Two layers**

- **Simple** — one page per SDK method. Copy the matching wrapper.
- **Advanced** — a full checkout that composes every method (cart, custom submit, live `updateOrder`).

Official docs: https://docs.xmoney.com/guides/checkout/embedded-checkout  
Hosted demo: https://demo.xmoney.com  
Payment intent creation lives in the separate xMoney API samples repository.

## Quick start

```bash
git clone <repository-url>
cd checkout-samples
cp .env.example .env
npm install
npm run dev
```

The app runs at `https://localhost:3002`.

### Environment

| Variable | Purpose |
| --- | --- |
| `VITE_PUBLIC_KEY` | Merchant public key (`pk_test_...` / `pk_live_...`) |
| `VITE_API_BASE` | Backend that returns `{ payload, checksum }` (see API samples) |

```env
VITE_PUBLIC_KEY="pk_test_your_key_here"
VITE_API_BASE="https://your-api-endpoint.com"
```

The SDK script URL is set in `index.html`. Local development uses `https://localhost:8080/xmoney.js`. Swap it before release:

- Staging: `https://secure-stage.xmoney.com/sdk/v2/xmoney.js`
- Production: `https://secure.xmoney.com/sdk/v2/xmoney.js`

## Examples

### Simple

| Route | SDK method | Wrapper |
| --- | --- | --- |
| `/` | `XMoney.paymentForm()` | [`PaymentForm.tsx`](src/components/xmoney-integrations/PaymentForm/PaymentForm.tsx) |
| `/payment-card` | `XMoney.paymentCard()` | [`PaymentCard.tsx`](src/components/xmoney-integrations/PaymentCard/PaymentCard.tsx) |
| `/google-pay` | `XMoney.googlePay()` | [`GooglePay.tsx`](src/components/xmoney-integrations/GooglePay/GooglePay.tsx) |
| `/apple-pay` | `XMoney.applePay()` | [`ApplePay.tsx`](src/components/xmoney-integrations/ApplePay/ApplePay.tsx) |
| `/saved-card` | `XMoney.savedCardPayment()` | [`SavedCardPayment.tsx`](src/components/xmoney-integrations/SavedCardPayment/SavedCardPayment.tsx) |

The Payment Form page also shows `updateLocale`, `updateAppearance`, card layout, and `updateOrder` when the amount changes.

The Payment Card page can hide the built-in submit button and call `validate()` then `submit()` from your own pay button.

Google Pay and Apple Pay call `XMoney.getPaymentMethodCapabilities()` first and hide the button when the wallet is not supported. Appearance is limited to the official button APIs (`style`/`color`, `type`, `radius`, `height`, and Google `borderType`). Custom CSS and artwork are not allowed.

### Advanced

| Route | What it shows |
| --- | --- |
| `/advance-checkout` | Custom layout: cart, delivery, official Apple Pay / Google Pay buttons, card accordion, custom submit, debounced `updateOrder` on every live instance |

## Integration pattern

Every wrapper follows the same lifecycle:

1. Load the SDK script (see `index.html`)
2. Create a payment intent on your backend (`orderPayload` + `orderChecksum`)
3. Call `window.XMoney.<method>({ ... })`
4. Handle `onReady`, `onPaymentComplete`, `onError`
5. Call `destroy()` on unmount

```typescript
const instance = await window.XMoney.paymentForm({
  container: "#payment-form",
  orderChecksum: checksum,
  orderPayload: payload,
  publicKey: PUBLIC_KEY,
  onPaymentComplete: (result) => {
    /* show receipt */
  },
  onError: (err) => {
    /* surface err.message */
  },
});

instance.destroy();
```

## TypeScript

The SDK does not ship types. Copy from [`src/types/xmoney-sdk/`](src/types/xmoney-sdk/) and [`src/types/xmoney-global.d.ts`](src/types/xmoney-global.d.ts):

```typescript
import type {
  PaymentFormConfig,
  PaymentFormInstance,
} from "./types/xmoney-sdk/payment-form-sdk.types";

const instance: PaymentFormInstance = await window.XMoney.paymentForm(config);
```

`window.XMoney` is declared in `xmoney-global.d.ts`.

## Project structure

```
checkout-samples/
├── src/
│   ├── components/xmoney-integrations/   # Copy-paste SDK wrappers
│   ├── types/xmoney-sdk/                 # TypeScript contract for the vanilla SDK
│   ├── pages/
│   │   ├── PaymentForm/                  # Simple: paymentForm
│   │   ├── PaymentCard/                  # Simple: paymentCard
│   │   ├── GooglePay/                    # Simple: googlePay
│   │   ├── ApplePay/                     # Simple: applePay
│   │   ├── SavedCard/                    # Simple: savedCardPayment
│   │   └── AdvanceCheckout/              # Advanced composition
│   └── api/                              # Client calls to your payment-intent API
├── index.html                            # Loads the SDK script
└── .env.example
```

## License

MIT
