export interface Setting {
  scale: number;
  scale2: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
  widthHalf: number;
  heightHalf: number;
}

export interface MoneyInfo {
  name: string;
  cost: number;
  type: string;
  account?: string;
}

export interface Bill {
  memberId: number;
  name: string;
  paid: number;
  pay: number;
  total: number;
  info: MoneyInfo[];
}

export interface Res<T> {
  data: T;
  status: string;
}

export interface PageDto<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CustomerPayload {
  customer: Customer;
  customerSetting: CustomerSetting;
}

export interface Customer {
  name: string;
  account: string;
}

export interface CustomerSetting {
  viewType: string;
  helpYn: string;
  payerSendYn: string;
  decimalPoint: string;
  cutting: number;
  cuttingYn: string;
}

export interface Schedule {
  scheduleId: string;
  title: string;
  date: string;
  color: string;
  totalCost: number;
}

export interface ScheduleMember {
  scheduleId: string;
  memberId: number;
  name: string;
  checked: boolean;
  payerYn: boolean;
  account: string | null;
}

export interface PaymentItem {
  scheduleId: string;
  paymentId: number;
  payer: string;
  payerId: number;
  title: string;
  cost: number;
  acceptYn: boolean;
  members: PaymentMember[];
}

export interface PaymentMember {
  scheduleId: string;
  paymentId: number;
  memberId: number;
  name: string;
}
