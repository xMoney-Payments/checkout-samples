import { createSignal, onCleanup } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { XMoneyPaymentFormInstance } from "../../../../types/xmoney-sdk/payment-form-sdk.types";
import { Locale, Theme } from "../../payments.types";
import { CURRENCY } from "../../../../constants";
import {
  customThemeStylesBlue,
  customThemeStylesGreen,
  customThemeStylesPurple,
  darkThemeStyles,
  lightThemeStyles,
} from "../../../../example/styles";

type Appearance = {
  theme?: "light" | "dark" | "custom";
  variables?: Record<string, string>;
  rules?: Record<string, Record<string, string>>;
};

interface PaymentFormConfigProps {
  paymentFormInstance: XMoneyPaymentFormInstance | null;
  amount: number;
  onAmountChange: (amount: number) => void;
  onAppearanceChange?: (appearance: Appearance) => void;
  onLocaleChange?: (locale: Locale) => void;
  disabled?: boolean;
}

export function PaymentFormConfig({
  amount,
  onAmountChange,
  onAppearanceChange,
  onLocaleChange,
  disabled = false,
}: PaymentFormConfigProps): JSX.Element {
  const [locale, setLocale] = createSignal<Locale>("en-US");
  const [theme, setTheme] = createSignal<Theme>("light");
  let debounceTimeout: number | null = null;

  const themeMap: Record<Theme, Appearance> = {
    light: lightThemeStyles,
    dark: darkThemeStyles,
    customGreen: customThemeStylesGreen,
    customBlue: customThemeStylesBlue,
    customPurple: customThemeStylesPurple,
  };

  function handleThemeChange(selected: Theme) {
    setTheme(selected);
    const appearance = themeMap[selected];
    if (appearance) {
      onAppearanceChange?.(appearance);
    }
  }

  function handleLocaleChange(newLocale: Locale) {
    setLocale(newLocale);
    onLocaleChange?.(newLocale);
  }

  function handleAmountInput(newAmount: number) {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = window.setTimeout(() => {
      onAmountChange(newAmount);
    }, 500);
  }

  onCleanup(() => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
  });

  return (
    <div class="grid gap-5 mb-8 p-5 rounded-2xl border bg-[color:var(--color-neutral-50)] border-[color:var(--color-neutral-100)] grid-cols-1 md:grid-cols-3">
      <div class="flex flex-col gap-2">
        <label class="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-neutral-500)]">
          Locale
        </label>
        <select
          value={locale()}
          onChange={(e) => handleLocaleChange(e.currentTarget.value as Locale)}
          class="w-full"
          disabled={disabled}
        >
          <option value="en-US">English</option>
          <option value="ro-RO">Romanian</option>
          <option value="el-GR">Greek</option>
        </select>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-neutral-500)]">
          Theme
        </label>
        <select
          value={theme()}
          onChange={(e) => handleThemeChange(e.currentTarget.value as Theme)}
          class="w-full"
          disabled={disabled}
        >
          <option value="light">Light (Default)</option>
          <option value="dark">Dark</option>
          <option value="customGreen">Custom Green</option>
          <option value="customBlue">Custom Blue</option>
          <option value="customPurple">Custom Purple</option>
        </select>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-neutral-500)]">
          Amount ({CURRENCY})
        </label>
        <input
          type="number"
          min={1}
          value={amount}
          onInput={(e) => handleAmountInput(Number(e.currentTarget.value))}
          class="w-auto min-w-[8rem]"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
