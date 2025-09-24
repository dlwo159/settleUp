import type { NavigatorScreenParams } from '@react-navigation/native';

export type DrawerParamList = {
  Home: undefined;
  Customer: undefined;
};

export type RootStackParamList = {
  Loading: undefined;
  Main: NavigatorScreenParams<DrawerParamList>;
  Schedule: undefined;
  Bill: undefined;
  Accept: undefined;
};
