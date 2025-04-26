import { createSignal, createEffect } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import "./TransactionResult.css";

const TransactionResult = () => {
  const [searchParams] = useSearchParams();
  const [transactionData, setTransactionData] = createSignal(null);
  const [error, setError] = createSignal(null);

  createEffect(() => {
    const fetchTransactionResult = async () => {
      const result = searchParams.result;
      if (!result) {
        setError("No result parameter found in the URL.");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3001/transaction-result",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ result }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setTransactionData(data);
      } catch (err) {
        setError("Failed to fetch transaction data.");
      }
    };

    fetchTransactionResult();
  });

  return (
    <div class="transaction-container">
      {error() ? (
        <div class="error-message">Error: {error()}</div>
      ) : !transactionData() ? (
        <div class="loading-message">Loading...</div>
      ) : (
        <div class="transaction-card">
          <h1 class="transaction-title">Transaction Result</h1>
          <p>
            <strong>Status:</strong> {transactionData().transactionStatus}
          </p>
          <p>
            <strong>Order ID:</strong> {transactionData().orderId}
          </p>
          <p>
            <strong>Transaction ID:</strong> {transactionData().transactionId}
          </p>
          <p>
            <strong>Amount:</strong> {transactionData().amount}{" "}
            {transactionData().currency}
          </p>
          <p>
            <strong>Transaction Type:</strong>{" "}
            {transactionData().transactionType}
          </p>
          <p>
            <strong>Transaction Method:</strong>{" "}
            {transactionData().transactionMethod}
          </p>
          <p>
            <strong>Customer ID:</strong> {transactionData().customerId}
          </p>
          <p>
            <strong>External Order ID:</strong>{" "}
            {transactionData().externalOrderId}
          </p>
          <p>
            <strong>Card ID:</strong> {transactionData().cardId}
          </p>
          <p>
            <strong>Timestamp:</strong>{" "}
            {new Date(transactionData().timestamp * 1000).toLocaleString()}
          </p>
          <p>
            <strong>Identifier:</strong> {transactionData().identifier}
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionResult;
