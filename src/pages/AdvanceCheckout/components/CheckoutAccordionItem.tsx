import { Show } from "solid-js";
import type { CheckoutAccordionItemProps } from "../types";

export function CheckoutAccordionItem(props: CheckoutAccordionItemProps) {
  return (
    <div
      class={`rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
        props.isOpen
          ? "border-[var(--color-primary-400)] bg-white shadow-[0_8px_30px_rgba(124,77,255,0.12)]"
          : "border-[var(--color-neutral-100)] bg-white hover:border-[var(--color-neutral-200)] hover:shadow-sm"
      }`}
    >
      <button
        type="button"
        class="w-full flex items-center gap-4 px-5 py-4 bg-transparent cursor-pointer text-left transition-colors duration-200"
        onClick={props.onToggle}
        aria-expanded={props.isOpen}
      >
        <div
          class={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
            props.isOpen
              ? "border-[var(--color-primary-500)] bg-[var(--color-primary-500)]"
              : "border-[var(--color-neutral-300)]"
          }`}
        >
          <Show when={props.isOpen}>
            <div class="w-2 h-2 rounded-full bg-white" />
          </Show>
        </div>

        <span class="flex items-center justify-center w-11 h-9 rounded-xl flex-shrink-0 bg-[var(--color-neutral-25)] border border-[var(--color-neutral-100)] overflow-hidden">
          {props.icon}
        </span>

        <div class="flex-1 min-w-0">
          <h4 class="m-0 text-sm font-semibold text-[var(--color-neutral-900)]">
            {props.title}
          </h4>
          <p class="m-0 mt-0.5 text-xs text-[var(--color-neutral-400)]">
            {props.subtitle}
          </p>
        </div>

        <svg
          class={`w-4 h-4 text-[var(--color-neutral-400)] transition-transform duration-300 flex-shrink-0 ${
            props.isOpen ? "rotate-180" : ""
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
      </button>

      <Show when={props.isOpen}>
        <div class="px-5 pb-5 pt-1 animate-[slideDown_0.25s_ease]">
          <div class="border-t border-[var(--color-neutral-100)] pt-4">
            {props.children}
          </div>
        </div>
      </Show>
    </div>
  );
}
