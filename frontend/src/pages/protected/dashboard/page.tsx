import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AppStoreButton, PlayStoreButton } from '@/components/ui/play-store-button'
import { useAuth } from '@/features/auth/contexts/AuthContext'
import { useProfiles } from '@/hooks/use-profiles'
import useTimeBefore from '@/hooks/use-remaining-time'
import { routes } from '@/routes/routes'
import { CheckCircle2, FileUpIcon, MegaphoneIcon, SquareArrowRightIcon } from "lucide-react"
import { useNavigate } from 'react-router'
import SubmissionsSummaryTable from './submissions-table'

function UserDashboardPage() {
    const { user } = useAuth()
    const { profile } = useProfiles()
    const navigate = useNavigate()
    const abstracts = profile?.participant?.abstracts || []

    return (
        <div className='p-8'>

            <div className="max-w-6xl mx-auto w-full grid grid-cols-1 gap-6 lg:grid-cols-3">

                <div className="lg:col-span-2 space-y-6">
                    <section className="max-w-6xl mx-auto mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Welcome back!</h1>
                            <p>Hello {user.first_name}</p>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Card className='outline-2 outline-transparent hover:outline-primary-main transition-colors duration-200'>
                            <CardHeader>
                                <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Abstract Submissions
                                </CardTitle>
                                <CardDescription>
                                    <div className="text-3xl font-bold">
                                        {abstracts.length}
                                    </div>
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className='outline-2 outline-transparent hover:outline-primary-main transition-colors duration-200'>
                            <CardHeader>
                                <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Email verification status
                                </CardTitle>
                                <CardDescription>
                                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-sm font-semibold">
                                        <CheckCircle2 />
                                        Verified
                                    </Badge>
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className='gap-3 outline-2 outline-transparent hover:outline-primary-main transition-colors duration-200'>
                            <CardContent>
                                <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    My Profile
                                </CardTitle>
                            </CardContent>
                            <CardHeader>
                                <CardDescription>
                                    Profile picture, affiliation and settings
                                </CardDescription>
                                <CardAction >
                                    <Button size='icon' variant='ghost' className='text-primary-main hover:text-primary-light'>
                                        <SquareArrowRightIcon className='size-8' />
                                    </Button>
                                </CardAction>
                            </CardHeader>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Abstract Submissions</CardTitle>
                            <CardDescription>Gestión de resúmenes y estado de aprobaciones.</CardDescription>
                            <SubmissionsSummaryTable />
                        </CardHeader>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row-reverse items-center justify-start">
                            <CardAction className="order-2">
                                <MegaphoneIcon className="text-primary-main" />
                            </CardAction>

                            <CardTitle className="order-1 mr-auto text-lg">
                                Announcements
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <CardDescription className="text-accent-foreground">
                                La recepción de abstracts para el 14vo congreso trienal de Congress of the World Association of Theoretical and Computational Chemists está abierta.
                            </CardDescription>
                        </CardContent>
                        <CardFooter>
                            <div className='space-y-3 w-full'>
                                <Button variant='main' className='flex-1 w-full' onClick={() => navigate(routes.users.submissions.summary)}>
                                    <FileUpIcon />
                                    Submit Abstract
                                </Button>

                                <TextCountDown />
                            </div>
                        </CardFooter>
                    </Card>


                    <Card className="relative">
                        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-50/50 blur-2xl dark:bg-blue-950/20 pointer-events-none" />

                        <CardContent>
                            <CardTitle className="text-xl tracking-tighter text-slate-900 dark:text-slate-50">
                                Get WATOC 2028 in your pocket
                            </CardTitle>
                            <CardDescription className="text-sm text-slate-500 max-w-sm dark:text-slate-400">
                                Access your personalized schedule, receive real-time room alerts, and connect with fellow researchers instantly.
                            </CardDescription>
                        </CardContent>

                        <CardFooter>
                            <div className="flex flex-row gap-3  justify-start shrink-0 z-10">
                                <AppStoreButton className="hover:scale-105 transition-transform duration-300 dynamic-layering" />
                                <PlayStoreButton className="hover:scale-105 transition-transform duration-300 dynamic-layering" />
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function TextCountDown() {
    const time = useTimeBefore(new Date("January 9, 2028 00:00:00"))
    const { weeks, days, hours } = time

    return (
        <p className='text-destructive text-center text-sm'>
            Cierre en {weeks} semanas, {days} días, {hours} horas
        </p>
    )
}

export default UserDashboardPage
