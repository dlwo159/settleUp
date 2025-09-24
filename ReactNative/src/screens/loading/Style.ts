import { StyleSheet } from 'react-native';
import Color from '@/css/ColorStyle';
import { Setting } from '@/@types/Types';

const Styles = (setting: Setting) =>
  StyleSheet.create({
    bg: {
      backgroundColor: Color.background,
    },
    viewTypeBox1: {
      flex: 1,
      borderStyle: 'solid',
      borderWidth: 1 * setting.scale,
      borderRadius: 4 * setting.scale,
      borderColor: Color.gray,
      paddingTop: 8 * setting.scale,
      paddingBottom: 8 * setting.scale,
      paddingRight: 24 * setting.scale,
      paddingLeft: 24 * setting.scale,
    },
    viewTypeBox2: {
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 52 * setting.scale,
    },
    viewTypeBox3: {
      height: 10 * setting.scale,
      borderRadius: 4 * setting.scale,
      backgroundColor: Color.main,
    },
    viewTypeBox4: {
      width: 24 * setting.scale,
      height: 24 * setting.scale,
      borderRadius: 4 * setting.scale,
      backgroundColor: Color.main,
    },
    lightGray: {
      backgroundColor: Color.lightGray,
    },
    logo: {
      width: 220 * setting.scale,
      height: 220 * setting.scale,
      resizeMode: 'stretch',
    },
  });

export default Styles;
