const API_BASE = "http://localhost:3001";
export const getSessionToken = async () => {
  try {
    const res = await fetch(`${API_BASE}/session-token`);
    if (!res.ok) throw new Error("Failed to fetch session token");
    const token = await res.json();
    return token;
  } catch (err) {
    console.error("❌ Error fetching session token:", err);
    return { data: "" };
  }
};
