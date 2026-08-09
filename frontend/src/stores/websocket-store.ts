import websocketDispatcher from "./websocket-dispatcher";
import { create } from "zustand";


type WebSocketState = {
    connected: Record<string, boolean>;
    connect: (socketUri?: string) => void;
    disconnect: (socketUri?: string) => void;
    send: (socketUri: string, data: unknown) => void;
};

let sockets = new Map<string, WebSocket>()
const reconnectTimers = new Map<string, number>();
const reconnectAttempts = new Map<string, number>();

const WEBSOCKET_URL = import.meta.env.VITE_WS_URL
const MAX_DELAY = 30_000;

const useWebsocket = create<WebSocketState>((set, get) => ({
    connected: {},
    connect(socketUri = 'api/socket/') {
        if (import.meta.env.VITE_USE_WEBSOCKETS !== 'true') {
            if (import.meta.env.VITE_DEBUG) {
                console.log(`[WebSocket] - Websocket disabled`)
            }
            return
        }

        const existingSocket = sockets.get(socketUri);
        if (existingSocket && (
            existingSocket.OPEN || existingSocket.CONNECTING
        )) {
            return
        }

        const socket = new WebSocket(`${WEBSOCKET_URL}${socketUri}`)

        sockets.set(socketUri, socket);

        socket.onopen = (ev: Event) => {
            if (import.meta.env.VITE_DEBUG) {
                console.log(`[WebSocket] - Open: ${ev.timeStamp}`)
            }

            set(state => ({
                connected: {
                    ...state.connected,
                    socketUri: true,
                }
            }))
            reconnectAttempts.set(socketUri, 0)
        }

        socket.onclose = (ev: CloseEvent) => {
            if (import.meta.env.VITE_DEBUG) {
                console.log(`[WebSocket] - Closed: ${ev.reason}`)
            }
            set(state => ({
                connected: {
                    ...state.connected,
                    socketUri: false,
                }
            }))

            if (sockets.get(socketUri) === socket) {
                sockets.delete(socketUri);
            }

            const attempts = reconnectAttempts.get(socketUri) ?? 0;
            const delay = Math.min(
                1000 * Math.pow(2, attempts),
                MAX_DELAY,
            )

            reconnectAttempts.set(
                socketUri,
                attempts + 1,
            );

            const timer = window.setTimeout(() => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log('[WebSocket] - Reconectar');
                }

                get().connect(socketUri)
            }, delay);

            reconnectTimers.set(
                socketUri,
                timer,
            );
        }

        socket.onmessage = (evt) => {
            const message = JSON.parse(evt.data);
            websocketDispatcher.dispatch(message)
        }

        socket.onerror = (evt) => {
            if (import.meta.env.VITE_DEBUG) {
                console.error(`[WebSocket] - Error: ${evt.type}`);
            }
        };
    },
    disconnect(socketUri = 'api/socket/') {
        const timer = reconnectTimers.get(socketUri);

        if (timer !== undefined) {
            clearTimeout(timer);
            reconnectTimers.delete(socketUri);
        }

        reconnectAttempts.delete(socketUri);

        const socket = sockets.get(socketUri);

        if (socket) {
            socket.close();
            sockets.delete(socketUri);
        }

        set(state => ({
            connected: {
                ...state.connected,
                [socketUri]: false,
            },
        }));
    },
    send(socketUri, data) {
        const socket = sockets.get(socketUri);

        if (socket?.readyState !== WebSocket.OPEN) {
            return;
        }

        socket.send(JSON.stringify(data));
    },
}))

export default useWebsocket