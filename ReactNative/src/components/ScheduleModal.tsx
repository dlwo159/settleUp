import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import { View, TextInput, Image, Keyboard } from 'react-native';

import {
  AppText,
  AppTouchableOpacity,
  AppTextInput,
  AppButton,
  AppCalendar,
  AppColorPicker,
  AppModal,
} from '@/components';
import Color from '@/css/ColorStyle';

export interface ScheduleFormPayload {
  title: string;
  date: string;
  color: string;
}

type Props = {
  isVisible: boolean;
  mode: 'create' | 'update';
  initialTitle?: string;
  initialDate: string;
  initialColor: string;
  globalStyles: any;
  styles: any;
  fontStyles: any;
  onSubmit: (data: ScheduleFormPayload) => void;
  onCancel: () => void;
};

const ScheduleModal = memo(function ScheduleItem({
  isVisible,
  mode,
  initialTitle = '',
  initialDate,
  initialColor,
  globalStyles,
  styles,
  fontStyles,
  onSubmit,
  onCancel,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [date, setDate] = useState(initialDate);
  const [color, setColor] = useState(initialColor);
  const [isCalendar, setCalendar] = useState(false);
  const [isColorBox, setColorBox] = useState(false);
  const [isColorPicker, setColorPicker] = useState(false);

  const titleInputRef = useRef<TextInput>(null);
  const tempColorRef = useRef(initialColor);

  useEffect(() => {
    if (!isVisible) return;
    setTitle(initialTitle);
    setDate(initialDate);
    setColor(initialColor);
    tempColorRef.current = initialColor;
  }, [isVisible, initialTitle, initialDate, initialColor]);

  const handleModalShow = useCallback(
    () =>
      requestAnimationFrame(() => {
        if (mode === 'create' && initialTitle === '') titleInputRef.current?.focus();
      }),
    [mode, initialTitle],
  );

  // 날짜 선택
  const handleDayPress = useCallback((day: { dateString: string }) => {
    setDate(day.dateString);
    setCalendar(false);
  }, []);

  // 색상 임시 선택
  const handleColor = useCallback((color: string) => {
    tempColorRef.current = color;
  }, []);

  // 색상 선택
  const handleColorPress = useCallback(() => {
    setColor(tempColorRef.current);
    setColorPicker(false);
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = title.trim();
    if (!trimmed) {
      titleInputRef.current?.focus();
      return;
    }
    Keyboard.dismiss();
    onSubmit({ title: trimmed, date: date, color: color });
  }, [onSubmit, title, date, color]);

  return (
    <AppModal isVisible={isVisible} onShow={handleModalShow}>
      {!isCalendar && !isColorPicker && (
        <View style={globalStyles.modalView}>
          <View style={globalStyles.row}>
            <View style={globalStyles.flex1}>
              <AppText
                style={[fontStyles.medium, fontStyles.s16, fontStyles.black, globalStyles.ml2, globalStyles.mb2]}>
                날짜
              </AppText>
              <AppTouchableOpacity onPress={() => setCalendar(true)}>
                <AppTextInput editable={false} value={date} />
              </AppTouchableOpacity>
            </View>
            <View style={globalStyles.emptyW16} />
            <View style={globalStyles.flex1}>
              <AppText
                style={[fontStyles.medium, fontStyles.s16, fontStyles.black, globalStyles.ml2, globalStyles.mb2]}>
                색상
              </AppText>
              <AppTouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  setColorBox(true);
                }}>
                <AppTextInput editable={false} style={[{ backgroundColor: color, borderColor: color }, styles.p0]} />
              </AppTouchableOpacity>
            </View>
          </View>
          <View style={globalStyles.mt8}>
            <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.black, globalStyles.ml2, globalStyles.mb2]}>
              일정명
            </AppText>
            <AppTextInput
              ref={titleInputRef}
              value={title}
              maxLength={20}
              placeholder="20자 이내"
              onChangeText={setTitle}
            />
          </View>
          <View style={[globalStyles.row, globalStyles.mt16]}>
            <AppButton text={mode === 'update' ? '수정' : '추가'} onPress={handleSubmit} />
            <View style={globalStyles.emptyW16} />
            <AppButton text="취소" cancle onPress={onCancel} />
          </View>
        </View>
      )}
      {isCalendar && (
        <View style={[globalStyles.modalView, globalStyles.p0]}>
          <AppCalendar
            style={globalStyles.borderRadius}
            current={date}
            onPress={handleDayPress}
            markedDates={{ [date]: { selected: true, selectedColor: Color.main } }}
          />
        </View>
      )}
      {isColorBox && (
        <AppTouchableOpacity
          onPress={() => setColorBox(false)}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}>
          <View style={[globalStyles.shadow, globalStyles.borderRadius, styles.colorBox]}>
            <View style={[globalStyles.row, globalStyles.mb8]}>
              {[0, 1, 2, 3, 4].map(i => (
                <AppTouchableOpacity
                  key={i}
                  onPress={() => {
                    setColor(Color.boxColor[i]);
                    setColorBox(false);
                  }}
                  style={[
                    globalStyles.borderRadius,
                    i !== 4 && globalStyles.mr8,
                    styles.palletBox,
                    { backgroundColor: Color.boxColor[i] },
                  ]}
                />
              ))}
            </View>
            <View style={globalStyles.row}>
              {[5, 6, 7, 8].map(i => (
                <AppTouchableOpacity
                  key={i}
                  onPress={() => {
                    setColor(Color.boxColor[i]);
                    setColorBox(false);
                  }}
                  style={[
                    globalStyles.borderRadius,
                    globalStyles.mr8,
                    styles.palletBox,
                    { backgroundColor: Color.boxColor[i] },
                  ]}
                />
              ))}
              <AppTouchableOpacity
                onPress={() => {
                  setColorBox(false);
                  setColorPicker(true);
                }}
                style={styles.palletBox}>
                <Image style={{ width: '100%', height: '100%' }} source={require('@images/pallet.png')} />
              </AppTouchableOpacity>
            </View>
          </View>
        </AppTouchableOpacity>
      )}
      {isColorPicker && (
        <View style={[globalStyles.borderRadius, styles.colorPickerBox1]}>
          <View style={styles.colorPickerBox2}>
            <AppColorPicker onPress={handleColor} initialColor={color} />
          </View>
          <View style={[globalStyles.row, globalStyles.mt16, globalStyles.mr16, globalStyles.ml16, globalStyles.mb16]}>
            <AppButton text={'선택'} onPress={handleColorPress} />
            <View style={globalStyles.emptyW16} />
            <AppButton text={'취소'} cancle onPress={() => setColorPicker(false)} />
          </View>
        </View>
      )}
    </AppModal>
  );
});

export default ScheduleModal;
