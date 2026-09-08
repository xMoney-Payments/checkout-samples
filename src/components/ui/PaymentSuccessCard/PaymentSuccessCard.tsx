import { createSignal, Show } from "solid-js";
import type { TransactionDetails } from "../../../types/checkout.types";
import { DetailRow } from "./components/DetailRow/DetailRow";

interface PaymentSuccessCardProps {
  result: TransactionDetails;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PaymentSuccessCard(props: PaymentSuccessCardProps) {
  const result = props.result;
  const [expanded, setExpanded] = createSignal(false);

  return (
    <div class="max-w-md mx-auto animate-[slideInDown_0.35s_ease] mt-3 sm:mt-6">
      <div class="bg-white rounded-2xl border border-[var(--color-neutral-100)] shadow-[0_8px_40px_rgba(22,20,26,0.10)] overflow-hidden">
        <div class="bg-gradient-to-br from-[var(--color-green-500)] to-[var(--color-green-600)] px-4 py-6 sm:px-6 sm:py-8 text-center text-white">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
            <svg
              class="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 class="m-0 text-xl font-bold">Payment Successful</h3>
          <p class="m-0 mt-1 text-sm text-white/80">
            Your order has been confirmed
          </p>
          <div class="mt-5">
            <span class="text-3xl font-bold tracking-tight">
              {result.amount} {result.currencyKey}
            </span>
          </div>
        </div>

        <div class="p-4 sm:p-6 flex flex-col gap-4">
          <div class="flex flex-col gap-0 divide-y divide-[var(--color-neutral-100)]">
            <DetailRow label="Transaction ID" value={`#${result.id}`} mono />
            <DetailRow
              label="Order ID"
              value={`#${result.externalOrderId}`}
              mono
            />
            <DetailRow
              label="Status"
              value={formatStatus(result.transactionStatus)}
              badge
            />
            <Show when={result.customerData?.creationDate}>
              <DetailRow
                label="Date"
                value={formatDate(result.customerData.creationDate)}
              />
            </Show>
            <Show when={result.customerData?.email}>
              <DetailRow
                label="Receipt sent to"
                value={result.customerData.email}
              />
            </Show>
          </div>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            class="w-full flex items-center justify-between py-2 px-0 text-sm font-medium
              text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)]
              transition-colors duration-200 bg-transparent border-0 cursor-pointer"
          >
            <span>{expanded() ? "Hide details" : "More details"}</span>
            <svg
              class={`w-4 h-4 transition-transform duration-200 ${expanded() ? "rotate-180" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          <Show when={expanded()}>
            <div class="flex flex-col gap-0 divide-y divide-[var(--color-neutral-100)] border-t border-[var(--color-neutral-100)]">
              <Show when={result.customerData?.firstName}>
                <DetailRow
                  label="Customer"
                  value={`${result.customerData.firstName} ${result.customerData.lastName}`}
                />
              </Show>
              <Show when={result.customerData?.phone}>
                <DetailRow label="Phone" value={result.customerData.phone} />
              </Show>
              <Show when={result.customerData?.country}>
                <DetailRow label="Country" value={result.customerData.country} />
              </Show>
              <Show when={result.amountInEuro}>
                <DetailRow
                  label="Amount (EUR)"
                  value={`€${result.amountInEuro}`}
                />
              </Show>
              <Show when={result.description}>
                <DetailRow label="Description" value={result.description} />
              </Show>
            </div>
          </Show>
        </div>

        <div class="px-4 pb-4 sm:px-6 sm:pb-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            class="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm
              text-[var(--color-neutral-700)] bg-[var(--color-neutral-50)] border border-[var(--color-neutral-200)]
              hover:bg-[var(--color-neutral-100)] hover:border-[var(--color-neutral-300)]
              active:scale-[0.98] transition-all duration-200"
          >
            <svg
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Try new transaction
          </button>
          <div class="flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-green-50)] border border-[var(--color-green-100)]">
            <svg
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-green-600)"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span class="text-xs font-medium text-[var(--color-green-700)]">
              Secured by xMoney
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatStatus(status: string): string {
  const map: Record<string, string> = {
    "complete-ok": "Completed",
    "in-progress": "In Progress",
    "complete-failed": "Failed",
    start: "Started",
    "cancel-ok": "Cancelled",
    "3d-pending": "3D Secure Pending",
  };
  return map[status] || status;
}
