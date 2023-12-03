import { addWeeks, format, subDays } from 'date-fns';


export const calculateSchedule = (jsonData, startDate) => {
    const schedule = [];
    const start = new Date(startDate);

    for (let week = 1; week <= 40; week++) {
        const weekStart = addWeeks(start, week - 1);
        const weekEnd = subDays(addWeeks(start, week), 1);

        const weekData = jsonData[week - 1];
        const notes = {
            mark: weekData.mark,
            checkups: weekData.checkups,
            attention: weekData.attention
        };

        schedule.push({
            week: `Week ${week}`,
            startDate: format(weekStart, 'yyyy-MM-dd'),
            endDate: format(weekEnd, 'yyyy-MM-dd'),
            notes: notes // 存储每周的具体信息
        });
    }

    return schedule;
};
