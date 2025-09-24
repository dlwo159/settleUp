import React, { memo, useCallback } from 'react';
import { View } from 'react-native';

import { PaymentItem } from '@/@types/Types';
import { AppText, AppTouchableOpacity } from '@/components';

import { MoneyFix, MoneyFormat, MoneyFormat2 } from '@/common/CommonUtils';

type Props = {
  index: number;
  item: PaymentItem;
  globalStyles: any;
  styles: any;
  fontStyles: any;
  onPress: (item: PaymentItem) => void;
  onLongPress: (item: PaymentItem) => void;
  children?: React.ReactNode;
};

const PaymentItemRender = memo(
  function ScheduleItem({ index, item, globalStyles, styles, fontStyles, onPress, onLongPress, children }: Props) {
    const handlePress = useCallback(() => onPress(item), [onPress, item]);
    const handleLong = useCallback(() => onLongPress(item), [onLongPress, item]);

    return (
      <View style={[globalStyles.flex1, children && globalStyles.row]}>
        <AppTouchableOpacity
          style={[
            globalStyles.flex1,
            styles.bgPaymentCard,
            globalStyles.shadow,
            globalStyles.borderRadius,
            globalStyles.pt8,
            globalStyles.pb8,
            globalStyles.pl12,
            globalStyles.pr12,
            globalStyles.ml16,
            globalStyles.mr16,
            index == 0 && globalStyles.mt16,
            globalStyles.mb16,
          ]}
          onPress={handlePress}
          onLongPress={handleLong}
          delayLongPress={500}>
          <View style={globalStyles.row}>
            <AppText style={[fontStyles.bold, fontStyles.s16, fontStyles.mainColor, globalStyles.flex1]}>
              {item.title}
            </AppText>
            <AppText style={[fontStyles.bold, fontStyles.s16, fontStyles.black]}>
              {MoneyFormat2(MoneyFix(item.cost, item.members.length).toString())}
              <AppText style={[fontStyles.regular, fontStyles.s14, globalStyles.mt2]}>원</AppText>
            </AppText>
          </View>
          <View style={[styles.gapBox, globalStyles.row, globalStyles.mt4]}>
            {item.members.map((p, i) => {
              return (
                <View
                  style={[
                    globalStyles.pt4,
                    globalStyles.pb4,
                    globalStyles.pl8,
                    globalStyles.pr8,
                    globalStyles.borderRadius,
                    styles.bgMemberCard,
                  ]}
                  key={p.memberId}>
                  <AppText style={[fontStyles.regular, fontStyles.s14, fontStyles.memberColor]}>{p.name}</AppText>
                </View>
              );
            })}
          </View>
          <View style={[globalStyles.row, globalStyles.mt4]}>
            <AppText
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[fontStyles.regular, fontStyles.s14, fontStyles.darkGray, globalStyles.flex1]}>
              결제자 : {item.payer}
            </AppText>
            <AppText style={[fontStyles.regular, fontStyles.s14, fontStyles.darkGray]}>
              {MoneyFormat(item.cost.toString())}원
            </AppText>
          </View>
        </AppTouchableOpacity>
        {children && <View>{children}</View>}
      </View>
    );
  },
  (prev, next) => {
    return (
      prev.globalStyles === next.globalStyles &&
      prev.styles === next.styles &&
      prev.item.scheduleId === next.item.scheduleId &&
      prev.item.paymentId === next.item.paymentId &&
      prev.item.title === next.item.title &&
      prev.item.payer === next.item.payer &&
      prev.item.payerId === next.item.payerId &&
      prev.item.cost === next.item.cost &&
      prev.item.members === next.item.members
    );
  },
);

export default PaymentItemRender;
