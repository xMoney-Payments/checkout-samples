import { JSX } from "solid-js/jsx-runtime";
import "./PageContainer.css";

export interface PageContainerProps {
  children: JSX.Element | JSX.Element[];
}

export function PageContainer(props: PageContainerProps): JSX.Element {
  return (
    <div class="page-container">
      <main class="page-content">{props.children}</main>
    </div>
  );
}
