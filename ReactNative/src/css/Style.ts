import { StyleSheet } from 'react-native';
import Color from './ColorStyle';

const Styles = (setting: any) =>
  StyleSheet.create({
    wrap: {
      backgroundColor: Color.background,
      flex: 1,
      paddingTop: setting.top,
      paddingBottom: setting.bottom,
    },

    row: {
      display: 'flex',
      flexDirection: 'row',
    },
    alignItemsCenter: {
      alignItems: 'center',
    },
    justifyContentCenter: {
      justifyContent: 'center',
    },
    justifyContentEnd: {
      justifyContent: 'flex-end',
    },

    flex1: {
      flex: 1,
    },

    width: {
      width: '100%',
    },

    emptyW8: {
      width: 8 * setting.scale,
    },
    emptyW16: {
      width: 16 * setting.scale,
    },

    mt0: {
      marginTop: 0 * setting.scale,
    },
    mt2: {
      marginTop: 2 * setting.scale,
    },
    mt4: {
      marginTop: 4 * setting.scale,
    },
    mt6: {
      marginTop: 6 * setting.scale,
    },
    mt8: {
      marginTop: 8 * setting.scale,
    },
    mt12: {
      marginTop: 12 * setting.scale,
    },
    mt16: {
      marginTop: 16 * setting.scale,
    },
    mt20: {
      marginTop: 20 * setting.scale,
    },
    mt24: {
      marginTop: 24 * setting.scale,
    },

    mb0: {
      marginBottom: 0 * setting.scale,
    },
    mb2: {
      marginBottom: 2 * setting.scale,
    },
    mb4: {
      marginBottom: 4 * setting.scale,
    },
    mb8: {
      marginBottom: 8 * setting.scale,
    },
    mb12: {
      marginBottom: 12 * setting.scale,
    },
    mb16: {
      marginBottom: 16 * setting.scale,
    },
    mb20: {
      marginBottom: 20 * setting.scale,
    },
    mb24: {
      marginBottom: 24 * setting.scale,
    },

    mr0: {
      marginRight: 0 * setting.scale,
    },
    mr2: {
      marginRight: 2 * setting.scale,
    },
    mr4: {
      marginRight: 4 * setting.scale,
    },
    mr8: {
      marginRight: 8 * setting.scale,
    },
    mr12: {
      marginRight: 12 * setting.scale,
    },
    mr16: {
      marginRight: 16 * setting.scale,
    },
    mr20: {
      marginRight: 20 * setting.scale,
    },
    mr24: {
      marginRight: 24 * setting.scale,
    },

    ml0: {
      marginLeft: 0 * setting.scale,
    },
    ml2: {
      marginLeft: 2 * setting.scale,
    },
    ml4: {
      marginLeft: 4 * setting.scale,
    },
    ml8: {
      marginLeft: 8 * setting.scale,
    },
    ml12: {
      marginLeft: 12 * setting.scale,
    },
    ml16: {
      marginLeft: 16 * setting.scale,
    },
    ml20: {
      marginLeft: 20 * setting.scale,
    },
    ml24: {
      marginLeft: 24 * setting.scale,
    },

    pt0: {
      paddingTop: 0 * setting.scale,
    },
    pt2: {
      paddingTop: 2 * setting.scale,
    },
    pt4: {
      paddingTop: 4 * setting.scale,
    },
    pt6: {
      paddingTop: 6 * setting.scale,
    },
    pt8: {
      paddingTop: 8 * setting.scale,
    },
    pt12: {
      paddingTop: 12 * setting.scale,
    },
    pt16: {
      paddingTop: 16 * setting.scale,
    },
    pt20: {
      paddingTop: 20 * setting.scale,
    },
    pt24: {
      paddingTop: 24 * setting.scale,
    },

    pb0: {
      paddingBottom: 0 * setting.scale,
    },
    pb2: {
      paddingBottom: 2 * setting.scale,
    },
    pb4: {
      paddingBottom: 4 * setting.scale,
    },
    pb6: {
      paddingBottom: 6 * setting.scale,
    },
    pb8: {
      paddingBottom: 8 * setting.scale,
    },
    pb12: {
      paddingBottom: 12 * setting.scale,
    },
    pb16: {
      paddingBottom: 16 * setting.scale,
    },
    pb20: {
      paddingBottom: 20 * setting.scale,
    },
    pb24: {
      paddingBottom: 24 * setting.scale,
    },

    pr0: {
      paddingRight: 0 * setting.scale,
    },
    pr2: {
      paddingRight: 2 * setting.scale,
    },
    pr4: {
      paddingRight: 4 * setting.scale,
    },
    pr6: {
      paddingRight: 6 * setting.scale,
    },
    pr8: {
      paddingRight: 8 * setting.scale,
    },
    pr12: {
      paddingRight: 12 * setting.scale,
    },
    pr16: {
      paddingRight: 16 * setting.scale,
    },
    pr20: {
      paddingRight: 20 * setting.scale,
    },
    pr24: {
      paddingRight: 24 * setting.scale,
    },

    pl0: {
      paddingLeft: 0 * setting.scale,
    },
    pl2: {
      paddingLeft: 2 * setting.scale,
    },
    pl4: {
      paddingLeft: 4 * setting.scale,
    },
    pl6: {
      paddingLeft: 6 * setting.scale,
    },
    pl8: {
      paddingLeft: 8 * setting.scale,
    },
    pl12: {
      paddingLeft: 12 * setting.scale,
    },
    pl16: {
      paddingLeft: 16 * setting.scale,
    },
    pl20: {
      paddingLeft: 20 * setting.scale,
    },
    pl24: {
      paddingLeft: 24 * setting.scale,
    },

    p0: {
      paddingLeft: 0,
      paddingRight: 0,
    },

    shadow: {
      // iOS
      shadowColor: '#333333',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,

      // Android
      elevation: 4,
    },

    borderRadius: {
      borderRadius: 6 * setting.scale,
    },

    img16: {
      width: 16 * setting.scale,
      height: 16 * setting.scale,
      resizeMode: 'stretch',
    },
    img20: {
      width: 20 * setting.scale,
      height: 20 * setting.scale,
      resizeMode: 'stretch',
    },
    img24: {
      width: 24 * setting.scale,
      height: 24 * setting.scale,
      resizeMode: 'stretch',
    },
    img32: {
      width: 32 * setting.scale,
      height: 32 * setting.scale,
      resizeMode: 'stretch',
    },
    img36: {
      width: 36 * setting.scale,
      height: 36 * setting.scale,
      resizeMode: 'stretch',
    },
    img40: {
      width: 40 * setting.scale,
      height: 40 * setting.scale,
      resizeMode: 'stretch',
    },
    img48: {
      width: 48 * setting.scale,
      height: 48 * setting.scale,
      resizeMode: 'stretch',
    },

    modalView: {
      width: 300 * setting.scale,
      padding: 16 * setting.scale,
      backgroundColor: Color.background,
      borderRadius: 4 * setting.scale,
    },
    fab: {
      backgroundColor: Color.main,
      width: 46 * setting.scale,
      height: 46 * setting.scale,
      borderRadius: 50 * setting.scale,
      position: 'absolute',
      bottom: 16 * setting.scale + setting.bottom,
      justifyContent: 'center',
      alignItems: 'center',
    },
    fab_r: {
      right: 16 * setting.scale,
    },
    fab_l: {
      left: 16 * setting.scale,
    },
  });

export default Styles;
