import {
  createSignal,
  JSX,
  Show,
  createContext,
  useContext,
  children as accessChildren,
} from "solid-js";
import "./Accordion.css";

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
      <div class="accordion-container">{props.children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  title: string;
  subtitle?: string;
  icon?: string;
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
    <div class={`accordion-item ${isOpen() ? "open" : ""}`}>
      <div
        class="accordion-header"
        onClick={() => context.setActiveIndex(props.index)}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen()}
      >
        <div class="radio-wrapper">
          <div class={`radio-button ${isOpen() ? "checked" : ""}`}>
            {isOpen() && (
              <svg
                class="check-icon"
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
        <div class="accordion-header-content">
          {props.icon && <span class="accordion-icon">{props.icon}</span>}
          <div class="accordion-text">
            <h3>{props.title}</h3>
            {props.subtitle && (
              <p class="accordion-subtitle">{props.subtitle}</p>
            )}
          </div>
        </div>
      </div>
      <Show when={isOpen()}>
        <div class="accordion-content">{props.children}</div>
      </Show>
    </div>
  );
}
