import { Show } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import type { TransactionDetails } from "../../types/checkout.types";
import { ErrorAlert } from "../../components/ui/ErrorAlert/ErrorAlert";
import { PaymentSuccessCard } from "../../components/ui/PaymentSuccessCard/PaymentSuccessCard";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner/LoadingSpinner";
import { SecureInfo } from "../../components/ui/SecureInfo/SecureInfo";

export interface SimpleExampleProps {
  title: string;
  description: string;
  sdkMethod: string;
  integrationPath: string;
  error: string | null;
  onDismissError?: () => void;
  transactionResult: TransactionDetails | null;
  isLoading: boolean;
  loadingMessage?: string;
  children: JSX.Element;
}

export function SimpleExample(props: SimpleExampleProps): JSX.Element {
  return (
    <div class="min-h-screen">
      <div class="max-w-2xl mx-auto px-3 pt-4 sm:px-6 sm:pt-8">
        <p class="m-0 text-xs font-semibold uppercase tracking-wider text-[var(--color-neutral-400)]">
          Simple example
        </p>
        <h1 class="m-0 mt-1 text-xl sm:text-2xl font-bold text-[var(--color-neutral-900)]">
          {props.title}
        </h1>
        <p class="m-0 mt-2 text-sm text-[var(--color-neutral-500)] leading-relaxed">
          {props.description}
        </p>
        <div class="mt-3 sm:mt-4 rounded-xl border border-[var(--color-neutral-100)] bg-white px-3 py-2.5 sm:px-4 sm:py-3">
          <p class="m-0 font-mono text-xs text-[var(--color-neutral-800)]">
            {props.sdkMethod}
          </p>
          <p class="m-0 mt-1 font-mono text-xs text-[var(--color-primary-600)] break-all">
            {props.integrationPath}
          </p>
        </div>
      </div>

      <div class="max-w-2xl mx-auto px-3 mt-4 sm:px-6 sm:mt-6">
        <Show when={props.transactionResult}>
          <PaymentSuccessCard result={props.transactionResult!} />
        </Show>
        <Show when={props.error}>
          <ErrorAlert
            title="Error"
            message={props.error!}
            onDismiss={props.onDismissError}
            variant="banner"
          />
        </Show>
      </div>

      <Show when={props.isLoading}>
        <div class="max-w-2xl mx-auto px-3 py-8 sm:px-6 sm:py-12">
          <LoadingSpinner
            size="lg"
            message={props.loadingMessage ?? "Initializing payment..."}
          />
        </div>
      </Show>

      <Show when={!props.isLoading && !props.transactionResult}>
        <div class="max-w-2xl mx-auto px-3 pb-8 mt-2 sm:px-6 sm:pb-12">
          {props.children}
          <SecureInfo />
        </div>
      </Show>
    </div>
  );
}
