import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import deepEqual from "fast-deep-equal";
import { Performance } from "../type";

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
