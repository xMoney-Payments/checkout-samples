export function CheckoutHero() {
  return (
    <div class="relative overflow-hidden bg-gradient-to-r from-[var(--color-primary-800)] via-[var(--color-primary-700)] to-[var(--color-primary-600)]">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-4 left-[10%] text-6xl">🍕</div>
        <div class="absolute top-8 right-[15%] text-5xl">🍕</div>
        <div class="absolute bottom-2 left-[40%] text-4xl">🧀</div>
        <div class="absolute bottom-4 right-[30%] text-3xl">🌿</div>
      </div>
      <div class="max-w-7xl mx-auto px-6 py-8 relative">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center text-3xl shadow-lg">
            🍕
          </div>
          <div>
            <h1 class="m-0 text-2xl font-bold text-white">xMoney Pizza</h1>
            <p class="m-0 text-sm text-white/70 mt-1">
              Authentic Italian Pizza — Checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
