export type User = {
    id: string;
    name: string;
    mailaddress: string;
    picture_url: string;
};

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
    googleDrive: {
        tracklistId: string | null;
        audioId: string | null;
        videoId: string | null;
    };
    trackList: {
        artist: string;
        title: string;
    }[];
};
