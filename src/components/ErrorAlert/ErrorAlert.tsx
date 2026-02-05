import { JSX } from "solid-js/jsx-runtime";
import "./ErrorAlert.css";

export interface ErrorAlertProps {
  message: string;
  title?: string;
  onDismiss?: () => void;
  variant?: "alert" | "banner";
}

export function ErrorAlert(props: ErrorAlertProps): JSX.Element {
  return (
    <div class={`error-alert error-alert-${props.variant || "banner"}`}>
      <div class="error-icon">
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

      <div class="error-content">
        {props.title && <h3 class="error-title">{props.title}</h3>}
        <p class="error-message">{props.message}</p>
      </div>

      {props.onDismiss && (
        <button
          class="error-dismiss"
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
