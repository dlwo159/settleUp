import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import { View, TextInput, Keyboard } from 'react-native';

import { AppText, AppTextInput, AppButton, AppModal } from '@/components';

export interface MemberFormPayload {
  name: string;
  account: string | null;
}

type Props = {
  isVisible: boolean;
  initialName: string;
  initialAccount?: string | null;
  globalStyles: any;
  styles: any;
  fontStyles: any;
  onSubmit: (data: MemberFormPayload) => void;
  onCancel: () => void;
};

const MemberAddModal = memo(function ScheduleItem({
  isVisible,
  initialName,
  initialAccount = '',
  globalStyles,
  fontStyles,
  onSubmit,
  onCancel,
}: Props) {
  const [name, setName] = useState(initialName);
  const [account, setAccount] = useState(initialAccount);

  const nameInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!isVisible) return;
    setName(initialName);
    setAccount(initialAccount);
  }, [isVisible, initialName, initialAccount]);

  const handleSubmit = useCallback(() => {
    const trimmed = name.trim();
    if (!trimmed) {
      nameInputRef.current?.focus();
      return;
    }

    Keyboard.dismiss();
    onSubmit({ name: name, account: account });
  }, [onSubmit, name, account]);

  return (
    <AppModal isVisible={isVisible}>
      <View style={globalStyles.modalView}>
        <View>
          <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.black, globalStyles.ml2, globalStyles.mb2]}>
            이름
          </AppText>
          <AppTextInput ref={nameInputRef} value={name} onChangeText={setName} placeholder="10자 이내" maxLength={10} />
        </View>
        <View style={globalStyles.mt8}>
          <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.black, globalStyles.ml2, globalStyles.mb2]}>
            계좌정보 <AppText style={[fontStyles.medium, fontStyles.s12, fontStyles.gray]}>(선택사항)</AppText>
          </AppText>
          <AppTextInput
            value={account ? account : ''}
            onChangeText={setAccount}
            placeholder="20자리 이내"
            maxLength={20}
          />
          <AppText style={[fontStyles.regular, fontStyles.s10, fontStyles.black]}>
            {'예시)카페로 주세요, 신한 000-000000-000 등'}
          </AppText>
        </View>
        <View style={[globalStyles.row, globalStyles.mt16]}>
          <AppButton text="수정" onPress={handleSubmit} />
          <View style={globalStyles.emptyW16} />
          <AppButton text="취소" cancle onPress={onCancel} />
        </View>
      </View>
    </AppModal>
  );
});

export default MemberAddModal;
