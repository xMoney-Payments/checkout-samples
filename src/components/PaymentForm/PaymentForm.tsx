import { onMount, onCleanup, createSignal } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { lightThemeStyles } from "../../example/styles/index";
import { PUBLIC_KEY, USER_ID } from "../../constants";
import {
  XMoneyPaymentForm,
  XMoneyPaymentFormInstance,
  XMoneyPaymentFormConfig,
} from "./payment-form.types";
import { TransactionResult } from "../TransactionResult/TransactionResult";
import { MatchStatusEnum } from "../../types/checkout.types";

declare global {
  interface Window {
    XMoneyPaymentForm: XMoneyPaymentForm;
  }
}

interface PaymentFormProps {
  config?: XMoneyPaymentFormConfig;
  paymentFormInstanceRef: (instance: XMoneyPaymentFormInstance | null) => void;
  sessionToken: string;
  result: { payload: string; checksum: string } | null;
  onClose: () => void;
}

export function PaymentForm(props: PaymentFormProps): JSX.Element {
  let paymentFormInstance: XMoneyPaymentFormInstance | undefined;
  const [isReady, setIsReady] = createSignal(false);
  const [transactionResult, setTransactionResult] = createSignal<any>(null);

  let intervalId: number | undefined;

  onMount(async () => {
    if (props.result === null) {
      console.error("No result provided to PaymentForm");
      return;
    }

    paymentFormInstance = new window.XMoneyPaymentForm(
      props.config
        ? {
            ...props.config,
            onReady: () => setIsReady(true),
            onError: (err: any) => console.error("❌ Payment error", err),
            onPaymentComplete: (result: any) => {
              setTransactionResult(result);
              window.scrollTo({ top: 0, behavior: "smooth" });
            },
          }
        : {
            container: "payment-form-widget",
            options: {
              appearance: lightThemeStyles,
              enableBackgroundRefresh: true,
              displayCardHolderName: true,
              cardOwnerVerification: {
                name: {
                  firstName: "customer_firstName",
                  middleName: "customer_middleName",
                  lastName: "customer_lastName",
                },
                ownerVerificationCallback: (matchResult: MatchStatusEnum) => {
                  return (
                    matchResult === MatchStatusEnum.Matched ||
                    matchResult === MatchStatusEnum.PartiallyMatched
                  );
                },
              },
            },
            checksum: props.result.checksum,
            payload: props.result.payload,
            publicKey: PUBLIC_KEY,
            sessionToken: props.sessionToken,
            userId: USER_ID,
            onReady: () => setIsReady(true),
            onError: (err: any) => console.error("❌ Payment error", err),
            onPaymentComplete: (result: any) => {
              setTransactionResult(result);
              window.scrollTo({ top: 0, behavior: "smooth" });
            },
          }
    );

    props.paymentFormInstanceRef(paymentFormInstance);
  });

  onCleanup(() => {
    paymentFormInstance?.destroy?.();
    intervalId && clearInterval(intervalId);
  });

  return (
    <div
      class="payment-form-container"
      style={{
        position: "relative",
        "border-radius": "8px",
        "min-height": "150px",
      }}
    >
      {!isReady() && (
        <div class="loading-overlay" style={{ "border-radius": "8px" }}>
          <span>Loading payment form...</span>
        </div>
      )}

      <div id="payment-form-widget" style={{ opacity: isReady() ? 1 : 0 }} />
      {transactionResult() && (
        <TransactionResult
          result={transactionResult()}
          onRetry={() => window.location.reload()}
        />
      )}
    </div>
  );
}
