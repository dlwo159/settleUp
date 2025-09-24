export const DateFormat = (date: Date = new Date()): string => {
  const year: number = date.getFullYear();
  const month: string = (date.getMonth() + 1).toString().padStart(2, '0');
  const day: string = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const ContrastColor = (hexColor: string): '#333333' | '#FFFFFF' => {
  // # 제거
  const color = hexColor.replace('#', '');

  // RGB로 분해
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  // 밝기 계산 (W3C 방식)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // 밝으면 검정, 어두우면 흰색
  return luminance > 0.8 ? '#333333' : '#FFFFFF';
};

export const MoneyFix = (cost: number, length: number): number => cost / length;

export const MoneyFormat = (value: string): string => {
  const numeric = value.replace(/[^0-9]/g, ''); // 숫자만 남김
  if (!numeric) return '';
  const floatValue = parseFloat(numeric);
  if (isNaN(floatValue)) return '';
  return floatValue.toLocaleString('ko-KR', {
    maximumFractionDigits: 4, // 소수점 최대 4자리까지 표시
    minimumFractionDigits: numeric.includes('.') ? 1 : 0, // 소수점이 있으면 최소 1자리
  });
};

export const MoneyFormat2 = (value: string): string => {
  const numeric = value.replace(/[^0-9.]/g, ''); // 숫자와 .만 남김
  if (!numeric) return '';
  const floatValue = parseFloat(numeric);
  if (isNaN(floatValue)) return '';
  return floatValue.toLocaleString('ko-KR', {
    maximumFractionDigits: 4, // 소수점 최대 4자리까지 표시
    minimumFractionDigits: numeric.includes('.') ? 1 : 0, // 소수점이 있으면 최소 1자리
  });
};

export const RandomHexColor = (): string =>
  '#' +
  Array.from({ length: 3 })
    .map(() =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('');

// HEX → RGB 변환
function hexToRgb(hex: string) {
  const parsedHex = hex.replace('#', '');
  const bigint = parseInt(parsedHex, 16);
  const r = (bigint >> (8 * 2)) & 255;
  const g = (bigint >> (8 * 1)) & 255;
  const b = (bigint >> (8 * 0)) & 255;
  return { r, g, b };
}

// RGB → HEX 변환
function rgbToHex(r: number, g: number, b: number) {
  return (
    '#' +
    [r, g, b]
      .map(x => {
        const hex = x.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
      })
      .join('')
  );
}

// 색을 어둡게 만드는 함수 (percent는 어둡게 할 비율)
export const DarkenColor = (hex: string, percent: number) => {
  const { r, g, b } = hexToRgb(hex);
  const newR = Math.max(0, r - r * (percent / 100));
  const newG = Math.max(0, g - g * (percent / 100));
  const newB = Math.max(0, b - b * (percent / 100));
  return rgbToHex(Math.round(newR), Math.round(newG), Math.round(newB));
};
