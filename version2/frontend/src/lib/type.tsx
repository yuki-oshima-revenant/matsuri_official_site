export type Event = {
    eventId: string;
    date: number;
    place: string;
    title: string;
};

export type Performance = {
    eventId: string;
    performanceOrder: number;
    performerName: string;
    startTime: number;
    endTime: number;
    trackList: {
        artist: string;
        title: string;
    }[];
};
