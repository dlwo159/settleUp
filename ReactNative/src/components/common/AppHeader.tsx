import { ViewProps, ImageSourcePropType, StyleSheet, View, Image } from 'react-native';
import { ReactNode } from 'react';

import { useSelector } from 'react-redux';
import type { RootState } from '@/app/Store';

import { Setting } from '@/@types/Types';
import { AppText, AppTouchableOpacity } from '@/components';

import GlobalStyles from '@/css/Style';
import FontStyles from '@/css/FontStyle';

interface Props extends ViewProps {
  title?: string;
  rightPress?: () => void;
  rightImg?: ImageSourcePropType;
  rightView?: ReactNode;
  leftPress?: () => void;
  leftImg?: ImageSourcePropType;
  leftView?: ReactNode;
}

const AppHeader = ({ title = '', rightPress, rightImg, rightView, leftPress, leftImg, leftView }: Props) => {
  const setting = useSelector((state: RootState) => state.app.setting);
  const globalStyles = GlobalStyles(setting);
  const fontStyles = FontStyles(setting);
  const styles = Styles(setting);

  return (
    <View style={[styles.title, globalStyles.row, globalStyles.alignItemsCenter]}>
      <AppTouchableOpacity style={styles.sideBox} onPress={rightPress}>
        {rightPress && rightImg && <Image style={[globalStyles.img32, styles.sideImg]} source={rightImg} />}
        {rightPress && rightView && <View style={styles.viewBox}>{rightView}</View>}
      </AppTouchableOpacity>
      <View style={[globalStyles.flex1, globalStyles.alignItemsCenter]}>
        {title ? (
          <AppText style={[fontStyles.bold, fontStyles.s18, fontStyles.center]}>{title}</AppText>
        ) : (
          <Image style={styles.logo} source={require('@images/logo1.png')} />
        )}
      </View>
      <AppTouchableOpacity style={styles.sideBox} onPress={leftPress}>
        {leftPress && leftImg && <Image style={[globalStyles.img32, styles.sideImg]} source={leftImg} />}
        {rightPress && leftView && <View style={styles.viewBox}>{leftView}</View>}
      </AppTouchableOpacity>
    </View>
  );
};

const Styles = (setting: Setting) =>
  StyleSheet.create({
    title: {
      height: 48 * setting.scale,
      paddingTop: 6 * setting.scale,
      paddingBottom: 6 * setting.scale,
    },
    sideBox: {
      width: 64 * setting.scale,
      height: 48 * setting.scale,
    },
    sideImg: {
      marginTop: 8 * setting.scale,
      marginLeft: 16 * setting.scale,
    },
    viewBox: {
      width: 32 * setting.scale,
      height: 32 * setting.scale,
      marginTop: 8 * setting.scale,
      marginLeft: 16 * setting.scale,
    },
    logo: {
      width: 125 * setting.scale,
      height: 37 * setting.scale,
      resizeMode: 'stretch',
    },
  });

export default AppHeader;
