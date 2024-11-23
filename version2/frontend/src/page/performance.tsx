import { useParams } from "react-router";
import { performanceAtom } from "../lib/atom";
import { useAtomValue } from "jotai";

export const Performance = () => {
    const params = useParams<{ eventid: string; performanceorder: string }>();
    const performance = useAtomValue(
        performanceAtom({
            eventId: params.eventid ?? null,
            performanceOrder: Number(params.performanceorder ?? 0),
        }),
    );

    return (
        <div>
            <div>{params.eventid}</div>
            <div>{params.performanceorder}</div>
            <textarea value={JSON.stringify(performance)} />
        </div>
    );
};
