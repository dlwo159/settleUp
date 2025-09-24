import { useEffect, useState, useRef, useCallback } from 'react';
import { StatusBar, View, Animated, Share, Image } from 'react-native';
import { AppText, AppTouchableOpacity, AppHeader, AppScrollView, AppLinearGradient } from '@/components';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/Types';
type Props = NativeStackScreenProps<RootStackParamList, 'Bill'>;

import { useSelector } from 'react-redux';
import type { RootState } from '@/app/Store';

import { api } from '@/common/Api';

import { MoneyFix, MoneyFormat } from '@/common/CommonUtils';

import GlobalStyles from '@/css/Style';
import FontStyles from '@/css/FontStyle';
import Styles from './Style';

import { Bill, MoneyInfo, PaymentItem } from '@/@types/Types';

import HelpModal from '@/components/HelpModal';
import { useHelps } from './Help';

export interface BillObj {
  [key: string]: Bill;
}
export interface MemberAcount {
  [key: number]: string;
}

export default function BILL({ route }: Props) {
  const { isHelpModalVisible, helpData, helpStep, opeHelpModal, nextHelpStep } = useHelps();
  const navigation = useNavigation();
  const setting = useSelector((state: RootState) => state.app.setting);
  const globalStyles = GlobalStyles(setting);
  const fontStyles = FontStyles(setting);
  const styles = Styles(setting);

  const selectedSchedule = useSelector((state: RootState) => state.app.schedule);
  const [billList, setBillList] = useState<Bill[]>([]);
  const memberList = useSelector((state: RootState) => state.app.memberList);
  const paymentItemList = useRef<PaymentItem[]>([]);

  const animationLinearGradient = useRef(new Animated.Value(0)).current;
  const [detailView, setDetailView] = useState<boolean>(false);

  const customerSetting = useSelector((state: RootState) => state.app.customerSetting);
  const [cuttingYn, setCuttingYn] = useState<boolean>(customerSetting.cuttingYn === 'Y' ? true : false);
  const payerSend = useRef<String>(customerSetting.payerSendYn);

  const dim = useRef<boolean>(false);

  useEffect(() => {
    AsyncStorage.getItem('first-bill').then(value => {
      if (!value) {
        AsyncStorage.setItem('first-bill', 'notFirst');
        opeHelpModal();
      }
    });
  }, []);

  // 데이터 로딩
  useEffect(() => {
    api.get('/api/paymentItems/list?scheduleId=' + selectedSchedule.scheduleId).then(res => {
      if (res.status === 'SUCCESS') {
        paymentItemList.current = res.data;
        calculateBills();
      }
    });
  }, []);

  const calculateBills = useCallback(() => {
    const accountByMemberId: MemberAcount = {};
    memberList.forEach(m => {
      if (m.account) accountByMemberId[m.memberId] = m.account;
    });
    const temp: BillObj = {};

    paymentItemList.current.forEach(item => {
      const pay = MoneyFix(item.cost, item.members.length);

      // 결제자 처리
      if (temp[item.payerId]) {
        temp[item.payerId].paid += item.cost;
        temp[item.payerId].total = temp[item.payerId].paid - temp[item.payerId].pay;
      } else {
        temp[item.payerId] = {
          memberId: item.payerId,
          name: item.payer,
          paid: item.cost,
          pay: 0,
          total: item.cost,
          info: [],
        };
      }

      // 멤버 처리
      item.members.forEach(m => {
        const detail: MoneyInfo = {
          name: item.title,
          cost: pay,
          type: 'sell',
        };
        if (temp[m.memberId]) {
          temp[m.memberId].pay += pay;
          temp[m.memberId].total = temp[m.memberId].paid - temp[m.memberId].pay;
          temp[m.memberId].info.push(detail);
        } else {
          temp[m.memberId] = {
            memberId: m.memberId,
            name: m.name,
            paid: 0,
            pay: pay,
            total: -pay,
            info: [detail],
          };
        }
      });
    });

    const all = Object.entries(temp).map(([key, value]) => ({ ...value, total: value.paid - value.pay }));
    let senders = all.filter(i => i.total < 0).sort((a, b) => b.total - a.total);
    let receivers = all.filter(i => i.total > 0).sort((a, b) => b.total - a.total);

    if (payerSend.current === 'Y') {
      // 정산 계산 함수(정산자 포함)
      while (receivers.length > 0) {
        const receiver = receivers[0];
        const senderList = Object.entries(temp).filter((i, _) => i[1].total < 0);
        senderList.forEach(i => {
          const sender: Bill = i[1];
          const transferable = -sender.total;

          temp[receiver.memberId].total = temp[receiver.memberId].total - transferable;
          temp[receiver.memberId].info.push({ name: sender.name, cost: transferable, type: 'receive' });

          temp[sender.memberId].total = 0;
          temp[sender.memberId].info.push({
            name: receiver.name,
            cost: transferable,
            type: 'send',
            account: accountByMemberId[receiver.memberId],
          });
        });
        receivers.shift();
      }

      const list: Bill[] = Object.entries(temp)
        .sort((a, b) => b[1].paid - a[1].paid)
        .map(([_, value]) => value);
      setBillList(list.sort((a, b) => a.name.localeCompare(b.name)));
    } else {
      // 정산 계산 함수(정산자 미포함)
      let senderIndex = 0;
      let receiverIndex = 0;

      while (senderIndex < senders.length && receiverIndex < receivers.length) {
        const s = senders[senderIndex];
        const r = receivers[receiverIndex];

        if (s.total >= 0) {
          senderIndex++;
          continue;
        }
        if (r.total <= 0) {
          receiverIndex++;
          continue;
        }

        const transferable = Math.min(r.total, -s.total);

        s.info.push({
          name: r.name,
          cost: transferable,
          type: 'send',
          account: accountByMemberId[r.memberId],
        });
        r.info.push({ name: s.name, cost: transferable, type: 'receive' });

        s.total += transferable;
        r.total -= transferable;

        if (s.total === 0) senderIndex++;
        if (r.total === 0) receiverIndex++;
      }

      const list = [...senders, ...receivers];
      setBillList(list.sort((a, b) => a.name.localeCompare(b.name)));
    }
  }, [payerSend]);

  // 렌더링 함수 분리
  const renderBillItem = useCallback(
    (item: Bill, idx: number) => {
      if (!detailView && !item.info.some(i => i.type == 'send')) {
        return;
      }
      item.paid = Math.round(item.paid);
      item.pay = Math.round(item.pay);
      item.total = Math.round(item.total);
      return (
        <View key={idx}>
          <AppTouchableOpacity
            style={[
              globalStyles.shadow,
              globalStyles.borderRadius,
              styles.paymentCard,
              globalStyles.ml16,
              globalStyles.mr16,
              globalStyles.mt8,
              globalStyles.mb16,
            ]}
            onPress={() => sendBill(item)}
            onLongPress={() => setDetailView(!detailView)}
            delayLongPress={500}>
            <AppText
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[fontStyles.bold, fontStyles.s16, fontStyles.mainColor, styles.textSetting]}>
              {item.name}
              <AppText style={[fontStyles.regular, fontStyles.s12, globalStyles.mt4]}>님</AppText>
            </AppText>
            {detailView && (
              <>
                {item.info
                  .filter((info, _) => info.type === 'sell')
                  .map((info, idx) => {
                    info.cost = Math.round(info.cost);
                    return (
                      <View key={idx}>
                        <View style={globalStyles.row}>
                          <AppText
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={[fontStyles.regular, fontStyles.s16, fontStyles.darkGray, styles.textSetting]}>
                            {info.name}
                          </AppText>
                          <View style={styles.underLine} />
                          <AppText style={[fontStyles.regular, fontStyles.s14, fontStyles.darkGray, globalStyles.mt2]}>
                            {MoneyFormat(info.cost.toString())}
                          </AppText>
                          <AppText style={[fontStyles.regular, fontStyles.s14, fontStyles.darkGray, globalStyles.mt2]}>
                            원
                          </AppText>
                        </View>
                      </View>
                    );
                  })}
                {item.pay > 0 && (
                  <View style={[globalStyles.row, globalStyles.mt8]}>
                    <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.darkGray, globalStyles.mt2]}>
                      이용 금액
                    </AppText>
                    <View style={styles.underLine} />
                    <AppText style={[fontStyles.medium, fontStyles.s14, fontStyles.darkGray, globalStyles.mt2]}>
                      {MoneyFormat(item.pay.toString())}원
                    </AppText>
                  </View>
                )}
                {item.paid > 0 && (
                  <View style={globalStyles.row}>
                    <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.darkGray, globalStyles.mt2]}>
                      결제 금액
                    </AppText>
                    <View style={styles.underLine} />
                    <AppText style={[fontStyles.medium, fontStyles.s14, fontStyles.darkGray, globalStyles.mt2]}>
                      {MoneyFormat(item.paid.toString())}원
                    </AppText>
                  </View>
                )}
                <View style={globalStyles.mt8} />
              </>
            )}
            {item.info
              .filter((info, _) => info.type === 'send')
              .map((info, idx) => {
                info.cost = Math.round(info.cost);
                let cost = info.cost;
                if (cuttingYn && customerSetting.cutting !== 0) {
                  const temp = customerSetting.cutting * 10;
                  cost = Math.floor(cost / temp) * temp;
                }
                return (
                  <View key={idx}>
                    <View style={globalStyles.row}>
                      <AppText
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[fontStyles.bold, fontStyles.s16, fontStyles.darkGray, styles.textSetting]}>
                        {info.name}
                      </AppText>
                      <AppText style={[fontStyles.regular, fontStyles.s12, fontStyles.darkGray, globalStyles.mt4]}>
                        님에게
                      </AppText>
                      <View style={styles.underLine} />
                      <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.darkGray, globalStyles.mr4]}>
                        {MoneyFormat(cost.toString())}
                        <AppText style={[fontStyles.regular, fontStyles.s14, globalStyles.mt2]}>원</AppText>
                      </AppText>
                      <AppText style={[fontStyles.bold, fontStyles.s16, fontStyles.mainColor]}>보내기</AppText>
                    </View>
                    {info.account && (
                      <AppText style={[fontStyles.regular, fontStyles.s12, fontStyles.darkGray]}>
                        (입금정보 : {info.account})
                      </AppText>
                    )}
                  </View>
                );
              })}
            {detailView &&
              item.info
                .filter((info, _) => info.type === 'receive')
                .map((info, idx) => {
                  info.cost = Math.round(info.cost);
                  let cost = info.cost;
                  if (cuttingYn && customerSetting.cutting !== 0) {
                    const temp = customerSetting.cutting * 10;
                    cost = Math.floor(cost / temp) * temp;
                  }
                  return (
                    <View key={idx}>
                      <View style={globalStyles.row}>
                        <AppText
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={[fontStyles.bold, fontStyles.s16, fontStyles.darkGray, styles.textSetting]}>
                          {info.name}
                        </AppText>
                        <AppText style={[fontStyles.regular, fontStyles.s12, fontStyles.darkGray, globalStyles.mt4]}>
                          님에게
                        </AppText>
                        <View style={styles.underLine} />
                        <AppText style={[fontStyles.medium, fontStyles.s16, fontStyles.darkGray, globalStyles.mr4]}>
                          {MoneyFormat(cost.toString())}
                          <AppText style={[fontStyles.regular, fontStyles.s14, globalStyles.mt2]}>원</AppText>
                        </AppText>
                        <AppText style={[fontStyles.bold, fontStyles.s16, fontStyles.red]}>받기</AppText>
                      </View>
                    </View>
                  );
                })}
          </AppTouchableOpacity>
          {idx == billList.length - 1 && <View style={{ height: 80 * setting.scale + setting.bottom }} />}
        </View>
      );
    },
    [globalStyles, fontStyles, styles, detailView],
  );

  const startHelp = () => {
    nextHelpStep(() => {
      switch (helpStep.current) {
        case 1:
          const temp: PaymentItem = {
            scheduleId: '',
            paymentId: 0,
            payer: '정산자',
            payerId: 999999,
            title: '아이스아메리카노',
            cost: 12000,
            acceptYn: true,
            members: [
              { name: '정산자', scheduleId: '', paymentId: 0, memberId: 999999 },
              { name: '이용자', scheduleId: '', paymentId: 0, memberId: 999998 },
            ],
          };
          paymentItemList.current = [temp, ...paymentItemList.current];
          calculateBills();
          break;
        case 4:
          paymentItemList.current = paymentItemList.current.slice(1);
          calculateBills();
          break;
      }
    });
  };

  const sendBill = async (item: Bill) => {
    if (dim.current) return;
    dim.current = true;
    setTimeout(() => {
      dim.current = false;
    }, 1000);
    if (!detailView && !item.info.some(i => i.type == 'send')) {
      return;
    }
    let sendMessase = '정산내역입니다!\n《✨' + item.name + '님✨》\n';
    if (detailView) {
      item.info
        .filter((info, _) => info.type === 'sell')
        .forEach((info, idx) => {
          info.cost = Math.round(info.cost);
          sendMessase += info.name + ' : ' + MoneyFormat(info.cost.toString()) + '원\n';
        });
      if (item.info.length > 0) {
        sendMessase += '\n';
      }
      if (item.pay > 0) {
        sendMessase += '이용 금액 : ' + MoneyFormat(item.pay.toString()) + '원\n';
      }
      if (item.paid > 0) {
        sendMessase += '결제 금액 : ' + MoneyFormat(item.paid.toString()) + '원\n';
      }
      if (item.info.length > 0) {
        sendMessase += '\n';
      }
    }

    item.info
      .filter((info, _) => info.type === 'send')
      .forEach((info, _) => {
        info.cost = Math.round(info.cost);
        let cost = info.cost;
        if (cuttingYn && customerSetting.cutting !== 0) {
          const temp = customerSetting.cutting * 10;
          cost = Math.floor(cost / temp) * temp;
        }
        sendMessase += info.name + '님에게 ' + MoneyFormat(cost.toString()) + '원 보내기';
        if (info.account) {
          sendMessase += '\n(입금정보 : ' + info.account + ')';
        }
      });

    if (detailView) {
      item.info
        .filter((info, _) => info.type === 'receive')
        .forEach((info, idx) => {
          info.cost = Math.round(info.cost);
          let cost = info.cost;
          if (cuttingYn && customerSetting.cutting !== 0) {
            const temp = customerSetting.cutting * 10;
            cost = Math.floor(cost / temp) * temp;
          }
          sendMessase += info.name + '님에게 ' + MoneyFormat(cost.toString()) + '원 받기';
        });
    }
    await Share.share({
      message: sendMessase,
    });
  };

  const sendAllBill = async () => {
    if (dim.current) return;
    dim.current = true;
    setTimeout(() => {
      dim.current = false;
    }, 1000);
    let sendMessase = '정산내역입니다!\n';
    billList.forEach(item => {
      if (!detailView && !item.info.some(i => i.type == 'send')) {
        return;
      }
      sendMessase += '\n《✨' + item.name + '님✨》\n';
      if (detailView) {
        item.info
          .filter((info, _) => info.type === 'sell')
          .forEach((info, idx) => {
            info.cost = Math.round(info.cost);
            sendMessase += info.name + ' : ' + MoneyFormat(info.cost.toString()) + '원\n';
          });
        if (item.info.length > 0) {
          sendMessase += '\n';
        }
        if (item.pay > 0) {
          sendMessase += '이용 금액 : ' + MoneyFormat(item.pay.toString()) + '원\n';
        }
        if (item.paid > 0) {
          sendMessase += '결제 금액 : ' + MoneyFormat(item.paid.toString()) + '원\n';
        }
        if (item.info.length > 0) {
          sendMessase += '\n';
        }
      }

      item.info
        .filter((info, _) => info.type === 'send')
        .forEach((info, _) => {
          info.cost = Math.round(info.cost);
          let cost = info.cost;
          if (cuttingYn && customerSetting.cutting !== 0) {
            const temp = customerSetting.cutting * 10;
            cost = Math.floor(cost / temp) * temp;
          }
          sendMessase += info.name + '님에게 ' + MoneyFormat(cost.toString()) + '원 보내기';
          if (info.account) {
            sendMessase += '(입금정보 : ' + info.account + ')';
          }
          sendMessase += '\n';
        });

      if (detailView) {
        item.info
          .filter((info, _) => info.type === 'receive')
          .forEach((info, idx) => {
            info.cost = Math.round(info.cost);
            let cost = info.cost;
            if (cuttingYn && customerSetting.cutting !== 0) {
              const temp = customerSetting.cutting * 10;
              cost = Math.floor(cost / temp) * temp;
            }
            sendMessase += info.name + '님에게 ' + MoneyFormat(cost.toString()) + '원 받기\n';
          });
      }
    });
    await Share.share({
      message: sendMessase,
    });
  };

  return (
    <View style={[globalStyles.wrap, globalStyles.pb0]}>
      <StatusBar barStyle="dark-content" />
      <AppHeader
        rightImg={require('@images/back.png')}
        rightPress={() => navigation.goBack()}
        leftImg={cuttingYn ? require('@images/knighfOn.png') : require('@images/knighfOff.png')}
        leftPress={() => setCuttingYn(!cuttingYn)}
      />
      <View style={[styles.scrollBox, globalStyles.mt8]}>
        <AppScrollView
          scrollEventThrottle={16}
          onScroll={e => {
            const contentOffset = e.nativeEvent.contentOffset;
            if (contentOffset.y < 16 * setting.scale) {
              animationLinearGradient.setValue(0);
            } else {
              animationLinearGradient.setValue(1);
            }
          }}>
          <AppLinearGradient
            style={{ top: 0, transform: [{ rotate: '180deg' }] }}
            animation={true}
            animationStyle={{ opacity: animationLinearGradient }}
          />
          {billList.map(renderBillItem)}
          <View style={styles.empty} />
        </AppScrollView>
      </View>
      {customerSetting.helpYn === 'Y' && (
        <AppTouchableOpacity style={[globalStyles.shadow, globalStyles.fab, globalStyles.fab_l]} onPress={opeHelpModal}>
          <Image style={globalStyles.img40} source={require('@images/help.png')} />
        </AppTouchableOpacity>
      )}
      <AppTouchableOpacity style={[globalStyles.shadow, globalStyles.fab, globalStyles.fab_r]} onPress={sendAllBill}>
        <Image style={globalStyles.img40} source={require('@images/share.png')} />
      </AppTouchableOpacity>
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
