import { createSignal, onMount } from "solid-js";

export function useWalletCapability(method: "googlePay" | "applePay") {
  const [state, setState] = createSignal<{
    supported: boolean;
    reason?: string;
  } | null>(null);

  onMount(async () => {
    try {
      const capabilities = await window.XMoney.getPaymentMethodCapabilities();
      setState(capabilities[method]);
    } catch (err) {
      console.error("Failed to check payment method capabilities:", err);
      setState({
        supported: false,
        reason: "Could not check availability in this browser.",
      });
    }
  });

  return state;
}
