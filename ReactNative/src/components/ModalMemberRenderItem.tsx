import React, { memo, useCallback } from 'react';
import { Image } from 'react-native';
import { AppText, AppTouchableOpacity } from '@/components';

import { ScheduleMember } from '@/@types/Types';

type Props = {
  item: ScheduleMember;
  globalStyles: any;
  styles: any;
  fontStyles: any;
  onPress: () => void;
  onLongPress?: () => void;
};

const ModalPayerRenderItem = memo(
  function ModalPayerItem({ item, globalStyles, styles, fontStyles, onPress, onLongPress }: Props) {
    const handlePress = useCallback(() => onPress(), [onPress]);
    const handleLong = useCallback(() => onLongPress?.(), [onLongPress]);
    return (
      <AppTouchableOpacity
        style={[
          globalStyles.pt8,
          globalStyles.pb8,
          globalStyles.pr12,
          globalStyles.pl12,
          globalStyles.borderRadius,
          styles.memberBox1,
          item.checked && styles.memberBox2,
        ]}
        onPress={handlePress}
        onLongPress={handleLong}
        delayLongPress={500}>
        {item.payerYn && <Image style={styles.coinImg} source={require('@images/coin.png')} />}
        <AppText style={[fontStyles.medium, fontStyles.s14, item.checked ? fontStyles.white : fontStyles.black]}>
          {item.name}
        </AppText>
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
      prev.item.checked === next.item.checked
    );
  },
);

export default ModalPayerRenderItem;
