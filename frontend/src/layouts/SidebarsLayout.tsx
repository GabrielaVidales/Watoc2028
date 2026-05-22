import { Link, NavLink, useParams } from 'react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "motion/react"
import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import React from 'react'
import UserProfile from '@/pages/protected/profile/UserProfile'
import logo from '../assets/WatocPNGLogo.png';
import { urls } from '@/routes/routes'
import { useAuth } from '@/contexts/AuthContext'
import { useProfiles } from '@/hooks/use-profiles'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import EnrichedTextArea from '@/components/EnrichedTextArea'


function SidebarsLayout() {
    const [tab, setTab] = useState("research")

    const { currentUser, handleLogout } = useAuth()
    const { profile } = useProfiles()


    const tabs = [
        {
            value: "links",
            label: "Enlaces",
            content: (
                <div>
                    Hola mundo
                </div>
            )
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

                    <nav className={cn(
                        "hidden lg:flex items-center gap-5 text-lg",
                    )}>
                        <NavLink to={'#'} end className='group text-xl font-medium flex flex-col cursor-pointer hover:scale-105 transition-transform'>
                            {({ isActive }) => (
                                <>
                                    <span className={cn(
                                        isActive ?
                                            'opacity-50' :
                                            'transition-colors'
                                    )}>
                                        JAJAJAJ
                                    </span>
                                    <div className={cn(
                                        'h-[0.2rem] rounded-full mt-auto origin-center scale-x-0',
                                        isActive ?
                                            'scale-x-100 opacity-50' :
                                            'group-hover:scale-x-100 transition-transform',
                                    )} />
                                </>
                            )}
                        </NavLink>
                    </nav>
                </div>
            </header>

            <div className='bg-muted flex flex-col mt-12 lg:mt-14'>
                <Tabs value={tab} onValueChange={setTab} orientation='vertical'>
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
                                <div className="px-6 mb-8">
                                    <h4 className="font-label-caps text-label-caps text-primary tracking-widest mb-1">DOCUMENTATION</h4>
                                    <p className="text-slate-500 text-[11px] font-sans">v2.4.0-stable</p>
                                </div>
                                <nav className="flex flex-col gap-1 px-2">
                                    <TabsList className="w-full gap-2 mb-4" variant={'line'}>
                                        {tabs.map(t => (
                                            <TabsTrigger
                                                key={t.value}
                                                value={t.value}
                                                className="text-xs md:text-sm px-3 py-2 w-full"
                                            >
                                                {t.label}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </nav>

                                <Avatar className="size-32 border-4 border-secondary shadow-sm mb-4">
									<AvatarImage src={currentUser.photo as string} alt="Profile" />
									<AvatarFallback className="text-2xl">JD</AvatarFallback>
								</Avatar>

								<div className="space-y-2 mb-6 text-center">
									<h1 className="text-lg font-bold text-foreground">
										{currentUser.full_name}
									</h1>
									
									{profile?.participant && (
										<div className="flex flex-col text-sm leading-relaxed">
											<span className="font-medium text-primary">
												{profile.participant.job_title}
											</span>
											<span className="text-muted-foreground">
												{profile.participant.affiliation}
											</span>
											<span className="font-medium text-primary mt-2">
												Field of Study
											</span>
											<span className="text-muted-foreground">
												{profile.participant.field_of_study}
											</span>
										</div>
									)}
								</div>
                            </div>
                        </aside>

                        <main className="p-5">
                            <header className="mb-12 bg-destructive">
                                <h1 className="text-3xl font-bold tracking-tight mb-3">
                                    Editar Datos
                                </h1>
                            </header>

                            <EnrichedTextArea/>

                            <section className='min-h-screen'>
                                <div className="flex flex-col gap-10 md:flex-[1.3]">

                                    <AnimatePresence mode="popLayout">
                                        {tabs.map(t =>
                                        (
                                            <motion.div
                                                key={t.value}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.2 }}
                                                className="w-full"
                                            >
                                                <TabsContent value={t.value} forceMount>
                                                    <UserProfile />
                                                </TabsContent>
                                            </motion.div>
                                        )
                                        )}
                                    </AnimatePresence>
                                </div>
                            </section>
                        </main>
                    </div>
                </Tabs>
            </div>
        </>
    )
}

export default SidebarsLayout