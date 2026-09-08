import { createSignal, Show } from "solid-js";
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
  collapsible?: boolean;
  defaultOpen?: boolean;
}

function CardHeader(props: {
  icon: JSX.Element;
  iconBg: string;
  title: string;
  subtitle: string;
  showChevron?: boolean;
  open?: boolean;
}) {
  return (
    <div class="flex items-center gap-3 w-full">
      <div
        class={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center ${props.iconBg}`}
      >
        {props.icon}
      </div>
      <div class="min-w-0 flex-1">
        <h3 class="m-0 text-sm sm:text-base font-bold text-[var(--color-neutral-900)]">
          {props.title}
        </h3>
        <p class="m-0 text-xs text-[var(--color-neutral-400)] mt-0.5">
          {props.subtitle}
        </p>
      </div>
      <Show when={props.showChevron}>
        <svg
          class={`w-4 h-4 flex-shrink-0 text-[var(--color-neutral-400)] transition-transform duration-200 lg:hidden ${
            props.open ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </Show>
    </div>
  );
}

export function SectionCard(props: SectionCardProps) {
  const [open, setOpen] = createSignal(props.defaultOpen !== false);
  const bodyHidden = () => Boolean(props.collapsible) && !open();

  return (
    <div
      class={`bg-white rounded-xl sm:rounded-2xl border border-[var(--color-neutral-100)] shadow-[0_4px_24px_rgba(22,20,26,0.06)] overflow-hidden ${props.class ?? ""}`}
    >
      <Show
        when={props.collapsible}
        fallback={
          <div
            class={`px-4 py-3 sm:px-6 sm:py-5 border-b border-[var(--color-neutral-100)] ${props.headerBg}`}
          >
            <CardHeader
              icon={props.icon}
              iconBg={props.iconBg}
              title={props.title}
              subtitle={props.subtitle}
            />
          </div>
        }
      >
        <button
          type="button"
          class={`w-full px-4 py-3 sm:px-6 sm:py-5 text-left cursor-pointer lg:cursor-default ${
            bodyHidden() ? "lg:border-b" : "border-b"
          } border-[var(--color-neutral-100)] ${props.headerBg}`}
          onClick={() => {
            if (window.matchMedia("(min-width: 1024px)").matches) return;
            setOpen((value) => !value);
          }}
          aria-expanded={open()}
        >
          <CardHeader
            icon={props.icon}
            iconBg={props.iconBg}
            title={props.title}
            subtitle={props.subtitle}
            showChevron
            open={open()}
          />
        </button>
      </Show>
      <div class={bodyHidden() ? "hidden lg:block" : ""}>
        {props.children}
      </div>
    </div>
  );
}
