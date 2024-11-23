import { BrowserRouter, Route } from "react-router";
import { Routes } from "react-router";
import { Layout } from "./Layout";
import { Home } from "./page/home";
import { Event } from "./page/event";
import { Performance } from "./page/performance";

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path=":eventid" element={<Event />} />
                    <Route
                        path=":eventid/:performanceorder"
                        element={<Performance />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
