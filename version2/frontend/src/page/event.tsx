import { useParams } from "react-router";
import { eventAtom, performanceListInEventAtom } from "../lib/atom";
import { useAtomValue } from "jotai";
import { MapPinSimple, CalendarBlank } from "@phosphor-icons/react";
import { useNavigate } from "react-router";

export const Event = () => {
    const params = useParams<{ eventid: string }>();
    const event = useAtomValue(eventAtom({ eventId: params.eventid ?? null }));
    const performances = useAtomValue(
        performanceListInEventAtom({
            eventId: params.eventid ?? null,
        }),
    );
    const navigate = useNavigate();

    if (!event) return null;
    const { eventId, title, date, place } = event;
    return (
        <div>
            <div className="flex mb-4">
                <h2 className="text-4xl h-auto my-auto tracking-tight">
                    {title}
                </h2>
                <div className="grow" />
                <div className="text-sm text-gray-300 flex flex-col gap-1">
                    <div className="flex gap-2">
                        <CalendarBlank size={14} className="h-auto my-auto" />
                        {date}
                    </div>
                    <div className="flex gap-2">
                        <MapPinSimple size={14} className="h-auto my-auto" />
                        {place}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <img
                    src={`https://delivery.unronritaro.net/matsuri/image/flyer/${eventId}.png`}
                />
                <div className="flex flex-col gap-4">
                    {performances.map(
                        ({
                            performanceOrder,
                            performerName,
                            startTime,
                            endTime,
                        }) => (
                            <div
                                key={performanceOrder}
                                className="p-6 rounded-lg hover:bg-gray-800 border border-gray-700 cursor-pointer duration-200 ease-in-out"
                                onClick={() => {
                                    navigate(`${performanceOrder}`);
                                }}
                            >
                                <div className="flex gap-4">
                                    <div className="h-auto my-auto text-lg">
                                        {`${performanceOrder}.`}
                                    </div>
                                    <div className="text-xl font-bold h-auto my-auto">
                                        {performerName}
                                    </div>
                                    <div className="grow" />
                                    <div className="text-sm text-gray-300 flex flex-col gap-2">
                                        <div>{startTime}</div>
                                        <div>{endTime}</div>
                                    </div>
                                </div>
                            </div>
                        ),
                    )}
                </div>
            </div>
        </div>
    );
};
