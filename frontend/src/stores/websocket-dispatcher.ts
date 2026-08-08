type WebSocketMessage = {
    type: string
    message: any
}

class WebSocketDispatcher {
    private handlers = new Map<string, (data: any) => void>

    register(key: string, handler: (data: any) => void) {
        this.handlers.set(key, handler)
    }

    dispatch(message: WebSocketMessage) {
        const handler = this.handlers.get(message.type)
        if (!handler) {
            if (import.meta.env.VITE_DEBUG) {
                console.warn(`Handler not found for: ${message?.type}`, message);
            }
            return
        }

        handler(message.message)
    }

    unregister(key: string) {
        if (this.handlers.has(key)) {
            this.handlers.delete(key)
        }
    }

}

const websocketDispatcher = new WebSocketDispatcher();

export default websocketDispatcher
