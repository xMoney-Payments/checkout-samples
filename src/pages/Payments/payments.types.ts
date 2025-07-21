export type Locale = "en-US" | "el-GR" | "ro-RO";
export type Theme =
  | "light"
  | "dark"
  | "customGreen"
  | "customBlue"
  | "customPurpule";

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  cardName: string;
  cardId: string;
}
