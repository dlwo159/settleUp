import React, { memo, useCallback } from 'react';
import { Image } from 'react-native';
import { ScheduleMember } from '@/@types/Types';
import { AppText, AppTouchableOpacity } from '@/components';

type Props = {
  index: number;
  item: ScheduleMember;
  length: number;
  globalStyles: any;
  styles: any;
  fontStyles: any;
  onPress: (item: ScheduleMember) => void;
  onLongPress: (item: ScheduleMember) => void;
};

const MemberRenderItem = memo(
  function MemberItem({ index, item, length, globalStyles, styles, fontStyles, onPress, onLongPress }: Props) {
    const handlePress = useCallback(() => onPress(item), [onPress, item]);
    const handleLong = useCallback(() => onLongPress(item), [onLongPress, item]);

    return (
      <AppTouchableOpacity
        style={[
          styles.bgMemberCard,
          globalStyles.borderRadius,
          globalStyles.mt8,
          globalStyles.pt8,
          globalStyles.pb8,
          globalStyles.pr12,
          globalStyles.pl12,
          index === 0 && globalStyles.ml12,
          index < length - 1 && globalStyles.mr8,
          index === length - 1 && globalStyles.mr12,
        ]}
        onPress={handlePress}
        onLongPress={handleLong}
        delayLongPress={500}>
        {item.payerYn && <Image style={styles.coinImg} source={require('@images/coin.png')} />}
        <AppText style={[fontStyles.medium, fontStyles.s14, fontStyles.memberColor]}>{item.name}</AppText>
      </AppTouchableOpacity>
    );
  },
  (prev, next) => {
    return (
      prev.globalStyles === next.globalStyles &&
      prev.styles === next.styles &&
      prev.item.scheduleId === next.item.scheduleId &&
      prev.item.memberId === next.item.memberId &&
      prev.item.name === next.item.name &&
      prev.item.payerYn === next.item.payerYn &&
      prev.item.account === next.item.account &&
      prev.length === next.length
    );
  },
);

export default MemberRenderItem;
