import type { TransactionDetails } from "../../../types/checkout.types";

interface PaymentSuccessBannerProps {
  result: TransactionDetails;
}

export function PaymentSuccessBanner(props: PaymentSuccessBannerProps) {
  return (
    <div class="flex items-center bg-[var(--color-green-500)] md:flex-row flex-col gap-4 py-5 px-6 rounded-2xl mb-6 shadow-lg text-center md:text-left animate-[slideInDown_0.35s_ease] text-white">
      <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
        ✓
      </div>
      <div>
        <h3 class="m-0 mb-1 text-lg font-semibold">
          Order Placed Successfully!
        </h3>
        <p class="m-0 text-sm opacity-95 leading-relaxed">
          Your pizza order of {props.result.amount} {props.result.currency} has
          been confirmed. Enjoy your meal!
        </p>
      </div>
    </div>
  );
}
