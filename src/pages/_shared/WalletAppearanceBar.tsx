import { For } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import type {
  ApplePayAppearance,
  ApplePayButtonStyle,
  ApplePayButtonType,
  GooglePayAppearance,
  GooglePayButtonBorderType,
  GooglePayButtonColor,
  GooglePayButtonType,
} from "../../types/xmoney-sdk/sdk-base.types";

const APPLE_STYLES: ApplePayButtonStyle[] = ["black", "white", "white-outline"];
const APPLE_TYPES: ApplePayButtonType[] = [
  "plain",
  "buy",
  "pay",
  "book",
  "checkout",
  "donate",
  "order",
  "subscribe",
  "add-money",
  "top-up",
  "continue",
  "contribute",
  "reload",
  "rent",
  "set-up",
  "support",
  "tip",
];

const GOOGLE_COLORS: GooglePayButtonColor[] = ["black", "white"];
const GOOGLE_TYPES: GooglePayButtonType[] = [
  "plain",
  "buy",
  "pay",
  "book",
  "checkout",
  "donate",
  "order",
  "subscribe",
];
const GOOGLE_BORDERS: GooglePayButtonBorderType[] = [
  "no_border",
  "default_border",
];

const HEIGHTS = [40, 48, 56];
const RADII = [4, 8, 12, 20];

const fieldClass = "flex flex-col gap-2";
const labelClass =
  "text-xs font-semibold uppercase tracking-wider text-[color:var(--color-neutral-500)]";

function SelectField(props: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}): JSX.Element {
  return (
    <div class={fieldClass}>
      <label class={labelClass}>{props.label}</label>
      <select
        value={String(props.value)}
        onChange={(event) => props.onChange(event.currentTarget.value)}
        class="w-full"
      >
        <For each={props.options}>
          {(option) => <option value={option.value}>{option.label}</option>}
        </For>
      </select>
    </div>
  );
}

function formatOption(value: string): string {
  return value
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export const DEFAULT_APPLE_PAY_APPEARANCE: ApplePayAppearance = {
  style: "black",
  type: "plain",
  radius: 12,
  height: 48,
};

export const DEFAULT_GOOGLE_PAY_APPEARANCE: GooglePayAppearance = {
  color: "black",
  type: "plain",
  radius: 12,
  height: 48,
  borderType: "no_border",
};

export function applePayNeedsDarkSurface(appearance: ApplePayAppearance): boolean {
  return appearance.style === "white";
}

export function googlePayNeedsDarkSurface(
  appearance: GooglePayAppearance,
): boolean {
  return appearance.color === "white";
}

export function ApplePayAppearanceBar(props: {
  appearance: ApplePayAppearance;
  onChange: (appearance: ApplePayAppearance) => void;
}): JSX.Element {
  return (
    <div class="mb-4 grid gap-3 p-3 sm:gap-5 sm:p-5 rounded-xl sm:rounded-2xl border border-[var(--color-neutral-100)] shadow-[0_4px_24px_rgba(22,20,26,0.06)] bg-gradient-to-r from-[var(--color-yellow-50)] to-white grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <SelectField
        label="Style"
        value={props.appearance.style ?? "black"}
        onChange={(value) =>
          props.onChange({
            ...props.appearance,
            style: value as ApplePayButtonStyle,
          })
        }
        options={APPLE_STYLES.map((style) => ({
          value: style,
          label: formatOption(style),
        }))}
      />
      <SelectField
        label="Type"
        value={props.appearance.type ?? "plain"}
        onChange={(value) =>
          props.onChange({
            ...props.appearance,
            type: value as ApplePayButtonType,
          })
        }
        options={APPLE_TYPES.map((type) => ({
          value: type,
          label: formatOption(type),
        }))}
      />
      <SelectField
        label="Height"
        value={props.appearance.height ?? 48}
        onChange={(value) =>
          props.onChange({ ...props.appearance, height: Number(value) })
        }
        options={HEIGHTS.map((height) => ({
          value: String(height),
          label: `${height}px`,
        }))}
      />
      <SelectField
        label="Radius"
        value={props.appearance.radius ?? 12}
        onChange={(value) =>
          props.onChange({ ...props.appearance, radius: Number(value) })
        }
        options={RADII.map((radius) => ({
          value: String(radius),
          label: `${radius}px`,
        }))}
      />
    </div>
  );
}

export function GooglePayAppearanceBar(props: {
  appearance: GooglePayAppearance;
  onChange: (appearance: GooglePayAppearance) => void;
}): JSX.Element {
  return (
    <div class="mb-4 grid gap-3 p-3 sm:gap-5 sm:p-5 rounded-xl sm:rounded-2xl border border-[var(--color-neutral-100)] shadow-[0_4px_24px_rgba(22,20,26,0.06)] bg-gradient-to-r from-[var(--color-yellow-50)] to-white grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
      <SelectField
        label="Color"
        value={props.appearance.color ?? "black"}
        onChange={(value) =>
          props.onChange({
            ...props.appearance,
            color: value as GooglePayButtonColor,
          })
        }
        options={GOOGLE_COLORS.map((color) => ({
          value: color,
          label: formatOption(color),
        }))}
      />
      <SelectField
        label="Type"
        value={props.appearance.type ?? "plain"}
        onChange={(value) =>
          props.onChange({
            ...props.appearance,
            type: value as GooglePayButtonType,
          })
        }
        options={GOOGLE_TYPES.map((type) => ({
          value: type,
          label: formatOption(type),
        }))}
      />
      <SelectField
        label="Border"
        value={props.appearance.borderType ?? "no_border"}
        onChange={(value) =>
          props.onChange({
            ...props.appearance,
            borderType: value as GooglePayButtonBorderType,
          })
        }
        options={GOOGLE_BORDERS.map((border) => ({
          value: border,
          label: formatOption(border),
        }))}
      />
      <SelectField
        label="Height"
        value={props.appearance.height ?? 48}
        onChange={(value) =>
          props.onChange({ ...props.appearance, height: Number(value) })
        }
        options={HEIGHTS.map((height) => ({
          value: String(height),
          label: `${height}px`,
        }))}
      />
      <SelectField
        label="Radius"
        value={props.appearance.radius ?? 12}
        onChange={(value) =>
          props.onChange({ ...props.appearance, radius: Number(value) })
        }
        options={RADII.map((radius) => ({
          value: String(radius),
          label: `${radius}px`,
        }))}
      />
    </div>
  );
}
