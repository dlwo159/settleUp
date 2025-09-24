import { useRef, useEffect, useState } from 'react';
import { View, Keyboard, Animated, TouchableOpacity } from 'react-native';

interface Props {
  isVisible?: boolean;
  propagateSwipe?: boolean;
  avoidKeyboard?: boolean;
  children?: React.ReactNode;
  onShow?: () => void;
}

const AppModal = ({ isVisible = false, children, onShow }: Props) => {
  const [mounted, setMounted] = useState(isVisible);
  const contentOpacity = useRef(new Animated.Value(0)).current;

  const onShowRef = useRef(onShow);
  useEffect(() => {
    onShowRef.current = onShow;
  }, [onShow]);

  useEffect(() => {
    // 애니 중복 방지
    contentOpacity.stopAnimation();

    if (isVisible) {
      if (!mounted) setMounted(true);
      setMounted(true);
      contentOpacity.setValue(0);
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) onShowRef.current?.();
      });
    } else if (mounted) {
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [isVisible]);

  if (!mounted) return null;

  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
      }}
      activeOpacity={1}
      onPress={Keyboard.dismiss}>
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          opacity: contentOpacity,
        }}
      />
      <Animated.View style={[{ opacity: contentOpacity }]}>{children && <View>{children}</View>}</Animated.View>
    </TouchableOpacity>
  );
};

export default AppModal;
