import React from 'react';
import { createNavigationContainerRef, NavigationContainer, CommonActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { RootStackParamList, DrawerParamList } from './Types';

import { useSelector } from 'react-redux';
import type { RootState } from '@/app/Store';

import Loading from '@/screens/loading';
import Home from '@/screens/home';
import Schedule from '@/screens/schedule';
import Bill from '@/screens/bill';
import Customer from '@/screens/customer';
import Accept from '@/screens/accept';

import CustomerDrawer from '@/components/CustomerDrawer';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

export function resetToAuth() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Loading' }],
      }),
    );
  }
}

function HomeDrawer() {
  const setting = useSelector((state: RootState) => state.app.setting);

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        swipeEdgeWidth: 50,
        drawerPosition: 'right',
        drawerStyle: { width: 260 * setting.scale },
      }}
      drawerContent={props => <CustomerDrawer {...props} />}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Customer" component={Customer} />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Loading"
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}>
        <Stack.Screen name="Loading" component={Loading} />
        <Stack.Screen name="Main" component={HomeDrawer} />
        <Stack.Screen name="Schedule" component={Schedule} />
        <Stack.Screen name="Bill" component={Bill} />
        <Stack.Screen name="Accept" component={Accept} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
