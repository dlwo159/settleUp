import { StyleSheet } from 'react-native';
import { Setting } from '@/@types/Types';
import Color from '@/css/ColorStyle';

const Styles = (setting: Setting) =>
  StyleSheet.create({
    updateBox: {
      backgroundColor: Color.main,
      padding: 12 * setting.scale,
      marginLeft: 16 * setting.scale,
      marginRight: 16 * setting.scale,
      marginBottom: 8 * setting.scale,
      alignItems: 'center',
      borderRadius: 4 * setting.scale,
    },
    itemBoxView: {
      flex: 1,
      paddingLeft: 8 * setting.scale,
      paddingRight: 8 * setting.scale,
    },
    itemBox: {
      margin: 8 * setting.scale,
      overflow: 'hidden',
      flexDirection: 'row',
    },
    itemBox1: {
      width: setting.width - 32 * setting.scale,
      height: 80 * setting.scale,
      borderRadius: 6 * setting.scale,
    },
    itemBox2: {
      width: setting.widthHalf,
      height: setting.widthHalf,
      borderRadius: 20 * setting.scale,
    },
    itemBox3: {
      width: setting.width / 3 - 21.5 * setting.scale,
      height: setting.width / 3 - 21.5 * setting.scale,
      borderRadius: 20 * setting.scale,
    },
    infoBox: {
      flex: 1,
      paddingTop: 8 * setting.scale,
      paddingBottom: 8 * setting.scale,
      paddingLeft: 12 * setting.scale,
      paddingRight: 12 * setting.scale,
    },
    colorBox: {
      width: 32 * setting.scale,
      height: '100%',
    },
    imgBox: {
      position: 'absolute',
      right: 8 * setting.scale,
      bottom: 12 * setting.scale,
    },
  });

export default Styles;
