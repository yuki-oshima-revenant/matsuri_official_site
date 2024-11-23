import { Outlet } from "react-router";

import { Suspense } from "react";

export const Layout = () => {
    return (
        <div className="text-white">
            <header>
                <h1>祭オフィシャルサイト</h1>
            </header>
            <main>
                <Suspense fallback="Loading...">
                    <Outlet />
                </Suspense>
            </main>
        </div>
    );
};
