import api from '@/clients/api';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb";
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from '@/components/ui/field';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Notification, NotificationResponse } from '@/domain/notifications';
import { routes } from '@/routes/routes';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { BellOff, CheckCheck, RotateCw, Settings2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import NotificationItem from './notification-item-component';

function NotificationsPage() {
    const [page, setPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const { data, isLoading } = useQuery<NotificationResponse>({
        queryKey: ['notifications', page, itemsPerPage],
        queryFn: async () => {
            const { data } = await api.get('/notifications/user/', {
                params: {
                    page: page,
                    limit: itemsPerPage,
                }
            });
            return data
        },
        placeholderData: keepPreviousData
    })

    if (!data) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    const { results } = data.notifications

    const unread: Notification[] = []
    const read: Notification[] = []
    results.forEach(n => n.is_read ? read.push(n) : unread.push(n))

    return (
        <div className='w-full max-w-5xl mx-auto p-8'>
            <Breadcrumb className='mb-8'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to={routes.users.profile}>
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
                                <SelectItemsPerPage
                                    itemsPerPage={itemsPerPage}
                                    setItemsPerPage={setItemsPerPage}

                                />

                                <Button size="sm" variant="outline">
                                    <CheckCheck />
                                    Mark all as read
                                </Button>

                                <Button size="sm" variant="outline">
                                    <RotateCw />
                                </Button>
                            </div>

                        </div>
                    </CardHeader>

                    <ScrollArea className='px-4 h-100 bg-secondary border-y'>
                        <TabsContent value="unread" className='space-y-1 py-4'>
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

                        <TabsContent value="read" className='space-y-1 py-4'>
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

                        <TabsContent value="all" className='space-y-1 py-4'>
                            {results?.map((notification) =>
                                <NotificationItem key={notification.id} notification={notification} />
                            )}
                            {results.length === 0 && (
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
                    </ScrollArea>

                    <CardFooter>
                        {!isLoading && (
                            <PaginationController
                                page={page}
                                onPageChange={setPage}
                                totalPages={data.notifications.meta.total_pages}
                            />
                        )}
                    </CardFooter>
                </Card>
            </Tabs>
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
                    {previousPage ? (
                        <button
                            type="button"
                            className="h-9 min-w-9 px-3 border rounded-md text-sm hover:bg-accent"
                            onClick={() => onPageChange(previousPage)}
                        >
                            {previousPage}
                        </button>
                    ) : (
                        <div className="h-9 min-w-9 bg-muted rounded-md border" />
                    )}
                </PaginationItem>

                <PaginationItem>
                    <Select
                        value={String(page)}
                        onValueChange={(value) =>
                            onPageChange(Number(value))
                        }
                    >
                        <SelectTrigger className="w-16 h-9">
                            <SelectValue />
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
                    {nextPage ? (
                        <button
                            type="button"
                            className="h-9 min-w-9 px-3 border rounded-md text-sm hover:bg-accent"
                            onClick={() => onPageChange(nextPage)}
                        >
                            {nextPage}
                        </button>
                    ) : (
                        <div className="h-9 min-w-9 bg-muted rounded-md border" />
                    )}
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
            </PaginationContent>
        </Pagination>
    )
}



type SelectItemsPerPageProps = {
    itemsPerPage: number
    setItemsPerPage: (n: number) => void
    options?: number[]
}

export function SelectItemsPerPage({ setItemsPerPage, itemsPerPage, options = [5, 10, 20] }: SelectItemsPerPageProps) {
    return (
        <Field orientation="horizontal" className="w-fit">
            <FieldLabel htmlFor="select-rows-per-page">Items per page</FieldLabel>
            <Select defaultValue="10" value={`${itemsPerPage}`} onValueChange={(value) => {
                const limit = Number(value)
                if (!isNaN(limit)) {
                    setItemsPerPage(limit)
                }
            }}>
                <SelectTrigger className="w-20" id="select-rows-per-page">
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
