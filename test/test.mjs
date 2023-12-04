import { addWeeks, format, subDays, isWithinInterval } from 'date-fns';

const today = new Date();

const isCurrentWeek = isWithinInterval(today, { start: new Date('2023-12-01'), end: new Date('2023-12-05') });
console.log("🚀 ~ file: test.mjs:5 ~ isCurrentWeek:", isCurrentWeek, new Date(), { start: new Date('2023-12-01'), end: new Date('2023-12-05') });
