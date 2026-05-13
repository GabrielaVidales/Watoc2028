import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { Link, NavLink, Outlet, useNavigate } from "react-router"
import logo from '@/assets/WatocPNGLogo.png';
import { urls } from "@/routes/routes";
import {
    Folder,
    Forward,
    Info,
    LogOut,
    MoreHorizontal,
    Trash2,
    type LucideIcon,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useProfiles } from "@/hooks/use-profiles";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export function AppSidebar({
    projects,
}: {
    projects: {
        name: string
        url: string
        icon: LucideIcon
    }[]
}) {
    const isMobile = useIsMobile()

    const { currentUser, handleLogout } = useAuth()
    const { profile } = useProfiles()

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="mx-auto">
                    <Link to={urls.home.index} className="flex items-center h-full">
                        <img
                            alt="WATOC 2028 Logo"
                            src={logo}
                            className='h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform hover:scale-105'
                        />
                    </Link>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <div className="rounded-2xl  flex flex-col items-center text-center  space-y-2">
                        <Avatar className="size-28 ring-2 ring-primary mb-3">
                            <AvatarImage src={currentUser.photo as string} />
                            <AvatarFallback>
                                {currentUser.full_name?.slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>

                        <h2 className="text-base font-semibold leading-tight">
                            {currentUser.full_name}
                        </h2>

                        <p className="text-sm leading-tight">
                            {currentUser.email}
                        </p>
                    </div>
                </SidebarGroup>


                <SidebarGroup>
                    <SidebarGroupLabel>
                        SECTIONS
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        {projects.map((item, i) => (
                            <SidebarMenuItem key={i}>
                                <SidebarMenuButton asChild>
                                    <a href={item.url}>
                                        <item.icon />
                                        <span>{item.name}</span>
                                    </a>
                                </SidebarMenuButton>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <SidebarMenuAction showOnHover>
                                            <MoreHorizontal />
                                            <span className="sr-only">More</span>
                                        </SidebarMenuAction>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-48 rounded-lg"
                                        side={isMobile ? "bottom" : "right"}
                                        align={isMobile ? "end" : "start"}
                                    >
                                        <DropdownMenuItem>
                                            <Folder className="text-muted-foreground" />
                                            <span>View Project</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Forward className="text-muted-foreground" />
                                            <span>Share Project</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <Trash2 className="text-muted-foreground" />
                                            <span>Delete Project</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </SidebarMenuItem>
                        ))}
                    </SidebarGroupContent>


                </SidebarGroup>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter className="p-3">
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <a href={'#'}>
                            <Info />
                            <span>Support</span>
                        </a>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <Button variant="destructive" className="w-full">
                        <LogOut />
                        <span>Logout</span>
                    </Button>
                </SidebarMenuItem>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}