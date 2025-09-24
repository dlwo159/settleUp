import { StyleSheet } from 'react-native';
import Color from '@/css/ColorStyle';
import { Setting } from '@/@types/Types';

const Styles = (setting: Setting) =>
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
    gapBox: {
      flexWrap: 'wrap',
      gap: 8 * setting.scale,
    },
    fab_l: {
      left: 76 * setting.scale,
    },
    fab_r: {
      right: 76 * setting.scale,
    },
    acceptCount: {
      position: 'absolute',
      bottom: 18 * setting.scale,
      right: 8 * setting.scale,
      width: 16 * setting.scale,
    },
  });

export default Styles;
