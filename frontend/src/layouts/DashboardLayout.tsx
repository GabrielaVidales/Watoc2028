import React from 'react'
import { ChevronsLeft, ClipboardList, FileText, IdCard, LogIn, type LucideIcon, FileBadge, FileType2, PackageCheck, ChevronDown, Bell } from "lucide-react"
import { Link, Outlet, } from "react-router"
import { urls } from "@/routes/routes"
import { useAuth } from "@/contexts/AuthContext"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import {
    BadgeCheckIcon,
    BellIcon,
    CreditCardIcon,
    LogOutIcon,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownMenuAvatar() {
    const { currentUser } = useAuth()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full">
                    <Avatar className="h-8 w-8 rounded-full border border-primary">
                        <AvatarImage src={currentUser.photo as string || null} alt={`${currentUser.full_name} Profile Picture`} />
                        <AvatarFallback>LR</AvatarFallback>
                    </Avatar>
                    <ChevronDown />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <BadgeCheckIcon />
                        Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <CreditCardIcon />
                        Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <BellIcon />
                        Notifications
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LogOutIcon />
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}



const projects: {
    name: string
    url: string
    icon: LucideIcon
}[] = [
        {
            name: "Abstract Submissions",
            url: "#",
            icon: FileType2,
        },
        {
            name: "Congress Registration",
            url: "#",
            icon: PackageCheck,
        },
        {
            name: "Certificate of Attendance",
            url: "#",
            icon: FileBadge,
        },
    ]

function DashboardLayout() {
    return (
        <SidebarProvider className='bg-amber-300'>

            <AppSidebar
                projects={projects}
            />

            <SidebarInset className="h-screen overflow-y-auto bg-slate-50">

                <header className="sticky top-0 z-50 border-b bg-background shrink-0">
                    <div className='my-2 px-3 mx-auto flex flex-row justify-between items-center gap-6'>

                        <div className='flex flex-row items-center sm:items-start gap-3 max-w-sm shrink-0'>
                            <SidebarTrigger />

                        </div>

                        <div className='flex flex-row items-center'>
                            <Button variant='ghost' size='icon' className='rounded-full'>
                                <Bell />
                            </Button>

                            <DropdownMenuAvatar />
                        </div>
                    </div>
                </header>

                <div className='p-3 lg:p-5 xl:p-8'>
                    <Outlet />
                </div>
            </SidebarInset>

        </SidebarProvider>
    )
}

export default DashboardLayout