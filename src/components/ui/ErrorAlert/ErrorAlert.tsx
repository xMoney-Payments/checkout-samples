import { JSX } from "solid-js/jsx-runtime";

export interface ErrorAlertProps {
  message: string;
  title?: string;
  onDismiss?: () => void;
  variant?: "alert" | "banner";
}

export function ErrorAlert(props: ErrorAlertProps): JSX.Element {
  const isBanner = props.variant === "banner";

  return (
    <div
      class={
        isBanner
          ? "flex gap-3 p-3 sm:gap-4 sm:p-5 rounded-xl mb-3 sm:mb-5 shadow-md border bg-[color:var(--color-red-50)] border-[color:var(--color-red-200)] animate-[slideInDown_0.35s_ease]"
          : "flex items-start gap-3 p-4 rounded-lg border bg-[color:var(--color-red-50)] border-[color:var(--color-red-200)]"
      }
    >
      <div
        class={
          isBanner
            ? "w-7 h-7 flex items-center justify-center flex-shrink-0"
            : "flex-shrink-0 w-6 h-6 flex items-center justify-center mt-0.5"
        }
        style={{ color: "var(--color-red-600)" }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <div class="flex-1 min-w-0">
        {props.title && (
          <h3
            class={
              isBanner ? "text-base m-0 mb-1" : "m-0 mb-1 text-sm font-bold"
            }
            style={{ color: "var(--color-red-900)" }}
          >
            {props.title}
          </h3>
        )}
        <p
          class={
            isBanner
              ? "m-0 text-sm opacity-95 leading-relaxed"
              : "m-0 text-sm leading-relaxed"
          }
          style={{ color: "var(--color-red-700)" }}
        >
          {props.message}
        </p>
      </div>

      {props.onDismiss && (
        <button
          class={
            isBanner
              ? "flex-shrink-0 bg-transparent border-none cursor-pointer flex items-center justify-center transition-colors duration-200"
              : "flex-shrink-0 bg-transparent border-none cursor-pointer p-1 flex items-center justify-center transition-colors duration-200 mt-0.5"
          }
          style={{ color: "var(--color-red-700)" }}
          onClick={props.onDismiss}
          aria-label="Dismiss error"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
