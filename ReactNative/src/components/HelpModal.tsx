import React, { useEffect, useState, useCallback, memo } from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';

import { AppText, AppTouchableOpacity } from '@/components';
import Color from '@/css/ColorStyle';

type Props = {
  isVisible: boolean;
  initialText: string;
  initialX: number;
  initialY: number;
  setting: any;
  fontStyles: any;
  onSubmit: () => void;
};

const HelpModal = memo(function HelpItem({
  isVisible,
  initialText,
  initialX,
  initialY,
  setting,
  fontStyles,
  onSubmit,
}: Props) {
  const [text, setText] = useState(initialText);
  const [p, setP] = useState({ x: initialX, y: initialY });

  useEffect(() => {
    if (!isVisible) return;
    setText(initialText);
    setP({ x: initialX, y: initialY });
  }, [isVisible, initialText, initialX, initialY]);

  const handleSubmit = useCallback(() => {
    onSubmit();
  }, [onSubmit]);

  if (!isVisible) return null;
  return (
    <AppTouchableOpacity
      style={[
        {
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 300,
          alignItems: 'center',
        },
      ]}
      onPress={handleSubmit}>
      <View
        style={{
          position: 'absolute',
          top: 90 * setting.scale,
          margin: 8 * setting.scale,
          paddingTop: 6 * setting.scale,
          paddingBottom: 6 * setting.scale,
          paddingLeft: 12 * setting.scale,
          paddingRight: 12 * setting.scale,
          borderRadius: 4 * setting.scale,
          backgroundColor: Color.main,
        }}>
        <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.white]}>{text}</AppText>
      </View>
      <View
        style={{
          position: 'absolute',
          top: p.y,
          left: p.x,
        }}>
        <LottieView
          style={{ width: 200 * setting.scale, height: 200 * setting.scale }}
          source={require('@json/click.json')}
          autoPlay
          loop
        />
      </View>
    </AppTouchableOpacity>
  );
});

export default HelpModal;
