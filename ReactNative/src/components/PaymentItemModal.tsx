import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import { View, TextInput, Keyboard, Platform, Pressable, StyleSheet } from 'react-native';

import { AppText, AppTouchableOpacity, AppTextInput, AppButton, AppModal, AppScrollView } from '@/components';
import { MoneyFormat } from '@/common/CommonUtils';
import { ScheduleMember, PaymentMember, Setting } from '@/@types/Types';

import ModalPayerRenderItem from '@/components/ModalMemberRenderItem';

export interface PaymentItemFormPayload {
  title: string;
  cost: string;
  payer: string;
  payerId: number;
  members: ScheduleMember[];
}

type Props = {
  isVisible: boolean;
  mode: 'create' | 'update' | 'help';
  initialTitle: string;
  initialCost: string;
  initialPayerId: number;
  initialMembers: ScheduleMember[];
  initialPaymentMembers: PaymentMember[];
  globalStyles: any;
  styles: any;
  fontStyles: any;
  setting: Setting;
  onSubmit: (data: PaymentItemFormPayload) => void;
  onSubmitCon?: (data: PaymentItemFormPayload) => void;
  onCancel: () => void;
};

const PaymentItemModal = memo(function ScheduleItem({
  isVisible,
  mode,
  initialTitle,
  initialCost,
  initialPayerId,
  initialMembers,
  initialPaymentMembers,
  globalStyles,
  styles,
  fontStyles,
  setting,
  onSubmit,
  onSubmitCon,
  onCancel,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [cost, setCost] = useState(MoneyFormat(initialCost));
  const payerId = useRef(initialPayerId);
  const tempPayerId = useRef(initialPayerId);
  const [payerName, setPayerName] = useState('');
  const [members, setMembers] = useState<ScheduleMember[]>(initialMembers);
  const paymentMembers = useRef<PaymentMember[]>([]);
  const [isPayerPiker, setPayerPiker] = useState(false);
  const [payerList, setPayerList] = useState<ScheduleMember[]>([]);
  const [checkMemberList, setCheckMemberList] = useState<ScheduleMember[]>([]);

  const titleInputRef = useRef<TextInput>(null);
  const costInputRef = useRef<TextInput>(null);

  const contentH = useRef<number>(0);

  useEffect(() => {
    if (!isVisible) return;
    setTitle(initialTitle);
    setCost(MoneyFormat(initialCost));
    payerId.current = initialPayerId;
    tempPayerId.current = initialPayerId;
    setMembers(initialMembers);
    if (initialPayerId === 0) {
      setPayerName('');
    } else {
      setPayerName(initialMembers.find(m => m.memberId === initialPayerId)!!.name);
    }
    paymentMembers.current = initialPaymentMembers;
    if (mode === 'help') {
      setCheckMemberList(
        initialMembers.slice(0, 3).map(m => ({ ...m, payerYn: m.memberId === initialPayerId, checked: true })),
      );
    } else {
      const idSet = new Set(initialPaymentMembers.map(m => m.memberId));
      setCheckMemberList(
        initialMembers.map(m => ({
          ...m,
          payerYn: m.memberId === initialPayerId,
          checked: idSet.size === 0 ? true : idSet.has(m.memberId),
        })),
      );
    }
  }, [isVisible]);

  const handleModalShow = useCallback(
    () =>
      requestAnimationFrame(() => {
        if (mode === 'create') titleInputRef.current?.focus();
      }),
    [mode, initialTitle],
  );

  const handlePayerPiker = useCallback(() => {
    tempPayerId.current = payerId.current;
    setPayerList(
      members.map(m => ({
        ...m,
        payerYn: m.memberId === payerId.current,
        checked: m.memberId === payerId.current,
      })),
    );
    setPayerPiker(true);
  }, [members]);

  const handlePayerMember = useCallback(() => {
    if (tempPayerId.current == 0) return;
    const temp = members.find(m => m.memberId === tempPayerId.current)!;
    setPayerName(temp.name);
    payerId.current = temp.memberId;
    setCheckMemberList(prev =>
      prev.map((m, i) => (m.memberId === payerId.current ? { ...m, payerYn: true } : { ...m, payerYn: false })),
    );
    setPayerPiker(false);
  }, [members]);

  const handleSubmit = useCallback(() => {
    const trimmed = title.trim();
    if (!trimmed) {
      titleInputRef.current?.focus();
      return null;
    }

    if (cost === '' || cost === '0') {
      costInputRef.current?.focus();
      return null;
    }
    Keyboard.dismiss();
    if (payerName === '' && payerId.current === 0) {
      handlePayerPiker();
      return null;
    }

    const selected = checkMemberList.filter(m => m.checked);
    if (selected.length === 0) {
      return null;
    }

    onSubmit({
      title: trimmed,
      cost: cost,
      payer: payerName,
      payerId: payerId.current,
      members: selected,
    });
  }, [onSubmit, title, cost, payerName, checkMemberList]);

  const handleSubmitCon = useCallback(() => {
    const trimmed = title.trim();
    if (!trimmed) {
      titleInputRef.current?.focus();
      return null;
    }

    if (cost === '' || cost === '0') {
      costInputRef.current?.focus();
      return null;
    }
    Keyboard.dismiss();
    if (payerName === '' && payerId.current === 0) {
      handlePayerPiker();
      return null;
    }

    const selected = checkMemberList.filter(m => m.checked);
    if (selected.length === 0) {
      return null;
    }

    setTitle('');
    setCost('');
    titleInputRef.current?.focus();
    onSubmitCon?.({
      title: trimmed,
      cost: cost,
      payer: payerName,
      payerId: payerId.current,
      members: selected,
    });
  }, [onSubmitCon, title, cost, payerName, checkMemberList]);

  return (
    <AppModal isVisible={isVisible} onShow={handleModalShow}>
      <View style={[globalStyles.modalView, globalStyles.pl0, globalStyles.pr0]}>
        {!isPayerPiker ? (
          <View>
            <View style={[globalStyles.pl16, globalStyles.pr16]}>
              <AppText
                style={[fontStyles.medium, fontStyles.s16, fontStyles.black, globalStyles.ml2, globalStyles.mb2]}>
                결제 항목
              </AppText>
              <AppTextInput
                ref={titleInputRef}
                value={title}
                maxLength={20}
                onChangeText={setTitle}
                onSubmitEditing={() => {
                  if (cost === '' || cost === '0') costInputRef.current?.focus();
                }}
              />
            </View>
            <View style={[globalStyles.mt8, globalStyles.pl16, globalStyles.pr16]}>
              <AppText
                style={[fontStyles.medium, fontStyles.s16, fontStyles.black, globalStyles.ml2, globalStyles.mb2]}>
                결제금액
              </AppText>
              <AppTextInput
                ref={costInputRef}
                value={cost}
                keyboardType="numeric"
                onChangeText={text => setCost(MoneyFormat(text))}
                onSubmitEditing={() => {
                  if (payerName == '') {
                    handlePayerPiker();
                  }
                }}
              />
            </View>
            <View style={[globalStyles.mt8, globalStyles.pl16, globalStyles.pr16]}>
              <AppText
                style={[fontStyles.medium, fontStyles.s16, fontStyles.black, globalStyles.ml2, globalStyles.mb2]}>
                결제자
              </AppText>
              <AppTouchableOpacity onPress={handlePayerPiker}>
                <AppTextInput editable={false} value={payerName} />
              </AppTouchableOpacity>
            </View>
            <View style={[globalStyles.mt8, globalStyles.pl16, globalStyles.pr16]}>
              <AppText
                style={[fontStyles.medium, fontStyles.s16, fontStyles.black, globalStyles.ml2, globalStyles.mb2]}>
                정산인원
              </AppText>
            </View>

            <AppScrollView
              style={{ maxHeight: 150 * setting.scale }}
              contentContainerStyle={[
                globalStyles.row,
                globalStyles.pt4,
                globalStyles.pl16,
                globalStyles.pr16,
                styles.gapBox,
              ]}
              onContentSizeChange={(_, h) => (contentH.current = h)}
              scrollEnabled={contentH.current > 150 * setting.scale}
              showsVerticalScrollIndicator={contentH.current > 150 * setting.scale}
              bounces={false}
              nestedScrollEnabled={false}
              removeClippedSubviews={Platform.OS === 'android' ? false : true}
              keyboardShouldPersistTaps="always"
              keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
              onTouchStart={() => Keyboard.dismiss()}>
              <Pressable style={StyleSheet.absoluteFill} pointerEvents="box-only" onPressIn={Keyboard.dismiss} />
              {checkMemberList.map((item, idx) => (
                <ModalPayerRenderItem
                  key={'m' + item.memberId}
                  item={item}
                  globalStyles={globalStyles}
                  styles={styles}
                  fontStyles={fontStyles}
                  onPress={() =>
                    setCheckMemberList(prev => prev.map((m, i) => (i === idx ? { ...m, checked: !m.checked } : m)))
                  }
                  onLongPress={() => {
                    tempPayerId.current = item.memberId;
                    handlePayerMember();
                  }}
                />
              ))}
            </AppScrollView>
            {mode !== 'update' && (
              <View style={[globalStyles.row, globalStyles.mt16, globalStyles.pl16, globalStyles.pr16]}>
                <AppButton text={'추가 후 계속'} onPress={handleSubmitCon} />
              </View>
            )}
            <View style={[globalStyles.row, globalStyles.mt16, globalStyles.pl16, globalStyles.pr16]}>
              <AppButton text={mode === 'update' ? '수정' : '추가'} onPress={handleSubmit} />
              <View style={globalStyles.emptyW16} />
              <AppButton text="취소" cancle={true} onPress={onCancel} />
            </View>
          </View>
        ) : (
          <View>
            <View>
              <AppText style={[fontStyles.semiBold, fontStyles.s24, fontStyles.black, fontStyles.center]}>
                결제자
              </AppText>
            </View>
            <AppScrollView
              style={{ maxHeight: 300 * setting.scale }}
              contentContainerStyle={[
                globalStyles.row,
                globalStyles.pt4,
                globalStyles.pl16,
                globalStyles.pr16,
                {
                  flexWrap: 'wrap',
                  gap: 8 * setting.scale,
                },
              ]}
              onContentSizeChange={(_, h) => (contentH.current = h)}
              scrollEnabled={contentH.current > 300 * setting.scale}
              showsVerticalScrollIndicator={contentH.current > 300 * setting.scale}
              bounces={false}
              nestedScrollEnabled={false}
              removeClippedSubviews={Platform.OS === 'android' ? false : true}>
              <Pressable style={StyleSheet.absoluteFill} pointerEvents="box-only" onPressIn={Keyboard.dismiss} />
              {payerList.map(item => (
                <ModalPayerRenderItem
                  key={'p' + item.memberId}
                  item={item}
                  globalStyles={globalStyles}
                  styles={styles}
                  fontStyles={fontStyles}
                  onPress={() => {
                    tempPayerId.current = item.memberId;
                    const updated = payerList.map((m, _) => ({
                      ...m,
                      payerYn: m.memberId === tempPayerId.current,
                      checked: m.memberId === tempPayerId.current,
                    }));
                    setPayerList(updated);
                  }}
                />
              ))}
            </AppScrollView>
            <View style={[globalStyles.row, globalStyles.mt16, globalStyles.pl16, globalStyles.pr16]}>
              <AppButton text="선택" onPress={handlePayerMember} />
              <View style={globalStyles.emptyW16} />
              <AppButton text={'취소'} cancle onPress={() => setPayerPiker(false)} />
            </View>
          </View>
        )}
      </View>
    </AppModal>
  );
});

export default PaymentItemModal;
