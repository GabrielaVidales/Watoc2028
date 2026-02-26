import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, SquareUserRound } from "lucide-react"
import React from 'react'
import { Link, NavLink, Outlet, useNavigate } from "react-router"
import logo from '@/assets/WatocPNGLogo.png';
import Footer from "@/components/Footer"
import { urls } from "@/routes/routes"
import { useAuth } from "@/contexts/AuthContext"
import background from '@/assets/background.png'
import { cn } from "@/lib/utils"



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
        <header className="flex flex-col shadow-lg">
            <div className="max-w-4xl w-full mx-auto flex flex-col items-center">

                <div className="h-full py-2">
                    <Link to={'/'}>
                        <img
                            alt="WATOC 2028 Logo"
                            src={logo}
                            className='w-50 sm:w-80'
                        />
                    </Link>
                </div>
            </div>
            <div className="border-b-18 border-primary-main w-full shadow-lg">
            </div>
        </header>
        <main className=" bg-cover bg-center bg-fixed" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${background})` }}>
            <div className='min-h-50 w-full py-9 flex gap-3 justify-center'>
                <div className='max-w-5xl w-full bg-background border-2 p-5 rounded-lg shadow-lg flex flex-col gap-5'>
                    <div className="flex gap-3 ">

                        <div
                            onClick={onLogout}
                            className={
                                cn(
                                    "cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                                    "bg-background hover:bg-background/50 hover:text-foreground border-2"
                                )
                            }
                        >
                            Logout
                        </div>
                        {links.map((item) => (
                            <NavLink
                                key={item.url}
                                to={item.url}
                                className={({ isActive }) =>
                                    cn(
                                        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                                        isActive
                                            ? "bg-background/50 text-foreground shadow-md border-2 border-primary-light"
                                            : "bg-background hover:bg-background/50 hover:text-foreground border-2"
                                    )
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                    <Outlet />
                </div>
            </div>
        </main>
        <Footer />
    </>)
}

export default DashboardLayout