export type Locale = "en-US" | "el-GR" | "ro-RO";
export type Theme =
  | "light"
  | "dark"
  | "customGreen"
  | "customBlue"
  | "customPurple";

export interface CustomerInformation {
  firstName: string;
  lastName: string;
  email: string;
}
