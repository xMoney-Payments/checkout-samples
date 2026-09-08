import type { Appearance } from "../../types/xmoney-sdk/sdk-base.types";

export const darkThemeStyles: Appearance = {
  theme: "dark",
};

export const lightThemeStyles: Appearance = {
  theme: "light",
};

export const customThemeStylesGreen: Appearance = {
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
  },
};

export const customThemeStylesBlue: Appearance = {
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
  },
};

export const customThemeStylesPurple: Appearance = {
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
  },
};
