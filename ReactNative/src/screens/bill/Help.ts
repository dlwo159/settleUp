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
      x: setting.width - 130 * setting.scale,
      y: setting.top + -75 * setting.scale,
      text: '설정한 절삭을 적용합니다!\n메뉴에서 설정할 수 있어요!',
    },
    {
      x: setting.width - 140 * setting.scale,
      y: setting.top + setting.height - 185 * setting.scale,
      text: '정산내역을 공유해 보세세요!',
    },
    {
      x: -60 * setting.scale,
      y: setting.top + 15 * setting.scale,
      text: '살짝 누르면 단건공유\n길게 누르면 상세보기로 변경됩니다!',
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
