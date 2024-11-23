import { Outlet } from "react-router";
import { Suspense } from "react";

const headerHeight = 80;

export const Layout = () => {
    return (
        <div className="text-white bg-gray-950 h-screen">
            <header
                className="h-20 flex backdrop-blur fixed px-6"
                style={{ height: headerHeight }}
            >
                <div className="h-auto my-auto">
                    <h1 className="font-serif text-6xl font-bold tracking-tighter h-auto px-auto">
                        祭
                    </h1>
                </div>
            </header>
            <main className="p-6" style={{ paddingTop: headerHeight + 24 }}>
                <Suspense fallback="Loading...">
                    <Outlet />
                </Suspense>
            </main>
        </div>
    );
};
