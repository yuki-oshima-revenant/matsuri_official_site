import { HardHat } from "@phosphor-icons/react";
import { functions, Paths } from "../lib/util/path";
import { useNavigate } from "react-router";
import { eventListAtom } from "../lib/atom/event";
import { useAtomValue } from "jotai";
import { EventCard } from "../lib/component/card";

const Slogan = () => {
    return (
        <div className="flex h-full justify-center pt-10">
            <div
                className="font-serif font-bold text-6xl tracking-tighter"
                style={{
                    writingMode: "vertical-rl",
                }}
            >
                <div className="px-2">
                    僕の
                    <span className="text-red-700 text-7xl py-2">最弱</span>
                    を以て、
                </div>
                <div className="px-2">
                    君の
                    <span className="text-red-700 text-7xl py-2">最強</span>
                    を打ち破る——。
                </div>
            </div>
        </div>
    );
};

export const HomePage = () => {
    const navigate = useNavigate();
    const eventList = useAtomValue(eventListAtom);
    const recentEvents = eventList.slice(0, 3);

    return (
        <div className="h-full">
            <div className="mb-10">
                <h2 className="text-2xl font-bold h-auto my-auto tracking-tight mb-6">
                    最近の祭
                </h2>
                <div className="grid grid-cols-3 gap-6">
                    {recentEvents.map((event) => (
                        <EventCard event={event} key={event.eventId} />
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold h-auto my-auto tracking-tight mb-6">
                    メニュー
                </h2>
                <div className="grid grid-cols-4 gap-6">
                    {functions.map((func) => {
                        if (func.path === Paths.HOME) return null;
                        return (
                            <div
                                key={func.path}
                                className="p-6 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 cursor-pointer duration-200 ease-in-out text-center"
                                onClick={() => {
                                    navigate(func.path);
                                }}
                            >
                                <div className="flex justify-center mb-6">
                                    <func.icon size={48} />
                                </div>
                                <div className="text-xl font-bold mb-4">
                                    {func.title}
                                </div>
                                <div className="text-sm text-zinc-400">
                                    {func.description}
                                </div>
                                {func.underConstruction && (
                                    <div className="text-sm text-zinc-400 flex justify-center mt-2">
                                        <div className="flex mr-1">
                                            <HardHat
                                                size={14}
                                                className="h-auto my-auto"
                                            />
                                        </div>
                                        under construction
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
