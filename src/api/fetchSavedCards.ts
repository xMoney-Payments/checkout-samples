const API_BASE = "http://localhost:3001";
export const fetchSavedCards = async (customerId: number) => {
  try {
    const res = await fetch(`${API_BASE}/saved-cards/${customerId}`);
    if (!res.ok) throw new Error("Failed to fetch saved cards");
    const cards = await res.json();
    return cards;
  } catch (err) {
    console.error("❌ Error fetching saved cards:", err);
    return { data: [] };
  }
};
