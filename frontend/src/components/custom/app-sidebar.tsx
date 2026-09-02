import logo from '@/assets/WatocPNGLogoBlank.png';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from '@/lib/utils';
import { routes } from "@/routes/routes";
import { ArrowLeftFromLine, BadgeCheckIcon, Bell, Bot, CalendarClockIcon, ChevronDown, ChevronRight, ChevronUp, FileBadge, FileCheck, FileType2, LayoutDashboard, LayoutList, LogOut, MessageSquareDot, PackageCheck, Settings2, TableProperties, Users, type LucideIcon } from "lucide-react";
import { Link, NavLink, useNavigate, } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ScrollArea } from "../ui/scroll-area";
import miniLogo from '/logo_mini.png';


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


const mainModules: NavItem[] = [
    {
        name: "Dashboard",
        url: routes.users.profile,
        icon: LayoutDashboard,
    },
    {
        name: "Notifications",
        url: routes.users.notifications,
        icon: MessageSquareDot,
    },
    {
        name: "Settings",
        url: routes.users.settings,
        icon: Settings2,
    },
]

const participantModules: NavItem[] = [
    {
        name: "Abstract Submissions",
        url: routes.users.submissions.summary,
        icon: FileType2,
    },
    {
        name: "Congress Registration",
        url: routes.users.confirmAssistance.start,
        icon: PackageCheck,
    },
    {
        name: "Certificate of Attendance",
        url: routes.users.settings,
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
                url: routes.users.administration.manageUsers,
                icon: Users,
            },
            {
                name: "Review Assignments",
                url: routes.users.administration.manageReviewers,
                icon: LayoutList,
            },
            {
                name: "Program Schedule",
                url: routes.users.administration.program,
                icon: CalendarClockIcon,
            },
        ]
    }
]

const reviewerModules: NavCollapsible[] = [
    {
        title: 'Abstract Reviews',
        icon: FileCheck,
        isActive: true,
        items: [
            {
                name: 'My reviews',
                url: routes.users.reviews.list,
                icon: TableProperties
            }
        ]
    }
]

