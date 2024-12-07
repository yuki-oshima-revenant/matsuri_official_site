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
    PiClock,
    PiGoogleDriveLogo,
    PiList,
    PiMicrophone,
    PiVideoCamera,
} from "react-icons/pi";
import { isLoginAtom } from "../lib/atom/auth";
import { FunctionComponent } from "react";
import { loadable } from "jotai/utils";
import { Performance } from "../lib/type";
import { ArchiveBreadcrumb } from "../lib/component/breadcrumb";

const getGoogleDriveUrl = (id: string) => {
    return `https://drive.google.com/file/d/${id}/view?usp=sharing`;
};

const NeedLogin: FunctionComponent<{
    googleDriveFileId: string | null;
}> = ({ googleDriveFileId }) => {
    return (
        <div className="py-6">
            <div className="text-center text-sm text-zinc-300 mb-4">
                <div>サイト上で視聴/閲覧するにはログインが必要です。</div>
                {googleDriveFileId && (
                    <div>
                        アカウントをお持ちでない方は
                        <a
                            className="text-blue-500 hover:underline cursor-pointer duration-200 ease-in-out mx-1"
                            onClick={() => {
                                window.open(
                                    getGoogleDriveUrl(googleDriveFileId),
                                );
                            }}
                        >
                            Google Drive
                        </a>
                        からご覧ください。
                    </div>
                )}
            </div>
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
    performance: Performance;
}> = ({ eventId, performanceOrder, performance }) => {
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

    if (!isLogin)
        return (
            <NeedLogin googleDriveFileId={performance.googleDrive.audioId} />
        );
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
    performance: Performance;
}> = ({ eventId, performanceOrder, performance }) => {
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

    if (!isLogin)
        return (
            <NeedLogin googleDriveFileId={performance.googleDrive.videoId} />
        );
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

    if (!isLogin)
        return (
            <NeedLogin
                googleDriveFileId={performance.googleDrive.tracklistId}
            />
        );

    return (
        <div className="divide-y divide-zinc-700">
            {performance.trackList.map(({ artist, title }, index) => (
                <div className="py-4 flex gap-4" key={index}>
                    <div className="h-auto my-auto">{`${index + 1}.`}</div>
                    <div>
                        <div className="text-sm mb-1 text-zinc-400">
                            {artist}
                        </div>
                        <div>{title}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const OpenGoogleDriveButton: FunctionComponent<{
    id: string | null;
}> = ({ id }) => {
    if (!id) return null;

    return (
        <button
            className="h-auto my-auto text-zinc-300"
            onClick={() => {
                window.open(
                    `https://drive.google.com/file/d/${id}/view?usp=sharing`,
                );
            }}
        >
            <PiGoogleDriveLogo size={20} />
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
            <div className="mb-2">
                <ArchiveBreadcrumb event={event} />
            </div>
            <div className="mb-6 flex gap-2">
                <div>
                    <div className="flex gap-2 text-4xl font-bold">
                        <div>{`${performance.performanceOrder}.`}</div>
                        <div>{performance.performerName}</div>
                    </div>
                </div>
                <div className="grow" />
                <div className="text-right flex flex-col gap-1">
                    <div className="text-sm text-zinc-400 h-auto mt-auto">
                        <div className="flex justify-end gap-1">
                            <PiClock size={18} className="h-auto my-auto" />
                            {`${getPerformanceDurationMinutes(performance.startTime, performance.endTime)} min`}
                        </div>
                    </div>
                    <div className="text-sm text-zinc-400 flex gap-2">
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
                    <div className="border border-zinc-700 bg-zinc-900 rounded-lg p-6">
                        <div className="flex gap-2 mb-6">
                            <PiMicrophone
                                size={20}
                                className="h-auto my-auto"
                            />
                            <div className="text-xl font-bold h-auto my-auto">
                                Audio
                            </div>
                            <div className="grow" />
                            <OpenGoogleDriveButton
                                id={performance.googleDrive.audioId}
                            />
                        </div>
                        <AudioView
                            eventId={params.eventid ?? null}
                            performanceOrder={params.performanceorder ?? null}
                            performance={performance}
                        />
                    </div>
                    <div className="border border-zinc-700 bg-zinc-900 rounded-lg p-6">
                        <div className="flex gap-2 mb-6">
                            <PiVideoCamera
                                size={20}
                                className="h-auto my-auto"
                            />
                            <div className="text-xl font-bold h-auto my-auto">
                                Video
                            </div>
                            <div className="grow" />
                            <OpenGoogleDriveButton
                                id={performance.googleDrive.videoId}
                            />
                        </div>
                        <VideoView
                            eventId={params.eventid ?? null}
                            performanceOrder={params.performanceorder ?? null}
                            performance={performance}
                        />
                    </div>
                </div>
                <div className="border border-zinc-700 bg-zinc-900 p-6 rounded-lg">
                    <div className="flex gap-2 mb-6">
                        <PiList size={20} className="h-auto my-auto" />
                        <div className="text-xl font-bold h-auto my-auto">
                            Track List
                        </div>
                        <div className="grow" />
                        <OpenGoogleDriveButton
                            id={performance.googleDrive.tracklistId}
                        />
                    </div>
                    <TrackListView performance={performance} />
                </div>
            </div>
        </div>
    );
};
