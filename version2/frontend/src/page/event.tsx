import { useParams } from "react-router";
import { eventAtom } from "../lib/atom/event";
import { performanceListInEventAtom } from "../lib/atom/performance";
import { useAtomValue } from "jotai";
import { MapPinSimple, CalendarBlank, Clock } from "@phosphor-icons/react";
import { useNavigate } from "react-router";
import {
    formatEventDate,
    formatPerformanceTime,
    getPerformanceDurationMinutes,
} from "../lib/util/date";
import { ArchiveBreadcrumb } from "../lib/component/breadcrumb";

export const EventPage = () => {
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
            <div className="mb-2">
                <ArchiveBreadcrumb event={null} />
            </div>
            <div className="flex mb-6">
                <h2 className="text-4xl font-bold h-auto my-auto tracking-tight">
                    {title}
                </h2>
                <div className="grow" />
                <div className="text-sm text-zinc-300 flex flex-col gap-1">
                    <div className="flex gap-2">
                        <CalendarBlank size={14} className="h-auto my-auto" />
                        {formatEventDate(date)}
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
                                className="p-6 rounded-lg hover:bg-zinc-800 border border-zinc-700 cursor-pointer duration-200 ease-in-out"
                                onClick={() => {
                                    navigate(`${performanceOrder}`);
                                }}
                            >
                                <div className="flex gap-4">
                                    <div className="h-auto my-auto text-lg">
                                        {`${performanceOrder}.`}
                                    </div>
                                    <div className="h-auto my-auto">
                                        <div className="text-xl font-bold ">
                                            {performerName}
                                        </div>
                                        <div className="text-sm text-zinc-300">
                                            <div className="flex gap-1">
                                                <Clock
                                                    size={14}
                                                    className="h-auto my-auto"
                                                />
                                                {`${getPerformanceDurationMinutes(
                                                    startTime,
                                                    endTime,
                                                )} min`}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grow" />
                                    <div>
                                        <div className="text-sm text-zinc-300 flex flex-col gap-1">
                                            <div>
                                                {formatPerformanceTime(
                                                    startTime,
                                                )}
                                            </div>
                                            <div>
                                                {formatPerformanceTime(endTime)}
                                            </div>
                                        </div>
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
