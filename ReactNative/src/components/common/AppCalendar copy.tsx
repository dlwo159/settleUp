import { Calendar, LocaleConfig } from 'react-native-calendars';
import Color from '@/css/ColorStyle';

LocaleConfig.locales['ko'] = {
  monthNames: [
    '01월',
    '02월',
    '03월',
    '04월',
    '05월',
    '06월',
    '07월',
    '08월',
    '09월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

interface AppCalendarProps {
  onPress?: (day: { dateString: string; [key: string]: any }) => void;
  markedDates?: {
    [date: string]: {
      selected?: boolean;
      marked?: boolean;
      selectedColor?: string;
    };
  };
  current: string;
}

const AppCalendar = ({ onPress, markedDates, current }: AppCalendarProps) => {
  return (
    <Calendar
      current={current}
      onDayPress={onPress}
      markedDates={markedDates}
      theme={{
        todayTextColor: Color.main,
        arrowColor: Color.main,
        selectedDayBackgroundColor: Color.main,
        selectedDayTextColor: Color.white,
        monthTextColor: Color.black,
        textDayFontFamily: 'Pretendard-Medium',
        textMonthFontFamily: 'Pretendard-Medium',
        textDayHeaderFontFamily: 'Pretendard-Medium',
      }}
      firstDay={0}
      monthFormat={'yyyy년 M월'}
    />
  );
};

export default AppCalendar;
