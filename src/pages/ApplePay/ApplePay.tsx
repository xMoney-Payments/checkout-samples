import { Show, createSignal } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { SimpleExample } from "../_shared/SimpleExample";
import { AmountBar } from "../_shared/AmountBar";
import { usePaymentIntent } from "../_shared/usePaymentIntent";
import { useWalletCapability } from "../_shared/useWalletCapability";
import {
  ApplePayAppearanceBar,
  DEFAULT_APPLE_PAY_APPEARANCE,
  applePayNeedsDarkSurface,
} from "../_shared/WalletAppearanceBar";
import { ApplePay } from "../../components/xmoney-integrations/ApplePay/ApplePay";
import { INITIAL_FORM_DATA } from "../../constants";
import type { ApplePayAppearance } from "../../types/xmoney-sdk/sdk-base.types";

export function ApplePayPage(): JSX.Element {
  const checkout = usePaymentIntent();
  const capability = useWalletCapability("applePay");
  const [appearance, setAppearance] = createSignal<ApplePayAppearance>(
    DEFAULT_APPLE_PAY_APPEARANCE,
  );

  const isLoading = () => checkout.isLoading() || capability() === null;
  const appearanceKey = () =>
    [
      appearance().style,
      appearance().type,
      appearance().radius,
      appearance().height,
    ].join("-");

  return (
    <SimpleExample
      title="Apple Pay"
      description="Native Apple Pay button. Availability is checked with getPaymentMethodCapabilities() first. Appearance is limited to Apple’s official button style, type, height, and corner radius — custom artwork is not allowed."
      sdkMethod="XMoney.applePay()"
      integrationPath="src/components/xmoney-integrations/ApplePay/ApplePay.tsx"
      error={checkout.error()}
      onDismissError={() => checkout.setError(null)}
      transactionResult={checkout.transactionResult()}
      isLoading={isLoading()}
      loadingMessage="Checking Apple Pay availability..."
    >
      <Show when={checkout.order()}>
        <AmountBar amount={INITIAL_FORM_DATA.amount} />
        <Show
          when={capability()?.supported}
          fallback={
            <div class="p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-[var(--color-neutral-100)] bg-white">
              <p class="m-0 text-sm font-semibold text-[var(--color-neutral-800)]">
                Apple Pay is not available
              </p>
              <p class="m-0 mt-1 text-sm text-[var(--color-neutral-500)]">
                {capability()?.reason ??
                  "This browser or device does not support Apple Pay."}
              </p>
            </div>
          }
        >
          <ApplePayAppearanceBar
            appearance={appearance()}
            onChange={setAppearance}
          />
          <div
            class="p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-[var(--color-neutral-100)]"
            classList={{
              "bg-white": !applePayNeedsDarkSurface(appearance()),
              "bg-[var(--color-neutral-900)]": applePayNeedsDarkSurface(
                appearance(),
              ),
            }}
          >
            <Show when={appearanceKey()} keyed>
              <ApplePay
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
