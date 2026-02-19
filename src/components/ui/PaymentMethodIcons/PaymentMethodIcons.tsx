export function CreditCardIcon() {
  return (
    <svg
      class="w-6 h-5"
      viewBox="0 0 24 18"
      fill="none"
      stroke="var(--color-primary-500)"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="1" y="1" width="22" height="16" rx="3" />
      <line x1="1" y1="7" x2="23" y2="7" />
      <line x1="5" y1="12" x2="10" y2="12" />
    </svg>
  );
}

export function SavedCardIcon() {
  return (
    <svg
      class="w-6 h-5"
      viewBox="0 0 24 18"
      fill="none"
      stroke="var(--color-green-600)"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="1" y="1" width="22" height="16" rx="3" />
      <path d="M9 10l2 2 4-4" />
    </svg>
  );
}

export function GooglePayIcon() {
  return (
    <svg class="w-7 h-5" viewBox="0 0 40 24">
      <text
        x="20"
        y="16"
        text-anchor="middle"
        font-size="10"
        font-weight="700"
        fill="#4285F4"
      >
        G Pay
      </text>
    </svg>
  );
}

export function ApplePayIcon() {
  return (
    <svg class="w-7 h-5" viewBox="0 0 40 24">
      <text
        x="20"
        y="16"
        text-anchor="middle"
        font-size="10"
        font-weight="700"
        fill="#000"
      >
        Pay
      </text>
    </svg>
  );
}
