import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  Setting,
  PaymentItem,
  ScheduleMember,
  Schedule,
  CustomerPayload,
  Customer,
  CustomerSetting,
} from '@/@types/Types';

interface State {
  appUpdate: boolean;
  value: number;
  setting: Setting;
  paymentItemList: PaymentItem[];
  memberList: ScheduleMember[];
  schedules: Schedule[];
  schedule: Schedule;
  customer: Customer;
  customerSetting: CustomerSetting;
  acceptCount: number;
}

const initialState: State = {
  appUpdate: false,
  value: 0,
  setting: {
    scale: 1,
    scale2: 1,
    top: 0,
    bottom: 0,
    width: 0,
    height: 0,
    widthHalf: 0,
    heightHalf: 0,
  },
  paymentItemList: [],
  memberList: [],
  schedules: [],
  schedule: {
    scheduleId: '',
    title: '',
    date: '',
    color: '',
    totalCost: 0,
  },
  customer: {
    name: '',
    account: '',
  },
  customerSetting: {
    helpYn: 'Y',
    viewType: '1',
    decimalPoint: '2',
    cutting: 0,
    cuttingYn: 'N',
    payerSendYn: 'N',
  },
  acceptCount: 0,
};

const Slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    appUpdate: state => {
      state.appUpdate = true;
    },
    setSetting: (state, action: PayloadAction<Setting>) => {
      state.setting = action.payload;
    },
    setPaymentItemList: (state, action: PayloadAction<PaymentItem[]>) => {
      state.paymentItemList = action.payload;
    },
    setMemberList: (state, action: PayloadAction<ScheduleMember[]>) => {
      state.memberList = action.payload;
    },
    selectedSchedule: (state, action: PayloadAction<Schedule | null>) => {
      if (action.payload != null) {
        state.schedule = action.payload;
      } else {
        state.schedule = {
          scheduleId: '',
          title: '',
          date: '',
          color: '',
          totalCost: 0,
        };
      }
      state.paymentItemList = [];
      state.memberList = [];
    },
    setSchedule: (state, action: PayloadAction<Schedule>) => {
      state.schedule = action.payload;
    },
    setSchedules: (state, action: PayloadAction<Schedule[]>) => {
      state.schedules = action.payload;
    },
    setCustomerDto: (state, action: PayloadAction<CustomerPayload>) => {
      state.customer = action.payload.customer;
      state.customerSetting = action.payload.customerSetting;
    },
    setCustomer: (state, action: PayloadAction<Customer>) => {
      state.customer = action.payload;
    },
    setCustomerSetting: (state, action: PayloadAction<CustomerSetting>) => {
      state.customerSetting = action.payload;
    },
    setSettingHelpYn: (state, action: PayloadAction<string>) => {
      state.customerSetting.helpYn = action.payload;
    },
    setSettingViewType: (state, action: PayloadAction<string>) => {
      state.customerSetting.viewType = action.payload;
    },
    setSettingDecimalPoint: (state, action: PayloadAction<string>) => {
      state.customerSetting.decimalPoint = action.payload;
    },
    setSettingCutting: (state, action: PayloadAction<number>) => {
      state.customerSetting.cutting = action.payload;
    },
    setSettingCuttingYn: (state, action: PayloadAction<string>) => {
      state.customerSetting.cuttingYn = action.payload;
    },
    setSettingPayerSendYn: (state, action: PayloadAction<string>) => {
      state.customerSetting.payerSendYn = action.payload;
    },
    setAcceptCount: (state, action: PayloadAction<number>) => {
      state.acceptCount = action.payload;
    },
    setDecreaseAcceptCount: state => {
      state.acceptCount--;
    },
  },
});

export const {
  appUpdate,
  setSetting,
  setPaymentItemList,
  setMemberList,
  selectedSchedule,
  setSchedule,
  setSchedules,
  setCustomerDto,
  setCustomer,
  setCustomerSetting,
  setSettingHelpYn,
  setSettingViewType,
  setSettingDecimalPoint,
  setSettingCutting,
  setSettingCuttingYn,
  setSettingPayerSendYn,
  setAcceptCount,
  setDecreaseAcceptCount,
} = Slice.actions;
export default Slice.reducer;
