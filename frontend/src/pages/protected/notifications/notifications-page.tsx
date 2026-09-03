import api from '@/clients/api';
import { PaginationController, SelectItemsPerPage } from '@/components/custom/pagination-controller';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { NotificationResponse } from '@/features/notifications/types/notifications';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BellOff, BellRing, CheckCheck, RotateCw, Settings2 } from 'lucide-react';
import { useState } from 'react';
import NotificationItem from '../../../features/notifications/components/notification-item-component';

function NotificationsPage() {
    const isMobile = useIsMobile()

    const queryClient = useQueryClient()

    const [value, setValue] = useState('unread')
    const [page, setPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const { data, isLoading } = useQuery<NotificationResponse>({
        queryKey: ['notifications', page, itemsPerPage, value],
        queryFn: async () => {
            const { data } = await api.get('/notifications/user/', {
                params: {
                    page: page,
                    limit: itemsPerPage,
                    is_read: value === 'unread' ? false : true
                }
            });
            return data
        },
        placeholderData: keepPreviousData
    })

    const refetchNotifications = () => {
        queryClient.invalidateQueries({
            queryKey: ['notifications', page, itemsPerPage, value],
        });
    }

    const toggleAllMutation = useMutation({
        mutationFn: async () => {
            const { data } = await api.patch(`/notifications/toggle-all-read/`);
            return data;
        },
        onSuccess: refetchNotifications,
    })

    const results = data ? data.notifications.results : []

    return (
        <div className='p-2 sm:p-4 md:p-6 lg:p-8 space-y-8'>
            <div className='bg-background max-w-6xl mx-auto space-y-4 mb-8'>
                <div className='flex flex-col md:flex-row md:justify-between gap-5'>
                    <div className="flex items-start gap-3">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-light/10 border-2 border-primary-main/20 text-primary">
                            <BellRing className="text-primary-main stroke-2 size-8" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold">
                                Notifications
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Manage your notifications
                            </p>
                        </div>
                    </div>

                    <Button variant="outline">
                        <Settings2 />
                        Preferences
                    </Button>
                </div>
            </div>

            <div className='max-w-6xl mx-auto'>
                <Card>
                    <CardContent>
                        <Tabs value={value} onValueChange={(setValue)} className="w-full max-w-6xl mx-auto">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <TabsList variant="line">
                                        <TabsTrigger value="unread">
                                            Unread
                                        </TabsTrigger>

                                        <TabsTrigger value="read">
                                            Read
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <div className="flex gap-2">
                                    {!isMobile && (
                                        <SelectItemsPerPage
                                            itemsPerPage={itemsPerPage}
                                            setItemsPerPage={setItemsPerPage}
                                            size='sm'
                                        />
                                    )}

                                    <Button size={isMobile ? "xs" : "sm"} variant="outline" onClick={() => toggleAllMutation.mutate()}>
                                        <CheckCheck />
                                        Mark all as read
                                    </Button>

                                    <Button size={isMobile ? "xs" : "sm"} variant="outline" onClick={refetchNotifications}>
                                        <RotateCw />
                                    </Button>
                                </div>
                            </div>

                            <ScrollArea className='h-100 border-y px-2'>
                                <fieldset
                                    disabled={isLoading}
                                    className={cn(
                                        "space-y-2 py-2",
                                        isLoading ? 'pointer-events-none' : 'pointer-events-auto'
                                    )}
                                >
                                    {results?.map((notification) =>
                                        <NotificationItem key={notification.id} notification={notification} />
                                    )}

                                    {results.length === 0 && (
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
                                </fieldset>
                            </ScrollArea>

                            {data && (
                                <PaginationController
                                    page={page}
                                    onPageChange={setPage}
                                    totalPages={data.notifications.meta.total_pages}
                                />
                            )}
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default NotificationsPage

