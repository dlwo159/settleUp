import { FlatList, FlatListProps } from 'react-native';

function AppFlatList<T>(props: FlatListProps<T>) {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      bounces={false}
      overScrollMode="never"
      {...props}
    />
  );
}

export default AppFlatList;
