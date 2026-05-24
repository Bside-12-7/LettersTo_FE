type DateFormat = 'yyyy.mm.dd' | 'yy년 m월 d일' | 'HH:mm';

const pad2 = (n: number) => String(n).padStart(2, '0');

export const dateFormatter = (format: DateFormat, ISO: Date) => {
  const d = new Date(ISO);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const date = d.getDate();

  if (format === 'yyyy.mm.dd') {
    return `${year}.${month}.${date}`;
  }

  if (format === 'yy년 m월 d일') {
    return `${year - 2000}년 ${month}월 ${date}일`;
  }

  if (format === 'HH:mm') {
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  }
};

export const subDate = (x: Date, y: Date) => {
  const millisecond = x.getTime() - y.getTime();
  const days = Math.floor(millisecond / 1000 / 60 / 60 / 24);
  const hours = Math.floor((millisecond / 1000 / 60 / 60) % 24);
  const minutes = Math.floor((millisecond / 1000 / 60) % 24);

  return {days, hours, minutes};
};
