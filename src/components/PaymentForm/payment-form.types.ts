export interface ICard {
  id: number;
  customerId: number;
  type: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  nameOnCard: string;
  cardHolderCountry: string;
  cardHolderState: string;
  cardProvider: string;
  hasToken: boolean;
  cardStatus: string;
  binInfo: ICardBinInfo;
}

interface ICardBinInfo {
  bin: string;
  brand: string;
  type: string;
  level: string;
  countryCode: string;
  bank: string;
}

/**
 * Configuration options for initializing and customizing the XMoney payment form.
 *
 * @property container - HTML element selector or element reference where the payment form will be rendered. Required.
 * @property checksum - Checksum for the order. Required.
 * @property payload - Base64 encoded order payload. Required.
 * @property publicKey - Public key for the payment form, e.g., "pk_{env}_{siteId}". Required.
 * @property elementsOptions - Options for customizing the appearance and behavior of form elements.
 * @property elementsOptions.appearance - Appearance customization options.
 * @property elementsOptions.appearance.theme - Theme for the payment form. Default is "light".
 * @property elementsOptions.appearance.variables - CSS variables for custom themes.
 * @property elementsOptions.appearance.rules - CSS rules for custom styles.
 * @property elementsOptions.validationMode - Validation mode for the form. Default is "onSubmit".
 * @property elementsOptions.locale - Locale for the payment form. Default is "en-US".
 * @property savedCards - Array of saved cards. Optional.
 * @property onReady - Callback when the payment form is ready. Optional.
 * @property onError - Callback for errors. Optional.
 */
interface XMoneyPaymentFormConfig {
  /**
   * HTML element selector or element reference where the payment form will be rendered. Required.
   */
  container: string;

  /**
   * Checksum for the order. Required.
   */
  checksum: string;

  /**
   * Base64 encoded order details. Required.
   */
  payload: string;

  /**
   * Public key for the payment form, e.g., "pk_{env}_{siteId}". Required.
   */
  publicKey: string;

  /**
   * Options for customizing the appearance and behavior of form elements.
   */
  elementsOptions: {
    /**
     * Appearance customization options.
     */
    appearance?: {
      /**
       * Theme for the payment form. Default is "light".
       */
      theme?: "light" | "dark" | "custom";
      /**
       * CSS variables for custom themes.
       */
      variables?: Record<string, string>;
      /**
       * CSS rules for custom styles.
       */
      rules?: Record<string, Record<string, string>>;
    };
    /**
     * Validation mode for the form. Default is "onSubmit".
     */
    validationMode?: "onSubmit" | "onChange" | "onBlur" | "onTouched";
    /**
     * Locale for the payment form. Default is "en-US".
     */
    locale?: "en-US" | "el-GR" | "ro-RO";
    /**
     * Option to save card details for future transactions. Default is false.
     */
    saveCardOption?: boolean;
  };

  /**
   * Array of saved cards. Optional.
   */
  savedCards?: ICard[];

  /**
   * Callback when the payment form is ready. Optional.
   */
  onReady?: () => void;

  /**
   * Callback for errors. Optional.
   */
  onError?: (err: any) => void;
}

/**
 * Represents an instance of the XMoney payment form, providing methods to interact with and manage the form.
 *
 * @interface XMoneyPaymentFormInstance
 *
 * @method updateOrder
 * Updates the order details in the payment form.
 * @param payload - A JSON string containing the updated order details.
 * @param checksum - A string used to verify the integrity of the request.
 *
 * @method updateLocale
 * Updates the locale of the payment form.
 * @param locale - The locale to set for the payment form. Supported values: "en-US" | "el-GR" | "ro-RO".
 *
 * @method close
 * Closes the payment form.
 *
 * @method destroy
 * Performs cleanup and destroys the payment form instance.
 */
export interface XMoneyPaymentFormInstance {
  /**
   * Updates the order details in the payment form.
   * @param payload - A JSON string containing the updated order details.
   * @param checksum - A string used to verify the integrity of the request.
   */
  updateOrder: (payload: string, checksum: string) => void;

  /**
   * Updates the locale of the payment form.
   * @param locale - The locale to set for the payment form. Supported values: "en-US" | "el-GR" | "ro-RO".
   */
  updateLocale: (locale: "en-US" | "el-GR" | "ro-RO") => void;

  /**
   * Updates the appearance of the payment form.
   * @param appearance - An object containing theme styles to apply to the payment form.
   */
  updateAppearance: (appearance: {
    /**
     * Theme for the payment form. Default is "light".
     */
    theme?: "light" | "dark" | "custom";
    /**
     * CSS variables for custom themes.
     */
    variables?: Record<string, string>;
    /**
     * CSS rules for custom styles.
     */
    rules?: Record<string, Record<string, string>>;
  }) => void;

  /**
   * Closes the payment form.
   */
  close: () => void;

  /**
   * Performs cleanup and destroys the payment form instance.
   */
  destroy: () => void;
}

/**
 * Represents the constructor interface for creating an instance of XMoneyPaymentForm.
 *
 * @param config - The configuration object required to initialize the payment form.
 * @returns An instance of {@link XMoneyPaymentFormInstance}.
 */
export interface XMoneyPaymentForm {
  new (config: XMoneyPaymentFormConfig): XMoneyPaymentFormInstance;
}
