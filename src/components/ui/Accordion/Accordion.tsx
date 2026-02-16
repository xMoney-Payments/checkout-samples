import {
  createSignal,
  JSX,
  Show,
  createContext,
  useContext,
  children,
} from "solid-js";

interface AccordionContextValue {
  activeIndex: () => number;
  setActiveIndex: (index: number) => void;
}

const AccordionContext = createContext<AccordionContextValue>();

interface AccordionProps {
  children: JSX.Element;
  defaultIndex?: number;
}

export function Accordion(props: AccordionProps) {
  const [activeIndex, setActiveIndex] = createSignal(props.defaultIndex ?? 0);

  return (
    <AccordionContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div class="flex flex-col gap-3">{props.children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  title: string;
  subtitle?: string;
  icon?: JSX.Element | string;
  children: JSX.Element;
  index: number;
}

export function AccordionItem(props: AccordionItemProps) {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("AccordionItem must be used within an Accordion");
  }

  const isOpen = () => context.activeIndex() === props.index;

  return (
    <div
      class={`overflow-hidden rounded-2xl border transition-all duration-200 ${
        isOpen()
          ? "border-[var(--color-primary-400)] bg-[var(--color-primary-25)] shadow-[0_14px_30px_rgba(124,77,255,0.12)]"
          : "border-[var(--color-neutral-100)] bg-white"
      }`}
    >
      <div
        class="w-full flex items-center gap-4 p-4 bg-transparent cursor-pointer text-left transition-colors duration-200 hover:bg-white"
        onClick={() => context.setActiveIndex(props.index)}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen()}
      >
        <div class="flex items-center justify-center flex-shrink-0">
          <div
            class={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              isOpen()
                ? "border-[var(--color-primary-500)] bg-[var(--color-primary-500)]"
                : "border-[var(--color-neutral-200)] bg-white"
            }`}
          >
            {isOpen() && (
              <svg
                class="w-3.5 h-3.5 text-white"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        </div>
        <div class="flex items-center gap-4 flex-1">
          {props.icon && (
            <span class="flex items-center justify-center w-10 h-8 rounded-xl flex-shrink-0 bg-white border border-[var(--color-neutral-200)] shadow-[0_6px_12px_rgba(15,23,42,0.08)] overflow-hidden">
              {props.icon}
            </span>
          )}
          <div>
            <h3 class="m-0 text-base font-semibold">{props.title}</h3>
            {props.subtitle && (
              <p
                class="mt-0.5 text-xs"
                style={{ color: "var(--color-neutral-500)" }}
              >
                {props.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
      <Show when={isOpen()}>
        <div class="px-5 py-5 pl-16 animate-[slideDown_0.3s_ease]">
          {props.children}
        </div>
      </Show>
    </div>
  );
}
