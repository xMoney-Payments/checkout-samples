interface DetailRowProps {
  label: string;
  value: string;
  mono?: boolean;
  badge?: boolean;
}

export function DetailRow(props: DetailRowProps) {
  return (
    <div class="flex items-center justify-between py-3">
      <span class="text-sm text-[var(--color-neutral-400)]">{props.label}</span>
      {props.badge ? (
        <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-green-50)] text-[var(--color-green-700)] border border-[var(--color-green-200)]">
          {props.value}
        </span>
      ) : (
        <span
          class={`text-sm font-medium text-[var(--color-neutral-800)] ${props.mono ? "font-mono" : ""}`}
        >
          {props.value}
        </span>
      )}
    </div>
  );
}
