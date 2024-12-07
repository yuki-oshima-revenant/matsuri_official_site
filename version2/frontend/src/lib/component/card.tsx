import { FunctionComponent } from "react";
import { Event } from "../type";
import { formatEventDate } from "../util/date";
import { PiCalendarBlank, PiMapPinSimple } from "react-icons/pi";
import { useNavigate } from "react-router";
import { Paths } from "../util/path";

export const EventCard: FunctionComponent<{
    event: Event;
}> = ({ event: { eventId, date, place, title } }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => {
                navigate(`${Paths.ARCHIVE}/${eventId}`);
            }}
            className="cursor-pointer border border-zinc-700 p-6 rounded-lg flex flex-col gap-6 bg-zinc-900 hover:bg-zinc-800 duration-200 ease-in-out"
        >
            <div className="text-xl font-bold">{title}</div>
            <img
                src={`https://delivery.unronritaro.net/matsuri/image/flyer/${eventId}.png`}
                className="aspect-video object-contain"
            />
            <div className="flex gap-4 text-sm text-zinc-400">
                <div className="flex gap-2">
                    <PiCalendarBlank size={14} className="h-auto my-auto" />
                    {formatEventDate(date)}
                </div>
                <div className="flex gap-2">
                    <PiMapPinSimple size={14} className="h-auto my-auto" />
                    {place}
                </div>
            </div>
        </div>
    );
};
