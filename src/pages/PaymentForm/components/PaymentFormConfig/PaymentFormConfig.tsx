import { createSignal, onCleanup } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { PaymentFormInstance } from "../../../../types/xmoney-sdk/payment-form-sdk.types";
import { Theme } from "../../payments.types";
import { CURRENCY } from "../../../../constants";
import {
  customThemeStylesBlue,
  customThemeStylesGreen,
  customThemeStylesPurple,
  darkThemeStyles,
  lightThemeStyles,
} from "../../../../example/styles";
import type {
  Appearance,
  CardInputGrouping,
  Locale,
} from "../../../../types/xmoney-sdk/sdk-base.types";

interface PaymentFormConfigProps {
  paymentFormInstance: PaymentFormInstance | null;
  amount: number;
  onAmountChange: (amount: number) => void;
  onAppearanceChange?: (appearance: Appearance) => void;
  onLocaleChange?: (locale: Locale) => void;
  onInputGroupingChange?: (grouping: CardInputGrouping) => void;
  disabled?: boolean;
}

export function PaymentFormConfig({
  amount,
  onAmountChange,
  onAppearanceChange,
  onLocaleChange,
  onInputGroupingChange,
  disabled = false,
}: PaymentFormConfigProps): JSX.Element {
  const [locale, setLocale] = createSignal<Locale>("en-US");
  const [theme, setTheme] = createSignal<Theme>("light");
  const [inputGrouping, setInputGrouping] =
    createSignal<CardInputGrouping>("spaced");
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

  function handleInputGroupingChange(grouping: CardInputGrouping) {
    setInputGrouping(grouping);
    onInputGroupingChange?.(grouping);
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
    <div class="grid gap-3 mb-2 p-3 sm:gap-5 sm:p-5 rounded-xl sm:rounded-2xl border border-[var(--color-neutral-100)] shadow-[0_4px_24px_rgba(22,20,26,0.06)] bg-gradient-to-r from-[var(--color-yellow-50)] to-white grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
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
          <option value="bg-BG">Bulgarian</option>
          <option value="hu-HU">Hungarian</option>
          <option value="pl-PL">Polish</option>
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
          Card layout
        </label>
        <select
          value={inputGrouping()}
          onChange={(e) =>
            handleInputGroupingChange(
              e.currentTarget.value as CardInputGrouping,
            )
          }
          class="w-full"
          disabled={disabled}
        >
          <option value="spaced">Spaced</option>
          <option value="condensed">Condensed</option>
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
