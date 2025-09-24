import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View, StyleSheet, Animated, Easing, ViewStyle, AccessibilityRole } from 'react-native';

import { useSelector } from 'react-redux';
import type { RootState } from '@/app/Store';
import Color from '@/css/ColorStyle';

export type ToggleSize = {
  w: number;
  h: number;
  p: number;
  thumb: number;
};

export type ToggleProps = {
  value?: boolean; // 제어 모드
  defaultValue?: boolean; // 비제어 모드 초기값
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  loading?: boolean; // 로딩 시 터치 막힘 + 핸들에 약간의 투명도
  size?: ToggleSize;
  style?: ViewStyle;
  /** 트랙 색상 */
  trackOnColor?: string;
  trackOffColor?: string;
  /** 핸들 색상 */
  thumbColor?: string;
  /** 눌렀을 때 진동 줄지 여부 */
  haptics?: boolean;
  /** 접근성 라벨 */
  accessibilityLabel?: string;
};

export const Toggle = forwardRef<View, ToggleProps>((props, ref) => {
  const setting = useSelector((state: RootState) => state.app.setting);
  const {
    value,
    defaultValue = false,
    onChange,
    disabled = false,
    loading = false,
    size = {
      w: 46 * setting.scale,
      h: 26 * setting.scale,
      p: 3 * setting.scale,
      thumb: 22 * setting.scale,
    },
    style,
    trackOnColor = Color.yellow,
    trackOffColor = Color.lightGray,
    thumbColor = Color.main,
    haptics = false,
    accessibilityLabel = 'toggle',
  } = props;

  const isControlled = typeof value === 'boolean';
  const [internal, setInternal] = useState<boolean>(defaultValue);
  const checked = isControlled ? (value as boolean) : internal;

  useEffect(() => {
    if (isControlled) return;
    setInternal(defaultValue);
  }, [defaultValue, isControlled]);

  const anim = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: checked ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [checked, anim]);

  const dim = size;
  const trackRadius = dim.h / 2;
  const thumbTranslateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, dim.w - dim.thumb - dim.p * 2],
  });

  const trackBg = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [trackOffColor, trackOnColor],
  });

  const pressableDisabled = disabled || loading;

  const handleToggle = useCallback(async () => {
    if (pressableDisabled) return;

    // optional haptics
    if (haptics) {
      try {
        const { default: RNHB } = await import('react-native-haptic-feedback');
        RNHB.trigger('impactLight', { enableVibrateFallback: true });
      } catch {
        // haptics lib 미설치 시 무시
      }
    }

    const next = !checked;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }, [pressableDisabled, haptics, checked, isControlled, onChange]);

  const role: AccessibilityRole = 'switch';
  const accessibilityState = useMemo(
    () => ({ checked, disabled: pressableDisabled, busy: loading }),
    [checked, pressableDisabled, loading],
  );

  return (
    <Pressable
      ref={ref as any}
      onPress={handleToggle}
      disabled={pressableDisabled}
      accessibilityRole={role}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
      style={[
        {
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      hitSlop={8}>
      <Animated.View
        style={[
          styles.track,
          {
            width: dim.w,
            height: dim.h,
            borderRadius: trackRadius,
            padding: dim.p,
            backgroundColor: trackBg as any,
          },
        ]}>
        <Animated.View
          style={[
            styles.thumb,
            {
              width: dim.thumb,
              height: dim.thumb,
              borderRadius: dim.thumb / 2,
              transform: [{ translateX: thumbTranslateX }],
              backgroundColor: thumbColor,
              opacity: loading ? 0.7 : 1,
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
});

Toggle.displayName = 'Toggle';

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
  },
  thumb: {
    elevation: 1,
    shadowColor: Color.black,
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
});

export default Toggle;
