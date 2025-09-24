import { useEffect, useState, useRef, useCallback } from 'react';
import { StatusBar, View, Animated, Image, Linking } from 'react-native';
import { AppTouchableOpacity, AppFlatList, AppHeader, AppLinearGradient, AppText } from '@/components';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation, CompositeScreenProps, DrawerActions } from '@react-navigation/native';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, DrawerParamList } from '@/navigation/Types';
export type Props = CompositeScreenProps<
  DrawerScreenProps<DrawerParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList, 'Main'>
>;
export type Navigation = Props['navigation'];

import { api } from '@/common/Api';

import { useSelector, useDispatch } from 'react-redux';
import { setSchedules, selectedSchedule } from '@/app/StateSlice';
import type { RootState } from '@/app/Store';

import GlobalStyles from '@/css/Style';
import FontStyles from '@/css/FontStyle';
import Styles from './Style';
import HooksStyle from '@/css/HooksStyle';

import { DateFormat, RandomHexColor } from '@/common/CommonUtils';
import { Schedule } from '@/@types/Types';

import { useSchedules } from '@/hooks/useSchedules';
import { useHelps } from './Help';

import ScheduleRenderItem from '@/components/ScheduleRenderItem';
import SchaduleModal from '@/components/ScheduleModal';
import RemoveModal from '@/components/RemoveModal';
import HelpModal from '@/components/HelpModal';

export default function HOME({ route }: Props) {
  const {
    isSchedlueModalVisible,
    isRemoveScheduleModalVisible,
    removeTitle,
    openAddScheduleModal,
    openRemoveScheduleModal,
    closeScheduleModal,
    closeRemoveScheduleModal,
    handleSaveSchedule,
    handleRemoveSchedule,
    helpAddSchedule,
    helpRemoveSchedule,
  } = useSchedules();
  const { isHelpModalVisible, helpStep, helpData, opeHelpModal, nextHelpStep } = useHelps();
  const navigation = useNavigation<Navigation>();
  const dispatch = useDispatch();
  const appUpdate = useSelector((state: RootState) => state.app.appUpdate);

  const schedules = useSelector((state: RootState) => state.app.schedules);

  const setting = useSelector((state: RootState) => state.app.setting);
  const globalStyles = GlobalStyles(setting);
  const fontStyles = FontStyles(setting);
  const styles = Styles(setting);
  const hooksStyle = HooksStyle(setting);

  const customerSetting = useSelector((state: RootState) => state.app.customerSetting);
  const numColumns = customerSetting.viewType == '1' ? 1 : setting.scale === 1 ? 2 : 3;

  const animationLinearGradient = useRef(new Animated.Value(0)).current;

  const page = useRef<number>(0);
  const totalPages = useRef<number>(-1);
  const dataLoading = useRef<boolean>(false);
  const dataRefreshing = useRef<boolean>(false);
  const [listHeight, setListHeight] = useState<number>(0);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const autofilling = useRef<boolean>(false);

  const initialSchaduleTitle = useRef('');

  useEffect(() => {
    AsyncStorage.getItem('first-home').then(value => {
      if (!value) {
        AsyncStorage.setItem('first-home', 'notFirst');
        opeHelpModal();
      }
    });
  }, []);

  const loadPage = useCallback(() => {
    if (dataLoading.current) return;
    if (page.current !== 0 && (page.current > totalPages.current || page.current === totalPages.current)) return;

    dataLoading.current = true;
    api
      .get('/api/schedules/page?page=' + page.current)
      .then(res => {
        if (res.status === 'SUCCESS') {
          totalPages.current = res.data.totalPages;
          const data: Schedule[] = res.data.content;
          if (dataRefreshing.current || res.data.page === 0) {
            dispatch(setSchedules(data));
            dataRefreshing.current = false;
          } else {
            dispatch(setSchedules([...schedules, ...data]));
          }
          page.current = res.data.page + 1;
        }
      })
      .finally(() => (dataLoading.current = false));
  }, [dispatch, schedules]);

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

  const onSchdulePress = useCallback(
    (schedule: Schedule) => {
      dispatch(selectedSchedule(schedule));
      navigation.navigate('Schedule');
    },
    [dispatch, navigation],
  );

  const onSchduleLong = useCallback((schedule: Schedule) => openRemoveScheduleModal(schedule), []);

  const startHelp = () => {
    nextHelpStep(() => {
      switch (helpStep.current) {
        case 2:
          initialSchaduleTitle.current = '이용안내 설명 중';
          openAddScheduleModal();
          break;
        case 3:
          initialSchaduleTitle.current = '';
          closeScheduleModal();
          helpAddSchedule();
          break;
        case 4:
          helpRemoveSchedule();
          break;
      }
    });
  };

  return (
    <View style={[globalStyles.wrap, globalStyles.pb0]}>
      <StatusBar barStyle="dark-content" />
      <AppHeader
        leftImg={require('@images/menu.png')}
        leftPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      {appUpdate && (
        <AppTouchableOpacity
          style={styles.updateBox}
          onPress={() => Linking.openURL('market://details?id=kr.co.fomun.settleup')}>
          <AppText style={[fontStyles.bold, fontStyles.s16, fontStyles.white, fontStyles.center]}>
            새로운 버전이 존재합니다!{'\n'}여기를 눌러 앱을 업데이트해주세요!
          </AppText>
        </AppTouchableOpacity>
      )}
      <View style={styles.itemBoxView}>
        <AppFlatList
          keyExtractor={i => i.scheduleId.toString()}
          data={schedules}
          renderItem={({ item }) => (
            <ScheduleRenderItem
              item={item}
              viewType={customerSetting.viewType}
              globalStyles={globalStyles}
              styles={styles}
              fontStyles={fontStyles}
              scale={setting.scale}
              onPress={onSchdulePress}
              onLongPress={onSchduleLong}
            />
          )}
          ListFooterComponent={<View style={{ height: 72 * setting.scale + setting.bottom }} />}
          key={numColumns}
          numColumns={numColumns}
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
          onEndReachedThreshold={0.3}
          onEndReached={onEndReached}
          onLayout={e => setListHeight(e.nativeEvent.layout.height)}
          onContentSizeChange={(_, h) => setContentHeight(h)}
        />
        <AppLinearGradient
          style={{ top: 0, transform: [{ rotate: '180deg' }] }}
          animation={true}
          animationStyle={{ opacity: animationLinearGradient }}
        />
        <AppLinearGradient style={{ bottom: 0 }} />
      </View>
      {customerSetting.helpYn === 'Y' && (
        <AppTouchableOpacity style={[globalStyles.shadow, globalStyles.fab, globalStyles.fab_l]} onPress={opeHelpModal}>
          <Image style={globalStyles.img40} source={require('@images/help.png')} />
        </AppTouchableOpacity>
      )}
      <AppTouchableOpacity
        style={[globalStyles.shadow, globalStyles.fab, globalStyles.fab_r]}
        onPress={openAddScheduleModal}>
        <Image style={globalStyles.img32} source={require('@images/addSchedule.png')} />
      </AppTouchableOpacity>
      <SchaduleModal
        isVisible={isSchedlueModalVisible}
        mode="create"
        initialTitle={initialSchaduleTitle.current}
        initialDate={DateFormat()}
        initialColor={RandomHexColor()}
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
