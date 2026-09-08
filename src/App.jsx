import { Suspense } from "solid-js";
import { Route, Router } from "@solidjs/router";
import Layout from "./components/Layout";
import { Payments } from "./pages/PaymentForm/PaymentForm";
import { PaymentCardPage } from "./pages/PaymentCard/PaymentCard";
import { GooglePayPage } from "./pages/GooglePay/GooglePay";
import { ApplePayPage } from "./pages/ApplePay/ApplePay";
import { SavedCardPage } from "./pages/SavedCard/SavedCard";
import { AdvanceCheckout } from "./pages/AdvanceCheckout/AdvanceCheckout";

const routes = [
  { path: "/", component: Payments },
  { path: "/payment-card", component: PaymentCardPage },
  { path: "/google-pay", component: GooglePayPage },
  { path: "/apple-pay", component: ApplePayPage },
  { path: "/saved-card", component: SavedCardPage },
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
