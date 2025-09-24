import { StyleSheet } from 'react-native';
import Color from './ColorStyle';

const Styles = (setting: any) =>
  StyleSheet.create({
    box: {
      backgroundColor: Color.toast,
      width: 343 * setting.scale,
      borderRadius: 18 * setting.scale,
      paddingBottom: 14 * setting.scale,
      paddingTop: 14 * setting.scale,
      marginBottom: 48 * setting.scale,
    },
    error: {
      backgroundColor: Color.red,
    },
    text1: {
      fontFamily: 'Pretendard-Bold',
      fontSize: 16 * setting.scale,
      lineHeight: 24 * setting.scale,
      color: Color.white,
      textAlign: 'center',
    },
    text2: {
      fontFamily: 'Pretendard-regular',
      fontSize: 16 * setting.scale,
      lineHeight: 24 * setting.scale,
      color: Color.white,
      textAlign: 'center',
    },
  });

export default Styles;
