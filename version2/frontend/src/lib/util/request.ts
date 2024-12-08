export const request = async <T>({
    endpoint,
    body,
}: {
    endpoint: string;
    body: T | null;
}) => {
    return fetch(
        `${import.meta.env.VITE_API_BASE_URL}${
            endpoint.startsWith("/") ? endpoint : `/${endpoint}`
        }`,
        {
            method: "POST",
            body: body !== null ? JSON.stringify(body) : null,
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        },
    );
};
