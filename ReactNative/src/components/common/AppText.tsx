import { Text, TextProps } from 'react-native';

const AppText = ({ allowFontScaling = false, ...rest }: TextProps) => {
  return <Text allowFontScaling={allowFontScaling} {...rest} />;
};

export default AppText;
