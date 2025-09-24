import { useState, useRef, useCallback } from 'react';
import Toast from 'react-native-toast-message';

import { api } from '@/common/Api';

import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/app/Store';
import { setPaymentItemList, setMemberList, setSchedule, setSchedules } from '@/app/StateSlice';

import { PaymentItemFormPayload } from '@/components/PaymentItemModal';
import { PaymentItem } from '@/@types/Types';

export function usePaymentItems() {
  const dispatch = useDispatch();

  const selectedSchedule = useSelector((state: RootState) => state.app.schedule);
  const paymentItemList = useSelector((state: RootState) => state.app.paymentItemList);
  const schedules = useSelector((state: RootState) => state.app.schedules);

  const [isPaymentItemModalVisible, setAddPaymentItemModalVisible] = useState<boolean>(false);
  const [isRemovePaymentItemModalVisible, setRemovePaymentItemModalVisible] = useState<boolean>(false);

  const selectedPaymentItem = useRef<PaymentItem | null>(null);

  const helpAddPaymentItem = useCallback(() => {
    const newItem: PaymentItem = {
      scheduleId: '',
      paymentId: 0,
      payer: '멤버',
      payerId: 9001,
      title: '결제등록안내',
      cost: 30000,
      acceptYn: true,
      members: [
        { name: '멤버', scheduleId: '', paymentId: 0, memberId: 9001 },
        { name: '추가', scheduleId: '', paymentId: 0, memberId: 9002 },
        { name: '예시', scheduleId: '', paymentId: 0, memberId: 9003 },
      ],
    };
    dispatch(setPaymentItemList([newItem, ...paymentItemList]));
  }, [paymentItemList]);

  const helpRemovePaymentItem = useCallback(() => {
    dispatch(setPaymentItemList(paymentItemList.slice(1)));
  }, [paymentItemList]);

  // 결제내역 추가 모달 ON
  const openAddPaymentItemModal = useCallback(() => {
    selectedPaymentItem.current = null;
    setAddPaymentItemModalVisible(true);
  }, []);

  // 결제내역 수정 모달 ON
  const openUpdatePaymentItemModal = useCallback((paymentItem: PaymentItem) => {
    selectedPaymentItem.current = paymentItem;
    setAddPaymentItemModalVisible(true);
  }, []);

  // 결제내역 삭제 모달 ON
  const openRemovePaymentItemModal = useCallback((paymentItem: PaymentItem) => {
    selectedPaymentItem.current = paymentItem;
    setRemovePaymentItemModalVisible(true);
  }, []);

  // 결제내역 추가/수정 모달 OFF
  const closePaymentItemModal = useCallback(() => {
    setAddPaymentItemModalVisible(false);
  }, []);

  // 결제내역 삭제 모달 OFF
  const closeRemovePaymentItemModal = useCallback(() => {
    setRemovePaymentItemModalVisible(false);
  }, []);

  const savePaymentItem = useCallback(
    async (data: PaymentItemFormPayload): Promise<boolean> => {
      const members = data.members.map(m => {
        return {
          scheduleId: m.scheduleId,
          paymentId: selectedPaymentItem.current ? selectedPaymentItem.current.paymentId : 0,
          memberId: m.memberId,
          name: m.name,
        };
      });
      if (selectedPaymentItem.current !== null) {
        const a = selectedPaymentItem.current.members.map(m => m.memberId).sort();
        const b = data.members.map(m => m.memberId).sort();
        if (
          selectedPaymentItem.current.title === data.title &&
          selectedPaymentItem.current.cost === Number(data.cost) &&
          selectedPaymentItem.current.payerId === data.payerId &&
          a.every((v, i) => v === b[i]) &&
          a.length === b.length
        ) {
          return true;
        }
      }
      const newItem: PaymentItem = {
        scheduleId: selectedSchedule.scheduleId,
        paymentId: selectedPaymentItem.current ? selectedPaymentItem.current.paymentId : 0,
        payer: data.payer,
        payerId: data.payerId,
        title: data.title,
        cost: parseInt(data.cost.replace(/,/g, '')),
        acceptYn: true,
        members: members,
      };

      let typeText: string;
      if (selectedPaymentItem.current === null) {
        const res1 = await api.post('/api/paymentItems?scheduleId=' + selectedSchedule.scheduleId, newItem);
        if (res1.status !== 'SUCCESS') return false;
        typeText = '추가';
        dispatch(setPaymentItemList([res1.data, ...paymentItemList]));
      } else {
        const res1 = await api.put(
          '/api/paymentItems?scheduleId=' +
            selectedSchedule.scheduleId +
            '&paymentId=' +
            selectedPaymentItem.current.paymentId,
          newItem,
        );
        if (res1.status !== 'SUCCESS') return false;
        typeText = '수정';
        const newList = paymentItemList.map(item => (item.paymentId === res1.data.paymentId ? res1.data : item));
        dispatch(setPaymentItemList(newList));
      }

      //총금액 업데이트
      const res2 = await api.get('/api/schedules?scheduleId=' + selectedSchedule.scheduleId);
      if (res2.status !== 'SUCCESS') return false;
      dispatch(setSchedule(res2.data));

      //스케줄 리스트 업데이트
      const newSchedules = schedules.map(s => (s.scheduleId === res2.data.scheduleId ? res2.data : s));
      dispatch(setSchedules(newSchedules));

      const res3 = await api.get('/api/schedules/members/list?scheduleId=' + selectedSchedule.scheduleId);
      if (res3.status !== 'SUCCESS') return false;
      dispatch(setMemberList(res3.data));
      Toast.show({
        type: 'message',
        text1: '결제내역을 ' + typeText + '했어요!',
        position: 'bottom',
        visibilityTime: 1500,
      });
      return true;
    },
    [dispatch, paymentItemList, schedules, selectedSchedule.scheduleId],
  );

  // 결제내역 추가 / 수정 기능
  const handleSavePaymentItem = useCallback(
    ({ title, cost, payer, payerId, members }: PaymentItemFormPayload) => {
      setAddPaymentItemModalVisible(false);
      savePaymentItem({ title, cost, payer, payerId, members });
    },
    [savePaymentItem],
  );

  // 결제내역 연속추가
  const handleSave2PaymentItem = useCallback(
    async ({ title, cost, payer, payerId, members }: PaymentItemFormPayload) => {
      savePaymentItem({ title, cost, payer, payerId, members });
    },
    [savePaymentItem],
  );

  // 삭제 기능
  const handleRemovePaymentItem = useCallback(async () => {
    if (selectedPaymentItem.current) {
      setRemovePaymentItemModalVisible(false);
      const res1 = await api.delete(
        '/api/paymentItems/delete?scheduleId=' +
          selectedPaymentItem.current.scheduleId +
          '&paymentId=' +
          selectedPaymentItem.current.paymentId,
      );
      if (res1.status !== 'SUCCESS') return false;

      const newList = paymentItemList.filter(item => item.paymentId !== selectedPaymentItem.current!!.paymentId);
      dispatch(setPaymentItemList(newList));

      //총금액 업데이트
      const res2 = await api.get('/api/schedules?scheduleId=' + selectedSchedule.scheduleId);
      if (res2.status !== 'SUCCESS') return false;
      dispatch(setSchedule(res2.data));

      const res3 = await api.get('/api/schedules/members/list?scheduleId=' + selectedSchedule.scheduleId);
      if (res3.status !== 'SUCCESS') return false;
      dispatch(setMemberList(res3.data));
      Toast.show({
        type: 'message',
        text1: '결제내역을 삭제했어요!',
        position: 'bottom',
        visibilityTime: 1500,
      });
    }
  }, [dispatch, paymentItemList, selectedSchedule.scheduleId]);

  return {
    isPaymentItemModalVisible,
    isRemovePaymentItemModalVisible,
    selectedPaymentItem,
    openAddPaymentItemModal,
    openUpdatePaymentItemModal,
    openRemovePaymentItemModal,
    closePaymentItemModal,
    closeRemovePaymentItemModal,
    handleSavePaymentItem,
    handleSave2PaymentItem,
    handleRemovePaymentItem,
    helpAddPaymentItem,
    helpRemovePaymentItem,
  };
}
