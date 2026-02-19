import type { JSX } from "solid-js/jsx-runtime";

interface PaymentMethodsPanelProps {
  children: JSX.Element;
}

export function PaymentMethodsPanel(props: PaymentMethodsPanelProps) {
  return (
    <div class="bg-white rounded-2xl border border-[var(--color-neutral-100)] shadow-[0_4px_24px_rgba(22,20,26,0.06)] overflow-hidden">
      <div class="px-6 py-5 border-b border-[var(--color-neutral-100)] bg-gradient-to-r from-[var(--color-blue-50)] to-white">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-[var(--color-blue-100)] flex items-center justify-center">
            <svg
              class="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-blue-600)"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>
          <div>
            <h3 class="m-0 text-base font-bold text-[var(--color-neutral-900)]">
              Payment Method
            </h3>
            <p class="m-0 text-xs text-[var(--color-neutral-400)] mt-0.5">
              Choose how you'd like to pay
            </p>
          </div>
        </div>
      </div>
      <div class="p-5 flex flex-col gap-3">{props.children}</div>
    </div>
  );
}
