import React, { Fragment, useEffect, useRef } from 'react'
import { type LucideIcon, FileBadge, FileType2, PackageCheck, ChevronDown, Bell, Settings2, Settings } from "lucide-react"
import { Link, Outlet, useLocation, } from "react-router"
import { routes } from "@/routes/routes"
import { useAuth } from "@/contexts/AuthContext"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { BadgeCheckIcon, LogOutIcon, } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage, } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { NotificationsBell } from '@/components/ui/notifications-btn'
import useWebsocket from '@/stores/websocket-store'
import websocketDispatcher from '@/stores/websocket-dispatcher'
import { toast } from 'sonner'
import { timeAgo } from '@/utils/utils'
import type { Notification } from '@/domain/notifications'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { useIsMobile } from '@/hooks/use-mobile'


export function DropdownMenuAvatar() {
    const { user: user, handleLogout } = useAuth()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full">
                    <Avatar className="h-8 w-8 rounded-full border border-primary">
                        <AvatarImage src={user.photo as string || null} alt={`${user.full_name} Profile Picture`} />
                        <AvatarFallback>LR</AvatarFallback>
                    </Avatar>
                    <ChevronDown />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link to={routes.users.profile}>
                            <BadgeCheckIcon />
                            Account
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link to={routes.users.settings}>
                            <Settings2 />
                            Settings
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => await handleLogout()}>
                    <LogOutIcon />
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


function NotificationToast({ id, duration = 7000, notification }: { id: number | string, duration?: number, notification: Notification }) {
    const timer = useRef<number | null>(null);

    const startTimer = () => {
        if (timer.current) {
            clearTimeout(timer.current);
        }

        timer.current = window.setTimeout(() => {
            toast.dismiss(id);
        }, duration);
    };

    const stopTimer = () => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
    };

    useEffect(() => {
        startTimer();

        return stopTimer;
    }, []);

    const actorName = notification.actor
        ? `${notification.actor.first_name} ${notification.actor.last_name}`
        : "[System] —";

    return (
        <div
            className="group flex cursor-pointer items-center gap-3 transition-all"
            onMouseEnter={stopTimer}
            onMouseLeave={startTimer}
            onClick={() => {
                toast.dismiss(id);
            }}
        >
            <div className="relative shrink-0">
                <Avatar className="size-11 border shadow-sm">
                    <AvatarImage src={notification.actor?.photo as string || null} />
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
                        {notification.message}
                    </span>
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                    {timeAgo(notification.created_at)}
                </p>
            </div>
        </div>
    )
}



function DashboardLayout() {
    const isMobile = useIsMobile()

    const location = useLocation().pathname
        .split('/')
        .filter(v => !!v && v !== 'user')

    const connect = useWebsocket(w => w.connect)
    const disconnect = useWebsocket(w => w.disconnect)

    websocketDispatcher.register('notification.created', (data) => {
        const notification = data

        toast.custom((id) => (
            <NotificationToast id={id} notification={notification} />
        ), {
            dismissible: true,
            duration: Infinity,
        })
    })

    useEffect(() => {
        connect()
        return disconnect
    }, [])

    return (
        <SidebarProvider id='sidebar-provider' className='overflow-y-scroll'>
            <AppSidebar />

            <SidebarInset className="min-h-screen overflow-hidden">
                <header className="sticky top-0 z-50 border-b shrink-0 h-14 flex items-center">
                    <div className='w-full px-3 mx-auto flex flex-row justify-between items-center gap-6'>
                        <div className='flex flex-row items-center gap-8 shrink-0'>
                            <SidebarTrigger />

                            {!isMobile && (
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink asChild>
                                                <Link to={routes.users.profile}>
                                                    Dashboard
                                                </Link>
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>

                                        {location.map((segment, i) => (
                                            <Fragment key={`${segment}-${i}`}>
                                                <BreadcrumbSeparator />
                                                <BreadcrumbItem className="capitalize">
                                                    {i === location.length - 1 ? (
                                                        <BreadcrumbPage>{segment.replace(/-/g, " ")}</BreadcrumbPage>
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            {segment.replace(/-/g, " ")}
                                                        </span>
                                                    )}
                                                </BreadcrumbItem>
                                            </Fragment>
                                        ))}
                                    </BreadcrumbList>
                                </Breadcrumb>
                            )}
                        </div>

                        <div className='flex flex-row items-center'>
                            <NotificationsBell />

                            <DropdownMenuAvatar />
                        </div>
                    </div>
                </header>
                <div className='no-scrollbar overflow-auto h-full bg-secondary'>
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default DashboardLayout