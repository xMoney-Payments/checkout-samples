import { createSignal } from "solid-js";

interface DeliveryForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  notes: string;
}

export function DeliveryDetailsCard() {
  const [form, setForm] = createSignal<DeliveryForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    notes: "",
  });

  const update = (field: keyof DeliveryForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div class="bg-white rounded-2xl border border-[var(--color-neutral-100)] shadow-[0_4px_24px_rgba(22,20,26,0.06)] overflow-hidden">
      {/* Header */}
      <div class="px-6 py-5 border-b border-[var(--color-neutral-100)] bg-gradient-to-r from-[var(--color-primary-25)] to-white">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-[var(--color-primary-100)] flex items-center justify-center">
            <svg
              class="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-primary-600)"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div>
            <h3 class="m-0 text-base font-bold text-[var(--color-neutral-900)]">
              Delivery Details
            </h3>
            <p class="m-0 text-xs text-[var(--color-neutral-400)] mt-0.5">
              Where should we deliver your pizza?
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div class="p-6 flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-[var(--color-neutral-500)] uppercase tracking-wider">
              First Name
            </label>
            <input
              type="text"
              value={form().firstName}
              onInput={(e) => update("firstName", e.currentTarget.value)}
              placeholder="John"
              class="!rounded-xl !py-2.5"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-[var(--color-neutral-500)] uppercase tracking-wider">
              Last Name
            </label>
            <input
              type="text"
              value={form().lastName}
              onInput={(e) => update("lastName", e.currentTarget.value)}
              placeholder="Doe"
              class="!rounded-xl !py-2.5"
            />
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-[var(--color-neutral-500)] uppercase tracking-wider">
            Email
          </label>
          <input
            type="email"
            value={form().email}
            onInput={(e) => update("email", e.currentTarget.value)}
            placeholder="john@example.com"
            class="!rounded-xl !py-2.5"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-[var(--color-neutral-500)] uppercase tracking-wider">
            Phone
          </label>
          <input
            type="text"
            value={form().phone}
            onInput={(e) => update("phone", e.currentTarget.value)}
            placeholder="+1 (555) 000-0000"
            class="!rounded-xl !py-2.5"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-[var(--color-neutral-500)] uppercase tracking-wider">
            Delivery Address
          </label>
          <input
            type="text"
            value={form().address}
            onInput={(e) => update("address", e.currentTarget.value)}
            placeholder="123 Main Street, Apt 4B"
            class="!rounded-xl !py-2.5"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-[var(--color-neutral-500)] uppercase tracking-wider">
              City
            </label>
            <input
              type="text"
              value={form().city}
              onInput={(e) => update("city", e.currentTarget.value)}
              placeholder="New York"
              class="!rounded-xl !py-2.5"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-[var(--color-neutral-500)] uppercase tracking-wider">
              ZIP Code
            </label>
            <input
              type="text"
              value={form().zipCode}
              onInput={(e) => update("zipCode", e.currentTarget.value)}
              placeholder="10001"
              class="!rounded-xl !py-2.5"
            />
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-[var(--color-neutral-500)] uppercase tracking-wider">
            Delivery Notes
          </label>
          <textarea
            value={form().notes}
            onInput={(e) => update("notes", e.currentTarget.value)}
            placeholder="Ring the bell, leave at the door..."
            class="!rounded-xl !py-2.5 !min-h-16"
            rows={2}
          />
        </div>

        {/* Estimated delivery */}
        <div class="flex items-center gap-3 mt-1 p-3 rounded-xl bg-[var(--color-green-50)] border border-[var(--color-green-100)]">
          <svg
            class="w-5 h-5 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-green-600)"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <div>
            <p class="m-0 text-xs font-semibold text-[var(--color-green-700)]">
              Estimated delivery: 25-35 min
            </p>
            <p class="m-0 text-xs text-[var(--color-green-600)] mt-0.5">
              Free delivery on orders over 30 EUR
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
