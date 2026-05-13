import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronsLeft, ClipboardList, FileText, Frame, IdCard, LogIn, LogOut, PieChart, SquareUserRound, Map, type LucideIcon } from "lucide-react"
import React from 'react'
import { Link, NavLink, Outlet, useNavigate } from "react-router"
import logo from '@/assets/WatocPNGLogo.png';
import { urls } from "@/routes/routes"
import { useAuth } from "@/contexts/AuthContext"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"


const guessRoutes = [
    {
        url: urls.auth.login,
        label: 'Login',
        icon: <LogIn className="size-5" />,
    },
    {
        url: urls.auth.register,
        label: 'Registration',
        icon: <ClipboardList className="size-5" />,
    },
]

const authRoutes = [
    {
        url: urls.users.profile,
        label: 'My Profile',
        icon: <IdCard className="size-5" />,
    },
    {
        url: urls.users.viewAbstracts,
        label: 'My Submissions',
        icon: <FileText className="size-5" />,
    },
]

const projects: {
    name: string
    url: string
    icon: LucideIcon
}[] = [
        {
            name: "My Profile",
            url: "#",
            icon: Frame,
        },
        {
            name: "Abstract Submission",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Registration",
            url: "#",
            icon: Map,
        },
        {
            name: "Registration",
            url: "#",
            icon: Map,
        },
    ]

function DashboardLayout() {
    const { handleLogout, currentUser } = useAuth()

    const onLogout = async () => {
        await handleLogout()
    }

    return (<>
        <SidebarProvider>
            <div className="flex w-full h-screen">

                <AppSidebar
                    projects={projects}
                />

                <div className="flex flex-col flex-1">
                    <header className='border-b-2 z-10 sticky top-0 bg-background'>
                        <div className=' min-h-14 my-2 px-3 mx-auto flex flex-col sm:flex-row justify-between items-center gap-6'>

                            <div className='flex flex-row items-center sm:items-start gap-3 max-w-sm shrink-0'>
                                <SidebarTrigger />
                             
                            </div>

                            <div className='flex flex-col sm:flex-row items-center'>
                                <Link to={urls.home.index} className="sm:flex">
                                    <Button variant='ghost' className='flex items-center gap-2 text-foreground sm:text-base lg:text-lg transition-all font-medium px-4'>
                                        <ChevronsLeft className="size-6" />
                                        <span>Home</span>
                                    </Button>
                                </Link>

                                {(currentUser ? authRoutes : guessRoutes).map(routes => (
                                    <Link to={routes.url} key={routes.url} className="sm:flex">
                                        <Button variant='ghost' className='flex items-center gap-2 text-foreground sm:text-base lg:text-lg transition-all font-medium px-4'>
                                            {routes.icon}
                                            <span>{routes.label}</span>
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </header>

                    <main className="bg-muted">
                        <Outlet />
                    </main>
                </div>

            </div>
        </SidebarProvider>
    </>)
}

export default DashboardLayout