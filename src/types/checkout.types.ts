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
export interface InitializeCheckoutResponse {
  payload: string;
  checksum: string;
  error?: string;
}

export interface OrderResponse {
  id: number;
  siteId: number;
  customerId: number;
  customerData: {
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
    isWhitelisted: number;
    isWhitelistedUntil: string | null;
    creationDate: string;
    creationTimestamp: number;
  };
  externalOrderId: string;
  orderType: xMoneyOrderTypeEnum;
  orderStatus: xMoneyOrderStatusEnum;
  amount: string;
  currency: string;
  description: string;
  level3Data: null;
  saveCard: false;
  invoiceEmail: string;
  createdAt: string;
  createdAtTimestamp: number;
  transactionMethod: xMoneyTransactionMethodEnum;
  transactionMethodId: number;
}

export enum xMoneyOrderStatusEnum {
  Start = "start",
  InProgress = "in-progress",
  Retrying = "retrying",
  Expiring = "expiring",
  CompleteOk = "complete-ok",
  CompleteFailed = "completed-failed",
}

export enum xMoneyTransactionMethodEnum {
  Card = "card",
  Wallet = "wallet",
}

export enum xMoneyOrderTypeEnum {
  Purchase = "purchase",
}

export enum MatchStatusEnum {
  Matched = "MATCHED",
  NotMatched = "NOT_MATCHED",
  NotVerified = "NOT_VERIFIED",
  PartiallyMatched = "PARTIALLY_MATCHED",
  NotSupported = "NOT_SUPPORTED",
}
