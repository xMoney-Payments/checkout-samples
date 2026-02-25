import { JSX } from "solid-js/jsx-runtime";

export interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: "sm" | "md" | "lg" | "xl";
  /** Optional message to display below spinner */
  message?: string;
  /** Enable overlay mode with positioning */
  overlay?: boolean;
  /** Use fixed positioning (full viewport). Only applies when overlay=true */
  fixed?: boolean;
  /** Custom class for additional styling */
  className?: string;
}

export function LoadingSpinner(props: LoadingSpinnerProps): JSX.Element {
  const size = props.size || "md";

  // Size configurations
  const sizeConfig = {
    sm: {
      spinner: "w-5 h-5 border-2",
      text: "text-xs",
      gap: "gap-2",
      padding: "p-3",
    },
    md: {
      spinner: "w-8 h-8 border-[3px]",
      text: "text-sm",
      gap: "gap-3",
      padding: "p-4",
    },
    lg: {
      spinner: "w-12 h-12 border-4",
      text: "text-base",
      gap: "gap-4",
      padding: "p-6",
    },
    xl: {
      spinner: "w-16 h-16 border-[5px]",
      text: "text-lg",
      gap: "gap-5",
      padding: "p-8",
    },
  };

  const config = sizeConfig[size];

  // Container classes based on overlay mode
  const getContainerClasses = () => {
    const baseClasses = `flex flex-col items-center justify-center ${config.gap}`;

    if (props.overlay) {
      const positionClass = props.fixed ? "fixed" : "absolute";
      return `${baseClasses} ${positionClass} inset-0 w-full h-full bg-white/95 backdrop-blur-sm z-50`;
    }

    return `${baseClasses} ${config.padding} ${props.className || ""}`;
  };

  return (
    <div class={getContainerClasses()}>
      {/* Spinner circle */}
      <div
        class={`${config.spinner} rounded-full border-solid border-transparent`}
        style={{
          animation: "spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite",
          "border-top-color": "var(--color-primary-500)",
          "border-left-color": "var(--color-primary-400)",
          "border-right-color": "var(--color-primary-300)",
        }}
      />

      {/* Optional message */}
      {props.message && (
        <p
          class={`${config?.text} m-0 text-center font-medium max-w-xs`}
          style={{ color: "var(--color-neutral-600)" }}
        >
          {props.message}
        </p>
      )}
    </div>
  );
}

// Keep backward compatibility with LoadingOverlay
export function LoadingOverlay(
  props: Omit<LoadingSpinnerProps, "overlay" | "fixed">,
): JSX.Element {
  return <LoadingSpinner {...props} overlay fixed />;
}
