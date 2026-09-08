import { CURRENCY } from "../../constants";

export function AmountBar(props: { amount: number; embedded?: boolean }) {
  return (
    <div
      class={
        props.embedded
          ? "flex items-center justify-between pb-3 mb-3 border-b border-[var(--color-neutral-100)]"
          : "mb-4 sm:mb-6 flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-[var(--color-neutral-100)] shadow-[0_4px_24px_rgba(22,20,26,0.06)]"
      }
    >
      <span class="text-sm text-[var(--color-neutral-500)]">Total Amount</span>
      <span
        class={
          props.embedded
            ? "text-base font-bold text-[var(--color-neutral-900)]"
            : "text-xl font-bold text-[var(--color-neutral-900)]"
        }
      >
        {props.amount.toFixed(2)} {CURRENCY}
      </span>
    </div>
  );
}
