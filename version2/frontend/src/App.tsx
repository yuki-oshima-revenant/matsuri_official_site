import { BrowserRouter, Route } from "react-router";
import { Routes } from "react-router";
import { Layout } from "./Layout";
import { HomePage } from "./page/home";
import { EventPage } from "./page/event";
import { PerformancePage } from "./page/performance";
import { SearchPage } from "./page/search";
import { DekamoriPage } from "./page/dekamori";
import { ArchivePage } from "./page/archive";

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="archive">
                        <Route index element={<ArchivePage />} />
                        <Route path=":eventid" element={<EventPage />} />
                        <Route
                            path=":eventid/:performanceorder"
                            element={<PerformancePage />}
                        />
                    </Route>
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/dekamori" element={<DekamoriPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
