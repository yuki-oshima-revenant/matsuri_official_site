import { useAtomValue } from "jotai";
import { eventListAtom } from "../lib/atom";

export const Home = () => {
    const eventList = useAtomValue(eventListAtom);

    return <textarea value={JSON.stringify(eventList)} />;
};
