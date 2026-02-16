import { XMoneyPaymentForm } from "./xmoney-sdk/payment-form-sdk.types";

declare global {
  interface Window {
    XMoneyPaymentForm: XMoneyPaymentForm;
  }
}
