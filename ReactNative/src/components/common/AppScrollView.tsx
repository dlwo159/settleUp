import { ScrollView, ScrollViewProps } from 'react-native';

const AppScrollView = ({
  showsVerticalScrollIndicator = false,
  showsHorizontalScrollIndicator = false,
  bounces = false,
  overScrollMode = 'never',
  ...rest
}: ScrollViewProps) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      bounces={bounces}
      overScrollMode={overScrollMode}
      {...rest}
    />
  );
};

export default AppScrollView;
