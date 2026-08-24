import { AppSidebar } from "@/components/custom/app-sidebar"
import ChangeThemeButton from '@/components/custom/change-theme-button'
import RightSidebar from '@/components/custom/right-sidebar'
import { Avatar, AvatarFallback, AvatarImage, } from "@/components/ui/avatar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { RightSidebarProvider, useRightSidebar } from '@/contexts/RightSidebarContext'
import { useIsMobile } from '@/hooks/use-mobile'
import { useNotificationsWebsocket } from "@/hooks/use-notifications-websocket"
import { NotificationsBell } from '@/pages/protected/notifications/notifications-btn'
import { routes } from "@/routes/routes"
import { BadgeCheckIcon, LogOutIcon, Settings2 } from "lucide-react"
import React, { Fragment } from 'react'
import { Link, Outlet, useLocation, } from "react-router"

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

export function DashboardLayout() {
    return (
        <RightSidebarProvider>
            <DashboardLayoutContent />
        </RightSidebarProvider>
    )
}

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

function DashboardLayoutContent() {
    const { content, width, defaultOpen } = useRightSidebar()

    useNotificationsWebsocket()

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
                            <div className='no-scrollbar overflow-auto h-full bg-background'>
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