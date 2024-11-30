import { Outlet } from "react-router";
import { FunctionComponent, Suspense, useMemo } from "react";
import {
    BowlFood,
    CircleNotch,
    ClockCounterClockwise,
    House,
    Icon,
    MagnifyingGlass,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router";
import { Paths } from "./lib/util/path";

const headerHeight = 64;
const footerHeight = 36;

const Loading = () => {
    return (
        <div className="flex justify-center h-96">
            <CircleNotch
                size={40}
                className="animate-spin text-zinc-500 h-auto my-auto"
            />
        </div>
    );
};

type Menu = "home" | "archive" | "search" | "dekamori";

const SidebarMenuItem: FunctionComponent<{
    Icon: Icon;
    menu: Menu;
}> = ({ Icon, menu }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = useMemo(() => {
        const pathName = location.pathname;
        if (menu === "home") return pathName === "/";
        return pathName.startsWith(`/${menu}`);
    }, [menu, location]);

    return (
        <button
            className={`
                w-full flex justify-center h-16 border-r-4
                ${isActive ? "border-zinc-300" : "border-transparent text-zinc-600 hover:text-white transition-colors duration-200 ease-in-out"}
            `}
            onClick={() => {
                navigate(menu === "home" ? "/" : `/${menu}`);
            }}
        >
            <Icon size={32} className="h-auto my-auto" />
        </button>
    );
};

export const Layout = () => {
    const location = useLocation();
    const isTop = location.pathname === Paths.HOME;

    return (
        <div className="text-white bg-zinc-950 relative">
            <div className="absolute z-10 top-0 h-screen w-full isolate">
                <div
                    className={`w-full h-full absolute bg-zinc-950/80 backdrop-blur-xl z-20
                    ${isTop ? "backdrop-blur-md" : "backdrop-blur-xl"}
                    `}
                />
                <img
                    src="/background/2020_03.png"
                    className="absolute object-cover h-full w-full z-10"
                />
            </div>
            <div className="absolute top-0 w-full h-screen z-20">
                <div className="static h-full">
                    <header
                        className="h-20 flex fixed px-4 border-b border-zinc-700 w-full"
                        style={{ height: headerHeight }}
                    >
                        <div className="h-auto my-auto">
                            <h1 className="text-3xl font-bold tracking-tight h-auto px-auto">
                                <span className="font-serif mr-1">祭</span>
                                <span>Official Site</span>
                            </h1>
                        </div>
                        <div className="grow" />
                    </header>
                    <main
                        className="flex h-full"
                        style={{
                            paddingTop: headerHeight,
                        }}
                    >
                        <div className="w-16 shrink-0 border-r border-zinc-700">
                            <SidebarMenuItem Icon={House} menu="home" />
                            <SidebarMenuItem
                                Icon={ClockCounterClockwise}
                                menu="archive"
                            />
                            <SidebarMenuItem
                                Icon={MagnifyingGlass}
                                menu="search"
                            />
                            <SidebarMenuItem Icon={BowlFood} menu="dekamori" />
                        </div>
                        <div className="grow">
                            <div
                                className="pt-6 px-6 overflow-y-auto"
                                style={{
                                    height: `calc(100% - ${footerHeight}px)`,
                                }}
                            >
                                <Suspense fallback={<Loading />}>
                                    <Outlet />
                                </Suspense>
                            </div>
                            <footer
                                className="flex justify-end text-xs px-6"
                                style={{ height: footerHeight }}
                            >
                                <div className="h-auto my-auto">
                                    ©︎2024 Yuki Oshima
                                </div>
                            </footer>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};
