import miniLogo from '@/assets/logo_img.png';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { urls } from "@/routes/routes";
import { ArrowLeftFromLine, BadgeCheckIcon, Bell, Bot, ChevronDown, ChevronRight, ChevronUp, FileBadge, FileCheck, FileType2, LayoutDashboard, LayoutList, LogOut, MessageSquareDot, PackageCheck, Settings2, TableProperties, Users, type LucideIcon } from "lucide-react";
import { Link, NavLink, useNavigate, } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ScrollArea } from "./ui/scroll-area";


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


const participantModules: NavItem[] = [
    {
        name: "Abstract Submissions",
        url: urls.users.submissions.summary,
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

const reviewerModules: NavCollapsible[] = [
    {
        title: 'Abstract Reviews',
        icon: FileCheck,
        isActive: true,
        items: [
            {
                name: 'My reviews',
                url: urls.users.reviews.list,
                icon: TableProperties
            }
        ]
    }
]

export function AppSidebar() {
    const { user: user } = useAuth()

    return (
        <Sidebar>
            <SidebarHeader className="py-5">
                <TeamSwitcher />
            </SidebarHeader>

            <SidebarContent className="no-scrollbar">
                <ScrollArea className="h-full">
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

                    <SidebarGroup>
                        <SidebarGroupLabel>
                            SPECIAL MODULES
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
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
                            {participantModules.map((item, i) => (
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
