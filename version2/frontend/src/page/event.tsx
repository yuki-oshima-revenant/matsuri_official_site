import { useParams } from "react-router";
import { eventAtom } from "../lib/atom/event";
import { performanceListInEventAtom } from "../lib/atom/performance";
import { useAtomValue } from "jotai";
import { PiMapPinSimple, PiCalendarBlank, PiClock } from "react-icons/pi";
import { useNavigate } from "react-router";
import {
    formatEventDate,
    formatPerformanceTime,
    getPerformanceDurationMinutes,
} from "../lib/util/date";
import { ArchiveBreadcrumb } from "../lib/component/breadcrumb";

const pageHeaderHeight = 72;

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
        <div className="h-full">
            <div
                className="mb-6"
                style={{
                    height: pageHeaderHeight,
                }}
            >
                <div className="mb-2">
                    <ArchiveBreadcrumb event={null} />
                </div>
                <div className="flex">
                    <h2 className="text-3xl md:text-4xl font-bold h-auto my-auto tracking-tight">
                        {title}
                    </h2>
                    <div className="grow" />
                    <div className="text-sm text-zinc-400 flex flex-col gap-1">
                        <div className="flex gap-2">
                            <PiCalendarBlank
                                size={14}
                                className="h-auto my-auto"
                            />
                            {formatEventDate(date)}
                        </div>
                        <div className="flex gap-2">
                            <PiMapPinSimple
                                size={14}
                                className="h-auto my-auto"
                            />
                            {place}
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full"
                style={{
                    height: `calc(100% - ${pageHeaderHeight}px - 24px)`,
                }}
            >
                <div className="col-span-1">
                    <img
                        src={`https://delivery.unronritaro.net/matsuri/image/flyer/${eventId}.png`}
                    />
                </div>
                <div className="flex flex-col gap-4 h-full overflow-y-auto col-span-1">
                    {performances.map(
                        ({
                            performanceOrder,
                            performerName,
                            startTime,
                            endTime,
                        }) => (
                            <div
                                key={performanceOrder}
                                className="p-6 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 cursor-pointer duration-200 ease-in-out"
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
                                        <div className="text-sm text-zinc-400">
                                            <div className="flex gap-1">
                                                <PiClock
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
                                        <div className="text-sm text-zinc-400 flex flex-col gap-1">
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
