import { API_BASE } from "../config";
import { Card } from "../types/checkout.types";

export async function getCards(customerId: number): Promise<any> {
  const response = await fetch(`${API_BASE}/saved-cards/${customerId}`);

  const result: { data: Card[]; error?: string } = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to create payment intent");
  }

  return result.data;
}
