import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import deepEqual from "fast-deep-equal";
import { Performance } from "../type";
import { request } from "../util/request";

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
            const response = await request({
                endpoint: "/performance/get",
                body: { eventId, performanceOrder },
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
            const response = await request({
                endpoint: "/performance/list_in_event",
                body: { eventId },
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
                status: number;
                url: string | null;
            } | null>
        >(async () => {
            if (!eventId || !performanceOrder) return null;
            const response = await request({
                endpoint: "/media/get_url",
                body: { eventId, performanceOrder, mediaFormat },
            });
            if (response.status === 404) {
                return {
                    status: 404,
                    url: null,
                };
            }
            const { url } = (await response.json()) as { url?: string };
            return {
                status: response.status,
                url: url || null,
            };
        });
    },
    deepEqual,
);
