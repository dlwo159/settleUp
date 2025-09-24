import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { StatusBar, View, Animated, Image, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/Types';
type Props = NativeStackScreenProps<RootStackParamList, 'Schedule'>;
type Navigation = NativeStackNavigationProp<RootStackParamList, 'Schedule'>;

import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/app/Store';
import { setPaymentItemList, setMemberList, setAcceptCount } from '@/app/StateSlice';

import Toast from 'react-native-toast-message';

import { api, baseURL } from '@/common/Api';

import { ContrastColor, MoneyFormat, DateFormat } from '@/common/CommonUtils';

import GlobalStyles from '@/css/Style';
import FontStyles from '@/css/FontStyle';
import Styles from './Style';
import HooksStyle from '@/css/HooksStyle';

import { AppText, AppTouchableOpacity, AppHeader, AppFlatList, AppLinearGradient } from '@/components';

import { useSchedules } from '@/hooks/useSchedules';
import { useMembers } from '@/hooks/useMembers';
import { usePaymentItems } from '@/hooks/usePaymentItems';
import { useHelps } from './Help';

import SchaduleModal from '@/components/ScheduleModal';
import MemberAddModal from '@/components/MemberAddModal';
import MemberUpdateModal from '@/components/MemberUpdateModal';
import RemoveModal from '@/components/RemoveModal';
import PaymentItemModal from '@/components/PaymentItemModal';
import HelpModal from '@/components/HelpModal';

import MemberRenderItem from '@/components/MemberRenderItem';
import PaymentRenderItem from '@/components/PaymentRenderItem';
import { ScheduleMember, PaymentItem } from '@/@types/Types';

export default function SCHEDULE({ route }: Props) {
  const {
    isSchedlueModalVisible,
    isRemoveScheduleModalVisible,
    removeTitle,
    openUpdateScheduleModal,
    openRemoveScheduleModal,
    closeScheduleModal,
    closeRemoveScheduleModal,
    handleSaveSchedule,
    handleRemoveSchedule,
  } = useSchedules();
  const {
    isAddMemberModalVisible,
    isUpdateMemberModalVisible,
    isRemoveMemberModalVisible,
    memberPreset,
    openAddMemberModal,
    openUpdateMemberModal,
    openRemoveMemberModal,
    closeAddMemberModal,
    closeUpdateMemberModal,
    closeRemoveMemberModal,
    handleAddMembers,
    handleUpdateMembers,
    handleRemoveMembers,
    helpAddMembers,
    helpRemoveMembers,
  } = useMembers();
  const {
    isPaymentItemModalVisible,
    isRemovePaymentItemModalVisible,
    selectedPaymentItem,
    openAddPaymentItemModal,
    openUpdatePaymentItemModal,
    openRemovePaymentItemModal,
    closePaymentItemModal,
    closeRemovePaymentItemModal,
    handleSavePaymentItem,
    handleSave2PaymentItem,
    handleRemovePaymentItem,
    helpAddPaymentItem,
    helpRemovePaymentItem,
  } = usePaymentItems();
  const { isHelpModalVisible, helpStep, helpData, opeHelpModal, nextHelpStep } = useHelps();
  const navigation = useNavigation<Navigation>();
  const dispatch = useDispatch();

  const setting = useSelector((state: RootState) => state.app.setting);
  const globalStyles = GlobalStyles(setting);
  const fontStyles = FontStyles(setting);
  const styles = Styles(setting);
  const hooksStyle = HooksStyle(setting);

  const selectedSchedule = useSelector((state: RootState) => state.app.schedule)!!;
  const memberList = useSelector((state: RootState) => state.app.memberList);
  const paymentItemList = useSelector((state: RootState) => state.app.paymentItemList);
  const paymentItemListRef = useRef(paymentItemList);
  useEffect(() => {
    paymentItemListRef.current = paymentItemList;
  }, [paymentItemList]);
  const acceptCount = useSelector((state: RootState) => state.app.acceptCount);

  const customerSetting = useSelector((state: RootState) => state.app.customerSetting);

  const colorType = useMemo(() => ContrastColor(selectedSchedule.color), [selectedSchedule.color]);

  const animationLinearGradient = useRef(new Animated.Value(0)).current;

  const page = useRef(0);
  const totalPages = useRef(-1);
  const dataLoading = useRef(false);
  const dataRefreshing = useRef(false);
  const [listHeight, setListHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const autofilling = useRef(false);

  const helfMemberName = useRef('');

  const dim = useRef<boolean>(false);

  useEffect(() => {
    AsyncStorage.getItem('first-schedule').then(value => {
      if (!value) {
        AsyncStorage.setItem('first-schedule', 'notFirst');
        opeHelpModal();
      }
    });
  }, []);

  useEffect(() => {
    api.get('/api/schedules/members/list?scheduleId=' + selectedSchedule.scheduleId).then(res => {
      if (res.status === 'SUCCESS') {
        const members: ScheduleMember[] = res.data.map((m: ScheduleMember) => ({
          ...m,
          checked: false,
        }));
        dispatch(setMemberList(members));
      }
    });
    api.get('/api/paymentItems/check/count?scheduleId=' + selectedSchedule.scheduleId).then(res => {
      if (res.status === 'SUCCESS') {
        dispatch(setAcceptCount(res.data));
      } else {
        dispatch(setAcceptCount(0));
      }
    });
  }, [dispatch, selectedSchedule.scheduleId]);

  const loadPage = useCallback(() => {
    if (dataLoading.current) return;
    if (page.current !== 0 && (page.current > totalPages.current || page.current === totalPages.current)) return;

    dataLoading.current = true;
    api
      .get('/api/paymentItems/page?page=' + page.current + '&scheduleId=' + selectedSchedule.scheduleId)
      .then(res => {
        if (res.status === 'SUCCESS') {
          totalPages.current = res.data.totalPages;
          const data: PaymentItem[] = res.data.content;
          if (dataRefreshing.current || res.data.page === 0) {
            dispatch(setPaymentItemList(data));
            dataRefreshing.current = false;
          } else {
            dispatch(setPaymentItemList([...paymentItemList, ...data]));
          }
          page.current = res.data.page + 1;
        }
      })
      .finally(() => (dataLoading.current = false));
  }, [dispatch, paymentItemList, selectedSchedule.scheduleId]);

  useEffect(() => {
    if (
      !isHelpModalVisible &&
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
  }, [listHeight, contentHeight, loadPage, isHelpModalVisible]);

  const onRefresh = useCallback(() => {
    dataRefreshing.current = true;
    page.current = 0;
    loadPage();
  }, [loadPage]);

  const onEndReached = useCallback(() => {
    loadPage();
  }, [loadPage]);

  const onSchdulePress = useCallback(() => openUpdateScheduleModal(selectedSchedule), [selectedSchedule]);

  const onSchduleLong = useCallback(() => openRemoveScheduleModal(selectedSchedule), [selectedSchedule]);

  const onMemberPress = useCallback((member: ScheduleMember) => openUpdateMemberModal(member), []);

  const onMemberLong = useCallback((member: ScheduleMember) => {
    if (member.payerYn) {
      Toast.show({
        type: 'message',
        text1: '결제자는 삭제할 수 없어요!',
        position: 'bottom',
        visibilityTime: 1500,
      });
      return;
    }
    const check = paymentItemListRef.current.filter(pi => pi.members.length === 1).map(pi => pi.members[0].memberId);
    if (check.includes(member.memberId)) {
      Toast.show({
        type: 'message',
        text1: '단독정산인원 삭제할 수 없어요!',
        position: 'bottom',
        visibilityTime: 1500,
      });
      return;
    }
    openRemoveMemberModal(member);
  }, []);

  const onPaymentItemPress = useCallback(
    (paymentItem: PaymentItem) => openUpdatePaymentItemModal(paymentItem),
    [openUpdatePaymentItemModal],
  );

  const onPaymentItemLong = useCallback((paymentItem: PaymentItem) => openRemovePaymentItemModal(paymentItem), []);

  const startHelp = () => {
    nextHelpStep(() => {
      switch (helpStep.current) {
        case 3:
          helfMemberName.current = '멤버,추가,예시';
          openAddMemberModal();
          break;
        case 4:
          helfMemberName.current = '';
          closeAddMemberModal();
          helpAddMembers();
          break;
        case 6:
          openAddPaymentItemModal();
          selectedPaymentItem.current = {
            scheduleId: '',
            paymentId: 0,
            title: '결제항목 추가안내',
            payer: '멤버',
            payerId: 9001,
            cost: 10000,
            acceptYn: true,
            members: [],
          };
          break;
        case 11:
          closePaymentItemModal();
          helpAddPaymentItem();
          break;
        case 13:
          helpRemoveMembers();
          helpRemovePaymentItem();
          break;
      }
    });
  };

  const createLink = useCallback(async () => {
    if (dim.current) return;
    dim.current = true;
    const now = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(now.getDate() + 7);
    const body = {
      scheduleId: selectedSchedule.scheduleId,
      closeDate: DateFormat(sevenDaysLater),
    };
    const res = await api.post('/api/schedules/link', body);

    setTimeout(() => {
      dim.current = false;
    }, 1000);
    if (res.status === 'SUCCESS') {
      await Share.share({
        message: baseURL + '/guest/payment?code=' + res.data,
      });
    }
  }, [selectedSchedule.scheduleId]);

  return (
    <View style={[globalStyles.wrap, globalStyles.pb0]}>
      <StatusBar barStyle="dark-content" />
      <AppHeader
        rightImg={require('@images/back.png')}
        rightPress={() => navigation.goBack()}
        leftImg={require('@images/bill.png')}
        leftPress={() => navigation.navigate('Bill')}
      />
      <View style={[globalStyles.mr16, globalStyles.ml16, globalStyles.mt8]}>
        <AppTouchableOpacity
          style={[
            globalStyles.shadow,
            globalStyles.pt8,
            globalStyles.pb8,
            globalStyles.pr12,
            globalStyles.pl12,
            globalStyles.borderRadius,
            { backgroundColor: selectedSchedule.color },
          ]}
          onPress={onSchdulePress}
          onLongPress={onSchduleLong}
          delayLongPress={500}>
          <AppText style={[fontStyles.medium, fontStyles.s12, { color: colorType }]}>{selectedSchedule.date}</AppText>
          <AppText
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[fontStyles.bold, fontStyles.s20, { color: colorType }]}>
            {selectedSchedule.title}
          </AppText>
          <View style={[globalStyles.row, globalStyles.alignItemsCenter]}>
            <AppText
              style={[fontStyles.bold, fontStyles.s20, fontStyles.right, globalStyles.flex1, { color: colorType }]}>
              {MoneyFormat(selectedSchedule.totalCost.toString())}
            </AppText>
            <AppText
              style={[fontStyles.medium, fontStyles.s14, { color: colorType }, globalStyles.ml2, globalStyles.mt4]}>
              원
            </AppText>
          </View>
        </AppTouchableOpacity>
        <View
          style={[
            globalStyles.shadow,
            globalStyles.borderRadius,
            globalStyles.mt16,
            globalStyles.pt8,
            globalStyles.pb8,
            styles.bgPaymentCard,
          ]}>
          <View style={[globalStyles.row, globalStyles.mr12]}>
            <AppText
              style={[
                fontStyles.medium,
                fontStyles.s14,
                fontStyles.mainColor,
                globalStyles.flex1,
                globalStyles.ml16,
                globalStyles.mt4,
              ]}>
              정산인원
            </AppText>
            <AppText style={[fontStyles.medium, fontStyles.s14, fontStyles.darkGray, globalStyles.mt4]}>
              {memberList.length}명
            </AppText>
            <AppTouchableOpacity
              style={[
                styles.bgMain,
                globalStyles.borderRadius,
                globalStyles.ml8,
                globalStyles.pt4,
                globalStyles.pb4,
                globalStyles.pr8,
                globalStyles.pl8,
              ]}
              onPress={openAddMemberModal}>
              <AppText style={[fontStyles.regular, fontStyles.s14, fontStyles.white]}>추가</AppText>
            </AppTouchableOpacity>
          </View>
          <AppFlatList
            horizontal
            keyExtractor={i => i.scheduleId + i.memberId.toString()}
            data={memberList}
            renderItem={({ item, index }) => (
              <MemberRenderItem
                index={index}
                item={item}
                length={memberList.length}
                globalStyles={globalStyles}
                styles={styles}
                fontStyles={fontStyles}
                onPress={() => onMemberPress(item)}
                onLongPress={() => onMemberLong(item)}
              />
            )}
          />
        </View>
      </View>
      <View style={globalStyles.flex1}>
        <AppFlatList
          keyExtractor={(_, idx) => idx.toString()}
          data={paymentItemList}
          renderItem={({ item, index }) => (
            <PaymentRenderItem
              index={index}
              item={item}
              globalStyles={globalStyles}
              styles={styles}
              fontStyles={fontStyles}
              onPress={onPaymentItemPress}
              onLongPress={onPaymentItemLong}
            />
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
      <AppTouchableOpacity style={[globalStyles.shadow, globalStyles.fab, globalStyles.fab_l]} onPress={createLink}>
        <Image style={globalStyles.img32} source={require('@images/sendPayment.png')} />
      </AppTouchableOpacity>
      {customerSetting.helpYn === 'Y' && (
        <AppTouchableOpacity style={[globalStyles.shadow, globalStyles.fab, styles.fab_l]} onPress={opeHelpModal}>
          <Image style={globalStyles.img40} source={require('@images/help.png')} />
        </AppTouchableOpacity>
      )}
      <AppTouchableOpacity
        style={[globalStyles.shadow, globalStyles.fab, globalStyles.fab_r]}
        onPress={openAddPaymentItemModal}>
        <Image style={globalStyles.img32} source={require('@images/addPayment.png')} />
      </AppTouchableOpacity>
      {acceptCount > 0 && (
        <AppTouchableOpacity
          style={[globalStyles.shadow, globalStyles.fab, styles.fab_r]}
          onPress={() => navigation.navigate('Accept')}>
          <Image style={globalStyles.img32} source={require('@images/newPayment.png')} />
          <AppText style={[styles.acceptCount, fontStyles.regular, fontStyles.s8, fontStyles.pink, fontStyles.center]}>
            {acceptCount}
          </AppText>
        </AppTouchableOpacity>
      )}
      <SchaduleModal
        isVisible={isSchedlueModalVisible}
        mode="update"
        initialTitle={selectedSchedule.title}
        initialDate={selectedSchedule.date}
        initialColor={selectedSchedule.color}
        globalStyles={globalStyles}
        styles={hooksStyle}
        fontStyles={fontStyles}
        onSubmit={handleSaveSchedule}
        onCancel={closeScheduleModal}
      />
      <RemoveModal
        isVisible={isRemoveScheduleModalVisible}
        type="일정을"
        initialTitle={removeTitle.current}
        globalStyles={globalStyles}
        fontStyles={fontStyles}
        onSubmit={handleRemoveSchedule}
        onCancel={closeRemoveScheduleModal}
      />
      <MemberAddModal
        isVisible={isAddMemberModalVisible}
        initialName={helfMemberName.current}
        globalStyles={globalStyles}
        styles={hooksStyle}
        fontStyles={fontStyles}
        onSubmit={handleAddMembers}
        onCancel={closeAddMemberModal}
      />
      <MemberUpdateModal
        isVisible={isUpdateMemberModalVisible}
        initialName={memberPreset.name}
        initialAccount={memberPreset.account}
        globalStyles={globalStyles}
        styles={hooksStyle}
        fontStyles={fontStyles}
        onSubmit={handleUpdateMembers}
        onCancel={closeUpdateMemberModal}
      />
      <RemoveModal
        isVisible={isRemoveMemberModalVisible}
        type="멤버를"
        initialTitle={memberPreset.name}
        globalStyles={globalStyles}
        fontStyles={fontStyles}
        onSubmit={handleRemoveMembers}
        onCancel={closeRemoveMemberModal}
      />
      <PaymentItemModal
        isVisible={isPaymentItemModalVisible}
        mode={isHelpModalVisible ? 'help' : selectedPaymentItem.current ? 'update' : 'create'}
        initialTitle={selectedPaymentItem.current ? selectedPaymentItem.current.title : ''}
        initialCost={selectedPaymentItem.current ? selectedPaymentItem.current.cost.toString() : ''}
        initialPayerId={selectedPaymentItem.current ? selectedPaymentItem.current.payerId : 0}
        initialMembers={memberList}
        initialPaymentMembers={selectedPaymentItem.current ? selectedPaymentItem.current.members : []}
        globalStyles={globalStyles}
        styles={hooksStyle}
        fontStyles={fontStyles}
        setting={setting}
        onSubmit={handleSavePaymentItem}
        onSubmitCon={handleSave2PaymentItem}
        onCancel={closePaymentItemModal}
      />
      <RemoveModal
        isVisible={isRemovePaymentItemModalVisible}
        type="결제내역을"
        initialTitle={selectedPaymentItem.current ? selectedPaymentItem.current.title : ''}
        globalStyles={globalStyles}
        fontStyles={fontStyles}
        onSubmit={handleRemovePaymentItem}
        onCancel={closeRemovePaymentItemModal}
      />
      <HelpModal
        isVisible={isHelpModalVisible}
        initialText={helpData.text}
        initialX={helpData.x}
        initialY={helpData.y}
        setting={setting}
        fontStyles={fontStyles}
        onSubmit={startHelp}
      />
    </View>
  );
}
