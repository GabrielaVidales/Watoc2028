import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar, } from "@/components/ui/sidebar"
import { Link, NavLink, useNavigate, } from "react-router"
import { urls } from "@/routes/routes";
import { ArrowLeftFromLine, BadgeCheckIcon, Bell, Bot, ChevronDown, ChevronRight, ChevronUp, FileBadge, FileType2, Folder, Forward, LayoutDashboard, LayoutList, LogOut, MessageSquareDot, MoreHorizontal, PackageCheck, Settings2, Trash2, Users, type LucideIcon, } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import miniLogo from '@/assets/logo_img.png'
import React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";


type NavItem = {
    name: string
    url: string
    icon?: LucideIcon
}

type NavCollapsible = {
    title: string
    icon?: LucideIcon
    isActive?: boolean
    items?: NavItem[]
}


const projects: NavItem[] = [
    {
        name: "Abstract Submissions",
        url: urls.users.viewAbstracts,
        icon: FileType2,
    },
    {
        name: "Congress Registration",
        url: urls.users.confirmAssistance.start,
        icon: PackageCheck,
    },
    {
        name: "Certificate of Attendance",
        url: urls.users.profile,
        icon: FileBadge,
    },
]

const adminModules: NavCollapsible[] = [
    {
        title: 'Administration',
        icon: Bot,
        isActive: true,
        items: [
            {
                name: "Manage Users",
                url: urls.users.administration.manageUsers,
                icon: Users,
            },
            {
                name: "Abstract Reviews",
                url: urls.users.administration.manageReviewers,
                icon: LayoutList,
            },
        ]
    }
]



export function AppSidebar() {
    const { currentUser } = useAuth()

    return (
        <Sidebar>
            <SidebarHeader className="bg-background py-5">
                <TeamSwitcher />
            </SidebarHeader>

            <SidebarContent className="bg-background">
                <SidebarGroup>
                    <SidebarGroupLabel>
                        MAIN
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <NavLink to={urls.users.profile} className="hover:translate-x-1 transition-transform duration-300">
                                    <LayoutDashboard />
                                    <span>Dashboard</span>
                                </NavLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <NavLink to={urls.users.notifications} className="hover:translate-x-1 transition-transform duration-300">
                                    <MessageSquareDot />
                                    <span>Notifications</span>
                                </NavLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        {currentUser.roles.includes('admin') && (
                            <SidebarMenu>
                                {adminModules.map((item) => (
                                    <Collapsible
                                        key={item.title}
                                        asChild
                                        defaultOpen={item.isActive}
                                        className="group/collapsible"
                                    >
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton tooltip={item.title} className="hover:translate-x-1 transition-transform duration-300">
                                                    {item.icon && <item.icon />}
                                                    <span>{item.title}</span>
                                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.items?.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.name}>
                                                            <SidebarMenuSubButton asChild>
                                                                <NavLink to={subItem.url} className="hover:translate-x-1 transition-transform duration-300">
                                                                    {subItem.icon && <subItem.icon />}
                                                                    <span>{subItem.name}</span>
                                                                </NavLink>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                ))}
                            </SidebarMenu>
                        )}
                    </SidebarGroupContent>
                </SidebarGroup>


                <SidebarGroup>
                    <SidebarGroupLabel>
                        CONGRESS
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        {projects.map((item, i) => (
                            <SidebarMenuItem key={i}>
                                <SidebarMenuButton asChild>
                                    <NavLink to={item.url} title={item.name} className="hover:translate-x-1 transition-transform duration-300">
                                        <item.icon />
                                        <span>{item.name}</span>
                                    </NavLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarGroupContent>

                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>
                        MISC
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <NavLink to={urls.users.settings} className="hover:translate-x-1 transition-transform duration-300">
                                    <Settings2 />
                                    <span>Settings</span>
                                </NavLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={{
                    avatar: currentUser.photo as string || null,
                    email: currentUser.email,
                    name: currentUser.full_name
                }} />
            </SidebarFooter>
        </Sidebar>
    )
}



export function NavUser({
    user,
}: {
    user: {
        name: string
        email: string
        avatar: string
    }
}) {
    const { isMobile } = useSidebar()
    const { handleLogout } = useAuth()

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>

                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-full border border-primary">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user.name}</span>
                                <span className="truncate text-xs">{user.email}</span>
                            </div>
                            <ChevronUp className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{user.name}</span>
                                    <span className="truncate text-xs">{user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link to={urls.users.profile}>
                                    <BadgeCheckIcon />
                                    Account
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to={urls.users.settings}>
                                    <Settings2 />
                                    Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to={urls.users.notifications}>
                                    <Bell />
                                    Notifications
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={async () => await handleLogout()}>
                            <LogOut />
                            Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}


export function TeamSwitcher() {
    const navigate = useNavigate()
    const { isMobile } = useSidebar()

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-16 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                                <img src={miniLogo} className="" />
                            </div>
                            <div className="grid flex-1 text-left text-base leading-tight">
                                <span className="truncate font-medium">WATOC 2028</span>
                                <span className="truncate text-sm">Mérida, MX</span>
                            </div>
                            <ChevronDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Action
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigate(urls.home.index)}
                            className="gap-2 p-2 cursor-pointer"
                        >
                            <div className="flex size-6 items-center justify-center rounded-md border">
                                <ArrowLeftFromLine className="size-3.5 shrink-0" />
                            </div>
                            Return to home
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
