export interface InitializeCheckoutModel {
  firstName: string;
  lastName: string;
  email: string;
  cardId?: string;
  saveCard?: boolean;
  amount: number;
  currency: string;
  publicKey: string;
}

export const enum TransactionStatusEnum {
  Start = "start",
  CompleteOk = "complete-ok",
  CancelOk = "cancel-ok",
  RefundOk = "refund-ok",
  VoidOk = "void-ok",
  ChargeBack = "charge-back",
  ChargeBackInProgress = "charge-back-in-progress",
  CompleteFailed = "complete-failed",
  InProgress = "in-progress",
  "3DPending" = "3d-pending",
  Uncertain = "uncertain",
}

export interface TransactionCustomerData {
  id: number;
  siteId: number;
  identifier: string;
  firstName: string;
  lastName: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  address: string;
  phone: string;
  email: string;
  creationDate: string;
  creationTimestamp: number;
}

export interface TransactionDetails {
  externalOrderId: string;
  transactionStatus: TransactionStatusEnum;
  amount: string;
  currencyKey: string;
  amountInEuro: string;
  customerData: TransactionCustomerData;
  description: string;
}

export interface CardHolderVerificationResult {
  status: MatchStatusEnum;
  firstNameStatus?: MatchStatusEnum;
  middleNameStatus?: MatchStatusEnum;
  lastNameStatus?: MatchStatusEnum;
}

export enum MatchStatusEnum {
  Matched = "MATCHED",
  NotMatched = "NOT_MATCHED",
  NotVerified = "NOT_VERIFIED",
  PartialMatched = "PARTIAL_MATCHED",
  NotSupported = "NOT_SUPPORTED",
}
