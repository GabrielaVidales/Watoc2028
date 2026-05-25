import { Link, NavLink, Outlet } from 'react-router'
import { motion, AnimatePresence } from "motion/react"
import { cn } from '@/lib/utils'
import React from 'react'
import logo from '../assets/WatocPNGLogo.png';
import { urls } from '@/routes/routes'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AvatarDropdown } from '@/components/ui/avatar-dropdown'
import {
    LayoutDashboard,
    User,
    FileText,
    Settings,
    LogOut,
} from "lucide-react"
import { Button } from '@/components/ui/button'


function SidebarsLayout() {
    const { currentUser, handleLogout } = useAuth()

    const sidebarLinks = [
        {
            label: "Dashboard",
            to: 'test',
            icon: LayoutDashboard,
        },
        {
            label: "Profile",
            to: urls.users.profile,
            icon: User,
        },
        {
            label: "Submissions",
            to: urls.users.viewAbstracts,
            icon: FileText,
        },
        {
            label: "Settings",
            to: urls.users.settings,
            icon: Settings,
        },
    ]


    return (
        <>
            <header className={cn(
                'h-12 lg:h-14 w-full z-50 fixed top-0 border-b border-b-border',
                'transition-all duration-300 bg-background'
            )}>
                <div className="h-full flex justify-between items-center gap-3 mx-auto p-2 px-10">
                    <div className="flex justify-center absolute left-1/2 -translate-x-1/2 lg:static lg:left-auto lg:translate-x-0">
                        <Link to={urls.home.index} className='relative'>
                            <img
                                src={logo}
                                alt="WATOC 2028 Logo"
                                className={cn(
                                    'w-auto transition-all duration-300',
                                    'max-h-10 lg:max-h-12 w-full',
                                    'transition-transform hover:scale-105',
                                )}
                            />
                        </Link>
                    </div>

                    <div className="ml-auto flex items-center">
                        <AvatarDropdown />
                    </div>
                </div>
            </header>

            <div className='bg-muted/50 flex flex-col mt-12 lg:mt-14'>
                <div
                    className={cn(
                        "mx-auto grid w-full items-start",
                        "xl:grid-cols-[280px_minmax(0,1fr)]",
                    )}
                >
                    <aside
                        className={cn(
                            "hidden xl:block",
                            "sticky top-12 lg:top-14",
                            "h-[calc(100vh-3rem)] lg:h-[calc(100vh-3.5rem)]",
                            "border-r border-border",
                            "bg-background/80",
                            "backdrop-blur-xl",
                        )}
                    >
                        <div className="flex flex-col py-6 h-full overflow-y-auto">
                            <Avatar className="size-32 border-4 border-secondary shadow-sm mb-4 mx-auto">
                                <AvatarImage src={currentUser.photo as string} alt="Profile" />
                                <AvatarFallback className='text-2xl'>
                                    {currentUser.first_name[0]}
                                    {currentUser.last_name[0]}
                                </AvatarFallback>
                            </Avatar>

                            <div className="space-y-2 mb-6 text-center">
                                <h1 className="text-lg font-bold text-foreground">
                                    {currentUser.full_name}
                                </h1>

                                <div className="flex flex-col text-sm leading-relaxed">
                                    <span className="text-muted-foreground">
                                        {currentUser.email}
                                    </span>
                                </div>

                            </div>

                            <hr className='my-3' />

                            <nav className="flex flex-col gap-1 px-3">
                                {sidebarLinks.map((item) => {
                                    const Icon = item.icon
                                    return (
                                        <NavLink
                                            key={item.label}
                                            to={item.to}
                                            className={({ isActive }) =>
                                                cn(
                                                    "flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-all",
                                                    isActive
                                                        ? "bg-primary/10 shadow-sm"
                                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                )
                                            }
                                        >
                                            <Icon className="size-4" />
                                            <span>{item.label}</span>
                                        </NavLink>
                                    )
                                })}
                            </nav>

                            <div className="mt-auto px-3 pt-4">
                                <Button
                                    variant="ghost"
                                    onClick={handleLogout}
                                    className={cn(
                                        "w-full justify-start gap-3 rounded-xl",
                                        "text-red-500 hover:text-red-500 hover:bg-red-500/10"
                                    )}
                                >
                                    <LogOut className="size-4" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </aside>

                    <main className="p-5 md:p-10">
                        <section>
                            <div className="flex flex-col gap-10 md:flex-[1.3]">
                                <AnimatePresence mode="popLayout">
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="w-full"
                                    >
                                        <Outlet />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </>
    )
}

export default SidebarsLayout


