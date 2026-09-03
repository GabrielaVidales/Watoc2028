import { notify } from "@/components/custom/notify"
import { isNotification } from "@/features/notifications/types/notifications"
import { NotificationDisplay } from "@/features/notifications/components/notification-item-component"
import websocketDispatcher from "@/stores/websocket-dispatcher"
import useWebsocket from "@/stores/websocket-store"
import React from "react"


export function useNotificationsWebsocket() {
    const connect = useWebsocket(w => w.connect)
    const disconnect = useWebsocket(w => w.disconnect)

    React.useEffect(() => {
        websocketDispatcher.register('notification.created', (data) => {
            if (isNotification(data)) {
                notify.custom(
                    () => <NotificationDisplay notification={data} />,
                    { closable: true, position: 'bottom-right' },
                    'default'
                )
            }
        })

        connect('api/notifications/')

        return () => {
            websocketDispatcher.unregister('notification.created')
            disconnect('api/notifications/')
        }
    }, [])
}