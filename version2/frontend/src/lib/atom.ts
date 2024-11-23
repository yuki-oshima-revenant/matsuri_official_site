import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import deepEqual from "fast-deep-equal";

type Event = {
    eventId: string;
    date: string;
    place: string;
    title: string;
};

// async atomをatomFamilyで作成する際に、比較関数をdeep equalにしないと無限ループが発生する
// オブジェクト同士の比較ができずに常に再計算されるため
export const eventAtom = atomFamily(
    ({ eventId }: { eventId: string | null }) => {
        return atom<Promise<Event> | null>(async () => {
            if (!eventId) return null;
            const response = await fetch("/api/event/get", {
                method: "POST",
                body: JSON.stringify({ eventId }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return await response.json();
        });
    },
    deepEqual,
);

export const eventListAtom = atom<Promise<Event[]>>(async () => {
    const response = await fetch("/api/event/list", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return await response.json();
});

type Performance = {
    eventId: string;
    performanceOrder: number;
    performerName: string;
    startTime: string;
    endTime: string;
    trackList: {
        artist: string;
        title: string;
    }[];
};

export const performanceAtom = atomFamily(
    ({
        eventId,
        performanceOrder,
    }: {
        eventId: string | null;
        performanceOrder: number | null;
    }) => {
        return atom<Promise<Performance> | null>(async () => {
            if (!eventId || !performanceOrder) return null;
            const response = await fetch("/api/performance/get", {
                method: "POST",
                body: JSON.stringify({
                    eventId,
                    performanceOrder,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return await response.json();
        });
    },
    deepEqual,
);

export const performanceListInEventAtom = atomFamily(
    ({ eventId }: { eventId: string | null }) =>
        atom<Promise<Performance[]>>(async () => {
            if (!eventId) return [];
            const response = await fetch("/api/performance/list_in_event", {
                method: "POST",
                body: JSON.stringify({ eventId }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return await response.json();
        }),
    deepEqual,
);

export enum MediaFormat {
    AUDIO = "audio",
    VIDEO = "video",
}

export const performanceMediaUrlAtom = atomFamily(
    ({
        eventId,
        performanceOrder,
        mediaFormat,
    }: {
        eventId: string | null;
        performanceOrder: number | null;
        mediaFormat: MediaFormat;
    }) => {
        return atom<
            Promise<{
                url: string;
            }>
        >(async () => {
            if (!eventId || !performanceOrder) return null;
            const response = await fetch("/api/media/get_url", {
                method: "POST",
                body: JSON.stringify({
                    eventId,
                    performanceOrder,
                    mediaFormat,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return await response.json();
        });
    },
    deepEqual,
);
