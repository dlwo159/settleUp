import React, { memo, useMemo, useCallback } from 'react';
import { View, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Schedule } from '@/@types/Types';
import { ContrastColor, DarkenColor } from '@/common/CommonUtils';
import { AppText, AppTouchableOpacity } from '@/components';

type Props = {
  item: Schedule;
  viewType: String;
  scale: number;
  globalStyles: any;
  styles: any;
  fontStyles: any;
  onPress: (item: Schedule) => void;
  onLongPress: (item: Schedule) => void;
};

const ScheduleRenderItem = memo(
  function ScheduleItem({ item, viewType, scale, globalStyles, styles, fontStyles, onPress, onLongPress }: Props) {
    const colorType = useMemo(() => ContrastColor(item.color), [item.color]);
    const colors = useMemo(() => [item.color, DarkenColor(item.color, 15), DarkenColor(item.color, 35)], [item.color]);
    const bgStyle = useMemo(() => ({ backgroundColor: item.color }), [item.color]);

    const handlePress = useCallback(() => onPress(item), [onPress, item]);
    const handleLong = useCallback(() => onLongPress(item), [onLongPress, item]);

    return (
      <View>
        <AppTouchableOpacity
          style={[
            styles.itemBox,
            viewType == '1' ? styles.itemBox1 : scale === 1 ? styles.itemBox2 : styles.itemBox3,
            globalStyles.shadow,
            bgStyle,
          ]}
          onPress={handlePress}
          onLongPress={handleLong}
          delayLongPress={500}>
          <LinearGradient
            style={globalStyles.flex1}
            colors={colors}
            locations={[0, 0.7, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <View style={styles.infoBox}>
              <AppText style={[fontStyles.medium, fontStyles.s12, { color: colorType }]}>{item.date}</AppText>
              <AppText
                ellipsizeMode="tail"
                numberOfLines={viewType == '1' ? 1 : 2}
                style={[fontStyles.bold, fontStyles.s20, { color: colorType }]}>
                {item.title}
              </AppText>
            </View>
            <Image style={[globalStyles.img20, styles.imgBox]} source={require('@images/next.png')} />
          </LinearGradient>
        </AppTouchableOpacity>
      </View>
    );
  },
  (prev, next) => {
    return (
      prev.globalStyles === next.globalStyles &&
      prev.styles === next.styles &&
      prev.item.scheduleId === next.item.scheduleId &&
      prev.item.color === next.item.color &&
      prev.item.title === next.item.title &&
      prev.item.date === next.item.date &&
      prev.item.totalCost === next.item.totalCost &&
      prev.viewType === next.viewType
    );
  },
);

export default ScheduleRenderItem;
