import { JSX } from "solid-js/jsx-runtime";

export interface PageContainerProps {
  children: JSX.Element | JSX.Element[];
  title?: string;
  subtitle?: string;
  eyebrow?: string;
}

export function PageContainer(props: PageContainerProps): JSX.Element {
  return (
    <div class="flex flex-col">
      <main class="flex-1 max-w-5xl mx-auto w-full px-3 py-4 sm:p-5">
        {props.children}
      </main>
    </div>
  );
}
