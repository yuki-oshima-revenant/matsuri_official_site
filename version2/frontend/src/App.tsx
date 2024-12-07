import { BrowserRouter, Route } from "react-router";
import { Routes } from "react-router";
import { Layout } from "./Layout";
import { HomePage } from "./page/home";
import { EventPage } from "./page/event";
import { PerformancePage } from "./page/performance";
import { SearchPage } from "./page/search";
import { DekamoriPage } from "./page/dekamori";
import { ArchivePage } from "./page/archive";
import { Paths } from "./lib/util/path";
import { AiPage } from "./page/ai";
import { WatchPartyPage } from "./page/watchparty";

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path={Paths.ARCHIVE}>
                        <Route index element={<ArchivePage />} />
                        <Route path=":eventid" element={<EventPage />} />
                        <Route
                            path=":eventid/:performanceorder"
                            element={<PerformancePage />}
                        />
                    </Route>
                    <Route path={Paths.SEARCH} element={<SearchPage />} />
                    <Route
                        path={Paths.WATCHPARTY}
                        element={<WatchPartyPage />}
                    />
                    <Route path={Paths.AI} element={<AiPage />} />
                    <Route path={Paths.DEKAMORI} element={<DekamoriPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
