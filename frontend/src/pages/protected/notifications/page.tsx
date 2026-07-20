import axiosClient from '@/clients/axiosClient';
import type { NotificationResponse, Notification } from '@/domain/notifications';
import { cn } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Link, useNavigate } from 'react-router';
import React from 'react'
import { BellOff, CheckCheck, MessageCircleCheck, MessageCircleReply, MoreHorizontal, RotateCw, Settings, Settings2, Trash2 } from 'lucide-react';
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
import NotificationItem from './notification-item-component';


function NotificationsPage() {

    const { data, } = useQuery<NotificationResponse>({
        queryKey: ['notifications'],
        queryFn: async () => {
            const { data } = await axiosClient.get(`/notifications/user/`);
            console.log(data);
            return data
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

    const unread: Notification[] = []
    const read: Notification[] = []
    notifications.forEach(n => n.is_read ? read.push(n) : unread.push(n))

    return (
        <div className='w-full max-w-5xl mx-auto p-8'>
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
                                <TabsTrigger value="unread">
                                    Unread
                                </TabsTrigger>

                                <TabsTrigger value="read">
                                    Read
                                </TabsTrigger>

                                <TabsTrigger value="all">
                                    All
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
                        <section className='p-3 rounded-lg border-2 border-dashed min-h-70'>
                            <TabsContent value="unread" className='space-y-1'>
                                {unread?.map((notification) =>
                                    <NotificationItem key={notification.id} notification={notification} />
                                )}
                                {unread.length === 0 && (
                                    <div className="flex flex-col items-center justify-center text-center py-12 px-4 animate-in fade-in-50 duration-300">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                            <BellOff className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <h3 className="mt-4 text-sm font-semibold tracking-tight">No unread notifications</h3>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            You're all caught up! You don't have any unread notifications right now.
                                        </p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="read" className='space-y-1'>
                                {read?.map((notification) =>
                                    <NotificationItem key={notification.id} notification={notification} />
                                )}
                                {read.length === 0 && (
                                    <div className="flex flex-col items-center justify-center text-center py-12 px-4 animate-in fade-in-50 duration-300">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                            <BellOff className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <h3 className="mt-4 text-sm font-semibold tracking-tight">No notifications</h3>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            You're all caught up! You don't have any notifications right now.
                                        </p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="all" className='space-y-1'>
                                {notifications?.map((notification) =>
                                    <NotificationItem key={notification.id} notification={notification} />
                                )}
                                {notifications.length === 0 && (
                                    <div className="flex flex-col items-center justify-center text-center py-12 px-4 animate-in fade-in-50 duration-300">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                            <BellOff className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <h3 className="mt-4 text-sm font-semibold tracking-tight">No notifications</h3>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            You're all caught up! You don't have any notifications right now.
                                        </p>
                                    </div>
                                )}
                            </TabsContent>
                        </section>
                    </CardContent>
                </Card>
            </Tabs>

        </div>
    )
}

export default NotificationsPage