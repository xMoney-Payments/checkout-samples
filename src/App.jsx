import { Suspense } from "solid-js";
import { Route, Router } from "@solidjs/router";
import Layout from "./components/Layout";
import { Payments } from "./pages/PaymentForm/PaymentForm";

const routes = [{ path: "/", component: Payments }];

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
