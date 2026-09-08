import { createEffect, createSignal, For, Show } from "solid-js";
import { A, useLocation } from "@solidjs/router";

const desktopLinkClass =
  "inline-flex items-center justify-center text-sm font-semibold no-underline transition-all duration-200 px-3 py-2 rounded-full text-[color:var(--color-neutral-600)] hover:bg-[color:var(--color-primary-50)] hover:text-[color:var(--color-primary-700)]";

const mobileLinkClass =
  "flex items-center text-sm font-semibold no-underline transition-all duration-200 px-3 py-2.5 rounded-xl text-[color:var(--color-neutral-700)] hover:bg-[color:var(--color-primary-50)] hover:text-[color:var(--color-primary-700)]";

const simpleLinks = [
  { href: "/", label: "Payment Form", end: true },
  { href: "/payment-card", label: "Payment Card" },
  { href: "/google-pay", label: "Google Pay" },
  { href: "/apple-pay", label: "Apple Pay" },
  { href: "/saved-card", label: "Saved Card" },
];

const advancedLink = { href: "/advance-checkout", label: "Advanced Checkout" };

function currentPage(pathname) {
  if (pathname === advancedLink.href) {
    return { group: "Advanced", label: advancedLink.label };
  }

  const match = simpleLinks.find((link) =>
    link.end ? pathname === link.href : pathname.startsWith(link.href),
  );

  return {
    group: "Simple",
    label: match?.label ?? "Examples",
  };
}

const Navbar = () => {
  const [menuOpen, setMenuOpen] = createSignal(false);
  const location = useLocation();
  const page = () => currentPage(location.pathname);

  createEffect(() => {
    location.pathname;
    setMenuOpen(false);
  });

  return (
    <nav class="sticky top-0 z-50 border-b border-[color:var(--color-neutral-100)] bg-[rgba(247,246,249,0.94)] backdrop-blur">
      <div
        class="h-0.5"
        style={{
          backgroundImage:
            "linear-gradient(90deg, var(--color-primary-400), var(--color-blue-400))",
        }}
      />

      <div class="hidden md:block max-w-7xl mx-auto px-5">
        <div class="flex items-center justify-start gap-3 py-2.5">
          <div class="flex items-center gap-1">
            <span class="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-neutral-400)] px-2 py-2">
              Simple
            </span>
            <ul class="flex items-center gap-1 list-none m-0 p-0">
              <For each={simpleLinks}>
                {(link) => (
                  <li>
                    <A
                      href={link.href}
                      class={desktopLinkClass}
                      activeClass="bg-[color:var(--color-primary-100)] text-[color:var(--color-primary-700)]"
                      end={link.end}
                    >
                      {link.label}
                    </A>
                  </li>
                )}
              </For>
            </ul>
          </div>
          <span class="w-px h-6 bg-[color:var(--color-neutral-200)]" />
          <A
            href={advancedLink.href}
            class={`${desktopLinkClass} border border-[color:var(--color-primary-200)]`}
            activeClass="bg-[color:var(--color-primary-100)] text-[color:var(--color-primary-700)] border-[color:var(--color-primary-300)]"
          >
            {advancedLink.label}
          </A>
        </div>
      </div>

      <div class="md:hidden">
        <div class="flex items-center justify-between gap-3 px-3 py-2">
          <div class="min-w-0">
            <p class="m-0 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-neutral-400)]">
              {page().group}
            </p>
            <p class="m-0 text-sm font-semibold text-[color:var(--color-neutral-900)] truncate">
              {page().label}
            </p>
          </div>
          <button
            type="button"
            class="flex items-center justify-center w-10 h-10 rounded-xl border border-[color:var(--color-neutral-200)] bg-white text-[color:var(--color-neutral-700)]"
            aria-label={menuOpen() ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen()}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Show
              when={menuOpen()}
              fallback={
                <svg
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                >
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </svg>
              }
            >
              <svg
                class="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </svg>
            </Show>
          </button>
        </div>

        <Show when={menuOpen()}>
          <div class="px-3 pb-3 border-t border-[color:var(--color-neutral-100)] bg-[color:var(--color-neutral-25)]">
            <p class="m-0 pt-3 pb-1 px-1 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-neutral-400)]">
              Simple
            </p>
            <ul class="flex flex-col gap-0.5 list-none m-0 p-0">
              <For each={simpleLinks}>
                {(link) => (
                  <li>
                    <A
                      href={link.href}
                      class={mobileLinkClass}
                      activeClass="bg-[color:var(--color-primary-100)] text-[color:var(--color-primary-700)]"
                      end={link.end}
                    >
                      {link.label}
                    </A>
                  </li>
                )}
              </For>
            </ul>
            <A
              href={advancedLink.href}
              class={`${mobileLinkClass} mt-2 border border-[color:var(--color-primary-200)]`}
              activeClass="bg-[color:var(--color-primary-100)] text-[color:var(--color-primary-700)] border-[color:var(--color-primary-300)]"
            >
              {advancedLink.label}
            </A>
          </div>
        </Show>
      </div>
    </nav>
  );
};

export default Navbar;
