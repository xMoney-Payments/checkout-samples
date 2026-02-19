import { Suspense } from "solid-js";
import { Route, Router } from "@solidjs/router";
import Layout from "./components/Layout";
import { Payments } from "./pages/PaymentForm/PaymentForm";
import { EmbeddedComponents } from "./pages/EmbeddedComponents/EmbeddedComponents";
import { AdvanceCheckout } from "./pages/AdvanceCheckout/AdvanceCheckout";

const routes = [
  { path: "/", component: Payments },
  { path: "/payment-methods", component: EmbeddedComponents },
  { path: "/advance-checkout", component: AdvanceCheckout },
];

export const App = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Router>
        <Route path="/" component={Layout}>
          {routes.map(({ path, component }) => (
            <Route path={path} component={component} />
          ))}
        </Route>
      </Router>
    </Suspense>
  );
};

export default App;
