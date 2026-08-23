import React, { Fragment, useEffect, useRef } from 'react'
import { type LucideIcon, FileBadge, FileType2, PackageCheck, ChevronDown, Bell, Settings2, Settings, Plus, PanelRight, PanelLeft, LayoutDashboard } from "lucide-react"
import { Link, Outlet, useLocation, } from "react-router"
import { routes } from "@/routes/routes"
import { useAuth } from "@/contexts/AuthContext"
import { RightSidebarTrigger, SidebarInset, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/custom/app-sidebar"
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
import RightSidebar from '@/components/custom/right-sidebar'
import { RightSidebarProvider, useRightSidebar } from '@/contexts/RightSidebarContext'
import ChangeThemeButton from '@/components/custom/change-theme-button'


export function DropdownMenuAvatar() {
    const { user: user, handleLogout } = useAuth()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full" size='icon-lg'>
                    <Avatar className="h-8 w-8 rounded-full">
                        <AvatarImage src={user.photo as string || null} alt={`${user.full_name} Profile Picture`} />
                        <AvatarFallback>LR</AvatarFallback>
                    </Avatar>
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

export function DashboardLayout() {
    return (
        <RightSidebarProvider>
            <DashboardLayoutContent />
        </RightSidebarProvider>
    )
}



function DashboardLayoutContent() {
    const { content, width, defaultOpen } = useRightSidebar()

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

    const header = (
        <header className="sticky top-0 z-50 border-b shrink-0 h-14 flex items-center bg-card">
            <div className='w-full px-3 mx-auto flex flex-row justify-between items-center gap-6'>
                <div className='flex flex-row items-center gap-8 shrink-0'>
                    <SidebarTrigger />

                    <DynamicBreadcrumb />
                </div>
                <div className='flex flex-row items-center gap-3'>
                    <NotificationsBell />

                    <ChangeThemeButton variant='ghost' />

                    <DropdownMenuAvatar />
                </div>
            </div>
        </header>
    )


    if (content) {
        return (
            <SidebarProvider id='sidebar-provider' defaultOpen={false}>
                <AppSidebar />

                <SidebarInset className="min-h-screen overflow-hidden">

                    {header}

                    <SidebarProvider
                        style={{ "--sidebar-width": width, } as React.CSSProperties}
                        defaultOpen={defaultOpen}
                    >
                        <SidebarInset className="min-h-screen overflow-hidden">
                            <div className='no-scrollbar overflow-auto h-full bg-secondary'>
                                <Outlet />
                            </div>
                        </SidebarInset>

                        <RightSidebar />

                    </SidebarProvider>
                </SidebarInset>

            </SidebarProvider>
        )
    }

    return (
        <SidebarProvider id='sidebar-provider'>
            <AppSidebar />

            <SidebarInset className="min-h-screen overflow-hidden">
                {header}
                <div className='no-scrollbar overflow-auto h-full bg-background'>
                    <Outlet />
                </div>
            </SidebarInset>

        </SidebarProvider>
    )
}

export default DashboardLayout


function DynamicBreadcrumb() {
    const isMobile = useIsMobile()

    if (isMobile) {
        return null
    }

    const location = useLocation().pathname
        .split('/')
        .filter(v => !!v && v !== 'user')

    return (
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
    )
}

