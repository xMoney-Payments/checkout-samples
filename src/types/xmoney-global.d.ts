import {
  XMoneyApplePayConfig,
  XMoneyApplePayInstance,
} from "./xmoney-sdk/apple-pay-sdk.types";
import {
  XMoneyCardElementsConfig,
  XMoneyCardElementsInstance,
} from "./xmoney-sdk/card-elements-sdk.types";
import {
  XMoneyGooglePayInstance,
  XMoneyGooglePayConfig,
} from "./xmoney-sdk/google-pay-sdk.types";
import {
  XMoneyPaymentFormConfig,
  XMoneyPaymentFormInstance,
} from "./xmoney-sdk/payment-form-sdk.types";
import { PaymentMethodCapabilities } from "./xmoney-sdk/payment-method-capabilities.types";
import {
  XMoneySavedCardPaymentInstance,
  XMoneySavedCardPaymentConfig,
} from "./xmoney-sdk/saved-card-payment-sdk.types";

declare global {
  interface Window {
    XMoney: {
      paymentForm: (
        config: XMoneyPaymentFormConfig,
      ) => Promise<XMoneyPaymentFormInstance>;
      paymentCard: (
        config: XMoneyCardElementsConfig,
      ) => Promise<XMoneyCardElementsInstance>;
      savedCardPayment: (
        config: XMoneySavedCardPaymentConfig,
      ) => Promise<XMoneySavedCardPaymentInstance>;
      googlePay: (
        config: XMoneyGooglePayConfig,
      ) => Promise<XMoneyGooglePayInstance>;
      applePay: (
        config: XMoneyApplePayConfig,
      ) => Promise<XMoneyApplePayInstance>;
      getPaymentMethodCapabilities: () => Promise<PaymentMethodCapabilities>;
    };
  }
}
