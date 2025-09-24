import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { StatusBar, View, Animated, Image, Share } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/Types';
type Props = NativeStackScreenProps<RootStackParamList, 'Accept'>;
type Navigation = NativeStackNavigationProp<RootStackParamList, 'Accept'>;

import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/app/Store';
import { setDecreaseAcceptCount, setPaymentItemList, setSchedule, setSchedules, setMemberList } from '@/app/StateSlice';

import Toast from 'react-native-toast-message';

import { api } from '@/common/Api';

import GlobalStyles from '@/css/Style';
import FontStyles from '@/css/FontStyle';
import Styles from '@/screens/schedule/Style';
import HooksStyle from '@/css/HooksStyle';
import Color from '@/css/ColorStyle';

import { AppText, AppTouchableOpacity, AppHeader, AppFlatList, AppLinearGradient } from '@/components';

import RemoveModal from '@/components/RemoveModal';

import PaymentRenderItem from '@/components/PaymentRenderItem';
import { PaymentItem, PaymentMember } from '@/@types/Types';

export default function ACCEPT({ route }: Props) {
  const navigation = useNavigation<Navigation>();
  const dispatch = useDispatch();

  const setting = useSelector((state: RootState) => state.app.setting);
  const globalStyles = GlobalStyles(setting);
  const fontStyles = FontStyles(setting);
  const styles = Styles(setting);
  const hooksStyle = HooksStyle(setting);

  const selectedSchedule = useSelector((state: RootState) => state.app.schedule)!!;
  const schedules = useSelector((state: RootState) => state.app.schedules);
  const schedulesRef = useRef(schedules);
  useEffect(() => {
    schedulesRef.current = schedules;
  }, [schedules]);
  const paymentItemList = useSelector((state: RootState) => state.app.paymentItemList);
  const paymentItemListRef = useRef(paymentItemList);
  useEffect(() => {
    paymentItemListRef.current = paymentItemList;
  }, [paymentItemList]);
  const [acceptList, setAcceptList] = useState<PaymentItem[]>([]);
  const acceptListRef = useRef(acceptList);
  useEffect(() => {
    acceptListRef.current = acceptList;
  }, [acceptList]);

  const customerSetting = useSelector((state: RootState) => state.app.customerSetting);

  const animationLinearGradient = useRef(new Animated.Value(0)).current;

  const page = useRef(0);
  const totalPages = useRef(-1);
  const dataLoading = useRef(false);
  const dataRefreshing = useRef(false);
  const [listHeight, setListHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const autofilling = useRef(false);

  const [isDim, setDim] = useState(false);
  const [isRemoveModalVisible, setRemoveModalVisible] = useState(false);
  const removeItem = useRef<PaymentItem | null>(null);

  const loadPage = useCallback(() => {
    if (dataLoading.current) return;
    if (page.current !== 0 && (page.current > totalPages.current || page.current === totalPages.current)) return;

    dataLoading.current = true;
    api
      .get(
        '/api/paymentItems/page?page=' +
          page.current +
          '&scheduleId=' +
          selectedSchedule.scheduleId +
          '&acceptYn=false',
      )
      .then(res => {
        if (res.status === 'SUCCESS') {
          totalPages.current = res.data.totalPages;
          const data: PaymentItem[] = res.data.content;
          if (dataRefreshing.current || res.data.page === 0) {
            setAcceptList(data);
            dataRefreshing.current = false;
          } else {
            setAcceptList(before => [...before, ...data]);
          }
          page.current = res.data.page + 1;
        }
      })
      .finally(() => (dataLoading.current = false));
  }, [selectedSchedule.scheduleId]);

  useEffect(() => {
    if (
      !autofilling.current &&
      !dataLoading.current &&
      listHeight !== 0 &&
      contentHeight !== 0 &&
      contentHeight < listHeight
    ) {
      autofilling.current = true;
      requestAnimationFrame(() => {
        loadPage();
        autofilling.current = false;
      });
    }
  }, [listHeight, contentHeight, loadPage]);

  const onRefresh = useCallback(() => {
    dataRefreshing.current = true;
    page.current = 0;
    loadPage();
  }, [loadPage]);

  const onEndReached = useCallback(() => {
    loadPage();
  }, [loadPage]);

  const onAceept = useCallback(
    async (paymentItem: PaymentItem) => {
      setDim(true);
      const members: PaymentMember[] = paymentItem.members.map(m => {
        return {
          scheduleId: paymentItem.scheduleId,
          paymentId: paymentItem.paymentId,
          memberId: m.memberId,
          name: m.name,
        };
      });
      const newItem: PaymentItem = {
        scheduleId: paymentItem.scheduleId,
        paymentId: paymentItem.paymentId,
        payer: paymentItem.payer,
        payerId: paymentItem.payerId,
        title: paymentItem.title,
        cost: paymentItem.cost,
        acceptYn: true,
        members: members,
      };
      const res1 = await api.put(
        '/api/paymentItems?scheduleId=' + paymentItem.scheduleId + '&paymentId=' + paymentItem.paymentId,
        newItem,
      );
      if (res1.status !== 'SUCCESS') return false;
      dispatch(setPaymentItemList([res1.data, ...paymentItemListRef.current]));

      //총금액 업데이트
      const res2 = await api.get('/api/schedules?scheduleId=' + paymentItem.scheduleId);
      if (res2.status !== 'SUCCESS') return false;
      dispatch(setSchedule(res2.data));

      //스케줄 리스트 업데이트
      const newSchedules = schedulesRef.current.map(s => (s.scheduleId === res2.data.scheduleId ? res2.data : s));
      dispatch(setSchedules(newSchedules));

      const res3 = await api.get('/api/schedules/members/list?scheduleId=' + paymentItem.scheduleId);
      setDim(false);
      if (res3.status !== 'SUCCESS') return false;
      dispatch(setMemberList(res3.data));
      Toast.show({
        type: 'message',
        text1: '결제내역을 추가했어요!',
        position: 'bottom',
        visibilityTime: 1500,
      });
      setAcceptList(acceptListRef.current.filter(item => item.paymentId !== paymentItem.paymentId));
      dispatch(setDecreaseAcceptCount());
    },
    [dispatch],
  );

  const removeAceept = useCallback(async (paymentItem: PaymentItem) => {
    removeItem.current = paymentItem;
    setRemoveModalVisible(true);
  }, []);

  const handleRemove = useCallback(async () => {
    if (removeItem.current != null) {
      setRemoveModalVisible(false);
      setDim(true);
      const res = await api.delete(
        '/api/paymentItems/delete?scheduleId=' +
          removeItem.current.scheduleId +
          '&paymentId=' +
          removeItem.current.paymentId,
      );
      if (res.status !== 'SUCCESS') return false;

      Toast.show({
        type: 'message',
        text1: '결제내역을 삭제했어요!',
        position: 'bottom',
        visibilityTime: 1500,
      });
      setAcceptList(acceptListRef.current.filter(item => item.paymentId !== removeItem.current!!.paymentId));
      dispatch(setDecreaseAcceptCount());
      setDim(false);
    }
  }, [dispatch]);

  return (
    <View style={[globalStyles.wrap, globalStyles.pb0]}>
      <StatusBar barStyle="dark-content" />
      <AppHeader rightImg={require('@images/back.png')} rightPress={() => navigation.goBack()} />
      <View style={globalStyles.flex1}>
        <AppFlatList
          keyExtractor={(_, idx) => idx.toString()}
          data={acceptList}
          renderItem={({ item, index }) => (
            <PaymentRenderItem
              index={index}
              item={item}
              globalStyles={globalStyles}
              styles={styles}
              fontStyles={fontStyles}
              onPress={() => null}
              onLongPress={() => null}>
              <View style={[globalStyles.justifyContentCenter, index == 0 && globalStyles.mt16]}>
                <AppTouchableOpacity
                  style={[
                    globalStyles.borderRadius,
                    globalStyles.pt8,
                    globalStyles.pb8,
                    globalStyles.pl12,
                    globalStyles.pr12,
                    globalStyles.mr16,
                    { backgroundColor: Color.main },
                  ]}
                  onPress={() => onAceept(item)}>
                  <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.white]}>수락</AppText>
                </AppTouchableOpacity>
                <AppTouchableOpacity
                  style={[
                    globalStyles.borderRadius,
                    globalStyles.pt4,
                    globalStyles.pb4,
                    globalStyles.mt16,
                    globalStyles.mr16,
                    { backgroundColor: Color.red },
                  ]}>
                  <AppText
                    style={[fontStyles.regular, fontStyles.s14, fontStyles.white, fontStyles.center]}
                    onPress={() => removeAceept(item)}>
                    삭제
                  </AppText>
                </AppTouchableOpacity>
              </View>
            </PaymentRenderItem>
          )}
          ListFooterComponent={<View style={{ height: 64 * setting.scale + setting.bottom }} />}
          scrollEventThrottle={16}
          onScroll={e => {
            const contentOffset = e.nativeEvent.contentOffset;
            if (contentOffset.y < 16 * setting.scale) {
              animationLinearGradient.setValue(0);
            } else {
              animationLinearGradient.setValue(1);
            }
          }}
          refreshing={dataRefreshing.current}
          onRefresh={onRefresh}
          onEndReachedThreshold={0.5}
          onEndReached={onEndReached}
          onLayout={e => setListHeight(e.nativeEvent.layout.height)}
          onContentSizeChange={(_, h) => setContentHeight(h)}
        />
        <AppLinearGradient
          style={[{ top: 0, transform: [{ rotate: '180deg' }] }, globalStyles.pl8]}
          animation={true}
          animationStyle={{ opacity: animationLinearGradient }}
        />
      </View>
      <RemoveModal
        isVisible={isRemoveModalVisible}
        type="해당 결제내역을"
        initialTitle={removeItem.current ? removeItem.current.title : ''}
        globalStyles={globalStyles}
        fontStyles={fontStyles}
        onSubmit={handleRemove}
        onCancel={() => setRemoveModalVisible(false)}
      />
      {isDim && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0)',
          }}
        />
      )}
    </View>
  );
}
