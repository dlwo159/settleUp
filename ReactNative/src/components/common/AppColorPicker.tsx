import ColorPicker from 'react-native-wheel-color-picker';

interface AppColorWheelProps {
  onPress?: (color: string) => void;
  initialColor?: string;
}

const AppColorWheel = ({ onPress, initialColor }: AppColorWheelProps) => {
  return (
    <ColorPicker
      style={{ width: '100%', height: '100%' }}
      color={initialColor || '#FFFFFF'}
      onColorChangeComplete={onPress}
      thumbSize={20}
      swatches={false}
      useNativeDriver={false}
      useNativeLayout={false}
    />
  );
};

export default AppColorWheel;
