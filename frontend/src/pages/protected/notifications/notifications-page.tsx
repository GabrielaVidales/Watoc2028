import api from '@/clients/api';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { NotificationResponse } from '@/domain/notifications';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BellOff, BellRing, CheckCheck, ChevronsLeftIcon, ChevronsRightIcon, HashIcon, RotateCw, Settings2 } from 'lucide-react';
import { useState, type HTMLAttributes } from 'react';
import NotificationItem from './notification-item-component';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { InputGroupAddon, InputGroupText } from '@/components/ui/input-group';

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

    const results = isLoading ? [] : data.notifications.results

    return (
        <div className='w-full h-full flex flex-col'>
            <div className='bg-background border-b-2 border-b-border space-y-4 p-2 sm:p-4 md:p-6 lg:p-8'>
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

            <div className='bg-background h-full p-2 sm:p-4 md:p-6 lg:p-8'>
                <Tabs value={value} onValueChange={(setValue)} className="w-full max-w-5xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <TabsList variant="default">
                                <TabsTrigger value="unread">
                                    Unread
                                </TabsTrigger>

                                <TabsTrigger value="read">
                                    Read
                                </TabsTrigger>
                            </TabsList>

                            {/* <span className='text-sm'>{results.length} notifications</span> */}
                        </div>

                        <div className="flex gap-2">
                            {!isMobile && (
                                <SelectItemsPerPage
                                    itemsPerPage={itemsPerPage}
                                    setItemsPerPage={setItemsPerPage}
                                    size='sm'
                                />
                            )}

                            <Button size="sm" variant="outline" onClick={() => toggleAllMutation.mutate()}>
                                <CheckCheck />
                                Mark all as read
                            </Button>

                            <Button size="icon-sm" variant="outline" onClick={refetchNotifications}>
                                <RotateCw />
                            </Button>
                        </div>
                    </div>

                    <ScrollArea className='h-100 border-y bg-background'>
                        <fieldset disabled={isLoading} className={cn(
                            "space-y-2 py-4",
                            isLoading ? 'pointer-events-none' : 'pointer-events-auto'
                        )}>
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

                    {!isLoading && (
                        <PaginationController
                            page={page}
                            onPageChange={setPage}
                            totalPages={data.notifications.meta.total_pages}
                        />
                    )}
                </Tabs>
            </div>
        </div>
    )
}

export default NotificationsPage



type PaginationControllerProps = {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function PaginationController({
    onPageChange,
    totalPages,
    page,
}: PaginationControllerProps) {
    const previousPage = page > 1 ? page - 1 : null
    const nextPage = page < totalPages ? page + 1 : null
    const pages = Array.from(
        { length: totalPages },
        (_, i) => i + 1
    )

    return (
        <Pagination>
            <PaginationContent>

                <PaginationItem>
                    <PaginationLink
                        title="Go to first page"
                        aria-label="Go to first page"
                        className={cn("gap-1 px-2.5 sm:pl-2.5")}
                        size="icon"
                        onClick={e => {
                            e.preventDefault()
                            onPageChange(1)
                        }}
                    >
                        <ChevronsLeftIcon />
                    </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={e => {
                            e.preventDefault()
                            if (page > 1)
                                onPageChange(page - 1)
                        }}
                    />
                </PaginationItem>

                <PaginationItem>
                    <Select
                        value={String(page)}
                        onValueChange={(value) =>
                            onPageChange(Number(value))
                        }
                    >
                        <SelectTrigger size='sm'>
                            <HashIcon className='text-transparent'/>
                            <SelectValue /> / {totalPages}
                        </SelectTrigger>

                        <SelectContent>
                            {pages.map((item) => (
                                <SelectItem
                                    key={item}
                                    value={String(item)}
                                >
                                    {item}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </PaginationItem>

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={e => {
                            e.preventDefault()
                            if (page < totalPages)
                                onPageChange(page + 1)
                        }}
                    />
                </PaginationItem>

                <PaginationItem>
                    <PaginationItem>
                        <PaginationLink
                            title="Go to last page"
                            aria-label="Go to last page"
                            className={cn("gap-1 px-2.5 sm:pl-2.5")}
                            size="icon"
                            onClick={e => {
                                e.preventDefault()
                                onPageChange(totalPages)
                            }}
                        >
                            <ChevronsRightIcon />
                        </PaginationLink>
                    </PaginationItem>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}



type SelectItemsPerPageProps = {
    itemsPerPage: number
    setItemsPerPage: (n: number) => void
    options?: number[]
    size?: "sm" | "default"
} & HTMLAttributes<HTMLSelectElement>

export function SelectItemsPerPage({
    setItemsPerPage,
    itemsPerPage,
    options = [5, 10, 20],
    size = 'default'
}: SelectItemsPerPageProps) {
    return (
        <Field orientation="horizontal" className="w-fit">
            <FieldLabel htmlFor="select-rows-per-page">Items per page</FieldLabel>
            <Select defaultValue="10" value={`${itemsPerPage}`} onValueChange={(value) => {
                const limit = Number(value)
                if (!isNaN(limit)) {
                    setItemsPerPage(limit)
                }
            }}>
                <SelectTrigger size={size} className="w-18" id="select-rows-per-page">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent align="start">
                    <SelectGroup>
                        {options.map(item => (
                            <SelectItem key={item} value={`${item}`}>{item}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </Field>
    )
}

