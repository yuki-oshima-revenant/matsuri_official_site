import { useSetAtom } from "jotai";
import { FunctionComponent } from "react";
import { PiWarningCircle, PiX } from "react-icons/pi";
import { errorCodeAtom } from "../atom/common";

const getErrorMessageByCode = (code: string) => {
    switch (code) {
        case "not_registered_user":
            return "アカウントが登録されていません。サイト管理者までご連絡ください";
        default:
            return "エラーが発生しました";
    }
};

export const ErrorMessage: FunctionComponent<{
    errorCode: string;
}> = ({ errorCode }) => {
    const setErrorCode = useSetAtom(errorCodeAtom);
    return (
        <div className="text-red-500 bg-zinc-800 p-6 rounded-lg flex gap-2 relative">
            <PiWarningCircle className="h-auto my-auto" size={24} />
            {getErrorMessageByCode(errorCode)}
            <button
                className="absolute -top-2 -right-2 rounded-full bg-zinc-600 p-1"
                onClick={() => {
                    setErrorCode(null);
                }}
            >
                <PiX className="h-auto my-auto" size={20} />
            </button>
        </div>
    );
};
