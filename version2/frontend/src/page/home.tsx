import { HardHat } from "@phosphor-icons/react";
import { functions, Paths } from "../lib/util/path";
import { useNavigate } from "react-router";
import { eventListAtom } from "../lib/atom/event";
import { useAtomValue } from "jotai";
import { EventCard } from "../lib/component/card";
import { isFutureEventDate } from "../lib/util/date";

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
    const recentEvent = eventList[0];

    return (
        <div className="h-full">
            {recentEvent && (
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-center tracking-tight mb-6">
                        {isFutureEventDate(recentEvent.date)
                            ? "次回の祭"
                            : "最近の祭"}
                    </h2>
                    <div className="flex justify-center">
                        <div className="w-[640px]">
                            <EventCard
                                event={recentEvent}
                                key={recentEvent.eventId}
                            />
                        </div>
                    </div>
                </div>
            )}
            <div>
                <h2 className="text-3xl font-bold text-center tracking-tight mb-6">
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
