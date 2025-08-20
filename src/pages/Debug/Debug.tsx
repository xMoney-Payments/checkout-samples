import { createSignal, onMount, Show } from "solid-js";
import { PaymentForm } from "../../components/PaymentForm/PaymentForm";
import { XMoneyPaymentFormConfig } from "../../components/PaymentForm/payment-form.types";
import { createPaymentIntent, getSessionToken } from "../../api";
import { CURRENCY, INITIAL_FORM_DATA, PUBLIC_KEY } from "../../constants";

import "./Debug.css";
import { Theme } from "../Payments/payments.types";
import {
  customThemeStylesBlue,
  customThemeStylesGreen,
  customThemeStylesPurple,
  darkThemeStyles,
  lightThemeStyles,
} from "../../example/styles";

export function DebugPaymentForm() {
  const [config, setConfig] = createSignal<Partial<XMoneyPaymentFormConfig>>({
    container: "payment-form-widget",
    sessionToken: "",
    publicKey: PUBLIC_KEY,
    options: {
      locale: "en-US",
      validationMode: "onChange",
      enableSavedCards: true,
      enableBackgroundRefresh: true,
      displaySaveCardOption: true,
      displayCardHolderName: false,
    },
  });

  const [showForm, setShowForm] = createSignal(false);

  onMount(async () => {
    const { data } = await getSessionToken();

    const paymentParams = {
      ...INITIAL_FORM_DATA,
      currency: CURRENCY,
      publicKey: PUBLIC_KEY,
    };

    const intentResult = await createPaymentIntent(paymentParams);

    setConfig((prev) => ({
      ...prev,
      sessionToken: data.token,
      checksum: intentResult?.checksum,
      payload: intentResult?.payload,
    }));
  });

  function getThemeStyles(selected: Theme) {
    const appearanceMap: Record<Theme, any> = {
      light: lightThemeStyles,
      dark: darkThemeStyles,
      customGreen: customThemeStylesGreen,
      customBlue: customThemeStylesBlue,
      customPurpule: customThemeStylesPurple,
    };

    return appearanceMap[selected];
  }

  function handleNestedInput(path: string[], value: any) {
    setConfig((prev) => {
      const updated = { ...prev };
      let ref: any = updated;

      for (let i = 0; i < path.length - 1; i++) {
        ref[path[i]] = { ...ref[path[i]] };
        ref = ref[path[i]];
      }

      ref[path[path.length - 1]] = value;
      return updated;
    });
  }

  return (
    <div class="debug-payment-form">
      <h2>Debug Payment Form</h2>

      {/* Config Panel */}
      <div style={{ display: showForm() ? "none" : "block" }}>
        <div class="config-form">
          <label>
            User ID:
            <input
              type="number"
              value={config().userId ?? ""}
              placeholder="Enter user ID"
              min={1}
              onInput={(e) =>
                handleNestedInput(
                  ["userId"],
                  e.currentTarget.value
                    ? Number(e.currentTarget.value)
                    : undefined
                )
              }
            />
          </label>

          <fieldset>
            <legend>Options</legend>
            {[
              { key: "enableSavedCards", label: "Enable Saved Cards" },
              {
                key: "enableBackgroundRefresh",
                label: "Enable Background Refresh",
              },
              {
                key: "displaySaveCardOption",
                label: "Display Save Card Option",
              },
              {
                key: "displayCardHolderName",
                label: "Display Card Holder Name",
              },
            ].map((opt) => (
              <label>
                <input
                  type="checkbox"
                  checked={
                    (config().options?.[
                      opt.key as keyof NonNullable<
                        XMoneyPaymentFormConfig["options"]
                      >
                    ] as boolean) ?? false
                  }
                  onChange={(e) =>
                    handleNestedInput(
                      ["options", opt.key],
                      e.currentTarget.checked
                    )
                  }
                />
                {opt.label}
              </label>
            ))}

            <label class="validation-mode">
              Locale:
              <select
                value={config().options?.locale}
                onChange={(e) =>
                  handleNestedInput(
                    ["options", "locale"],
                    e.currentTarget.value
                  )
                }
              >
                <option value="en-US">English</option>
                <option value="el-GR">Greek</option>
                <option value="ro-RO">Romanian</option>
              </select>
            </label>

            <label class="validation-mode">
              Validation Mode:
              <select
                value={config().options?.validationMode}
                onChange={(e) =>
                  handleNestedInput(
                    ["options", "validationMode"],
                    e.currentTarget.value
                  )
                }
              >
                <option value="onSubmit">onSubmit</option>
                <option value="onChange">onChange</option>
                <option value="onBlur">onBlur</option>
                <option value="onTouched">onTouched</option>
              </select>
            </label>
            <label class="validation-mode">
              Theme
              <select
                onChange={(e) => {
                  const selected = e.currentTarget.value as Theme;
                  const appearance = getThemeStyles(selected);
                  setConfig((prev) => ({
                    ...prev,
                    options: {
                      ...prev.options,
                      appearance,
                    },
                  }));
                }}
              >
                <option value="light">Light (Default)</option>
                <option value="dark">Dark</option>
                <option value="customGreen">Custom Green</option>
                <option value="customBlue">Custom Blue</option>
                <option value="customPurpule">Custom Purple</option>
              </select>
            </label>
          </fieldset>
        </div>
      </div>
      <div class="button-group">
        <button class="secondary" onClick={() => setShowForm((prev) => !prev)}>
          {showForm() ? "Try new config" : "Show Form"}
        </button>
      </div>

      {/* Payment Form Mount Area */}
      <Show when={showForm()}>
        <PaymentForm
          config={config() as XMoneyPaymentFormConfig}
          sessionToken={config().sessionToken || ""}
          result={{
            checksum: config().checksum || "",
            payload: config().payload || "",
          }}
          onClose={() => {
            setShowForm(false);
            console.log("Payment form closed");
          }}
          paymentFormInstanceRef={(instance) =>
            console.log("Form instance ready:", instance)
          }
        />
      </Show>
    </div>
  );
}
