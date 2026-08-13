import api from "@/clients/api"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle, } from "@/components/ui/empty"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import type { NotificationResponse } from "@/domain/notifications"
import { cn } from "@/lib/utils"
import NotificationItem from "@/pages/protected/notifications/notification-item-component"
import { routes } from "@/routes/routes"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowRight, Bell, BellOff, CheckCheck, RotateCw } from "lucide-react"
import { Link } from "react-router"
import { ScrollArea } from "./scroll-area"


export function NotificationsBell() {
    const queryClient = useQueryClient()

    const { data, isLoading, refetch } = useQuery<NotificationResponse>({
        queryKey: ['notifications'],
        queryFn: async () => {
            const { data } = await api.get(`/notifications/user/`);
            return data
        },
    })

    const notifications = data?.notifications.results || []

    const unreadCount = data?.unread_count || 0

    const toggleMutation = useMutation({
        mutationFn: async (ctx: { id?: number, is_read?: boolean, mark_all_read?: boolean }) => {
            if (ctx.mark_all_read) {
                const { data } = await api.patch(`/notifications/toggle-all-read/`);
                return data;
            }

            const { data } = await api.patch(`/notifications/${ctx.id}/toggle-is-read/`, { is_read: ctx.is_read });
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
                                "absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full px-1",
                                "text-white! bg-destructive text-destructive-foreground text-[10px] font-semibold leading-none",
                                unreadCount > 99 && "min-w-7"
                            )}
                        >
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="bg-card max-w-xs sm:max-w-sm md:max-w-md w-full md:w-100 max-sm:px-1">
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
                            onClick={async () => await toggleMutation.mutateAsync({ mark_all_read: true })}
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

                <div className="flex items-center justify-center">
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

                        <div className="my-3">
                            {notifications?.map((notification) => (
                                <NotificationItem key={notification.id} notification={notification} />
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                <div className="border-t">
                    <Button variant="ghost" className="w-full justify-center text-xs" asChild>
                        <Link to={routes.users.notifications}>
                            View all notifications
                            <ArrowRight className="ml-2 size-4" />
                        </Link>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
