import { Outlet } from "react-router";
import { FunctionComponent, Suspense, useEffect, useMemo } from "react";
import { PiCircleNotch } from "react-icons/pi";
import { useNavigate } from "react-router";
import { useLocation } from "react-router";
import { Function, functions, Paths } from "./lib/util/path";
import { FaGithub } from "react-icons/fa6";
import { ErrorMessage } from "./lib/component/error";
import { useAtom } from "jotai";
import { errorCodeAtom } from "./lib/atom/common";

const headerHeight = 64;
const footerHeight = 36;

const Loading = () => {
    return (
        <div className="flex justify-center h-96">
            <PiCircleNotch
                size={40}
                className="animate-spin text-zinc-500 h-auto my-auto"
            />
        </div>
    );
};

const SidebarMenuItem: FunctionComponent<{
    func: Function;
}> = ({ func }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = useMemo(() => {
        const pathName = location.pathname;
        if (func.path === Paths.HOME) return pathName === "/";
        return pathName.startsWith(func.path);
    }, [func, location]);

    return (
        <button
            className={`
                w-full flex justify-center h-16 border-r-4
                ${isActive ? "border-zinc-300" : "border-transparent text-zinc-600 hover:text-white transition-colors duration-200 ease-in-out"}
            `}
            onClick={() => {
                navigate(func.path);
            }}
        >
            <func.icon size={32} className="h-auto my-auto" />
        </button>
    );
};

export const Layout = () => {
    const navigate = useNavigate();
    const [errorCode, setErrorCode] = useAtom(errorCodeAtom);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setErrorCode(params.get("error_code") ?? null);
    }, [setErrorCode]);

    return (
        <div className="text-white bg-zinc-950 relative">
            <div className="absolute z-10 top-0 h-screen w-full isolate">
                <div
                    className={`w-full h-full absolute bg-zinc-950/80 backdrop-blur-xl z-20`}
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
                        <button
                            className="h-auto my-auto"
                            onClick={() => {
                                navigate(Paths.HOME);
                            }}
                        >
                            <h1 className="text-3xl font-bold tracking-tight h-auto px-auto">
                                <span className="font-serif mr-1">祭</span>
                                <span>Official Site</span>
                            </h1>
                        </button>
                        <div className="grow" />
                        <div className="flex">
                            <button
                                className="rounded-full text-zinc-300 h-auto my-auto"
                                onClick={() => {
                                    window.open(
                                        "https://github.com/yuki-oshima-revenant/matsuri_official_site/tree/master/version2",
                                    );
                                }}
                            >
                                <FaGithub size={20} />
                            </button>
                        </div>
                    </header>
                    <main
                        className="flex h-full"
                        style={{
                            paddingTop: headerHeight,
                        }}
                    >
                        <div className="hidden md:block w-16 shrink-0 border-r border-zinc-700">
                            {functions.map((func) => (
                                <SidebarMenuItem key={func.path} func={func} />
                            ))}
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
                                {errorCode && (
                                    <div className="absolute top-6 right-6 z-20">
                                        <ErrorMessage errorCode={errorCode} />
                                    </div>
                                )}
                            </div>
                            <footer
                                className="flex justify-end text-xs text-zinc-400 px-6"
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
