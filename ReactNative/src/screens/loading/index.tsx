import { useEffect, useState, useRef } from 'react';
import { View, StatusBar, Animated, TextInput, Image, Linking, PermissionsAndroid, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/common/Api';
import DeviceInfo from 'react-native-device-info';

import {
  getMessaging,
  onMessage,
  setBackgroundMessageHandler,
  onNotificationOpenedApp,
  getInitialNotification,
  registerDeviceForRemoteMessages,
  getToken,
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
const messagingInstance = getMessaging();

import Toast from 'react-native-toast-message';

import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/app/Store';
import {
  appUpdate,
  setSetting,
  setCustomerDto,
  setCustomer,
  setCustomerSetting,
  selectedSchedule,
} from '@/app/StateSlice';

import { useNavigation, CommonActions, useRoute } from '@react-navigation/native';
import { navigationRef } from '@/navigation';

import GlobalStyles from '@/css/Style';
import FontStyles from '@/css/FontStyle';
import Styles from './Style';

import { AppText, AppTouchableOpacity, AppButton, AppModal, AppTextInput } from '@/components';
import { Res, CustomerPayload } from '@/@types/Types';

// const { DeviceModule } = NativeModules;
// const deviceEmitter = new NativeEventEmitter(DeviceModule);

let pushInit = false;
let pushData: any = null;

export default function LOADING() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const OS = useRef(Platform.OS === 'android' ? 'AOS' : 'IOS');

  const setting = useSelector((state: RootState) => state.app.setting);
  const globalStyles = GlobalStyles(setting);
  const fontStyles = FontStyles(setting);
  const styles = Styles(setting);

  // const [isFoldable, setIsFoldable] = useState<boolean | null>(null);
  const [isVisible, setVisible] = useState<boolean>(false);
  const [viewType, setViewType] = useState<string>('0');
  const [payerSendYn, setPayerSendYn] = useState<string>('N');
  const customerSetting = useSelector((state: RootState) => state.app.customerSetting);

  const scaleAnim = useRef(new Animated.Value(10)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  const loadData = useRef<boolean[]>([
    false, // 최소시간 1500ms
    false, // 로고 애니메이션
    false, // 로그인 체크
  ]);

  const modalTypeList = useRef<string[]>([]);
  const [modalType, setModalType] = useState<string>('');

  const name = useRef<string>('');
  const nameInputRef = useRef<TextInput>(null);
  const [nameInputFocus, setNameInputFocus] = useState<boolean>(false);

  const account = useRef<string>('');
  const accountInputRef = useRef<TextInput>(null);
  const [accountInputFocus, setAccountInputFocus] = useState<boolean>(false);

  async function requestAndroidNotificationPermission() {
    if (OS.current === 'IOS') return true;
    if (Number(Platform.Version) >= 33) {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  }

  useEffect(() => {
    if (!pushInit) {
      setupPushNotifications();
      pushInit = true;
    }
    dispatch(setSetting(setting));

    setTimeout(() => {
      loadData.current[0] = true;
      loadCheck();
    }, 1500);

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Animated.timing(rotateAnim, {
      //   toValue: 1,
      //   duration: 500,
      //   useNativeDriver: true,
      //   easing: Easing.out(Easing.quad),
      // }),
    ]).start(() => {
      loadData.current[1] = true;
      loadCheck();
    });

    (async () => {
      const version = await versionCheck();
      const permission = await requestAndroidNotificationPermission();

      let token = null;
      if (permission) {
        await registerDeviceForRemoteMessages(messagingInstance);
        token = await getToken(messagingInstance);
      } else {
        Toast.show({
          type: 'message',
          text1: '알림 권한을 거부하였습니다!',
          position: 'bottom',
          visibilityTime: 1500,
        });
      }

      if (parseInt(DeviceInfo.getBuildNumber()) + 2 < parseInt(version)) {
        Toast.show({
          type: 'message',
          text1: '업데이트를 위해 스토어로 이동합니다!',
          position: 'bottom',
          visibilityTime: 3000,
        });
        setTimeout(() => Linking.openURL('market://details?id=kr.co.fomun.settleup'), 1500);
      } else {
        if (parseInt(DeviceInfo.getBuildNumber()) < parseInt(version)) {
          dispatch(appUpdate());
        }

        login(token);
      }
    })();

    // DeviceModule.isFoldable()
    //   .then((result: boolean) => {
    //     // setIsFoldable(result);
    //     console.error('Foldable :', result);
    //   })
    //   .catch((error: any) => {
    //     console.error('Foldable detection error:', error);
    //   });

    // const sub = deviceEmitter.addListener('onFoldableStateChanged', event => {
    //   console.log('접힘 상태:', event.isFolded);
    //   console.log('접힘 상태:', event.isFolded ? '접힘' : '펼침');
    // });

    // DeviceModule.startFoldableListener();

    return () => {
      // DeviceModule.stopFoldableListener();
      // sub.remove();
    };
  }, []);

  const versionCheck = async () => {
    return await api.get('/api/code/version');
  };

  const login = async (pushToken: string | null) => {
    let loginToken = await AsyncStorage.getItem('loginToken');
    if (loginToken) {
    } else {
      loginToken =
        Date.now().toString() +
        Math.floor(Math.random() * 10000)
          .toString()
          .padStart(5, '0');
      AsyncStorage.setItem('loginToken', loginToken);
    }
    const body = {
      token: loginToken,
      model: DeviceInfo.getModel(),
      os: OS.current,
      systemVersion: OS.current === 'AOS' ? Platform.Version : DeviceInfo.getSystemVersion(),
      pushToken: pushToken,
    };
    api.post<Res<CustomerPayload>>('/api/auth/login', body).then(res => {
      if (res.status === 'SUCCESS') {
        if (res.data.customer.name === '') modalTypeList.current.push('customer');
        dispatch(setCustomerDto(res.data));
        loadData.current[2] = true;
        loadCheck();
      }
    });
  };

  const loadCheck = async () => {
    const complateLoad = loadData.current.every(value => value);
    if (complateLoad) {
      const first = await AsyncStorage.getItem('first');
      if (!first) {
        modalTypeList.current.push('payerSendYn');
        modalTypeList.current.push('renderType');
      }
      if (modalTypeList.current.length === 0) {
        pageMove();
      } else {
        setModalType(modalTypeList.current[0]);
        if (modalTypeList.current[0] === 'customer') setTimeout(() => nameInputRef.current?.focus(), 150);
        setVisible(true);
      }
    }
  };

  const saveInfo = () => {
    const tempName = name.current.trim();
    const tempAccount = account.current.trim();
    if (tempName === '') {
      nameInputRef.current?.focus();
      return;
    }
    api.put('/api/customers', { name: tempName, account: tempAccount === '' ? null : tempAccount }).then(res => {
      if (res.status === 'SUCCESS') {
        dispatch(setCustomer(res.data));
        modalCheck();
      }
    });
  };

  const saveFirst = () => {
    if (viewType === '0') {
      return;
    }

    setVisible(false);
    AsyncStorage.setItem('first', 'notFirst');
    api
      .put('/api/customers/settings', { ...customerSetting, viewType: viewType, payerSendYn: payerSendYn })
      .then(res => {
        if (res.status === 'SUCCESS') {
          dispatch(setCustomerSetting(res.data));
          modalCheck();
        }
      });
  };

  const modalCheck = () => {
    if (modalTypeList.current.length > 1) {
      modalTypeList.current.shift();
      setModalType(modalTypeList.current[0]);
    } else {
      pageMove();
    }
  };

  const pageMove = async () => {
    let routes = [{ name: 'Main' }];
    if (pushData !== null) {
      if (pushData?.type === 'PUSH01') {
        const res = await api.get('/api/schedules?scheduleId=' + pushData.scheduleId);
        dispatch(selectedSchedule(res.data));
      }
      routes.push({ name: 'Schedule' });
      routes.push({ name: 'Accept' });
    }
    pushData = null;
    navigation.dispatch(
      CommonActions.reset({
        index: routes.length - 1,
        routes: routes,
      }),
    );
  };

  const setupPushNotifications = () => {
    PushNotification.configure({
      onNotification: function (notification: any) {
        pushData = notification.data;
        if (navigationRef.current?.getCurrentRoute()?.name !== route.name) {
          pageMove();
        }
      },
    });

    onMessage(messagingInstance, async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      console.debug('포그라운드 메시지 수신', remoteMessage);
      PushNotification.localNotification({
        title: remoteMessage.notification?.title || '알림',
        message: remoteMessage.notification?.body || '새로운 메시지가 도착했습니다.',
        userInfo: remoteMessage.data,
      });
    });

    setBackgroundMessageHandler(messagingInstance, async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      console.debug('백그라운드 메시지 수신', remoteMessage);
    });

    onNotificationOpenedApp(messagingInstance, async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      console.debug('앱이 백그라운드에서 실행됨', remoteMessage);
      pushData = remoteMessage.data;
      if (navigationRef.current?.getCurrentRoute()?.name !== route.name) {
        pageMove();
      }
    });

    getInitialNotification(messagingInstance).then((remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
      if (remoteMessage) {
        console.debug('앱이 종료 상태에서 실행됨', remoteMessage);
        pushData = remoteMessage.data;
      }
    });
  };

  return (
    <View style={[globalStyles.wrap, styles.bg]}>
      <StatusBar barStyle="dark-content" />
      <View style={[globalStyles.flex1, globalStyles.justifyContentCenter, globalStyles.alignItemsCenter]}>
        <Animated.Image
          style={[styles.logo, { transform: [{ scale: scaleAnim }, { rotate: rotateInterpolate }] }]}
          source={require('@images/logo2.png')}
        />
      </View>
      <AppModal isVisible={isVisible}>
        <View style={globalStyles.modalView}>
          {modalType === 'customer' && (
            <>
              <View style={globalStyles.mb16}>
                <AppText
                  style={[fontStyles.medium, fontStyles.s16, fontStyles.black, globalStyles.ml2, globalStyles.mb2]}>
                  닉네임
                </AppText>
                <AppTextInput
                  ref={nameInputRef}
                  focus={nameInputFocus}
                  onFocus={() => setNameInputFocus(true)}
                  onBlur={() => setNameInputFocus(false)}
                  onChangeText={text => (name.current = text)}
                  placeholder="10자리 이내"
                  maxLength={10}
                />
              </View>
              <View style={globalStyles.mb16}>
                <AppText
                  style={[fontStyles.medium, fontStyles.s16, fontStyles.black, globalStyles.ml2, globalStyles.mb2]}>
                  계좌정보 <AppText style={[fontStyles.medium, fontStyles.s12, fontStyles.gray]}>(선택사항)</AppText>
                </AppText>
                <AppTextInput
                  ref={accountInputRef}
                  focus={accountInputFocus}
                  onFocus={() => setAccountInputFocus(true)}
                  onBlur={() => setAccountInputFocus(false)}
                  onChangeText={text => (account.current = text)}
                  placeholder="20자리 이내"
                  maxLength={20}
                />
                <AppText style={[fontStyles.regular, fontStyles.s10, fontStyles.black]}>
                  {'예시)카페로 주세요, 신한 000-000000-000 등'}
                </AppText>
              </View>
              <View style={globalStyles.mb16}>
                <AppText style={[fontStyles.regular, fontStyles.s12, fontStyles.darkGray]}>
                  (일정추가시 정산인원에 자동으로 추가됩니다)
                </AppText>
              </View>
              <View style={globalStyles.row}>
                <AppButton text="확인" onPress={saveInfo} />
              </View>
            </>
          )}
          {modalType === 'payerSendYn' && (
            <>
              <View style={globalStyles.mb16}>
                <AppText style={[fontStyles.bold, fontStyles.s14, fontStyles.black, fontStyles.center]}>
                  엔빵 방식
                </AppText>
              </View>
              <View>
                <AppTouchableOpacity onPress={() => setPayerSendYn('N')}>
                  <View style={globalStyles.row}>
                    <Image
                      style={[globalStyles.img20, globalStyles.mt2, globalStyles.mr4]}
                      source={payerSendYn === 'N' ? require('@images/radioOn.png') : require('@images/radioOff.png')}
                    />
                    <AppText style={[fontStyles.regular, fontStyles.s16, fontStyles.black]}>결제자 송금 제외</AppText>
                  </View>
                  <AppText style={[fontStyles.medium, fontStyles.s12, fontStyles.darkGray, globalStyles.ml24]}>
                    (2번 송금하는 사람 발생)
                  </AppText>
                </AppTouchableOpacity>
                <AppTouchableOpacity style={globalStyles.mt8} onPress={() => setPayerSendYn('Y')}>
                  <View style={globalStyles.row}>
                    <Image
                      style={[globalStyles.img20, globalStyles.mt2, globalStyles.mr4]}
                      source={payerSendYn === 'Y' ? require('@images/radioOn.png') : require('@images/radioOff.png')}
                    />
                    <AppText style={[fontStyles.regular, fontStyles.s16, fontStyles.black]}>
                      참여인원 1번씩 송금
                    </AppText>
                  </View>
                  <AppText style={[fontStyles.medium, fontStyles.s12, fontStyles.darkGray, globalStyles.ml24]}>
                    (결제자도 송금 발생)
                  </AppText>
                </AppTouchableOpacity>
              </View>
              <View style={[globalStyles.row, globalStyles.mt16]}>
                <AppButton text="확인" onPress={modalCheck} />
              </View>
            </>
          )}
          {modalType === 'renderType' && (
            <>
              <View style={globalStyles.mb16}>
                <AppText style={[fontStyles.bold, fontStyles.s14, fontStyles.black, fontStyles.center]}>
                  일정 표시 방법
                </AppText>
              </View>
              <View style={[globalStyles.width, globalStyles.row, globalStyles.justifyContentCenter]}>
                <AppTouchableOpacity
                  style={[styles.viewTypeBox1, viewType == '1' && styles.lightGray]}
                  onPress={() => setViewType('1')}>
                  <View>
                    <View style={[styles.viewTypeBox3, globalStyles.mb4]} />
                    <View style={[styles.viewTypeBox3, globalStyles.mb4]} />
                    <View style={[styles.viewTypeBox3, globalStyles.mb4]} />
                    <View style={[styles.viewTypeBox3]} />
                  </View>
                  <AppText
                    style={[globalStyles.mt4, fontStyles.medium, fontStyles.s14, fontStyles.black, fontStyles.center]}>
                    목록형
                  </AppText>
                </AppTouchableOpacity>
                <View style={globalStyles.emptyW8} />
                <AppTouchableOpacity
                  style={[styles.viewTypeBox1, globalStyles.alignItemsCenter, viewType == '2' && styles.lightGray]}
                  onPress={() => setViewType('2')}>
                  <View style={styles.viewTypeBox2}>
                    <View style={[styles.viewTypeBox4, globalStyles.mb4]} />
                    <View style={[styles.viewTypeBox4, globalStyles.mb4]} />
                    <View style={[styles.viewTypeBox4]} />
                    <View style={[styles.viewTypeBox4]} />
                  </View>
                  <AppText
                    style={[globalStyles.mt4, fontStyles.medium, fontStyles.s14, fontStyles.black, fontStyles.center]}>
                    격자형
                  </AppText>
                </AppTouchableOpacity>
              </View>
              <View style={[globalStyles.row, globalStyles.mt16]}>
                <AppButton text="확인" onPress={saveFirst} />
              </View>
            </>
          )}
        </View>
      </AppModal>
    </View>
  );
}
