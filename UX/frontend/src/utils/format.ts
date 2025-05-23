import dayjs, { Dayjs } from 'dayjs';
//const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/


/*
* Date formatter:
* Format a date of format "2000-01-01"
* Into a common phrase "1st of January"
*/
export function formatDate(date: Dayjs): string {
  const dayjsDate = dayjs(date);
  function getOrdinal(n: number): string {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }
  return `${getOrdinal(dayjsDate.date())} of ${dayjsDate.format('MMMM')}`;
}