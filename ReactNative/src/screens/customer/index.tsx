import { useState, useRef } from 'react';
import { StatusBar, View, TextInput } from 'react-native';
import Toast from 'react-native-toast-message';

import { useNavigation, CompositeScreenProps } from '@react-navigation/native';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, DrawerParamList } from '@/navigation/Types';
export type Props = CompositeScreenProps<
  DrawerScreenProps<DrawerParamList, 'Customer'>,
  NativeStackScreenProps<RootStackParamList, 'Main'>
>;
export type Navigation = Props['navigation'];

import { AppText, AppTextInput, AppHeader, AppButton } from '@/components';

import { api } from '@/common/Api';

import { useSelector, useDispatch } from 'react-redux';
import { setCustomer } from '@/app/StateSlice';
import type { RootState } from '@/app/Store';

import GlobalStyles from '@/css/Style';
import FontStyles from '@/css/FontStyle';

export default function CUSTOMER({ route }: Props) {
  const navigation = useNavigation<Navigation>();
  const dispatch = useDispatch();

  const setting = useSelector((state: RootState) => state.app.setting);
  const globalStyles = GlobalStyles(setting);
  const fontStyles = FontStyles(setting);

  const customer = useSelector((state: RootState) => state.app.customer);

  const [name, setName] = useState<string>(customer.name);
  const nameInputRef = useRef<TextInput>(null);
  const [nameInputFocus, setNameInputFocus] = useState<boolean>(false);

  const [account, setAccount] = useState<string>(customer.account);
  const accountInputRef = useRef<TextInput>(null);
  const [accountInputFocus, setAccountInputFocus] = useState<boolean>(false);

  const loading = useRef<boolean>(false);

  const saveInfo = () => {
    if (loading.current) return;

    loading.current = true;
    const tempName = name.trim();
    const tempAccount = account.trim();
    if (tempName === '') {
      nameInputRef.current?.focus();
      return;
    }
    api.put('/api/customers', { name: tempName, account: tempAccount === '' ? null : tempAccount }).then(res => {
      if (res.status === 'SUCCESS') {
        dispatch(setCustomer(res.data));
        Toast.show({
          type: 'message',
          text1: '정보를 수정했어요!',
          position: 'bottom',
          visibilityTime: 1500,
        });
        loading.current = false;
      }
    });
  };

  return (
    <View style={globalStyles.wrap}>
      <StatusBar barStyle="dark-content" />
      <AppHeader rightImg={require('@images/back.png')} rightPress={() => navigation.goBack()} />
      <View style={[globalStyles.pl16, globalStyles.pr16, globalStyles.flex1]}>
        <View style={globalStyles.mt8}>
          <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.black, globalStyles.ml2, globalStyles.mb2]}>
            닉네임
          </AppText>
          <AppTextInput
            ref={nameInputRef}
            focus={nameInputFocus}
            value={name}
            onFocus={() => setNameInputFocus(true)}
            onBlur={() => setNameInputFocus(false)}
            onChangeText={text => setName(text)}
            placeholder="10자리 이내"
            maxLength={10}
          />
        </View>
        <View style={globalStyles.mt8}>
          <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.black, globalStyles.ml2, globalStyles.mb2]}>
            계좌정보 <AppText style={[fontStyles.medium, fontStyles.s12, fontStyles.gray]}>(선택사항)</AppText>
          </AppText>
          <AppTextInput
            ref={accountInputRef}
            focus={accountInputFocus}
            value={account}
            onFocus={() => setAccountInputFocus(true)}
            onBlur={() => setAccountInputFocus(false)}
            onChangeText={text => setAccount(text)}
            placeholder="20자리 이내"
            maxLength={20}
          />
          <AppText style={[fontStyles.regular, fontStyles.s12, fontStyles.darkGray]}>
            {'예시)카페로 주세요, 신한 000-000000-000 등'}
          </AppText>
        </View>
        <View style={globalStyles.flex1} />
        <View style={[globalStyles.row, globalStyles.mt16, globalStyles.mb16]}>
          <AppButton text="수정" onPress={saveInfo} />
        </View>
      </View>
    </View>
  );
}
