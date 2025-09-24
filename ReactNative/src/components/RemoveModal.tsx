import React, { useEffect, useState, useCallback, memo } from 'react';
import { View } from 'react-native';

import { AppText, AppButton, AppModal } from '@/components';

type Props = {
  isVisible: boolean;
  type: string;
  initialTitle: string;
  globalStyles: any;
  fontStyles: any;
  onSubmit: () => void;
  onCancel: () => void;
};

const RemoveModal = memo(function ScheduleItem({
  isVisible,
  type,
  initialTitle,
  globalStyles,
  fontStyles,
  onSubmit,
  onCancel,
}: Props) {
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    if (!isVisible) return;
    setTitle(initialTitle);
  }, [isVisible, initialTitle]);

  return (
    <AppModal isVisible={isVisible}>
      <View style={globalStyles.modalView}>
        <View>
          <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.black, fontStyles.center, globalStyles.mb4]}>
            해당 {type} 삭제하시겠습니까?
          </AppText>
          <AppText style={[fontStyles.bold, fontStyles.s20, fontStyles.black, fontStyles.center]}>{title}</AppText>
        </View>
        <View style={[globalStyles.row, globalStyles.mt16]}>
          <AppButton text="삭제" onPress={onSubmit} />
          <View style={globalStyles.emptyW16} />
          <AppButton text="취소" cancle onPress={onCancel} />
        </View>
      </View>
    </AppModal>
  );
});

export default RemoveModal;
