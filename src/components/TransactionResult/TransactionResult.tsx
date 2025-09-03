import { createSignal } from "solid-js";
import "./TransactionResult.css";

interface TransactionResultProps {
  result: any;
  onRetry: () => void;
}

export function TransactionResult(props: TransactionResultProps) {
  const [showRaw, setShowRaw] = createSignal(false);
  const { result } = props;
  const isFailed = result.orderStatus?.includes("failed");

  return (
    <div class="transaction-result">
      <h2 class={isFailed ? "status-failed" : "status-success"}>
        {isFailed ? "❌ Transaction Failed" : "✅ Transaction Successful"}
      </h2>

      <div class="summary-box">
        <p>
          <strong>Order ID:</strong> {result.externalOrderId}
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
          <strong>Status:</strong> {result.orderStatus}
        </p>
        <p>
          <strong>Date:</strong> {new Date(result.createdAt).toLocaleString()}
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
