import { useCallback } from 'react';
import { View, Image, Linking } from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/app/Store';
import {
  setSettingViewType,
  setSettingHelpYn,
  setSettingDecimalPoint,
  setSettingCutting,
  setSettingCuttingYn,
  setSettingPayerSendYn,
} from '@/app/StateSlice';

import { DrawerContentComponentProps } from '@react-navigation/drawer';

import { AppText, AppToggle, AppTouchableOpacity, AppScrollView } from '@/components';

import { api } from '@/common/Api';

import GlobalStyles from '@/css/Style';
import FontStyles from '@/css/FontStyle';
import Color from '@/css/ColorStyle';

export default function CustomerDrawer({ navigation }: DrawerContentComponentProps) {
  const dispatch = useDispatch();
  const customerSetting = useSelector((state: RootState) => state.app.customerSetting);

  const setting = useSelector((state: RootState) => state.app.setting);
  const globalStyles = GlobalStyles(setting);
  const fontStyles = FontStyles(setting);

  const setHelpYn = useCallback(
    (value: boolean) => {
      const temp = {
        ...customerSetting,
        helpYn: value ? 'Y' : 'N',
      };
      dispatch(setSettingHelpYn(temp.helpYn));
      api.put('/api/customers/settings', temp);
    },
    [dispatch, customerSetting],
  );

  const setViewType = useCallback(
    (value: string) => {
      const temp = {
        ...customerSetting,
        viewType: value,
      };
      dispatch(setSettingViewType(temp.viewType));
      api.put('/api/customers/settings', temp);
    },
    [dispatch, customerSetting],
  );

  const setDecimalPoint = useCallback(
    (value: string) => {
      const temp = {
        ...customerSetting,
        decimalPoint: value,
      };
      dispatch(setSettingDecimalPoint(temp.decimalPoint));
      api.put('/api/customers/settings', temp);
    },
    [dispatch, customerSetting],
  );

  const setCutting = useCallback(
    (value: number) => {
      const temp = {
        ...customerSetting,
        cutting: value,
      };
      dispatch(setSettingCutting(temp.cutting));
      api.put('/api/customers/settings', temp);
    },
    [dispatch, customerSetting],
  );

  const setCuttingYn = useCallback(
    (value: boolean) => {
      const temp = {
        ...customerSetting,
        cuttingYn: value ? 'Y' : 'N',
      };
      dispatch(setSettingCuttingYn(temp.cuttingYn));
      api.put('/api/customers/settings', temp);
    },
    [dispatch, customerSetting],
  );

  const setPayerSendYn = useCallback(
    (value: string) => {
      const temp = {
        ...customerSetting,
        payerSendYn: value,
      };
      dispatch(setSettingPayerSendYn(temp.payerSendYn));
      api.put('/api/customers/settings', temp);
    },
    [dispatch, customerSetting],
  );

  const openEmail = () => {
    const email = 'settleup.service@gmail.com';
    const subject = '[칼 같이 정산] 문의';
    const body = '사용성 개선, 오류 등 문의해주세요\n(요류일 경우 오류코드를 같이 주시면 감사합니다)';

    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url).catch(err => console.error('메일 열기 실패:', err));
  };

  return (
    <View
      style={[
        globalStyles.wrap,
        globalStyles.pl16,
        globalStyles.pr16,
        { borderTopLeftRadius: 20 * setting.scale, borderBottomLeftRadius: 20 * setting.scale },
      ]}>
      <View style={[globalStyles.alignItemsCenter, globalStyles.mt16, globalStyles.mb16]}>
        <Image
          style={{ width: 152 * setting.scale, height: 45 * setting.scale, resizeMode: 'stretch' }}
          source={require('@images/logo1.png')}
        />
      </View>
      <AppScrollView>
        <AppTouchableOpacity
          style={[globalStyles.row, globalStyles.mt16, globalStyles.mb8]}
          onPress={() => navigation.navigate('Customer')}>
          <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.black, globalStyles.flex1]}>
            마이페이지
          </AppText>
          <Image
            style={[globalStyles.img20, globalStyles.mt2, globalStyles.mr4]}
            source={require('@images/next_black.png')}
          />
        </AppTouchableOpacity>
        <View style={[globalStyles.mt8, globalStyles.mb8]}>
          <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.black]}>소수점 처리</AppText>
          <View style={globalStyles.row}>
            <AppTouchableOpacity
              style={[globalStyles.row, globalStyles.pt4, globalStyles.pb4, { width: '33%' }]}
              onPress={() => setDecimalPoint('1')}>
              <Image
                style={[globalStyles.img20, globalStyles.mt2, globalStyles.mr4]}
                source={
                  customerSetting.decimalPoint === '1'
                    ? require('@images/radioOn.png')
                    : require('@images/radioOff.png')
                }
              />
              <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.black]}>올림</AppText>
            </AppTouchableOpacity>
            <AppTouchableOpacity
              style={[globalStyles.row, globalStyles.pt4, globalStyles.pb4, { width: '33%' }]}
              onPress={() => setDecimalPoint('2')}>
              <Image
                style={[globalStyles.img20, globalStyles.mt2, globalStyles.mr4]}
                source={
                  customerSetting.decimalPoint === '2'
                    ? require('@images/radioOn.png')
                    : require('@images/radioOff.png')
                }
              />
              <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.black]}>반올림</AppText>
            </AppTouchableOpacity>
            <AppTouchableOpacity
              style={[globalStyles.row, globalStyles.pt4, globalStyles.pb4, { width: '33%' }]}
              onPress={() => setDecimalPoint('3')}>
              <Image
                style={[globalStyles.img20, globalStyles.mt2, globalStyles.mr4]}
                source={
                  customerSetting.decimalPoint === '3'
                    ? require('@images/radioOn.png')
                    : require('@images/radioOff.png')
                }
              />
              <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.black]}>버림</AppText>
            </AppTouchableOpacity>
          </View>
        </View>
        <View style={[globalStyles.mt8, globalStyles.mb8]}>
          <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.black]}>
            절삭 처리
            <AppText style={[fontStyles.s12, fontStyles.darkGray]}>
              {customerSetting.cutting === 0 ? '' : ' (' + customerSetting.cutting + '원 -> 0원처리)'}
            </AppText>
          </AppText>
          <View style={globalStyles.row}>
            <AppTouchableOpacity
              style={[globalStyles.row, globalStyles.pt4, globalStyles.pb4, { width: '33%' }]}
              onPress={() => setCutting(0)}>
              <Image
                style={[globalStyles.img20, globalStyles.mt2, globalStyles.mr4]}
                source={
                  customerSetting.cutting === 0 ? require('@images/radioOn.png') : require('@images/radioOff.png')
                }
              />
              <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.black]}>없음</AppText>
            </AppTouchableOpacity>
            <AppTouchableOpacity
              style={[globalStyles.row, globalStyles.pt4, globalStyles.pb4, { width: '33%' }]}
              onPress={() => setCutting(1)}>
              <Image
                style={[globalStyles.img20, globalStyles.mt2, globalStyles.mr4]}
                source={
                  customerSetting.cutting === 1 ? require('@images/radioOn.png') : require('@images/radioOff.png')
                }
              />
              <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.black]}>1원</AppText>
            </AppTouchableOpacity>
            <AppTouchableOpacity
              style={[globalStyles.row, globalStyles.pt4, { width: '33%' }]}
              onPress={() => setCutting(10)}>
              <Image
                style={[globalStyles.img20, globalStyles.mt2, globalStyles.mr4]}
                source={
                  customerSetting.cutting === 10 ? require('@images/radioOn.png') : require('@images/radioOff.png')
                }
              />
              <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.black]}>10원</AppText>
            </AppTouchableOpacity>
          </View>
        </View>
        <View style={[globalStyles.row, globalStyles.mt8, globalStyles.mb8]}>
          <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.black, globalStyles.flex1]}>
            절삭 기본적용여부
          </AppText>
          <AppToggle value={customerSetting.cuttingYn === 'Y' ? true : false} onChange={setCuttingYn} />
        </View>
        <View style={[globalStyles.mt8, globalStyles.mb8]}>
          <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.black]}>목록 표시</AppText>
          <View style={[globalStyles.row, globalStyles.mt8]}>
            <AppTouchableOpacity style={{ width: '50%' }} onPress={() => setViewType('1')}>
              <View
                style={[
                  globalStyles.pt8,
                  globalStyles.pb4,
                  globalStyles.pr8,
                  globalStyles.pl8,
                  globalStyles.mr8,
                  globalStyles.borderRadius,
                  {
                    borderStyle: 'solid',
                    borderWidth: 2 * setting.scale,
                    borderColor: Color.lightGray,
                  },
                  customerSetting.viewType === '1' && { backgroundColor: Color.lightGray },
                ]}>
                <View
                  style={[
                    globalStyles.borderRadius,
                    globalStyles.mb4,
                    {
                      width: '100%',
                      height: 12 * setting.scale,
                      backgroundColor: Color.main,
                    },
                  ]}
                />
                <View
                  style={[
                    globalStyles.borderRadius,
                    globalStyles.mb4,
                    {
                      width: '100%',
                      height: 12 * setting.scale,
                      backgroundColor: Color.main,
                    },
                  ]}
                />
                <View
                  style={[
                    globalStyles.borderRadius,
                    globalStyles.mb4,
                    {
                      width: '100%',
                      height: 12 * setting.scale,
                      backgroundColor: Color.main,
                    },
                  ]}
                />
                <View
                  style={[
                    globalStyles.borderRadius,
                    globalStyles.mb4,
                    {
                      width: '100%',
                      height: 12 * setting.scale,
                      backgroundColor: Color.main,
                    },
                  ]}
                />
                <AppText style={[fontStyles.regular, fontStyles.s14, fontStyles.black, fontStyles.center]}>
                  목록형
                </AppText>
              </View>
            </AppTouchableOpacity>
            <AppTouchableOpacity style={{ width: '50%' }} onPress={() => setViewType('2')}>
              <View
                style={[
                  globalStyles.pt8,
                  globalStyles.pb4,
                  globalStyles.pr20,
                  globalStyles.pl20,
                  globalStyles.ml8,
                  globalStyles.borderRadius,
                  {
                    borderStyle: 'solid',
                    borderWidth: 2 * setting.scale,
                    borderColor: Color.lightGray,
                  },
                  customerSetting.viewType === '2' && { backgroundColor: Color.lightGray },
                ]}>
                <View style={[globalStyles.justifyContentCenter, { flexWrap: 'wrap', flexDirection: 'row' }]}>
                  <View
                    style={[
                      globalStyles.borderRadius,
                      globalStyles.mb4,
                      globalStyles.mr4,
                      {
                        width: 28 * setting.scale,
                        height: 28 * setting.scale,
                        backgroundColor: Color.main,
                      },
                    ]}
                  />
                  <View
                    style={[
                      globalStyles.borderRadius,
                      globalStyles.mb4,
                      {
                        width: 28 * setting.scale,
                        height: 28 * setting.scale,
                        backgroundColor: Color.main,
                      },
                    ]}
                  />
                  <View
                    style={[
                      globalStyles.borderRadius,
                      globalStyles.mb4,
                      globalStyles.mr4,
                      {
                        width: 28 * setting.scale,
                        height: 28 * setting.scale,
                        backgroundColor: Color.main,
                      },
                    ]}
                  />
                  <View
                    style={[
                      globalStyles.borderRadius,
                      globalStyles.mb4,
                      {
                        width: 28 * setting.scale,
                        height: 28 * setting.scale,
                        backgroundColor: Color.main,
                      },
                    ]}
                  />
                </View>
                <AppText style={[fontStyles.regular, fontStyles.s14, fontStyles.black, fontStyles.center]}>
                  격자형
                </AppText>
              </View>
            </AppTouchableOpacity>
          </View>
        </View>
        <View style={[globalStyles.mt8, globalStyles.mb8]}>
          <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.black]}>엔빵 방식</AppText>
          <View style={globalStyles.row}>
            <AppTouchableOpacity
              style={[globalStyles.row, globalStyles.pt4, globalStyles.pb4, { width: '50%' }]}
              onPress={() => setPayerSendYn('N')}>
              <Image
                style={[globalStyles.img20, globalStyles.mt2, globalStyles.mr4]}
                source={
                  customerSetting.payerSendYn === 'N' ? require('@images/radioOn.png') : require('@images/radioOff.png')
                }
              />
              <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.black]}>결제자{'\n'}송금 제외</AppText>
            </AppTouchableOpacity>
            <AppTouchableOpacity
              style={[globalStyles.row, globalStyles.pt4, globalStyles.pb4, { width: '50%' }]}
              onPress={() => setPayerSendYn('Y')}>
              <Image
                style={[globalStyles.img20, globalStyles.mt2, globalStyles.mr4]}
                source={
                  customerSetting.payerSendYn === 'Y' ? require('@images/radioOn.png') : require('@images/radioOff.png')
                }
              />
              <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.black]}>참여인원{'\n'}1번씩 송금</AppText>
            </AppTouchableOpacity>
          </View>
        </View>
        <View style={[globalStyles.row, globalStyles.mt8, globalStyles.mb8]}>
          <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.black, globalStyles.flex1]}>
            도움말 표시
          </AppText>
          <AppToggle value={customerSetting.helpYn === 'Y' ? true : false} onChange={setHelpYn} />
        </View>
        <View style={globalStyles.flex1} />
        <View>
          <AppTouchableOpacity
            style={[globalStyles.pt24, globalStyles.pb24, globalStyles.pl24, globalStyles.pr24]}
            onPress={openEmail}>
            <AppText style={[fontStyles.medium, fontStyles.s14, fontStyles.black, fontStyles.center]}>문의하기</AppText>
          </AppTouchableOpacity>
        </View>
        <View>
          <AppText style={[fontStyles.medium, fontStyles.s14, fontStyles.black, fontStyles.center]}>
            Create by{'\n'}FOMUN
          </AppText>
        </View>
      </AppScrollView>
    </View>
  );
}
