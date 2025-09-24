import { StyleSheet } from 'react-native';
import Color from '@/css/ColorStyle';
import { Setting } from '@/@types/Types';

const Styles = (setting: Setting) =>
  StyleSheet.create({
    paymentCard: {
      backgroundColor: Color.paymentCard,
      paddingTop: 8 * setting.scale,
      paddingBottom: 8 * setting.scale,
      paddingLeft: 12 * setting.scale,
      paddingRight: 12 * setting.scale,
    },
    underLine: {
      flex: 1,
      height: 1 * setting.scale,
      borderStyle: 'dashed',
      borderTopWidth: 1 * setting.scale,
      borderColor: Color.darkGray,
      marginLeft: 8 * setting.scale,
      marginRight: 8 * setting.scale,
      marginTop: 18 * setting.scale,
    },
    scrollBox: {
      height: setting.height - (setting.top + 28 * setting.scale),
    },
    empty: {
      height: setting.bottom,
    },
    textSetting: {
      flexShrink: 1,
      minWidth: 0,
    },
  });

export default Styles;
