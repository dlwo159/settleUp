import { useState } from 'react';
import { TextInput, TextInputProps, StyleSheet, View } from 'react-native';

import { useSelector } from 'react-redux';
import type { RootState } from '@/app/Store';

import { Setting } from '@/@types/Types';
import Color from '@/css/ColorStyle';

interface Props extends TextInputProps {
  focus?: boolean;
  style?: any;
  ref?: any;
}

const AppTextInput = ({ allowFontScaling = false, style, focus = false, ref, ...rest }: Props) => {
  const setting = useSelector((state: RootState) => state.app.setting);
  const styles = Styles(setting);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.box, style && style, isFocused && { borderColor: Color.main }]}>
      <TextInput
        ref={ref}
        allowFontScaling={allowFontScaling}
        {...rest}
        style={styles.input}
        placeholderTextColor={Color.gray}
        underlineColorAndroid="transparent"
        onFocus={e => {
          setIsFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={e => {
          setIsFocused(false);
          rest.onBlur?.(e);
        }}
      />
    </View>
  );
};

const Styles = (setting: Setting) =>
  StyleSheet.create({
    box: {
      height: 40 * setting.scale,
      borderColor: Color.gray,
      borderWidth: 1 * setting.scale,
      borderRadius: 4 * setting.scale,
      paddingLeft: 4 * setting.scale,
      paddingRight: 4 * setting.scale,
    },
    input: {
      fontFamily: 'Pretendard-Medium',
      fontSize: 16 * setting.scale,
      lineHeight: 20 * setting.scale,
      color: Color.black,
      paddingTop: 8 * setting.scale,
      paddingLeft: 4 * setting.scale,
      paddingRight: 4 * setting.scale,
      // paddingHorizontal: 0,
      // paddingVertical: 0,
      textAlignVertical: 'center',
      includeFontPadding: false,
    },
  });

export default AppTextInput;
