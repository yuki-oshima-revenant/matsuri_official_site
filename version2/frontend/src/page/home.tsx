import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Paths } from "../lib/util/path";

export const HomePage = () => {
    const navigate = useNavigate();

    // tmp
    useEffect(() => {
        navigate(Paths.ARCHIVE, { replace: true });
    }, []);

    return (
        <div>
            <div>under construction</div>
        </div>
    );
};
