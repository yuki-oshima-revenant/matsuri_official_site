import { CaretRight } from "@phosphor-icons/react";
import { FunctionComponent } from "react";
import { Event } from "../type";
import { useNavigate } from "react-router";
import { Paths } from "../util/path";

const BreadcrumbDivider = () => {
    return <CaretRight size={14} className="h-auto my-auto mx-1" />;
};

const BreadcrumbItem: FunctionComponent<{
    children: React.ReactNode;
    onClick: () => void;
}> = ({ children, onClick }) => {
    return (
        <a
            className="hover:underline duration-200 ease-in-out cursor-pointer"
            onClick={onClick}
        >
            {children}
        </a>
    );
};

export const ArchiveBreadcrumb: FunctionComponent<{
    event: Event | null;
}> = ({ event }) => {
    const navigate = useNavigate();
    return (
        <div className="flex text-sm text-zinc-400">
            <BreadcrumbItem
                onClick={() => {
                    navigate(Paths.ARCHIVE);
                }}
            >
                祭アーカイブ
            </BreadcrumbItem>
            <BreadcrumbDivider />
            {event && (
                <>
                    <BreadcrumbItem
                        onClick={() => {
                            navigate(`${Paths.ARCHIVE}/${event.eventId}`);
                        }}
                    >
                        {event.title}
                    </BreadcrumbItem>
                    <BreadcrumbDivider />
                </>
            )}
        </div>
    );
};
