import { format, parse } from "date-fns";

export const formatEventDate = (date: number) => {
    const parsed = parse(String(date), "yyyyMMdd", new Date());
    return format(parsed, "yyyy/MM/dd");
};

const parsePerformanceTime = (time: number) => {
    return parse(String(time), "yyyyMMddHHmm", new Date());
};

export const formatPerformanceTime = (time: number) => {
    const date = parsePerformanceTime(time);
    return format(date, "HH:mm");
};

export const getPerformanceDurationMinutes = (
    startTime: number,
    endTime: number,
) => {
    const startDate = parsePerformanceTime(startTime);
    const endDate = parsePerformanceTime(endTime);
    const duration = endDate.getTime() - startDate.getTime();
    return duration / 1000 / 60;
};
