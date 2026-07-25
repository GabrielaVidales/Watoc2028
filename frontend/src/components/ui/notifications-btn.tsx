import axiosClient from "@/clients/axiosClient"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle, } from "@/components/ui/empty"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import type { NotificationResponse } from "@/domain/notifications"
import { cn } from "@/lib/utils"
import { urls } from "@/routes/routes"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowRight, Bell, BellOff, CheckCheck, MessageCircleCheck, MessageCircleReply, MoreHorizontal, RotateCw, Settings, Trash2 } from "lucide-react"
import { Fragment } from "react"
import { Link, useNavigate } from "react-router"
import { ScrollArea } from "./scroll-area"


export function NotificationsBell() {
    const navigate = useNavigate()

    const queryClient = useQueryClient()

    const { data, isLoading, refetch } = useQuery<NotificationResponse>({
        queryKey: ['notifications'],
        queryFn: async () => {
            const { data } = await axiosClient.get(`/notifications/user/`);
            console.log(data);
            return data
        },
    })

    const notifications = data?.notifications.results || []

    const unreadCount = data?.unread_count || 0

    const mutation = useMutation({
        mutationFn: async (ctx: { id?: number, is_read?: boolean, mark_all_read?: boolean }) => {
            if (ctx.mark_all_read) {
                const { data } = await axiosClient.patch(`/notifications/toggle-all-read/`);
                return data;
            }

            const { data } = await axiosClient.patch(`/notifications/${ctx.id}/toggle-is-read/`, { is_read: ctx.is_read });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'], refetchType: 'all' });
            refetch()
        },
    })

    const deleteMut = useMutation({
        mutationFn: async (id: number) => {
            const { data } = await axiosClient.delete(`/notifications/${id}/`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'], refetchType: 'all' });
            refetch()
        },
    })

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                    <Bell className="size-5" />
                    {unreadCount > 0 && (
                        <span
                            className={cn(
                                "absolute right-0 top-0",
                                "flex h-4 min-w-4 items-center justify-center",
                                "rounded-full px-1 text-white!",
                                "bg-destructive text-destructive-foreground",
                                "text-[10px] font-semibold leading-none",
                                unreadCount > 99 && "min-w-7"
                            )}
                        >
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="max-w-xs sm:max-w-sm md:max-w-md w-full md:w-100 max-sm:px-1">
                <section className="flex flex-col sm:flex-row gap-2 items-center justify-between border-b px-0 pb-3">
                    <div>
                        <h4 className="font-semibold">Notifications</h4>
                        <p className="text-xs text-muted-foreground">
                            Stay up to date.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => await mutation.mutateAsync({ mark_all_read: true })}
                            className="text-xs sm:text-sm"
                        >
                            <CheckCheck />
                            Mark all as read
                        </Button>

                        <Button
                            size="icon-sm"
                            variant="outline"
                            onClick={async () => { await refetch() }}
                        >
                            <RotateCw
                                className={cn(
                                    isLoading && "animate-spin"
                                )}
                            />
                        </Button>
                    </div>
                </section>

                <div className="flex h-80 items-center justify-center my-3">
                    <ScrollArea className="w-full h-80 -mr-3 pr-3">
                        {(!notifications || notifications.length === 0) && (
                            <Empty>
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <BellOff className="size-6" />
                                    </EmptyMedia>

                                    <EmptyTitle>
                                        You're all caught up
                                    </EmptyTitle>

                                    <EmptyDescription>
                                        New notifications will appear here.
                                    </EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        )}

                        <div className="space-y-1">
                            {notifications?.map((notification) => {
                                const actorName = notification.actor
                                    ? `${notification.actor.first_name} ${notification.actor.last_name}`
                                    : "System:";

                                return (
                                    <fieldset
                                        disabled={isLoading || mutation.isPending || deleteMut.isPending}
                                        key={notification.id}
                                        className={cn(
                                            "group relative cursor-pointer p-2 border-2 border-border rounded-md transition-colors duration-300",
                                            "hover:border-primary-light hover:shadow-sm",
                                            notification.is_read && "bg-muted-foreground/13"
                                        )}
                                    >
                                        <div
                                            onClick={async () => {
                                                if (!notification.is_read) {
                                                    await mutation.mutateAsync({
                                                        id: notification.id,
                                                        is_read: true,
                                                    })
                                                }
                                                if (notification.target_url) {
                                                    navigate(notification.target_url || "#")
                                                }
                                            }}
                                            className="flex flex-1 items-center gap-3 min-w-0 pr-12 md:pr-0"
                                        >
                                            <div className="relative shrink-0">
                                                <Avatar className="size-10 border shadow-sm">
                                                    <AvatarImage src={notification.actor?.photo as string ?? null} />
                                                    <AvatarFallback>
                                                        {notification.actor ? (
                                                            actorName
                                                                .split(" ")
                                                                .map((x) => x[0])
                                                                .join("")
                                                                .slice(0, 2)
                                                        ) : (
                                                            <Settings className="size-6" />
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>

                                                {!notification.is_read && (
                                                    <span className="absolute right-0 top-0 size-2 rounded-full bg-destructive ring-2 ring-background" />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1 text-xs">
                                                <p className="leading-relaxed wrap-anywhere pr-8 break-all">
                                                    <span className="font-semibold">
                                                        {actorName}
                                                    </span>{" "}
                                                    <span className="text-muted-foreground">
                                                        {notification.message}
                                                    </span>
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(notification.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"
                                                    //  className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                                                    className={cn(
                                                        "absolute top-2 right-2 shrink-0 transition-opacity",
                                                        "opacity-100",
                                                        "md:opacity-0 md:group-hover:opacity-100"
                                                    )}
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
                                                        onClick={() => {
                                                            mutation.mutate({
                                                                id: notification.id,
                                                                is_read: !notification.is_read,
                                                            })
                                                        }}
                                                    >
                                                        {notification.is_read ? (
                                                            <Fragment>
                                                                <MessageCircleReply />
                                                                <span>Mark as unread</span>
                                                            </Fragment>
                                                        ) : (
                                                            <Fragment>
                                                                <MessageCircleCheck />
                                                                <span>Mark as read</span>
                                                            </Fragment>
                                                        )}
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onClick={() => {
                                                            deleteMut.mutate(notification.id)
                                                        }}
                                                    >
                                                        <Trash2 />
                                                        <span>Delete</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </fieldset>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </div>

                <div className="border-t">
                    <Button variant="ghost" className="w-full justify-center text-xs" asChild>
                        <Link to={urls.users.notifications}>
                            View all notifications
                            <ArrowRight className="ml-2 size-4" />
                        </Link>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
