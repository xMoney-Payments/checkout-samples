import { Suspense, lazy } from "solid-js";
import { Route, Router } from "@solidjs/router";
import Layout from "./components/Layout";
import TransactionResult from "./pages/TransactionResult/TransactionResult";
import { Payments } from "./pages/Payments/Payments";
import { DebugPaymentForm } from "./pages/Debug/Debug";

const routes = [
  { path: "/", component: Payments },
  { path: "/debug", component: DebugPaymentForm },
  { path: "/transaction-result", component: TransactionResult },
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
