import api from '@/clients/api';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import type { Notification } from '@/domain/notifications';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageCircleCheck, MessageCircleReply, MoreHorizontal, Settings, Trash2 } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router';


type Props = {
    notification: Notification
}

function NotificationItem({ notification }: Props) {
    const navigate = useNavigate()

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async (ctx: { id: number, is_read: boolean }) => {
            const { data } = await api.patch(`/notifications/${ctx.id}/toggle-is-read/`, { is_read: ctx.is_read });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'], refetchType: 'all' });
        },
    })

    const deleteMut = useMutation({
        mutationFn: async (id: number) => {
            const { data } = await api.delete(`/notifications/${id}/`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'], refetchType: 'all' });
        },
    })

    const onNotificationTapped = async () => {
        if (!notification.is_read) {
            await mutation.mutateAsync({
                id: notification.id,
                is_read: true,
            })
        }
        if (notification.target_url) {
            navigate(notification.target_url || "#")
        }
    }
    
    const actor = notification.actor

    return (
        <fieldset
            disabled={mutation.isPending || deleteMut.isPending}
            key={notification.id}
            className={cn(
                "group cursor-pointer p-3 border-2 border-border rounded-md transition-colors duration-300",
                "hover:border-primary-light hover:shadow-sm",
                "flex flex-col items-start md:flex-row md:items-center justify-between gap-3",
                notification.is_read ? "bg-secondary" : 'bg-card'
            )}
        >
            <div onClick={onNotificationTapped} className="flex flex-1 items-start gap-3 min-w-0">
                <div className="relative shrink-0">
                    <Avatar className="size-10 border shadow-sm">
                        <AvatarImage src={actor?.photo as string ?? null} />
                        <AvatarFallback>
                            {actor ? (
                                `${actor.first_name} ${actor.last_name}`
                                    .split(" ")
                                    .map((x) => x[0])
                                    .join("")
                                    .slice(0, 2)
                            ) : (
                                <Settings className="size-4" />
                            )}
                        </AvatarFallback>
                    </Avatar>

                    {!notification.is_read && (
                        <span className="absolute -right-1 -top-1 size-3 rounded-full bg-destructive ring-2 ring-background" />
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-xs leading-tight">
                        {actor && (
                            <span className="font-semibold">
                                {actor.full_name}
                            </span>
                        )}{" "}
                        <span className="text-muted-accent" dangerouslySetInnerHTML={{ __html: notification.message }} />
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(notification.created_at).toLocaleString()}
                    </p>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon-xs"
                            className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={e => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                        >
                            <MoreHorizontal className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-40" align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-xs text-muted-foreground">
                                Actions
                            </DropdownMenuLabel>

                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    mutation.mutate({
                                        id: notification.id,
                                        is_read: !notification.is_read,
                                    })
                                }}
                            >
                                {notification.is_read ? (
                                    <React.Fragment>
                                        <MessageCircleReply />
                                        <span>Mark as unread</span>
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <MessageCircleCheck />
                                        <span>Mark as read</span>
                                    </React.Fragment>
                                )}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                variant="destructive"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    deleteMut.mutate(notification.id)
                                }}
                            >
                                <Trash2 />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </fieldset>
    );
}

export default NotificationItem