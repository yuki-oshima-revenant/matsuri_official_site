import { useParams } from "react-router";
import {
    eventAtom,
    MediaFormat,
    performanceAtom,
    performanceMediaUrlAtom,
} from "../lib/atom";
import { useAtomValue } from "jotai";
import {
    formatPerformanceTime,
    getPerformanceDurationMinutes,
} from "../lib/util/date";
import { Clock, List, Microphone, VideoCamera } from "@phosphor-icons/react";

export const Performance = () => {
    const params = useParams<{ eventid: string; performanceorder: string }>();
    const event = useAtomValue(eventAtom({ eventId: params.eventid ?? null }));
    const performance = useAtomValue(
        performanceAtom({
            eventId: params.eventid ?? null,
            performanceOrder: Number(params.performanceorder ?? 0),
        }),
    );

    const audioUrl = useAtomValue(
        performanceMediaUrlAtom({
            eventId: params.eventid ?? null,
            performanceOrder: Number(params.performanceorder ?? 0),
            mediaFormat: MediaFormat.AUDIO,
        }),
    );

    const videoUrl = useAtomValue(
        performanceMediaUrlAtom({
            eventId: params.eventid ?? null,
            performanceOrder: Number(params.performanceorder ?? 0),
            mediaFormat: MediaFormat.VIDEO,
        }),
    );

    if (!event || !performance) return null;

    return (
        <div>
            <div className="mb-6 flex gap-2">
                <div>
                    <div className="mb-1 text-lg text-gray-300">
                        {event.title}
                    </div>
                    <div className="flex gap-2 text-4xl font-bold">
                        <div>{`${performance.performanceOrder}.`}</div>
                        <div>{performance.performerName}</div>
                    </div>
                </div>

                <div className="grow" />
                <div className="text-right flex flex-col gap-1">
                    <div className="text-lg text-gray-300 h-auto mt-auto">
                        <div className="flex justify-end gap-1">
                            <Clock size={18} className="h-auto my-auto" />
                            {`${getPerformanceDurationMinutes(performance.startTime, performance.endTime)} min`}
                        </div>
                    </div>
                    <div className="text-sm text-gray-300 flex gap-2">
                        <div>
                            {formatPerformanceTime(performance.startTime)}
                        </div>
                        <div>-</div>
                        <div>{formatPerformanceTime(performance.endTime)}</div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-6">
                    <div className="border border-gray-700 rounded-lg p-6">
                        <div className="flex gap-2 mb-6">
                            <Microphone size={20} className="h-auto my-auto" />
                            <div className="text-xl font-bold h-auto my-auto">
                                Audio
                            </div>
                        </div>
                        <div className="flex">
                            <audio
                                src={import.meta.env.PROD ? audioUrl.url : ""}
                                controls
                                className="grow"
                            />
                        </div>
                    </div>
                    <div className="border border-gray-700 rounded-lg p-6">
                        <div className="flex gap-2 mb-6">
                            <VideoCamera size={20} className="h-auto my-auto" />
                            <div className="text-xl font-bold h-auto my-auto">
                                Video
                            </div>
                        </div>
                        <div className="flex">
                            <video
                                src={import.meta.env.PROD ? videoUrl.url : ""}
                                controls
                                className="grow"
                            />
                        </div>
                    </div>
                </div>
                <div className="border border-gray-700 p-6 rounded-lg">
                    <div className="flex gap-2 mb-6">
                        <List size={20} className="h-auto my-auto" />
                        <div className="text-xl font-bold h-auto my-auto">
                            Track List
                        </div>
                    </div>
                    <div className="divide-y divide-gray-700">
                        {performance.trackList.map(
                            ({ artist, title }, index) => (
                                <div className="py-4 flex gap-4" key={index}>
                                    <div className="h-auto my-auto">{`${index + 1}.`}</div>
                                    <div>
                                        <div className="text-sm mb-1 text-gray-300">
                                            {artist}
                                        </div>
                                        <div>{title}</div>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
