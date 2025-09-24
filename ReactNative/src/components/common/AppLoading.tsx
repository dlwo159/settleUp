import { View } from 'react-native';
import LottieView from 'lottie-react-native';

type AppLoadingProps = {
  visible?: boolean;
  scale?: number;
  children?: React.ReactNode;
};

const AppLoaing = ({ visible = false, scale = 1, children }: AppLoadingProps) => {
  if (!visible) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999999,
        backgroundColor: 'rgb(0, 0, 0, 0)',
        pointerEvents: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <LottieView
        style={{ width: 120 * scale, height: 120 * scale }}
        source={require('@json/loading.json')}
        autoPlay
        loop
      />
      {children}
    </View>
  );
};

export default AppLoaing;
