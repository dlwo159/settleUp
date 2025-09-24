import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import LottieView from 'lottie-react-native';

import { useSelector } from 'react-redux';
import type { RootState } from '@/app/Store';

import GlobalStyles from '@/css/Style';
import FontStyles from '@/css/FontStyle';

import { Setting } from '@/@types/Types';
import { AppText, AppTouchableOpacity } from '@/components';

interface HelpItem {
  t: string;
  tt: 'top' | 'bottom' | 'right' | 'left';
  p: { x: number; y: number };
  fn: () => void;
  close?: boolean;
}

export function useHelpsInternal() {
  const setting = useSelector((state: RootState) => state.app.setting);
  const globalStyles = GlobalStyles(setting);
  const fontStyles = FontStyles(setting);
  const styles = Styles(setting);

  const [isVisible, setVisible] = useState(false);
  const info = useRef<HelpItem[]>([{ t: '', tt: 'top', p: { x: 0, y: 0 }, fn: () => {}, close: false }]);
  const [step, setStep] = useState(0);

  const openHelpsModal = (item: HelpItem[]) => {
    info.current = item.concat({
      t: '\n\n이제 서비스를 이용해 보세요!',
      tt: 'top',
      p: { x: setting.widthHalf - 70 * setting.scale, y: setting.heightHalf - 40 * setting.scale },
      fn: () => setVisible(false),
      close: true,
    });
    setStep(0);
    setVisible(true);
  };

  const next = () => {
    info.current[step].fn();
    setStep(step + 1);
  };

  const renderHelpsModal = () => {
    if (!isVisible) return null;

    return (
      <AppTouchableOpacity
        style={styles.content}
        onPress={() => {
          if (info.current[step].close) setVisible(false);
        }}>
        <View style={[styles.box, { top: info.current[step].p.y, left: info.current[step].p.x }]}>
          <AppText
            style={[
              styles.text,
              info.current[step].tt === 'top' && styles.textTop,
              info.current[step].tt === 'bottom' && styles.textBottom,
              info.current[step].tt === 'right' && styles.textRight,
              info.current[step].tt === 'left' && styles.textLeft,
              fontStyles.medium,
              fontStyles.s16,
              fontStyles.black,
            ]}>
            {info.current[step].t}
          </AppText>
          <LottieView style={[styles.lottie]} source={require('@json/click.json')} autoPlay loop />
          <AppTouchableOpacity style={[styles.step]} onPress={next} />
        </View>
      </AppTouchableOpacity>
    );
  };

  return {
    openHelpsModal,
    renderHelpsModal,
  };
}

export type UseHelpsHook = ReturnType<typeof useHelpsInternal>;

const Styles = (setting: Setting) =>
  StyleSheet.create({
    content: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 99999,
    },
    box: {
      position: 'absolute',
      width: 200 * setting.scale,
      height: 200 * setting.scale,
    },
    lottie: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    text: {
      position: 'absolute',
      right: 0,
      left: 0,
      textAlign: 'center',
    },
    textTop: {
      top: 0,
    },
    textBottom: {
      bottom: -10 * setting.scale,
    },
    textRight: {
      top: 70 * setting.scale,
      left: 145 * setting.scale,
      width: 200 * setting.scale,
      textAlign: 'left',
    },
    textLeft: {
      top: 70 * setting.scale,
      left: -140 * setting.scale,
      width: 200 * setting.scale,
      textAlign: 'right',
    },
    step: {
      position: 'absolute',
      top: 60 * setting.scale,
      left: 60 * setting.scale,
      width: 80 * setting.scale,
      height: 80 * setting.scale,
    },
  });
