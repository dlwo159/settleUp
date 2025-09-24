import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import { View, TextInput, Keyboard } from 'react-native';

import { AppText, AppTextInput, AppButton, AppModal } from '@/components';

type Props = {
  isVisible: boolean;
  initialName?: string;
  globalStyles: any;
  styles: any;
  fontStyles: any;
  onSubmit: (data: string[]) => void;
  onCancel: () => void;
};

const MemberAddModal = memo(function ScheduleItem({
  isVisible,
  initialName = '',
  globalStyles,
  fontStyles,
  onSubmit,
  onCancel,
}: Props) {
  const [memberNames, setMemberNames] = useState('');

  const memberNamesInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!isVisible) return;
    setMemberNames(initialName);
  }, [isVisible, initialName]);

  const handleModalShow = useCallback(
    () =>
      requestAnimationFrame(() => {
        if (initialName === '') memberNamesInputRef.current?.focus();
      }),
    [initialName],
  );

  const handleSubmit = useCallback(() => {
    const trimmed = memberNames.trim();
    if (!trimmed) {
      memberNamesInputRef.current?.focus();
      return;
    }

    const temp: string[] = memberNames.replaceAll(' ', '').split(',');
    const inputMembers: string[] = temp.filter(item => item !== '').map(item => item.slice(0, 10));
    if (inputMembers.length === 0) {
      memberNamesInputRef.current?.focus();
      return;
    }

    Keyboard.dismiss();
    onSubmit(inputMembers);
  }, [onSubmit, memberNames]);

  return (
    <AppModal isVisible={isVisible} onShow={handleModalShow}>
      <View style={globalStyles.modalView}>
        <View>
          <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.black, globalStyles.ml2, globalStyles.mb2]}>
            이름
          </AppText>
          <AppTextInput
            ref={memberNamesInputRef}
            value={memberNames}
            onChangeText={setMemberNames}
            onSubmitEditing={handleSubmit}
            placeholder=",로 여러명등록 가능(A,B,C)"
          />
        </View>
        <AppText style={[fontStyles.regular, fontStyles.s12, fontStyles.black]}>
          각 이름은 10자까지만 등록됩니다
        </AppText>
        <View style={[globalStyles.row, globalStyles.mt16]}>
          <AppButton text="추가" onPress={handleSubmit} />
          <View style={globalStyles.emptyW16} />
          <AppButton text="취소" cancle onPress={onCancel} />
        </View>
      </View>
    </AppModal>
  );
});

export default MemberAddModal;
