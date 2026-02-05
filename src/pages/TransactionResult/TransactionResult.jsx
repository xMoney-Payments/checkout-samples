import { createSignal, createEffect, Show } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import "./TransactionResult.css";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import { PageContainer } from "../../components/PageContainer/PageContainer";

const TransactionResult = () => {
  const [searchParams] = useSearchParams();
  const [transactionData, setTransactionData] = createSignal(null);
  const [error, setError] = createSignal(null);
  const [isLoading, setIsLoading] = createSignal(true);

  createEffect(() => {
    const fetchTransactionResult = async () => {
      const result = searchParams.result;
      if (!result) {
        setError("No result parameter found in the URL.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3001/payment-confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ result }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }

        const data = await response.json();
        setTransactionData(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch transaction result:", err);
        setError(
          "Failed to fetch transaction details. Please try again or contact support.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionResult();
  });

  return (
    <PageContainer
      title="Transaction Result"
      subtitle="Your payment transaction details"
    >
      <div class="transaction-container">
        <Show when={error()}>
          <ErrorAlert
            title="Error"
            message={error()}
            onDismiss={() => setError(null)}
            variant="banner"
          />
        </Show>

        <Show when={isLoading()}>
          <LoadingSpinner
            size="large"
            message="Loading transaction details..."
          />
        </Show>

        <Show when={!isLoading() && transactionData()}>
          <div class="transaction-card">
            <div class="transaction-header">
              <div class="transaction-status">
                <span
                  class={`status-badge status-${transactionData().transactionStatus?.toLowerCase() || "unknown"}`}
                >
                  {transactionData().transactionStatus || "Unknown"}
                </span>
              </div>
            </div>

            <div class="transaction-details">
              <div class="detail-row">
                <span class="detail-label">Order ID:</span>
                <span class="detail-value">{transactionData().orderId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Transaction ID:</span>
                <span class="detail-value">
                  {transactionData().transactionId}
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Amount:</span>
                <span class="detail-value amount">
                  {transactionData().amount} {transactionData().currency}
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Transaction Type:</span>
                <span class="detail-value">
                  {transactionData().transactionType}
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment Method:</span>
                <span class="detail-value">
                  {transactionData().transactionMethod}
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Customer ID:</span>
                <span class="detail-value">{transactionData().customerId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">External Order ID:</span>
                <span class="detail-value">
                  {transactionData().externalOrderId}
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Card ID:</span>
                <span class="detail-value">{transactionData().cardId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Timestamp:</span>
                <span class="detail-value">
                  {new Date(
                    transactionData().timestamp * 1000,
                  ).toLocaleString()}
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Identifier:</span>
                <span class="detail-value">{transactionData().identifier}</span>
              </div>
            </div>

            <div class="transaction-footer">
              <a href="/" class="btn-return">
                Return to Home
              </a>
            </div>
          </div>
        </Show>
      </div>
    </PageContainer>
  );
};

export default TransactionResult;