export function AppSidebar() {
    const { user: user } = useAuth()

    const { setOpen, state } = useSidebar()

    const style = 'bg-gradient-to-b from-indigo-950 via-primary-dark to-indigo-950 text-neutral-100 dark:bg-indigo-950 dark:text-indigo-50'

    return (
        <Sidebar collapsible='icon' className={style}>
            <SidebarHeader>
                <div className={cn("flex items-center justify-center rounded-lg text-sidebar-primary-foreground",)}>
                    <Link to={routes.home.index} className="flex items-center h-full">
                        <img
                            src={logo}
                            className="p-2 group-data-[collapsible=icon]:hidden group-data-[state=collapsed]:hidden transition-transform hover:scale-105"
                            alt="Logo"
                        />
                        <img
                            src={miniLogo}
                            className="hidden mb-4 mt-2 group-data-[collapsible=icon]:block size-0 group-data-[state=collapsed]:block group-data-[state=collapsed]:h-5 group-data-[state=collapsed]:w-15 transition-transform hover:scale-105"
                            alt="Mini Logo"
                        />
                    </Link>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <ScrollArea className="h-full">
                    <SidebarGroup className='space-y-0'>
                        <SidebarGroupLabel className={cn(state === 'collapsed' ? 'hidden' : 'text-neutral-100')}>
                            MAIN
                        </SidebarGroupLabel>
                        <SidebarGroupContent className='space-y-1'>
                            {mainModules.map((item, i) => (
                                <SidebarMenuItem key={i}>
                                    <NavLink to={item.url}>
                                        {({ isActive }) => (
                                            <SidebarMenuButton className={cn(
                                                "hover:bg-white/20 hover:text-neutral-50 active:bg-white/20 active:text-neutral-50",
                                                "dark:hover:bg-white/20 dark:active:bg-white/30",

                                                "text-neutral-50 hover:translate-x-1 transition-transform duration-300",
                                                isActive && 'bg-white/30'
                                            )}>
                                                <item.icon />
                                                <span>{item.name}</span>
                                            </SidebarMenuButton>
                                        )}
                                    </NavLink>
                                </SidebarMenuItem>
                            ))}
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup className='space-y-0'>
                        <SidebarGroupLabel className={cn(state === 'collapsed' ? 'hidden' : 'text-neutral-100')}>
                            MODULES
                        </SidebarGroupLabel>
                        <SidebarGroupContent className='space-y-1'>
                            {user.roles.includes('admin') && (
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
                                                    <SidebarMenuButton
                                                        onClick={() => setOpen(true)}
                                                        className={cn(
                                                            "hover:bg-white/20 hover:text-neutral-50 active:bg-white/20 active:text-neutral-50",
                                                            "dark:hover:bg-white/20 dark:active:bg-white/30",
                                                            "text-neutral-50 hover:translate-x-1 transition-transform duration-300",
                                                        )}
                                                    >
                                                        {item.icon && <item.icon />}
                                                        <span>{item.title}</span>
                                                        <ChevronRight className="pointer-events-none ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <SidebarMenuSub>
                                                        {item.items?.map((subItem, i) => (
                                                            <SidebarMenuItem key={i}>
                                                                <NavLink to={subItem.url}>
                                                                    {({ isActive }) => (
                                                                        <SidebarMenuButton className={cn(
                                                                            "hover:bg-white/20 hover:text-neutral-50 active:bg-white/20 active:text-neutral-50",
                                                                            "dark:hover:bg-white/20 dark:active:bg-white/30",

                                                                            "text-neutral-50 hover:translate-x-1 transition-transform duration-300",
                                                                            isActive && 'bg-white/30'
                                                                        )}>
                                                                            <subItem.icon />
                                                                            <span>{subItem.name}</span>
                                                                        </SidebarMenuButton>
                                                                    )}
                                                                </NavLink>
                                                            </SidebarMenuItem>
                                                        ))}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    ))}
                                </SidebarMenu>
                            )}
                            {user.roles.includes('reviewer') && (
                                <SidebarMenu>
                                    {reviewerModules.map((item) => (
                                        <Collapsible
                                            key={item.title}
                                            asChild
                                            defaultOpen={item.isActive}
                                            className="group/collapsible"
                                        >
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton
                                                        onClick={() => setOpen(true)}
                                                        className={cn(
                                                            "hover:bg-white/20 hover:text-neutral-50 active:bg-white/20 active:text-neutral-50",
                                                            "dark:hover:bg-white/20 dark:active:bg-white/30",
                                                            "text-neutral-50 hover:translate-x-1 transition-transform duration-300",
                                                        )}
                                                    >
                                                        {item.icon && <item.icon />}
                                                        <span>{item.title}</span>
                                                        <ChevronRight className="pointer-events-none ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <SidebarMenuSub>
                                                        {item.items?.map((subItem, i) => (
                                                            <SidebarMenuItem key={i}>
                                                                <NavLink to={subItem.url}>
                                                                    {({ isActive }) => (
                                                                        <SidebarMenuButton className={cn(
                                                                            "hover:bg-white/20 hover:text-neutral-50 active:bg-white/20 active:text-neutral-50",
                                                                            "dark:hover:bg-white/20 dark:active:bg-white/30",

                                                                            "text-neutral-50 hover:translate-x-1 transition-transform duration-300",
                                                                            isActive && 'bg-white/30'
                                                                        )}>
                                                                            <subItem.icon />
                                                                            <span>{subItem.name}</span>
                                                                        </SidebarMenuButton>
                                                                    )}
                                                                </NavLink>
                                                            </SidebarMenuItem>
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

                    <SidebarGroup className='space-y-0'>
                        <SidebarGroupLabel className={cn(state === 'collapsed' ? 'hidden' : 'text-neutral-100')}>
                            CONGRESS
                        </SidebarGroupLabel>
                        <SidebarGroupContent className='space-y-1'>
                            {participantModules.map((item, i) => (
                                <SidebarMenuItem key={i}>
                                    <NavLink to={item.url}>
                                        {({ isActive }) => (
                                            <SidebarMenuButton className={cn(
                                                "hover:bg-white/20 hover:text-neutral-50 active:bg-white/20 active:text-neutral-50",
                                                "dark:hover:bg-white/20 dark:active:bg-white/30",

                                                "text-neutral-50 hover:translate-x-1 transition-transform duration-300",
                                                isActive && 'bg-white/30'
                                            )}>
                                                <item.icon />
                                                <span>{item.name}</span>
                                            </SidebarMenuButton>
                                        )}
                                    </NavLink>
                                </SidebarMenuItem>
                            ))}
                        </SidebarGroupContent>
                    </SidebarGroup>
                </ScrollArea>
            </SidebarContent>

            <SidebarFooter>
                <SidebarFooterContent user={{
                    avatar: user.photo as string || null,
                    email: user.email,
                    name: user.full_name
                }} />
            </SidebarFooter>
        </Sidebar>
    )
}


export function SidebarFooterContent({ user, }: {
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
                            <DropdownMenuItem asChild>
                                <Link to={routes.users.notifications}>
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

    const { open } = useSidebar()

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className={cn(
                                "flex aspect-square items-center invert justify-center rounded-lg text-sidebar-primary-foreground",
                                open ? 'size-16' : 'size-8'
                            )}>
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
                            onClick={() => navigate(routes.home.index)}
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
