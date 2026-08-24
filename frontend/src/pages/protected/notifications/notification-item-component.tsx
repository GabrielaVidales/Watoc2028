import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import type { Notification } from '@/domain/notifications';
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from '@/lib/utils';
import { deleteNotification, toggleIsReadNotification } from '@/services/notifications/notifications-services';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { ExternalLinkIcon, MessageCircleCheck, MessageCircleReply, MoreHorizontalIcon, Settings, Trash2 } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router';


type Props = {
    notification: Notification
}

function NotificationItem({ notification }: Props) {
    const navigate = useNavigate()

    const isMobile = useIsMobile()

    const queryClient = useQueryClient()

    const mutation = useMutation<Notification, AxiosError, { id: number, is_read: boolean }>({
        mutationFn: toggleIsReadNotification,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['notifications'],
                refetchType: 'all',
            })
        },
    })

    const deleteMut = useMutation<void, AxiosError, number>({
        mutationFn: deleteNotification,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['notifications'],
                refetchType: 'all',
            })
        },
    })

    const goToAction = () => {
        if (notification.urlpath) {
            navigate(notification.urlpath || "#")
        }
    }

    return (
        <fieldset
            disabled={mutation.isPending || deleteMut.isPending}
            key={notification.id}
            className={cn(
                "group border-2 border-border rounded-md transition-colors duration-300 bg-card",
                "dark:hover:brightness-120 hover:brightness-95",
                "flex flex-row items-start justify-between gap-3",
                notification.is_read && "dark:brightness-120 brightness-95",
            )}
        >
            <NotificationDisplay notification={notification} />

            <div className='py-3 pr-3'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            className={cn(
                                "shrink-0 transition-opacity",
                                isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                            )}
                        >
                            <MoreHorizontalIcon className='size-5 shrink-0' />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-40" align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-xs text-muted-foreground">
                                Actions
                            </DropdownMenuLabel>

                            <DropdownMenuItem onClick={goToAction}>
                                <ExternalLinkIcon />
                                <span>View more</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => {
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
                                onClick={() => deleteMut.mutate(notification.id)}
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


function NotificationDisplay({ notification }: Props) {
    const navigate = useNavigate()

    const actor = notification?.actor

    const queryClient = useQueryClient()

    const mutation = useMutation<Notification, AxiosError, { id: number, is_read: boolean }>({
        mutationFn: toggleIsReadNotification,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['notifications'],
                refetchType: 'all',
            })
        },
    })

    const onNotificationTapped = async () => {
        if (!notification.is_read) {
            await mutation.mutateAsync({
                id: notification.id,
                is_read: true,
            })
        }
        // if (notification.urlpath) {
        //     navigate(notification.urlpath || "#")
        // }
    }

    return (
        <div onClick={onNotificationTapped} className="cursor-pointer flex flex-1 items-start gap-3 min-w-0 p-3">
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
                <p className="text-[13px] leading-tight">
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
        </div>
    )
}


export default NotificationItem

export {
    NotificationDisplay
};

