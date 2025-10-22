import { MatchStatusEnum, OrderResponse } from "../../types/checkout.types";

/**
 * Configuration options for initializing and customizing the XMoney payment form.
 */
export interface XMoneyPaymentFormConfig {
  /**
   * HTML element selector (CSS string) or a direct HTMLElement reference where the payment form will be rendered.
   *
   * @example "#payment-form-container"
   * @example document.getElementById("payment-form-container")
   *
   * @remarks
   * This field is **required**.
   */
  container: string | HTMLElement;

  /**
   * Checksum for the order, used for request integrity validation.
   *
   * @remarks
   * This field is **required**.
   */
  checksum: string;

  /**
   * Base64-encoded order payload containing order details.
   *
   * @remarks
   * This field is **required**.
   */
  payload: string;

  /**
   * Public API key for the payment form, e.g., `"pk_{env}_{siteId}"`.
   *
   * @remarks
   * This field is **required**.
   */
  publicKey: string;

  /**
   * Session token used for background data refresh or saved card functionality.
   *
   * @remarks
   * - Required if `options.enableBackgroundRefresh` is `true`.
   * - Required if `options.enableSavedCards` is `true`.
   */
  sessionToken?: string;

  /**
   * User ID associated with the payment form.
   *
   * @remarks
   * Required if `options.enableSavedCards` is `true`.
   */
  userId?: number;

  /**
   * Options for customizing the appearance and behavior of form elements.
   */
  options?: {
    /**
     * Appearance customization options.
     */
    appearance?: {
      /**
       * Theme for the payment form.
       *
       * @defaultValue `"light"`
       */
      theme?: "light" | "dark" | "custom";

      /**
       * CSS variables for custom themes.
       *
       * @example { colorPrimary: "#009688" }
       */
      variables?: Record<string, string>;

      /**
       * CSS rules for custom styles.
       *
       * @example { ".xmoney-input:hover": { "color": "#333" } }
       */
      rules?: Record<string, Record<string, string>>;
    };

    /**
     * Validation mode for the form.
     *
     * @defaultValue `"onChange"`
     */
    validationMode?: "onSubmit" | "onChange" | "onBlur" | "onTouched";

    /**
     * Locale for the payment form.
     *
     * @defaultValue `"en-US"`
     */
    locale?: "en-US" | "el-GR" | "ro-RO";

    /**
     * Enables saved card functionality for returning users.
     *
     * @defaultValue `true`
     */
    enableSavedCards?: boolean;

    /**
     * Enables background data refresh for the payment form.
     *
     * @defaultValue `true`
     */
    enableBackgroundRefresh?: boolean;

    /**
     * Displays a "Save Card" option to the user.
     *
     * @defaultValue `true`
     */
    displaySaveCardOption?: boolean;

    /**
     * Displays a cardholder name field in the form.
     *
     * @defaultValue `false`
     */
    displayCardHolderName?: boolean;
    /**
     * Card owner verification options.
     */
    cardOwnerVerification?: {
      /**
       * Name information for card owner verification.
       */
      name: {
        firstName: string;
        middleName: string;
        lastName: string;
      };
      /**
       * Callback function for owner verification.
       */
      ownerVerificationCallback: (matchResult: MatchStatusEnum) => boolean;
    };
  };

  /**
   * Callback executed when the payment form is fully initialized and ready.
   */
  onReady?: () => void;

  /**
   * Callback executed when an error occurs within the payment form.
   *
   * @param err - The error object or message.
   */
  onError?: (err: { code: number; message: string } | string) => void;

  /**
   * Callback executed when the payment is completed.
   *
   * @param data - Payment completion response data.
   *
   * @remarks
   * This callback will **not** be triggered if `enableBackgroundRefresh` is `false`.
   */
  onPaymentComplete?: (data: OrderResponse) => void;
}

/**
 * Represents an instance of the XMoney payment form, providing methods to interact with and manage the form.
 */
export interface XMoneyPaymentFormInstance {
  /**
   * Updates the order details in the payment form.
   *
   * @param payload - Base64-encoded updated order payload.
   * @param checksum - Checksum to validate the updated order.
   */
  updateOrder: (payload: string, checksum: string) => void;

  /**
   * Updates the locale of the payment form.
   *
   * @param locale - Locale to set for the form.
   */
  updateLocale: (locale: "en-US" | "el-GR" | "ro-RO") => void;

  /**
   * Updates the appearance of the payment form.
   *
   * @param appearance - Theme, CSS variables, and/or CSS rules to apply.
   */
  updateAppearance: (appearance: {
    theme?: "light" | "dark" | "custom";
    variables?: Record<string, string>;
    rules?: Record<string, Record<string, string>>;
  }) => void;

  /**
   * Closes the payment form.
   *
   * @remarks
   * This does not destroy the form instance. Use {@link destroy} for full cleanup.
   */
  close: () => void;

  /**
   * Cleans up and completely destroys the payment form instance.
   *
   * @remarks
   * After calling this, the instance cannot be reused.
   */
  destroy: () => void;
}

/**
 * Represents the constructor interface for creating an instance of {@link XMoneyPaymentFormInstance}.
 */
export interface XMoneyPaymentForm {
  /**
   * Creates and initializes a new payment form instance.
   *
   * @param config - The configuration object required to initialize the payment form.
   * @returns An initialized {@link XMoneyPaymentFormInstance}.
   */
  new (config: XMoneyPaymentFormConfig): XMoneyPaymentFormInstance;
}
