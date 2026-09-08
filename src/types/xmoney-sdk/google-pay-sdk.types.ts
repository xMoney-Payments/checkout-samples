import type {
  Appearance,
  GooglePayAppearance,
  BaseConfig,
  BaseInstance,
  SharedOptions,
} from "./sdk-base.types";

/**
 * Configuration options for initializing and customizing the Google Pay button.
 */
export interface GooglePayConfig extends BaseConfig {
  /**
   * Options for customizing the appearance and behavior of Google Pay.
   */
  options?: SharedOptions & {
    /**
     * Appearance customization options.
     * Theme variables apply to the wallet iframe; button fields style the Google Pay button.
     */
    appearance?: Appearance & GooglePayAppearance;
  };
}

/**
 * Represents an instance of Google Pay, providing methods to interact with and manage the payment.
 */
export interface GooglePayInstance extends BaseInstance {}
