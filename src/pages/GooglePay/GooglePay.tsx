import { Show, createSignal } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { SimpleExample } from "../_shared/SimpleExample";
import { AmountBar } from "../_shared/AmountBar";
import { usePaymentIntent } from "../_shared/usePaymentIntent";
import { useWalletCapability } from "../_shared/useWalletCapability";
import {
  GooglePayAppearanceBar,
  DEFAULT_GOOGLE_PAY_APPEARANCE,
  googlePayNeedsDarkSurface,
} from "../_shared/WalletAppearanceBar";
import { GooglePay } from "../../components/xmoney-integrations/GooglePay/GooglePay";
import { INITIAL_FORM_DATA } from "../../constants";
import type { GooglePayAppearance } from "../../types/xmoney-sdk/sdk-base.types";

export function GooglePayPage(): JSX.Element {
  const checkout = usePaymentIntent();
  const capability = useWalletCapability("googlePay");
  const [appearance, setAppearance] = createSignal<GooglePayAppearance>(
    DEFAULT_GOOGLE_PAY_APPEARANCE,
  );

  const isLoading = () => checkout.isLoading() || capability() === null;
  const appearanceKey = () =>
    [
      appearance().color,
      appearance().type,
      appearance().borderType,
      appearance().radius,
      appearance().height,
    ].join("-");

  return (
    <SimpleExample
      title="Google Pay"
      description="Native Google Pay button. Availability is checked with getPaymentMethodCapabilities() first. Appearance is limited to Google’s official button color, type, border, height, and corner radius — custom artwork is not allowed."
      sdkMethod="XMoney.googlePay()"
      integrationPath="src/components/xmoney-integrations/GooglePay/GooglePay.tsx"
      error={checkout.error()}
      onDismissError={() => checkout.setError(null)}
      transactionResult={checkout.transactionResult()}
      isLoading={isLoading()}
      loadingMessage="Checking Google Pay availability..."
    >
      <Show when={checkout.order()}>
        <AmountBar amount={INITIAL_FORM_DATA.amount} />
        <Show
          when={capability()?.supported}
          fallback={
            <div class="p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-[var(--color-neutral-100)] bg-white">
              <p class="m-0 text-sm font-semibold text-[var(--color-neutral-800)]">
                Google Pay is not available
              </p>
              <p class="m-0 mt-1 text-sm text-[var(--color-neutral-500)]">
                {capability()?.reason ??
                  "This browser or device does not support Google Pay."}
              </p>
            </div>
          }
        >
          <GooglePayAppearanceBar
            appearance={appearance()}
            onChange={setAppearance}
          />
          <div
            class="p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-[var(--color-neutral-100)]"
            classList={{
              "bg-white": !googlePayNeedsDarkSurface(appearance()),
              "bg-[var(--color-neutral-900)]": googlePayNeedsDarkSurface(
                appearance(),
              ),
            }}
          >
            <Show when={appearanceKey()} keyed>
              <GooglePay
                payload={checkout.order()!.payload}
                checksum={checkout.order()!.checksum}
                appearance={appearance()}
                onPaymentComplete={checkout.handlePaymentComplete}
                onError={checkout.handlePaymentError}
              />
            </Show>
          </div>
        </Show>
      </Show>
    </SimpleExample>
  );
}
