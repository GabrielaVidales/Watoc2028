import websocketDispatcher from "./websocket-dispatcher";
import { create } from "zustand";


type WebSocketState = {
    connected: boolean
    connect: () => void;
    disconnect: () => void;
    send: (data: unknown) => void;
}

let socket: WebSocket | null = null;
let reconnectTimer: number | null = null;
let reconnectAttempts = 0;

const MAX_DELAY = 30_000;

const useWebsocket = create<WebSocketState>((set, get) => ({
    connected: false,
    connect() {
        if (import.meta.env.VITE_USE_WEBSOCKETS !== 'true') {
            if (import.meta.env.VITE_DEBUG) {
                console.log(`[WebSocket] - Websocket disabled`)
            }
            return
        }

        socket = new WebSocket('ws://127.0.0.1:8000/ws/api/socket/')

        socket.onopen = (ev: Event) => {
            if (import.meta.env.VITE_DEBUG) {
                console.log(`[WebSocket] - Open: ${ev.timeStamp}`)
            }
            set({ connected: true })
            reconnectAttempts = 0
        }

        socket.onclose = (ev: CloseEvent) => {
            if (import.meta.env.VITE_DEBUG) {
                console.log(`[WebSocket] - CloseEvent QUEE?: ${ev.reason}`)
            }
            set({ connected: false })

            const delay = Math.min(
                1000 * Math.pow(2, reconnectAttempts),
                MAX_DELAY,
            )

            reconnectTimer = window.setTimeout(() => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log('[WebSocket] - Reconectar');
                }

                get().connect()
            }, delay);
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
    disconnect() {
        if (reconnectTimer) {
            clearTimeout(reconnectTimer);
        }
        socket?.close();
        socket = null;
        set({ connected: false });
    },
    send(data) {
        if (socket?.readyState !== WebSocket.OPEN) return;

        socket.send(JSON.stringify(data));
    },
}))

export default useWebsocket