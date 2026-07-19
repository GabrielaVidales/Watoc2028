import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import websocketDispatcher from '@/stores/websocket-dispatcher';
import { timeAgo } from '@/utils/utils';
import { Settings } from 'lucide-react';
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner';

function Sockets() {
    const [inputMensaje, setInputMensaje] = useState('');
    const [mensajesDelServidor, setMensajesDelServidor] = useState([]);
    const socketRef = useRef<WebSocket | null>(null);

    websocketDispatcher.register('notification.created', (data) => {
        console.log('QUEEEEEEEEEE??!?!?!?!?!?s');
        
        setMensajesDelServidor((prev) => [...prev, data.respuesta_api.verb]);

        const notification = data.respuesta_api
        const actorName = notification.actor
            ? `${notification.actor.first_name} ${notification.actor.last_name}`
            : "[System] —";

        toast.custom((id) => (
            <div
                className="group flex cursor-pointer items-center gap-3 transition-all"
                onClick={() => {
                    toast.dismiss(id);
                }}
            >
                <div className="relative shrink-0">
                    <Avatar className="size-11 border shadow-sm">
                        <AvatarImage src={/* avatarUrl */ ""} />
                        <AvatarFallback>
                            {notification.actor ? (
                                actorName
                                    .split(" ")
                                    .map((x) => x[0])
                                    .join("")
                                    .slice(0, 2)
                            ) : (
                                <Settings className="size-4" />
                            )}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-sm leading-relaxed">
                        <span className="font-semibold">
                            {actorName}
                        </span>{" "}
                        <span className="text-muted-foreground">
                            {notification.vemessagerb}
                        </span>
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                        {timeAgo(notification.created_at)}
                    </p>
                </div>
            </div>
        ), {
            dismissible: false,
            duration: Infinity,
        })
    })


    const enviarMensaje = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            // Mandar el mensaje estructurado en JSON hacia Django
            socketRef.current.send(JSON.stringify({
                mensaje: inputMensaje
            }));
            setInputMensaje('');
        }
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
            <h1>React + Django Channels API</h1>

            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    value={inputMensaje}
                    onChange={(e) => setInputMensaje(e.target.value)}
                    placeholder="Escribe un mensaje para el backend..."
                    style={{ padding: '10px', width: '300px', marginRight: '10px' }}
                />
                <button onClick={enviarMensaje} style={{ padding: '10px 20px' }}>
                    Enviar por WebSocket
                </button>
            </div>

            <h2>Respuestas en Tiempo Real desde Django:</h2>
            <div style={{ background: '#222', color: '#fff', padding: '15px', borderRadius: '5px' }}>
                {mensajesDelServidor.length === 0 ? <p>Esperando mensajes...</p> : null}
                {mensajesDelServidor.map((msg, index) => (
                    <p key={index} style={{ margin: '5px 0', color: '#00ffcc' }}>🔹 {msg}</p>
                ))}
            </div>
        </div>
    );
}
export default Sockets