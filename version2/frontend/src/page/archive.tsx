import { useAtomValue } from "jotai";
import { eventListAtom } from "../lib/atom/event";
import { EventCard } from "../lib/component/card";

export const ArchivePage = () => {
    const eventList = useAtomValue(eventListAtom);
    return (
        <div>
            <h2 className="text-4xl font-bold mb-6">祭アーカイブ</h2>
            <div className="grid grid-cols-2 gap-6">
                {eventList.map((event) => (
                    <EventCard event={event} />
                ))}
            </div>
        </div>
    );
};
