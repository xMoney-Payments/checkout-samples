import { API_BASE } from "../constants";
import { InitializeCheckoutModel } from "../types/checkout.types";

export interface PaymentIntentResponse {
  payload: string;
  checksum: string;
  error?: string;
}

export async function createPaymentIntent(
  data: InitializeCheckoutModel
): Promise<PaymentIntentResponse> {
  const response = await fetch(`${API_BASE}/checkout-initialization`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to create payment intent");
  }

  return result;
}
