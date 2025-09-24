import { StyleSheet } from 'react-native';
import Color from '@/css/ColorStyle';

const Styles = (setting: any) =>
  StyleSheet.create({
    bgPaymentCard: { backgroundColor: Color.paymentCard },
    bgMain: { backgroundColor: Color.main },
    bgMemberCard: { backgroundColor: Color.memberCard },
    coinImg: {
      width: 20 * setting.scale,
      height: 20 * setting.scale,
      resizeMode: 'stretch',
      position: 'absolute',
      top: -6 * setting.scale,
      left: -6 * setting.scale,
    },
    memberBox1: {
      borderColor: Color.gray,
      borderWidth: 1 * setting.scale,
      alignSelf: 'flex-start',
    },
    memberBox2: {
      borderColor: Color.main,
      backgroundColor: Color.main,
    },
    gapBox: {
      flexWrap: 'wrap',
      gap: 8 * setting.scale,
    },
    p0: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    colorBox: {
      position: 'absolute',
      backgroundColor: Color.background,
      top: 86 * setting.scale,
      right: 16 * setting.scale,
      padding: 8 * setting.scale,
    },
    palletBox: {
      width: 40 * setting.scale,
      height: 40 * setting.scale,
    },
    colorPickerBox1: {
      backgroundColor: Color.background,
      width: 300 * setting.scale,
      height: 360 * setting.scale,
      justifyContent: 'center',
      alignItems: 'center',
    },
    colorPickerBox2: {
      width: 280 * setting.scale,
      height: 280 * setting.scale,
    },
  });

export default Styles;
