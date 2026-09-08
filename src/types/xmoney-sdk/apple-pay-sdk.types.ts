import type {
  Appearance,
  ApplePayAppearance,
  BaseConfig,
  BaseInstance,
  SharedOptions,
} from "./sdk-base.types";

/**
 * Configuration options for initializing and customizing Apple Pay.
 */
export interface ApplePayConfig extends BaseConfig {
  /**
   * Options for customizing the appearance and behavior of Apple Pay.
   */
  options?: SharedOptions & {
    /**
     * Appearance customization options.
     * Theme variables apply to the wallet iframe; button fields style the Apple Pay button.
     */
    appearance?: Appearance & ApplePayAppearance;
  };
}

/**
 * Represents an instance of Apple Pay, providing methods to interact with and manage the payment.
 */
export interface ApplePayInstance extends BaseInstance {}
