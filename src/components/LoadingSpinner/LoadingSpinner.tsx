import { JSX } from "solid-js/jsx-runtime";
import "./LoadingSpinner.css";

export interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  message?: string;
}

export function LoadingSpinner(props: LoadingSpinnerProps): JSX.Element {
  return (
    <div class={`loading-spinner loading-spinner-${props.size || "medium"}`}>
      <div class="spinner-circle" />
      {props.message && <p class="spinner-message">{props.message}</p>}
    </div>
  );
}

export function LoadingOverlay(props: LoadingSpinnerProps): JSX.Element {
  return (
    <div class={`loading-overlay loading-overlay-${props.size || "medium"}`}>
      <div class="spinner-circle" />
      {props.message && <p class="spinner-message">{props.message}</p>}
    </div>
  );
}
