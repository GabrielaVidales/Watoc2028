import { DEBUG } from "@/lib/constants"
import { create } from "zustand"
import websocketDispatcher from "./websocket-dispatcher"

type WebSocketState = {
    connected: Record<string, boolean>
    exhausted: Record<string, boolean>
    connect: (socketUri?: string) => void
    disconnect: (socketUri?: string) => void
    send: (socketUri: string, data: unknown) => void
}

const DEFAULT_URI = "api/socket/"
const WEBSOCKET_URL = import.meta.env.VITE_WS_URL
const MAX_DELAY = 30_000
const MAX_ATTEMPTS = 3
const STABLE_AFTER = 10_000

const active = new Map<string, WebSocket>()
const timers = new Map<string, number>()
const attempts = new Map<string, number>()
const autoRetry = new Set<string>()
const intentional = new WeakSet<WebSocket>()

const clearTimer = (socketUri: string) => {
    const timer = timers.get(socketUri)
    if (timer !== undefined) {
        clearTimeout(timer)
        timers.delete(socketUri)
    }
}

const useWebsocket = create<WebSocketState>((set, get) => ({
    connected: {},
    exhausted: {},

    connect(socketUri = DEFAULT_URI) {
        if (import.meta.env.VITE_USE_WEBSOCKETS !== "true") {
            if (DEBUG) console.log("[WebSocket] - Websocket disabled")
            return
        }

        const isAutoRetry = autoRetry.delete(socketUri)
        if (!isAutoRetry) {
            attempts.delete(socketUri)
            set((state) => ({
                exhausted: { ...state.exhausted, [socketUri]: false },
            }))
        }

        const existing = active.get(socketUri)
        if (
            existing &&
            (existing.readyState === WebSocket.OPEN ||
                existing.readyState === WebSocket.CONNECTING)
        ) {
            return
        }

        clearTimer(socketUri)

        const socket = new WebSocket(`${WEBSOCKET_URL}${socketUri}`)
        active.set(socketUri, socket)

        let stableTimer: number | undefined

        socket.onopen = () => {
            if (DEBUG) console.log(`[WebSocket] - Open: ${socketUri}`)

            set((state) => ({
                connected: { ...state.connected, [socketUri]: true },
            }))

            stableTimer = window.setTimeout(() => {
                attempts.set(socketUri, 0)
            }, STABLE_AFTER)
        }

        socket.onclose = (ev: CloseEvent) => {
            if (stableTimer !== undefined) clearTimeout(stableTimer)

            if (active.get(socketUri) !== socket) {
                if (DEBUG) console.log("[WebSocket] - Cierre de socket obsoleto, ignorado")
                return
            }

            if (DEBUG) console.log(`[WebSocket] - Closed: ${ev.code} ${ev.reason}`)

            active.delete(socketUri)
            set((state) => ({
                connected: { ...state.connected, [socketUri]: false },
            }))

            if (intentional.has(socket)) {
                if (DEBUG) console.log("[WebSocket] - Cierre intencional, no reconectar")
                return
            }

            const n = attempts.get(socketUri) ?? 0

            if (n >= MAX_ATTEMPTS) {
                if (DEBUG) {
                    console.warn(
                        `[WebSocket] - ${MAX_ATTEMPTS} reintentos agotados para ${socketUri}, me rindo`,
                    )
                }
                attempts.delete(socketUri)
                autoRetry.delete(socketUri)
                set((state) => ({
                    exhausted: { ...state.exhausted, [socketUri]: true },
                }))
                return
            }

            attempts.set(socketUri, n + 1)

            const base = Math.min(1000 * 2 ** n, MAX_DELAY)
            const delay = base / 2 + Math.random() * (base / 2)

            if (DEBUG) {
                console.log(`[WebSocket] - Reconectar en ${Math.round(delay)}ms (intento ${n + 1}/${MAX_ATTEMPTS})`,)
            }

            timers.set(
                socketUri,
                window.setTimeout(() => {
                    timers.delete(socketUri)
                    autoRetry.add(socketUri)
                    get().connect(socketUri)
                }, delay),
            )
        }

        socket.onmessage = (evt) => {
            try {
                websocketDispatcher.dispatch(JSON.parse(evt.data))
            } catch (err) {
                if (DEBUG) console.error("[WebSocket] - Mensaje no parseable", err, evt.data)
            }
        }

        socket.onerror = (evt) => {
            if (DEBUG) console.error("[WebSocket] - Error", evt)
        }
    },

    disconnect(socketUri = DEFAULT_URI) {
        clearTimer(socketUri)
        attempts.delete(socketUri)
        autoRetry.delete(socketUri)

        const socket = active.get(socketUri)
        if (socket) {
            intentional.add(socket)
            active.delete(socketUri)
            socket.close(1000, "client disconnect")
        }

        set((state) => ({
            connected: { ...state.connected, [socketUri]: false },
            exhausted: { ...state.exhausted, [socketUri]: false },
        }))
    },

    send(socketUri, data) {
        const socket = active.get(socketUri)
        if (socket?.readyState !== WebSocket.OPEN) return
        socket.send(JSON.stringify(data))
    },
}))

export default useWebsocket