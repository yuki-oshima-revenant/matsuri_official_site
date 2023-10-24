import { useEffect, useRef } from "react";

export default function Home() {
    const webSocketRef = useRef<WebSocket | null>(null);
    useEffect(() => {
        webSocketRef.current = new WebSocket("ws://localhost:8000/ws");
        const onOpenHandler = () => {
            console.log("WebSocket open");
        }
        const onCloseHandler = () => {
            console.log("WebSocket closed");
        }
        const onMessageHandler = (event: MessageEvent) => {
            console.log("WebSocket message", event.data);
        }
        webSocketRef.current.addEventListener("open", onOpenHandler);
        webSocketRef.current.addEventListener("close", onCloseHandler);
        webSocketRef.current.addEventListener("message", onMessageHandler);
        return () => {
            webSocketRef.current?.removeEventListener("open", onOpenHandler);
            webSocketRef.current?.removeEventListener("close", onCloseHandler);
            webSocketRef.current?.removeEventListener("message", onMessageHandler);
        }
    }, []);

    return (
        <div>
            <button
                onClick={() => {
                    webSocketRef.current?.send("hello");
                }}
            >message</button>
        </div>
    )
}
