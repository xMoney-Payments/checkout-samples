export function SecureInfo() {
  return (
    <div class="flex items-center justify-center gap-2 mt-5">
      <svg
        class="w-3.5 h-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-green-600)"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      <span class="text-xs text-[var(--color-neutral-400)]">
        Secured by xMoney
      </span>
    </div>
  );
}
