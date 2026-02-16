import { createSignal, For } from "solid-js";

import { TransactionDetails } from "../../../types/checkout.types";

interface TransactionResultProps {
  result: TransactionDetails;
  onRetry: () => void;
}

export function TransactionResult(props: TransactionResultProps) {
  const [showRaw, setShowRaw] = createSignal(false);
  const { result } = props;
  const isFailed = result.transactionStatus?.includes("failed") || !result.id;
  const statusLabel = () => (isFailed ? "Failed" : "Successful");
  const statusTone = () =>
    isFailed
      ? "inline-flex items-center text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full border text-[color:var(--color-red-700)] bg-[color:var(--color-red-50)] border-[color:var(--color-red-200)]"
      : "inline-flex items-center text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full border text-[color:var(--color-green-700)] bg-[color:var(--color-green-50)] border-[color:var(--color-green-200)]";
  const displayValue = (value: unknown) =>
    value === null || value === undefined || value === "" ? "-" : value;
  const customerName = () => {
    const first = result.customerData?.firstName;
    const last = result.customerData?.lastName;
    const fullName = [first, last].filter(Boolean).join(" ");
    return fullName || "-";
  };
  const amountLabel = () => {
    if (result.amount === null || result.amount === undefined) {
      return "-";
    }

    return result.currency
      ? `${result.amount} ${result.currency}`
      : String(result.amount);
  };
  const details = () => [
    { label: "Transaction ID", value: displayValue(result.id) },
    { label: "Order ID", value: displayValue(result.orderId) },
    { label: "Customer ID", value: displayValue(result.customerId) },
    { label: "Customer", value: customerName() },
    { label: "Email", value: displayValue(result.customerData?.email) },
    { label: "Amount", value: amountLabel() },
    {
      label: "Status",
      value: displayValue(result.transactionStatus),
    },
    { label: "Description", value: displayValue(result.description) },
  ];

  return (
    <div class="rounded-2xl border bg-white p-6 shadow-[0_12px_28px_rgba(22,20,26,0.08)] border-[color:var(--color-neutral-100)]">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 class="m-0 text-lg font-semibold">Transaction {statusLabel()}</h2>
          <p class="m-0 text-sm" style={{ color: "var(--color-neutral-500)" }}>
            Review the details from your latest payment attempt.
          </p>
        </div>
        <span class={statusTone()}>
          {result.transactionStatus || "Unknown"}
        </span>
      </div>

      <dl class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <For each={details()}>
          {(detail) => (
            <div class="rounded-xl border p-4 bg-[color:var(--color-neutral-50)] border-[color:var(--color-neutral-100)]">
              <dt
                class="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--color-neutral-500)" }}
              >
                {detail.label}
              </dt>
              <dd class="mt-1 text-sm font-medium break-words">
                {detail.value}
              </dd>
            </div>
          )}
        </For>
      </dl>

      <div class="mt-6 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          class="px-4 py-2 rounded-md font-semibold transition-colors border border-[color:var(--color-primary-400)] text-[color:var(--color-primary-600)] bg-white hover:bg-[color:var(--color-primary-50)]"
          onClick={() => setShowRaw(!showRaw())}
        >
          {showRaw() ? "Hide raw data" : "Show raw data"}
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded-md font-semibold transition-all shadow-md hover:shadow-lg text-white border border-[color:var(--color-primary-600)]"
          style={{
            backgroundImage:
              "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-400))",
          }}
          onClick={props.onRetry}
        >
          Retry transaction
        </button>
      </div>

      {showRaw() && (
        <pre
          class="mt-4 max-h-72 overflow-auto rounded-xl border p-4 text-xs"
          style={{
            borderColor: "var(--color-neutral-200)",
            backgroundColor: "var(--color-neutral-50)",
            color: "var(--color-neutral-700)",
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
