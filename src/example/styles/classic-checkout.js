export const classicCheckoutStyles = {
  noStyle: true,
  rules: {
    ".embeded-components-container": {
      display: "grid",
      gap: "12px",
      gridTemplateColumns: "1fr 1fr",
      "font-family": "Arial, sans-serif",
    },
    ".embeded-components-container label": {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    ".embeded-components-container label:nth-child(1)": {
      gridColumn: "1 / 3",
    },
    ".checkout-input": {
      border: "1px solid #ccc",
      borderRadius: "6px",
      padding: "5px",
      height: "48px",
    },
    ".embeded-components-container .label-text": {
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
