import { useState, useRef, useCallback } from 'react';

import Toast from 'react-native-toast-message';
import { navigationRef } from '@/navigation';

import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/app/Store';
import { setSchedules, setSchedule } from '@/app/StateSlice';

import { api } from '@/common/Api';

import { DateFormat, RandomHexColor } from '@/common/CommonUtils';
import { ScheduleFormPayload } from '@/components/ScheduleModal';
import { Schedule } from '@/@types/Types';

export function useSchedules() {
  const getRoutesCount = () => (navigationRef.isReady() ? navigationRef.getRootState()?.routes.length ?? 0 : 0);
  const dispatch = useDispatch();

  const selectedSchedule = useRef<Schedule | null>(null);
  const schedules = useSelector((state: RootState) => state.app.schedules);
  const schedulesLength = useSelector((state: RootState) => state.app.schedules.length);

  const [isSchedlueModalVisible, setSchedlueModalVisible] = useState(false);
  const [isRemoveScheduleModalVisible, setRemoveScheduleModalVisible] = useState(false);
  const removeTitle = useRef('');

  const helpAddSchedule = useCallback(() => {
    const newSchedule = {
      scheduleId: '',
      title: '이용안내 설명 중',
      date: DateFormat(),
      color: RandomHexColor(),
      totalCost: 0,
    };
    dispatch(setSchedules([newSchedule, ...schedules]));
  }, [schedules]);

  const helpRemoveSchedule = useCallback(() => {
    dispatch(setSchedules(schedules.slice(1)));
  }, [schedules]);

  // 일정 추가 모달 ON
  const openAddScheduleModal = useCallback(() => {
    selectedSchedule.current = null;
    setSchedlueModalVisible(true);
  }, []);

  // 일정 수정 모달 ON
  const openUpdateScheduleModal = useCallback((schedule: Schedule) => {
    selectedSchedule.current = schedule;
    setSchedlueModalVisible(true);
  }, []);

  // 일정 삭제 모달 ON
  const openRemoveScheduleModal = useCallback((schedule: Schedule) => {
    selectedSchedule.current = schedule;
    removeTitle.current = schedule.title;
    setRemoveScheduleModalVisible(true);
  }, []);

  // 일정 추가/수정 모달 OFF
  const closeScheduleModal = useCallback(() => {
    setSchedlueModalVisible(false);
  }, []);

  // 일정 삭제 모달 OFF
  const closeRemoveScheduleModal = useCallback(() => {
    setRemoveScheduleModalVisible(false);
  }, []);

  // 일정 추가 / 수정 기능
  const handleSaveSchedule = useCallback(
    async ({ title, date, color }: ScheduleFormPayload) => {
      let res,
        typeText,
        length = schedulesLength;
      setSchedlueModalVisible(false);
      let newSchedule: Schedule | null = null;
      if (selectedSchedule.current === null) {
        typeText = '추가';
        newSchedule = {
          scheduleId: '',
          title: title,
          date: date,
          color: color,
          totalCost: 0,
        };
        res = await api.post('/api/schedules', newSchedule);
        length += 1;
      } else {
        if (
          selectedSchedule.current.title === title &&
          selectedSchedule.current.date === date &&
          selectedSchedule.current.color === color
        ) {
          Toast.show({
            type: 'message',
            text1: '일정을 수정했어요!',
            position: 'bottom',
            visibilityTime: 1500,
          });
          return;
        }
        typeText = '수정';
        newSchedule = {
          scheduleId: selectedSchedule.current.scheduleId,
          title: title,
          date: date,
          color: color,
          totalCost: selectedSchedule.current.totalCost,
        };
        res = await api.put('/api/schedules', newSchedule);
      }
      if (res.status !== 'SUCCESS') return false;

      if (selectedSchedule.current === null) {
        typeText = '추가';
        dispatch(setSchedules([res.data, ...schedules]));
      } else {
        typeText = '수정';
        dispatch(setSchedule(res.data));
        const newList = schedules.map(item => (item.scheduleId === res.data.scheduleId ? res.data : item));
        dispatch(setSchedules(newList));
      }
      Toast.show({
        type: 'message',
        text1: '일정을 ' + typeText + '했어요!',
        position: 'bottom',
        visibilityTime: 1500,
      });
    },
    [dispatch, schedules],
  );

  // 삭제 기능
  const handleRemoveSchedule = useCallback(async () => {
    if (selectedSchedule.current !== null) {
      const res1 = await api.put('/api/schedules/delete?scheduleId=' + selectedSchedule.current.scheduleId);
      if (res1.status !== 'SUCCESS') return false;

      setRemoveScheduleModalVisible(false);
      const newList = schedules.filter(item => item.scheduleId !== selectedSchedule.current!!.scheduleId);
      dispatch(setSchedules(newList));
      if (getRoutesCount() != 1) {
        navigationRef.goBack();
      }
      Toast.show({
        type: 'message',
        text1: '일정을 삭제했어요!',
        position: 'bottom',
        visibilityTime: 1500,
      });
    }
  }, [schedules]);

  return {
    isSchedlueModalVisible,
    isRemoveScheduleModalVisible,
    removeTitle,
    openAddScheduleModal,
    openUpdateScheduleModal,
    openRemoveScheduleModal,
    closeScheduleModal,
    closeRemoveScheduleModal,
    handleSaveSchedule,
    handleRemoveSchedule,
    helpAddSchedule,
    helpRemoveSchedule,
  };
}
