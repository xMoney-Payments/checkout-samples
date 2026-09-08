export function formatFieldValidationErrors(
  fields: Record<string, { error: { message: string } | null }>,
): string {
  return Object.values(fields)
    .map((field) => field.error?.message)
    .filter((message): message is string => Boolean(message))
    .join(" ");
}

export function formatPaymentError(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return "Payment processing failed. Please try again.";
}
