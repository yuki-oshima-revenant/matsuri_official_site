import { useAtomValue } from "jotai";
import { eventListAtom } from "../lib/atom/event";
import { useNavigate } from "react-router";
import { MapPinSimple, CalendarBlank } from "@phosphor-icons/react";
import { formatEventDate } from "../lib/util/date";

export const ArchivePage = () => {
    const eventList = useAtomValue(eventListAtom);
    const navigate = useNavigate();

    return (
        <div>
            <h2 className="text-4xl font-bold mb-6">祭アーカイブ</h2>
            <div className="grid grid-cols-2 gap-6">
                {eventList.map(({ eventId, title, date, place }) => (
                    <div
                        key={eventId}
                        onClick={() => {
                            navigate(`${eventId}`);
                        }}
                        className="cursor-pointer border border-zinc-700 p-6 rounded-lg flex flex-col gap-6 hover:bg-zinc-800 duration-200 ease-in-out"
                    >
                        <div className="text-xl font-bold">{title}</div>
                        <img
                            src={`https://delivery.unronritaro.net/matsuri/image/flyer/${eventId}.png`}
                            className="aspect-video object-contain"
                        />
                        <div className="flex gap-4 text-sm text-zinc-300">
                            <div className="flex gap-2">
                                <CalendarBlank
                                    size={14}
                                    className="h-auto my-auto"
                                />
                                {formatEventDate(date)}
                            </div>
                            <div className="flex gap-2">
                                <MapPinSimple
                                    size={14}
                                    className="h-auto my-auto"
                                />
                                {place}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
