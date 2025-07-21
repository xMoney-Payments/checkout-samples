export interface InitializeCheckoutModel {
  firstName: string;
  lastName: string;
  email: string;
  cardName?: string;
  cardId?: string;
  saveCard?: boolean;
  amount: number;
  currency: string;
  publicKey: string;
}
export interface InitializeCheckoutResponse {
  payload: string;
  checksum: string;
  error?: string;
}
