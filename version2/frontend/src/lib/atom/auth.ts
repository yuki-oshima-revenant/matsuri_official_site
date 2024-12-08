import { atom } from "jotai";
import { User } from "../type";
import { loadable } from "jotai/utils";
import { request } from "../util/request";

export const checkLoginAtom = atom<Promise<User> | null>(async () => {
    const response = await request({
        endpoint: "/auth/checklogin",
        body: null,
    });
    return await response.json();
});

export const isLoginAtom = atom<boolean>((get) => {
    const user = get(loadable(checkLoginAtom));
    return user.state === "hasData";
});
