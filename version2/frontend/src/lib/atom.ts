import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import deepEqual from "fast-deep-equal";

// async atomをatomFamilyで作成する際に、比較関数をdeep equalにしないと無限ループが発生する
// オブジェクト同士の比較ができずに常に再計算されるため
export const eventAtom = atomFamily(
    ({ eventId }: { eventId: string | null }) => {
        return atom(async () => {
            if (!eventId) return null;
            const response = await fetch("/api/event/get", {
                method: "POST",
                body: JSON.stringify({ event_id: eventId }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return await response.json();
        });
    },
    deepEqual,
);

export const eventListAtom = atom(async () => {
    const response = await fetch("/api/event/list", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return await response.json();
});

export const performanceAtom = atomFamily(
    ({
        eventId,
        performanceOrder,
    }: {
        eventId: string | null;
        performanceOrder: number | null;
    }) => {
        return atom(async () => {
            if (!eventId || !performanceOrder) return null;
            const response = await fetch("/api/performance/get", {
                method: "POST",
                body: JSON.stringify({
                    event_id: eventId,
                    performance_order: performanceOrder,
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
