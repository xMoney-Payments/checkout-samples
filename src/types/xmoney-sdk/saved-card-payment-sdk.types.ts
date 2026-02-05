import { XMoneyBaseConfig, XMoneyBaseInstance } from "./sdk-base.types";

/**
 * Configuration options for initializing and customizing the XMoney Saved Card Payment.
 */
export interface XMoneySavedCardPaymentConfig extends XMoneyBaseConfig {}

/**
 * Represents an instance of the XMoney Saved Card Payment, providing methods to interact with and manage the payment.
 */
export interface XMoneySavedCardPaymentInstance extends XMoneyBaseInstance {
  pay: (cardId: number) => void;
}
