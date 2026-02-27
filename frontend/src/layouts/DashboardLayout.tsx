import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, LogOut, SquareUserRound } from "lucide-react"
import React from 'react'
import { Link, NavLink, Outlet, useNavigate } from "react-router"
import logo from '@/assets/WatocPNGLogo.png';
import Footer from "@/components/Footer"
import { urls } from "@/routes/routes"
import { useAuth } from "@/contexts/AuthContext"
import background from '@/assets/background.png'
import { cn } from "@/lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"


function DashboardLayout() {
    const { handleLogout } = useAuth()

    const links = [
        {
            label: 'Logout',
            url: urls.auth.logout
        },
        {
            label: 'My profile',
            url: urls.users.profile
        },
        {
            label: 'Abstract',
            url: urls.users.submitAbstract
        },
    ]

    const onLogout = async () => {
        await handleLogout()
    }

    return (<>
        <header className="flex flex-col shadow-xl border-b-2">
            <div className="max-w-4xl w-full mx-auto flex justify-center sm:justify-between items-center">
                <div className="h-full py-2">
                    <Link to={'/'}>
                        <img
                            alt="WATOC 2028 Logo"
                            src={logo}
                            className='w-50 sm:w-80'
                        />
                    </Link>
                </div>
                <div className="max-sm:hidden">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem className="p-0 w-full">
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link to={'puta'} className="p-0 w-full">
                                        <Button variant="ghost" className="p-0 w-full text-lg">
                                            Logout
                                            <LogOut className="text-foreground" />
                                        </Button>
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
        </header>

        <main className="bg-gray-100">
            <Outlet />
        </main>
        <Footer />
    </>)
}

export default DashboardLayout