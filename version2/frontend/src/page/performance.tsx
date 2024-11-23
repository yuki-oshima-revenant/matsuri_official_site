import { useParams } from "react-router";
import {
    eventAtom,
    MediaFormat,
    performanceAtom,
    performanceMediaUrlAtom,
} from "../lib/atom";
import { useAtomValue } from "jotai";

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
            <div className="mb-6">
                <div className="mb-1 text-gray-300">{event.title}</div>
                <div className="flex gap-2 text-4xl">
                    <div>{`${performance.performanceOrder}.`}</div>
                    <div>{performance.performerName}</div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-6">
                    <div className="border border-gray-700 rounded-lg p-6">
                        <div className="text-lg mb-6">Audio</div>
                        <div className="flex">
                            <audio
                                src={import.meta.env.PROD ? audioUrl.url : ""}
                                controls
                                className="grow"
                            />
                        </div>
                    </div>
                    <div className="border border-gray-700 rounded-lg p-6">
                        <div className="text-lg mb-6">Video</div>
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
                    <div className="text-lg mb-5">Track List</div>
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
