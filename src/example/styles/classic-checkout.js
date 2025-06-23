export const classicCheckoutStyles = {
  noStyle: true,
  rules: {
    ".embedded-components-container": {
      display: "grid",
      gap: "12px",
      gridTemplateColumns: "1fr 1fr",
      "font-family": "Arial, sans-serif",
    },

    ".embedded-components-container label": {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    ".embedded-components-container .card-number-group": {
      gridColumn: "1 / 3",
      position: "relative",
    },
    ".card-icon": {
      position: "absolute",
      top: "44px",
      left: "10px",
      transform: "translateY(-50%)",
      pointerEvents: "none",
    },

    ".checkout-input": {
      border: "1px solid #D1CDDB",
      borderRadius: "6px",
      padding: "5px",
      height: "48px",
    },
    ".card-number": {
      padding: "0 0 0 32px",
    },
    ".embedded-components-container .label-text": {
      fontSize: "14px",
    },
    ".label-text": {
      display: "block",
    },
    ".error-text": {
      fontSize: "12px",
      color: "red",
      marginTop: "4px",
      display: "none",
    },
    ".checkout-input.error": {
      borderColor: "red",
    },
  },
};
