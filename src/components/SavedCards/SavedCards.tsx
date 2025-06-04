import { createSignal, onMount, onCleanup } from "solid-js";

interface Card {
  id: string;
}

interface SavedCardsProps {
  userId: number;
  publicKey: string;
  onCardSelect: (card: Card) => void;
  onOtherCardSelect: () => void;
  savedCardsInstanceRef: (instance: any) => void;
}

declare global {
  interface Window {
    XMoneySavedCards: any;
  }
}

export function SavedCards(props: SavedCardsProps) {
  let savedCardsInstance: any;

  const [isReady, setIsReady] = createSignal(false);

  const initSavedCards = async (): Promise<void> => {
    const { fetchSavedCards } = await import("../../api");
    const savedCards = await fetchSavedCards(props.userId);
    savedCardsInstance = new window.XMoneySavedCards({
      savedCards: savedCards.data,
      container: "saved-cards",
      publicKey: props.publicKey,
      elementsOptions: {},
      onError: (err: any) => console.error("❌ Saved cards error", err),
      onReady: () => setIsReady(true),
      onCardSelect: props.onCardSelect,
      onOtherCardSelect: props.onOtherCardSelect,
    });
    props.savedCardsInstanceRef(savedCardsInstance);
  };

  onMount(async () => {
    await initSavedCards();
  });

  onCleanup(() => {
    savedCardsInstance?.destroy?.();
  });

  return (
    <div
      class="saved-cards-container"
      style={{
        position: "relative",
        "border-radius": "8px",
        "min-height": "48px",
        height: "inherit",
      }}
    >
      {!isReady() && (
        <div class="loading-overlay" style={{ "border-radius": "8px" }}>
          <span>Loading saved cards...</span>
        </div>
      )}
      <div
        id="saved-cards"
        style={{ display: isReady() ? "block" : "none" }}
      ></div>
    </div>
  );
}
