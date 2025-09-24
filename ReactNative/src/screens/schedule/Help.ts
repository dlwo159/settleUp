import { useState, useRef, useCallback } from 'react';

import { useSelector } from 'react-redux';
import type { RootState } from '@/app/Store';

type Fn = () => void;

export function useHelps() {
  const setting = useSelector((state: RootState) => state.app.setting);
  const [isHelpModalVisible, setHelpModalVisible] = useState(false);
  const helpStep = useRef(0);
  const data = useRef([
    {
      x: setting.widthHalf - 70 * setting.scale,
      y: setting.top + setting.heightHalf - 100 * setting.scale,
      text: '손가락을 눌르면 안내가 시작합니다!',
    },
    {
      x: -60 * setting.scale,
      y: setting.top + 15 * setting.scale,
      text: '살짝 누르면 수정\n길게 누르면 삭제할 수 있어요!',
    },
    {
      x: setting.width - 145 * setting.scale,
      y: setting.top + 90 * setting.scale,
      text: '정산인원을 추가해 주세요!',
    },
    {
      x: setting.widthHalf - 145 * setting.scale,
      y: setting.top + setting.heightHalf - 55 * setting.scale,
      text: '정산참여자를 입력해 주세요!\n,로 구분시 여러명이 등록됩니다!',
    },
    {
      x: -45 * setting.scale,
      y: setting.top + 130 * setting.scale,
      text: '살짝 누르면 수정\n길게 누르면 삭제할 수 있어요!\n(수정시 입금정보를 입력할 수 있어요!)',
    },
    {
      x: setting.width - 140 * setting.scale,
      y: setting.top + setting.height - 185 * setting.scale,
      text: '이제 결제내역을 등록해 주세요!',
    },
    {
      x: setting.widthHalf - 180 * setting.scale,
      y: setting.heightHalf - 240 * setting.scale,
      text: '결제 항목을 입력해 주세요!',
    },
    {
      x: setting.widthHalf - 180 * setting.scale,
      y: setting.heightHalf - 165 * setting.scale,
      text: '결제금액을 입력해 주세요!',
    },
    {
      x: setting.widthHalf - 180 * setting.scale,
      y: setting.heightHalf - 90 * setting.scale,
      text: '결제자를 선택해 주세요!',
    },
    {
      x: setting.widthHalf - 180 * setting.scale,
      y: setting.heightHalf - 15 * setting.scale,
      text: '정산인원을 선택해 주세요!\n길게 누를 경우 결제자를 빠르게 변경할 수 있어요!',
    },
    {
      x: setting.widthHalf - 145 * setting.scale,
      y: setting.heightHalf + 110 * setting.scale,
      text: '결제내역이 추가됩니다!',
    },
    {
      x: -25 * setting.scale,
      y: setting.top + 220 * setting.scale,
      text: '살짝 누르면 수정\n길게 누르면 삭제할 수 있어요!',
    },
    {
      x: setting.width - 130 * setting.scale,
      y: setting.top + -75 * setting.scale,
      text: '입력한 내용을 기준으로\n정산내역을 확인할 수 있어요!',
    },
    {
      x: -65 * setting.scale,
      y: setting.top + setting.height - 185 * setting.scale,
      text: '결제내역을 등록할 수 있는 링크를\n다른 결제자에게 공유해보세요!',
    },
    {
      x: setting.width - 205 * setting.scale,
      y: setting.top + setting.height - 185 * setting.scale,
      text: '다른 결제자가 등록한 결제내역을 검토합니다!',
    },
    {
      x: setting.widthHalf - 70 * setting.scale,
      y: setting.top + setting.heightHalf - 100 * setting.scale,
      text: '이제 서비스를 이용해 보세요!',
    },
  ]);
  const [helpData, setHelpData] = useState(data.current[0]);

  const opeHelpModal = useCallback(() => {
    helpStep.current = 0;
    setHelpData(data.current[helpStep.current]);
    setHelpModalVisible(true);
  }, []);

  const nextHelpStep = useCallback((fn: Fn) => {
    helpStep.current += 1;
    if (helpStep.current === data.current.length) setHelpModalVisible(false);
    else {
      setHelpData(data.current[helpStep.current]);
      fn();
    }
  }, []);

  return {
    isHelpModalVisible,
    helpStep,
    helpData,
    opeHelpModal,
    nextHelpStep,
  };
}
