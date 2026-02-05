import { Suspense, lazy } from "solid-js";
import { Route, Router } from "@solidjs/router";
import Layout from "./components/Layout";
import TransactionResult from "./pages/TransactionResult/TransactionResult";
import { Payments } from "./pages/Payments/Payments";
import { PaymentMethods } from "./pages/PaymentMethods/PaymentMethods";
import { CustomCardsPage } from "./pages/CustomCards/CustomCardsPage";

const routes = [
  { path: "/", component: Payments },
  { path: "/payment-methods", component: PaymentMethods },
  { path: "/custom-cards", component: CustomCardsPage },
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
