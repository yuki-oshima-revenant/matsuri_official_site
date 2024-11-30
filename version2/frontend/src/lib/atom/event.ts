import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import deepEqual from "fast-deep-equal";
import { Event } from "../type";

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
