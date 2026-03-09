import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, LogOut, SquareUserRound } from "lucide-react"
import React from 'react'
import { Link, NavLink, Outlet, useNavigate } from "react-router"
import logo from '@/assets/WatocPNGLogo.png';
import Footer from "@/components/Footer"
import { urls } from "@/routes/routes"
import { useAuth } from "@/contexts/AuthContext"
import background from '@/assets/field.png'
import { cn } from "@/lib/utils"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"


function DashboardLayout() {
    const { handleLogout } = useAuth()

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
                                    <Link to={urls.users.viewAbstracts}>
                                        <Button variant="ghost" className="p-0 flex flex-row gap-2 w-full text-lg">
                                            My Submissions
                                        </Button>
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem className="p-0 w-full">
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link to={urls.users.profile}>
                                        <Button variant="ghost" className="p-0 flex flex-row gap-2 w-full text-lg">
                                            Profile
                                        </Button>
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem className="p-0 w-full">
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Button variant="ghost" onClick={onLogout} className="p-0 flex flex-row gap-2 w-full text-lg">
                                        Logout
                                        <LogOut className="text-foreground" />
                                    </Button>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
        </header>

        <main className="bg-gray-100 opacity-90 bg-fixed">
            <Outlet />
        </main>
        <Footer />
    </>)
}

export default DashboardLayout