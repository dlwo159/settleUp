import { useState, useRef, useCallback, useEffect } from 'react';

import Toast from 'react-native-toast-message';

import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/app/Store';
import { setPaymentItemList, setMemberList } from '@/app/StateSlice';

import { api } from '@/common/Api';

import { MemberFormPayload } from '@/components/MemberUpdateModal';
import { ScheduleMember } from '@/@types/Types';

export function useMembers() {
  const dispatch = useDispatch();

  const selectedSchedule = useSelector((state: RootState) => state.app.schedule);
  const memberList = useSelector((state: RootState) => state.app.memberList);
  const paymentItemList = useSelector((state: RootState) => state.app.paymentItemList);
  const paymentItemListRef = useRef(paymentItemList);
  useEffect(() => {
    paymentItemListRef.current = paymentItemList;
  }, [paymentItemList]);

  const [isAddMemberModalVisible, setAddMemberModalVisible] = useState<boolean>(false);
  const [isUpdateMemberModalVisible, setUpdateMemberModalVisible] = useState<boolean>(false);
  const [isRemoveMemberModalVisible, setRemoveMemberModalVisible] = useState(false);

  const [memberPreset, setMemberPreset] = useState<MemberFormPayload>({ name: '', account: null });

  const selectedMember = useRef<ScheduleMember | null>(null);

  const helpAddMembers = useCallback(() => {
    const newMembers: ScheduleMember[] = [
      { name: '멤버', payerYn: false, checked: false, account: null, memberId: 9001, scheduleId: '' },
      { name: '추가', payerYn: false, checked: false, account: null, memberId: 9002, scheduleId: '' },
      { name: '예시', payerYn: false, checked: false, account: null, memberId: 9003, scheduleId: '' },
    ];
    dispatch(setMemberList([...newMembers, ...memberList]));
  }, [memberList]);

  const helpRemoveMembers = useCallback(() => {
    dispatch(setMemberList(memberList.slice(3)));
  }, [memberList]);

  // 멤버 추가 모달 ON
  const openAddMemberModal = useCallback(() => {
    setAddMemberModalVisible(true);
  }, []);

  // 멤버 수정 모달 ON
  const openUpdateMemberModal = useCallback((member: ScheduleMember) => {
    selectedMember.current = member;
    setMemberPreset({ name: member.name, account: member.account });
    setUpdateMemberModalVisible(true);
  }, []);

  // 멤버 삭제 모달 ON
  const openRemoveMemberModal = useCallback((member: ScheduleMember) => {
    selectedMember.current = member;
    setMemberPreset({ name: member.name, account: member.account });
    setRemoveMemberModalVisible(true);
  }, []);

  // 멤버 추가 모달 OFF
  const closeAddMemberModal = useCallback(() => {
    setAddMemberModalVisible(false);
  }, []);

  // 멤버 수정 모달 OFF
  const closeUpdateMemberModal = useCallback(() => {
    setUpdateMemberModalVisible(false);
  }, []);

  // 멤버 삭제 모달 OFF
  const closeRemoveMemberModal = useCallback(() => {
    setRemoveMemberModalVisible(false);
  }, []);

  // 멤버 추가 기능
  const handleAddMembers = useCallback(
    (data: string[]) => {
      setAddMemberModalVisible(false);
      const newMembers = data.map(name => {
        return {
          name: name,
          payerYn: false,
        };
      });
      api.post('/api/schedules/members?scheduleId=' + selectedSchedule.scheduleId, newMembers).then(res => {
        if (res.status === 'SUCCESS') {
          dispatch(setMemberList([...memberList, ...res.data]));
          Toast.show({
            type: 'message',
            text1: '멤버를 추가했어요!',
            position: 'bottom',
            visibilityTime: 1500,
          });
        }
      });
    },
    [dispatch, selectedSchedule.scheduleId, memberList],
  );

  // 멤버 수정 기능
  const handleUpdateMembers = useCallback(
    (data: MemberFormPayload) => {
      setUpdateMemberModalVisible(false);
      if (selectedMember.current !== null) {
        if (selectedMember.current.name === data.name && selectedMember.current.account === data.account) {
          return;
        }
        const newMember: ScheduleMember = {
          scheduleId: selectedMember.current.scheduleId,
          memberId: selectedMember.current.memberId,
          name: data.name,
          checked: false,
          payerYn: selectedMember.current.payerYn,
          account: selectedMember.current.account !== '' ? data.account : null,
        };
        api
          .put(
            '/api/schedules/members?scheduleId=' +
              selectedMember.current.scheduleId +
              '&memberId=' +
              selectedMember.current.memberId,
            newMember,
          )
          .then(res => {
            if (res.status === 'SUCCESS') {
              const newMemberList = memberList.map(m => (m.memberId === newMember.memberId ? newMember : m));
              dispatch(setMemberList(newMemberList));
              const newPaymentItemList = paymentItemListRef.current.map(pi => {
                const newMemberList = pi.members.map(m =>
                  m.memberId === newMember.memberId ? { ...m, name: newMember.name } : m,
                );
                if (pi.payerId === newMember.memberId) {
                  return { ...pi, payer: newMember.name, members: newMemberList };
                } else {
                  return { ...pi, members: newMemberList };
                }
              });
              dispatch(setPaymentItemList(newPaymentItemList));
              Toast.show({
                type: 'message',
                text1: '멤버를 수정했어요!',
                position: 'bottom',
                visibilityTime: 1500,
              });
            }
          });
      }
    },
    [dispatch, memberList],
  );

  //멤버 삭제 기능
  const handleRemoveMembers = useCallback(async () => {
    setRemoveMemberModalVisible(false);
    if (selectedMember.current !== null) {
      const res1 = await api.put(
        '/api/schedules/members/delete?scheduleId=' +
          selectedMember.current.scheduleId +
          '&memberId=' +
          selectedMember.current.memberId,
      );
      if (res1.status === 'SUCCESS') {
        const updatedMembers = memberList.filter(i => i.memberId !== selectedMember.current!!.memberId);
        dispatch(setMemberList(updatedMembers));
        const newPaymentItemList = paymentItemListRef.current.map(pi => {
          const newMemberList = pi.members.filter(m => m.memberId !== selectedMember.current!!.memberId);
          return { ...pi, members: newMemberList };
        });
        dispatch(setPaymentItemList(newPaymentItemList));
        Toast.show({
          type: 'message',
          text1: '멤버를 삭제했어요!',
          position: 'bottom',
          visibilityTime: 1500,
        });
      }
    }
  }, [dispatch, memberList]);

  return {
    isAddMemberModalVisible,
    isUpdateMemberModalVisible,
    isRemoveMemberModalVisible,
    memberPreset,
    openAddMemberModal,
    openUpdateMemberModal,
    openRemoveMemberModal,
    closeAddMemberModal,
    closeUpdateMemberModal,
    closeRemoveMemberModal,
    handleAddMembers,
    handleUpdateMembers,
    handleRemoveMembers,
    helpAddMembers,
    helpRemoveMembers,
  };
}
