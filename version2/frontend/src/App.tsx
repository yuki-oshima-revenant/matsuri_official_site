import { BrowserRouter, Route } from "react-router";
import { Routes } from "react-router";
import { Layout } from "./Layout";
import { HomePage } from "./page/home";
import { EventPage } from "./page/event";
import { PerformancePage } from "./page/performance";

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path=":eventid" element={<EventPage />} />
                    <Route
                        path=":eventid/:performanceorder"
                        element={<PerformancePage />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
