import { createSignal } from "solid-js";
import "./TransactionResult.css";
import { TransactionDetails } from "../../types/checkout.types";

interface TransactionResultProps {
  result: TransactionDetails;
  onRetry: () => void;
}

export function TransactionResult(props: TransactionResultProps) {
  const [showRaw, setShowRaw] = createSignal(false);
  const { result } = props;
  const isFailed = result.transactionStatus?.includes("failed") || !result.id;

  return (
    <div class="transaction-result">
      <h2 class={isFailed ? "status-failed" : "status-success"}>
        {isFailed ? "❌ Transaction Failed" : "✅ Transaction Successful"}
      </h2>

      <div class="summary-box">
        <p>
          <strong>Transaction ID:</strong> {result.id}
        </p>
        <p>
          <strong>Order ID:</strong> {result.orderId}
        </p>
        <p>
          <strong>Customer ID:</strong> {result.customerId}
        </p>
        <p>
          <strong>Customer:</strong> {result.customerData?.firstName}{" "}
          {result.customerData?.lastName}
        </p>
        <p>
          <strong>Email:</strong> {result.customerData?.email}
        </p>
        <p>
          <strong>Amount:</strong> {result.amount} {result.currency}
        </p>
        <p>
          <strong>Status:</strong> {result.transactionStatus}
        </p>
        <p>
          <strong>Description:</strong> {result.description}
        </p>
      </div>

      <div class="button-group">
        <button class="toggle-btn" onClick={() => setShowRaw(!showRaw())}>
          {showRaw() ? "Hide raw data" : "Show raw data"}
        </button>
        <button class="retry-btn" onClick={props.onRetry}>
          Retry Transaction
        </button>
      </div>
      {showRaw() && (
        <pre class="raw-json">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
