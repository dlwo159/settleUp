import { StyleSheet } from 'react-native';
import Color from '@/css/ColorStyle';

const Styles = (setting: any) =>
  StyleSheet.create({
    regular: { fontFamily: 'Pretendard-Regular' },
    medium: { fontFamily: 'Pretendard-Medium' },
    semiBold: { fontFamily: 'Pretendard-SemiBold' },
    bold: { fontFamily: 'Pretendard-Bold' },
    LetterSpace: { letterSpacing: 0.5 * setting.scale },
    underline: { textDecorationLine: 'underline' },
    center: { textAlign: 'center' },
    right: { textAlign: 'right' },
    s8: { fontSize: 8 * setting.scale, lineHeight: 14 * setting.scale },
    s10: { fontSize: 10 * setting.scale, lineHeight: 14 * setting.scale },
    s11: { fontSize: 11 * setting.scale, lineHeight: 16 * setting.scale },
    s12: { fontSize: 12 * setting.scale, lineHeight: 18 * setting.scale },
    s13: { fontSize: 13 * setting.scale, lineHeight: 20 * setting.scale },
    s14: { fontSize: 14 * setting.scale, lineHeight: 20 * setting.scale },
    s15: { fontSize: 15 * setting.scale, lineHeight: 22 * setting.scale },
    s16: { fontSize: 16 * setting.scale, lineHeight: 24 * setting.scale },
    s18: { fontSize: 18 * setting.scale, lineHeight: 26 * setting.scale },
    s20: { fontSize: 20 * setting.scale, lineHeight: 30 * setting.scale },
    s22: { fontSize: 22 * setting.scale, lineHeight: 24 * setting.scale },
    s24: { fontSize: 24 * setting.scale, lineHeight: 36 * setting.scale },
    s26: { fontSize: 26 * setting.scale, lineHeight: 38 * setting.scale },
    s28: { fontSize: 28 * setting.scale, lineHeight: 40 * setting.scale },
    s40: { fontSize: 40 * setting.scale, lineHeight: 48 * setting.scale },

    black: { color: Color.black },
    white: { color: Color.white },
    gray: { color: Color.gray },
    darkGray: { color: Color.darkGray },

    memberColor: { color: Color.memberColor },
    mainColor: { color: Color.main },

    red: { color: Color.red },
    pink: { color: Color.pink },
  });

export default Styles;
