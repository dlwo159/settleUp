import { AppText, AppTouchableOpacity } from '@/components';

import { useSelector } from 'react-redux';
import type { RootState } from '@/app/Store';

import FontStyles from '@/css/FontStyle';
import Color from '@/css/ColorStyle';

interface AppButtonProps {
  onPress?: (props: any) => void;
  text?: string;
  cancle?: boolean;
  style?: any;
}

const AppButton = ({ onPress, text, cancle = false, style }: AppButtonProps) => {
  const setting = useSelector((state: RootState) => state.app.setting);
  const fontStyles = FontStyles(setting);

  return (
    <AppTouchableOpacity
      onPress={onPress}
      style={[
        {
          flex: 1,
          height: 48 * setting.scale,
          maxHeight: 48 * setting.scale,
          borderRadius: 4 * setting.scale,
          alignItems: 'center',
          justifyContent: 'center',
        },
        !cancle
          ? {
              backgroundColor: Color.main,
            }
          : {
              backgroundColor: Color.gray,
            },
        style,
      ]}>
      <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.white]}>{text ? text : '확인'}</AppText>
    </AppTouchableOpacity>
  );
};

export default AppButton;
