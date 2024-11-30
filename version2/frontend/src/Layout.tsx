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

const headerHeight = 64;
const footerHeight = 36;

const Loading = () => {
    return (
        <div className="flex justify-center h-96">
            <CircleNotch
                size={40}
                className="animate-spin text-gray-500 h-auto my-auto"
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
                ${isActive ? "border-gray-300" : "border-transparent text-gray-600 hover:text-white transition-colors duration-200 ease-in-out"}
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
    return (
        <div className="text-white bg-gray-950 h-screen">
            <header
                className="h-20 flex backdrop-blur fixed px-4 border-b border-gray-700 w-full"
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
                <div className="w-16 shrink-0 border-r border-gray-700">
                    <SidebarMenuItem Icon={House} menu="home" />
                    <SidebarMenuItem
                        Icon={ClockCounterClockwise}
                        menu="archive"
                    />
                    <SidebarMenuItem Icon={MagnifyingGlass} menu="search" />
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
                        className="flex justify-center text-xs"
                        style={{ height: footerHeight }}
                    >
                        <div className="h-auto my-auto">
                            ©︎2024 Yuki Oshima
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
};
