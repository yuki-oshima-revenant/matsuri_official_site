import { useParams } from "react-router";
import { eventAtom } from "../lib/atom/event";
import {
    MediaFormat,
    performanceAtom,
    performanceMediaUrlAtom,
} from "../lib/atom/performance";
import { useAtomValue } from "jotai";
import {
    formatPerformanceTime,
    getPerformanceDurationMinutes,
} from "../lib/util/date";
import {
    Clock,
    GoogleDriveLogo,
    List,
    Microphone,
    VideoCamera,
} from "@phosphor-icons/react";
import { isLoginAtom } from "../lib/atom/auth";
import { FunctionComponent } from "react";
import { loadable } from "jotai/utils";
import { Performance } from "../lib/type";

const NeedLogin = () => {
    return (
        <div className="">
            <div className="flex justify-center">
                <button
                    className="flex bg-neutral-700 rounded px-3 py-2"
                    onClick={() => {
                        const params = new URLSearchParams();
                        params.append("return_to", window.location.href);
                        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/login?${params.toString()}`;
                    }}
                >
                    <div className="text-sm">ログイン</div>
                </button>
            </div>
        </div>
    );
};

const AudioView: FunctionComponent<{
    eventId: string | null;
    performanceOrder: string | null;
}> = ({ eventId, performanceOrder }) => {
    const isLogin = useAtomValue(isLoginAtom);

    const audioUrl = useAtomValue(
        loadable(
            performanceMediaUrlAtom({
                eventId: eventId ?? null,
                performanceOrder: Number(Number(performanceOrder ?? 0)),
                mediaFormat: MediaFormat.AUDIO,
            }),
        ),
    );

    if (!isLogin) return <NeedLogin />;
    if (audioUrl.state !== "hasData") return null;

    return (
        <div className="flex">
            <audio
                src={import.meta.env.PROD ? audioUrl.data.url : ""}
                controls
                className="grow"
            />
        </div>
    );
};

const VideoView: FunctionComponent<{
    eventId: string | null;
    performanceOrder: string | null;
}> = ({ eventId, performanceOrder }) => {
    const isLogin = useAtomValue(isLoginAtom);

    const videoUrl = useAtomValue(
        loadable(
            performanceMediaUrlAtom({
                eventId: eventId ?? null,
                performanceOrder: Number(performanceOrder ?? 0),
                mediaFormat: MediaFormat.VIDEO,
            }),
        ),
    );

    if (!isLogin) return <NeedLogin />;
    if (videoUrl.state !== "hasData") return null;

    return (
        <div className="flex">
            <video
                src={import.meta.env.PROD ? videoUrl.data.url : ""}
                controls
                className="grow"
            />
        </div>
    );
};

const TrackListView: FunctionComponent<{
    performance: Performance;
}> = ({ performance }) => {
    const isLogin = useAtomValue(isLoginAtom);

    if (!isLogin) return <NeedLogin />;

    return (
        <div className="divide-y divide-gray-700">
            {performance.trackList.map(({ artist, title }, index) => (
                <div className="py-4 flex gap-4" key={index}>
                    <div className="h-auto my-auto">{`${index + 1}.`}</div>
                    <div>
                        <div className="text-sm mb-1 text-gray-300">
                            {artist}
                        </div>
                        <div>{title}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const OpenGoogleDriveButton = () => {
    return (
        <button className="h-auto my-auto text-gray-300">
            <GoogleDriveLogo size={20} />
        </button>
    );
};

export const PerformancePage = () => {
    const params = useParams<{ eventid: string; performanceorder: string }>();
    const event = useAtomValue(eventAtom({ eventId: params.eventid ?? null }));
    const performance = useAtomValue(
        performanceAtom({
            eventId: params.eventid ?? null,
            performanceOrder: Number(params.performanceorder ?? 0),
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
                            <div className="grow" />
                            <OpenGoogleDriveButton />
                        </div>
                        <AudioView
                            eventId={params.eventid ?? null}
                            performanceOrder={params.performanceorder ?? null}
                        />
                    </div>
                    <div className="border border-gray-700 rounded-lg p-6">
                        <div className="flex gap-2 mb-6">
                            <VideoCamera size={20} className="h-auto my-auto" />
                            <div className="text-xl font-bold h-auto my-auto">
                                Video
                            </div>
                            <div className="grow" />
                            <OpenGoogleDriveButton />
                        </div>
                        <VideoView
                            eventId={params.eventid ?? null}
                            performanceOrder={params.performanceorder ?? null}
                        />
                    </div>
                </div>
                <div className="border border-gray-700 p-6 rounded-lg">
                    <div className="flex gap-2 mb-6">
                        <List size={20} className="h-auto my-auto" />
                        <div className="text-xl font-bold h-auto my-auto">
                            Track List
                        </div>
                        <div className="grow" />
                        <OpenGoogleDriveButton />
                    </div>
                    <TrackListView performance={performance} />
                </div>
            </div>
        </div>
    );
};
