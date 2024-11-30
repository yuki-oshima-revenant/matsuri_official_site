import { atom } from "jotai";
import { User } from "../type";
import { loadable } from "jotai/utils";

export const checkLoginAtom = atom<Promise<User> | null>(async () => {
    const response = await fetch("/api/auth/checklogin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return await response.json();
});

export const isLoginAtom = atom<boolean>((get) => {
    const user = get(loadable(checkLoginAtom));
    return user.state === "hasData";
});
