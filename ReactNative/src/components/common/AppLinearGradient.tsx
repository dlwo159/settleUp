import { Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { useSelector } from 'react-redux';
import type { RootState } from '@/app/Store';

interface Props {
  style?: any;
  animation?: boolean;
  animationStyle?: any;
}
const colors = ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.05)', 'rgba(0, 0, 0, 0.1)'];
const locations = [0, 0.7, 1];

const AppLinearGradient = ({ style, animation = false, animationStyle }: Props) => {
  const setting = useSelector((state: RootState) => state.app.setting);

  const gradientStyle = {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 40 * setting.scale,
  };

  const combinedStyle = [gradientStyle, style];

  if (animation) {
    return (
      <Animated.View pointerEvents="none" style={[gradientStyle, animationStyle]}>
        <LinearGradient pointerEvents="none" colors={colors} locations={locations} style={combinedStyle} />
      </Animated.View>
    );
  }

  return <LinearGradient colors={colors} locations={locations} style={combinedStyle} />;
};

export default AppLinearGradient;
