import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

const AppTouchableOpacity = ({ activeOpacity = 1, ...rest }: TouchableOpacityProps) => {
  return <TouchableOpacity activeOpacity={activeOpacity} {...rest} />;
};

export default AppTouchableOpacity;
