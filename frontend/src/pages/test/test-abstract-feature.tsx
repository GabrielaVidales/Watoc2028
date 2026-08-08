import websocketDispatcher from '@/stores/websocket-dispatcher'
import useWebsocket from '@/stores/websocket-store'
import React, { useEffect } from 'react'

function TestAbstractFeature() {

    const connect = useWebsocket(w => w.connect)
    const disconnect = useWebsocket(w => w.disconnect)

    websocketDispatcher.register('task-connection', (data) => {
        console.log(data);
    })

    useEffect(() => {
        connect()
        return disconnect
    }, [])

    return (
        <div>



        </div>
    )
}

export default TestAbstractFeature