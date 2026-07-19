import axiosClient from '@/clients/axiosClient';
import type { NotificationResponse } from '@/domain/notifications';
import { cn } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Link, useNavigate } from 'react-router';
import React from 'react'
import { CheckCheck, MessageCircleCheck, MessageCircleReply, MoreHorizontal, RotateCw, Settings, Settings2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { urls } from '@/routes/routes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


function NotificationsPage() {
    const navigate = useNavigate()

    const queryClient = useQueryClient()

    const { data, refetch, isLoading } = useQuery<NotificationResponse>({
        queryKey: ['notifications'],
        queryFn: async () => {
            const { data } = await axiosClient.get(`/notifications/for-user/`);
            console.log(data);
            return data
        },
    })

    const mutation = useMutation({
        mutationFn: async (ctx: { id: number, is_read: boolean }) => {
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

    if (!data) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    const { notifications, unread_count } = data

    return (
        <div className='w-full max-w-5xl mx-auto'>
            <Breadcrumb className='mb-8'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to={urls.users.profile}>
                                Dashboard
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Notifications</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="mb-8 flex items-center justify-between">
                <div className='space-y-2'>
                    <CardTitle className='text-3xl'>Notifications</CardTitle>
                    <CardDescription>
                        Stay up to date with activity on your account.
                    </CardDescription>
                </div>

                <Button variant="outline">
                    <Settings2 />
                    Preferences
                </Button>
            </div>

            <Tabs defaultValue="unread" className="w-full">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between border-b">

                            <TabsList variant="line">
                                <TabsTrigger value="all">
                                    All
                                </TabsTrigger>

                                <TabsTrigger value="unread">
                                    Unread
                                </TabsTrigger>

                                <TabsTrigger value="read">
                                    Read
                                </TabsTrigger>
                            </TabsList>

                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                >
                                    <CheckCheck />
                                    Mark all as read
                                </Button>

                                <Button
                                    size="sm"
                                    variant="outline"
                                >
                                    <RotateCw />
                                </Button>
                            </div>

                        </div>

                    </CardHeader>
                    <CardContent>
                        <TabsContent value="all">
                            {notifications?.map((notification) => {
                                const actorName = notification.actor
                                    ? `${notification.actor.first_name} ${notification.actor.last_name}`
                                    : "[System] —";

                                return (
                                    <fieldset
                                        disabled={isLoading || mutation.isPending || deleteMut.isPending}
                                        key={notification.id}
                                        className={cn(
                                            "group cursor-pointer p-3 border-2 border-border rounded-md transition-colors duration-300",
                                            "hover:border-primary-light hover:shadow-sm",
                                            "flex flex-col items-start md:flex-row md:items-center justify-between gap-3",
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
                                            className="flex flex-1 items-center gap-3 min-w-0"
                                        >
                                            <div className="relative shrink-0">
                                                <Avatar className="size-11 border shadow-sm">
                                                    <AvatarImage src={notification.actor?.photo as string ?? null} />
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

                                                {!notification.is_read && (
                                                    <span className="absolute -right-1 -top-1 size-3 rounded-full bg-destructive ring-2 ring-background" />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm leading-relaxed">
                                                    <span className="font-semibold">
                                                        {actorName}
                                                    </span>{" "}
                                                    <span className="text-muted-foreground">
                                                        {notification.message}
                                                    </span>
                                                </p>

                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {new Date(notification.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
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
                        </TabsContent>
                        <TabsContent value="read">Change your password here.</TabsContent>
                    </CardContent>
                </Card>
            </Tabs>

        </div>
    )
}

export default NotificationsPage