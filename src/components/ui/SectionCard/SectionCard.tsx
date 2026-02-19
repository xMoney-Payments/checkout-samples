import type { JSX } from "solid-js/jsx-runtime";

export function PaymentMethodCardIcon() {
  return (
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
  );
}

interface SectionCardProps {
  icon: JSX.Element;
  iconBg: string;
  headerBg: string;
  title: string;
  subtitle: string;
  children: JSX.Element;
  class?: string;
}

export function SectionCard(props: SectionCardProps) {
  return (
    <div
      class={`bg-white rounded-2xl border border-[var(--color-neutral-100)] shadow-[0_4px_24px_rgba(22,20,26,0.06)] overflow-hidden ${props.class ?? ""}`}
    >
      <div
        class={`px-6 py-5 border-b border-[var(--color-neutral-100)] ${props.headerBg}`}
      >
        <div class="flex items-center gap-3">
          <div
            class={`w-9 h-9 rounded-xl flex items-center justify-center ${props.iconBg}`}
          >
            {props.icon}
          </div>
          <div>
            <h3 class="m-0 text-base font-bold text-[var(--color-neutral-900)]">
              {props.title}
            </h3>
            <p class="m-0 text-xs text-[var(--color-neutral-400)] mt-0.5">
              {props.subtitle}
            </p>
          </div>
        </div>
      </div>
      {props.children}
    </div>
  );
}
