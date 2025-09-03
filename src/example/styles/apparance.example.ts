export const darkThemeStyles: {
  theme: "dark" | "light" | "custom";
  variables?: Record<string, string>;
  rules?: Record<string, Record<string, string>>;
} = {
  theme: "dark",
};

export const lightThemeStyles: {
  theme: "dark" | "light" | "custom";
  variables?: Record<string, string>;
  rules?: Record<string, Record<string, string>>;
} = {
  theme: "light",
};

export const customThemeStylesGreen: {
  theme: "dark" | "light" | "custom";
  variables: Record<string, string>;
  rules: Record<string, Record<string, string>>;
} = {
  theme: "custom",
  variables: {
    colorPrimary: "#009688",
    colorDanger: "#e53935",
    colorText: "#212121",
    colorTextSecondary: "#757575",
    colorTextPlaceholder: "#bdbdbd",
    colorBorder: "#e0e0e0",
    colorBorderFocus: "#009688",
    colorBackground: "#e0f2f1",
    colorBackgroundFocus: "#0096880a",
  },
  rules: {
    ".xmoney-label--focused": {
      fontWeight: "bold",
    },
    ".xmoney-input:hover": {
      borderRadius: "18px",
    },
    ".xmoney-input:focus": {
      borderRadius: "20px",
    },
    ".xmoney-input::placeholder": {
      fontStyle: "italic",
      fontWeight: "bold",
    },
    ".xmoney-input--invalid": {
      borderColor: "red",
      backgroundColor: "#ffcccc",
    },
    ".xmoney-input:disabled": {
      borderColor: "gray",
      backgroundColor: "#f0f0f0",
      cursor: "not-allowed",
    },
    ".xmoney-saved-card:hover": {
      backgroundColor: "rgba(0, 77, 64, 0.04)",
      borderColor: "#009688",
      height: "180px",
      borderRadius: "8px",
    },
    ".xmoney-saved-card--selected": {
      backgroundColor: "rgba(0, 77, 64, 0.04)",
      borderColor: "#004d40",
      height: "200px",
      borderRadius: "8px",
    },
    ".xmoney-saved-card--selected:hover": {
      backgroundColor: "rgba(0, 77, 64, 0.04)",
      borderColor: "#004d40",
      height: "200px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
  },
};

export const customThemeStylesBlue: {
  theme: "dark" | "light" | "custom";
  variables: Record<string, string>;
  rules: Record<string, Record<string, string>>;
} = {
  theme: "custom",
  variables: {
    colorPrimary: "#42a5f5",
    colorDanger: "#d32f2f",
    colorText: "#212121",
    colorTextSecondary: "#757575",
    colorTextPlaceholder: "#bdbdbd",
    colorBorder: "#e0e0e0",
    colorBorderFocus: "#42a5f5",
    colorBackground: "#e3f2fd",
    colorBackgroundFocus: "#42a5f50a",
  },
  rules: {
    ".xmoney-label--focused": {
      fontWeight: "bold",
    },
    ".xmoney-input:hover": {
      borderRadius: "18px",
    },
    ".xmoney-input:focus": {
      borderRadius: "20px",
    },
    ".xmoney-input::placeholder": {
      fontStyle: "italic",
      fontWeight: "bold",
    },
    ".xmoney-input--invalid": {
      borderColor: "red",
      backgroundColor: "#ffcccc",
    },
    ".xmoney-input:disabled": {
      borderColor: "gray",
      backgroundColor: "#f0f0f0",
      cursor: "not-allowed",
    },
    ".xmoney-saved-card:hover": {
      backgroundColor: "rgba(66, 165, 245, 0.04)",
      borderColor: "#42a5f5",
      height: "180px",
      borderRadius: "8px",
    },
    ".xmoney-saved-card--selected": {
      backgroundColor: "rgba(66, 165, 245, 0.04)",
      borderColor: "#1565c0",
      height: "200px",
      borderRadius: "8px",
    },
    ".xmoney-saved-card--selected:hover": {
      backgroundColor: "rgba(66, 165, 245, 0.04)",
      borderColor: "#1565c0",
      height: "200px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
  },
};

export const customThemeStylesPurple: {
  theme: "dark" | "light" | "custom";
  variables: Record<string, string>;
  rules: Record<string, Record<string, string>>;
} = {
  theme: "custom",
  variables: {
    colorPrimary: "#8e24aa",
    colorDanger: "#d32f2f",
    colorText: "#212121",
    colorTextSecondary: "#757575",
    colorTextPlaceholder: "#bdbdbd",
    colorBorder: "#e0e0e0",
    colorBorderFocus: "#8e24aa",
    colorBackground: "#f3e5f5",
    colorBackgroundFocus: "#8e24aa0a",
  },
  rules: {
    ".xmoney-label--focused": {
      fontWeight: "bold",
    },
    ".xmoney-input:hover": {
      borderRadius: "18px",
    },
    ".xmoney-input:focus": {
      borderRadius: "20px",
    },
    ".xmoney-input::placeholder": {
      fontStyle: "italic",
      fontWeight: "bold",
    },
    ".xmoney-input--invalid": {
      borderColor: "red",
      backgroundColor: "#ffcccc",
    },
    ".xmoney-input:disabled": {
      borderColor: "gray",
      backgroundColor: "#f0f0f0",
      cursor: "not-allowed",
    },
    ".xmoney-saved-card:hover": {
      backgroundColor: "rgba(142, 36, 170, 0.04)",
      borderColor: "#8e24aa",
      height: "180px",
      borderRadius: "8px",
    },
    ".xmoney-saved-card--selected": {
      backgroundColor: "rgba(142, 36, 170, 0.04)",
      borderColor: "#4a148c",
      height: "200px",
      borderRadius: "8px",
    },
    ".xmoney-saved-card--selected:hover": {
      backgroundColor: "rgba(142, 36, 170, 0.04)",
      borderColor: "#4a148c",
      height: "200px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
  },
};
