import { useParams } from "react-router";
import { eventAtom } from "../lib/atom";
import { useAtomValue } from "jotai";

export const Event = () => {
    const params = useParams<{ eventid: string }>();
    const event = useAtomValue(eventAtom({ eventId: params.eventid ?? null }));
    return (
        <div>
            <div>{params.eventid}</div>
            <textarea value={JSON.stringify(event)} />
        </div>
    );
};
