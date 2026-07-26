import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, User, Calendar, Mail, MapPin, Shield, Edit2, Building, CheckCircle2, MessageSquareWarning, MessageCircleWarning, Eye, Edit, Download, Smartphone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/contexts/AuthContext'
import { formatDate } from '@/utils/formatDate'
import { useProfiles } from '@/hooks/use-profiles'
import { renderHTMLString } from '@/utils/tsx_utils'
import { useNavigate } from 'react-router'
import { urls } from '@/routes/routes'
import { cn } from '@/lib/utils'
import { AppStoreButton, PlayStoreButton } from '@/components/ui/play-store-button'

function UserDashboardPage() {
    const navigate = useNavigate()

    const { user: user } = useAuth()

    const { profile } = useProfiles()

    const abstracts = profile?.participant?.abstracts || []

    return (
        <section className="antialiased">
            <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Control Panel</h1>
                    <p className="text-sm text-muted-foreground">Welcome back, {user.full_name}</p>
                </div>
                <Button size="lg" className="gap-2 shadow-sm">
                    <PlusCircle className="h-4 w-4" />
                    Registrar Nueva Ponencia
                </Button>
            </header>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    </div>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div>
                                <CardTitle className="text-lg font-semibold">Abstract Submissions</CardTitle>
                                <CardDescription>Gestión de resúmenes y estado de aprobaciones.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border bg-background overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="font-semibold">Title</TableHead>
                                            {/* <TableHead className="font-semibold">Presentation</TableHead> */}
                                            <TableHead className="font-semibold">Modified</TableHead>
                                            <TableHead className="font-semibold">Status</TableHead>
                                            <TableHead className="text-right font-semibold">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {abstracts && abstracts.length > 0 ? (
                                            abstracts.map((abstract) => (
                                                <TableRow key={abstract.id}>
                                                    <TableCell className="font-medium max-w-80 min-w-40">
                                                        {abstract.title ? (
                                                            <div className="truncate font-semibold text-foreground" title={abstract.title} >
                                                                {renderHTMLString(abstract.title)}
                                                            </div>
                                                        ) : (
                                                            <div className="inline-flex items-center gap-1 font-normal text-destructive" title={abstract.title} >
                                                                <MessageCircleWarning className='size-4 -scale-x-100' />
                                                                Untitled abstract
                                                            </div>
                                                        )}
                                                    </TableCell>

                                                    {/* <TableCell className="capitalize text-xs">
                                                        {abstract.presentation_type?.replace('_', ' ')}
                                                    </TableCell> */}

                                                    <TableCell className="text-xs text-muted-foreground">
                                                        {abstract.last_update ? formatDate(abstract.last_update) : '—'}
                                                    </TableCell>

                                                    <TableCell>
                                                        {(() => {
                                                            const statusConfig = {
                                                                draft: { label: "Draft", className: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20" },
                                                                submitted: { label: "Sent", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
                                                                accepted: { label: "Accepted", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
                                                                rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
                                                                corrections: { label: "Corrections", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
                                                                deleted: { label: "Deleted", className: "bg-red-500/10 text-red-600 line-through border-red-500/20" }
                                                            };
                                                            const config = statusConfig[abstract.status || "draft"];
                                                            return (
                                                                <Badge variant="outline" className={`font-medium ${config.className}`}>
                                                                    {config.label}
                                                                </Badge>
                                                            );
                                                        })()}
                                                    </TableCell>

                                                    <TableCell className="text-right space-x-1">
                                                        {abstract.status === "draft" || abstract.status === "corrections" ? (
                                                            <Button variant="link" size="icon-sm" className="text-foreground" onClick={() => navigate(urls.users.editAbstract.build({ id: abstract.id }))}>
                                                                <Edit className='size-5' />
                                                            </Button>
                                                        ) : null}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                                                    No tienes ninguna ponencia registrada en este sistema.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">

                    <Card className="w-full">
                        <CardHeader className="flex flex-row items-start space-x-2.5 space-y-0 pb-4 border-b">
                            <User className="h-5 w-5 text-primary-main" />
                            <div className="flex flex-col">
                                <CardTitle className="text-base font-bold leading-none">
                                    {user.prefix} {user.first_name} {user.last_name}
                                </CardTitle>
                                {profile?.participant && (
                                    <span className="text-xs text-muted-foreground mt-1">
                                        {profile.participant.job_title} • {profile.participant.field_of_study}
                                    </span>
                                )}

                                {user.pronouns && (
                                    <span className="text-xs text-muted-foreground mt-1">
                                        ({user.pronouns})
                                    </span>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-3.5">
                            <div className="flex items-center text-sm text-foreground/90 gap-2.5">
                                <Mail className="h-4 w-4 text-primary-main shrink-0" />
                                <span className="truncate">{user.email}</span>
                            </div>

                            {profile?.participant && (
                                <div className="flex items-center text-sm text-foreground/90 gap-2.5">
                                    <Building className="h-4 w-4 text-primary-main shrink-0" />
                                    <span className="truncate">{profile.participant.affiliation}</span>
                                </div>
                            )}

                            <div className="flex items-center text-sm text-foreground/90 gap-2.5">
                                <MapPin className="h-4 w-4 text-primary-main shrink-0" />
                                <span>{user.city}, {user.nationality}</span>
                            </div>

                            <div className="flex items-start text-sm text-foreground/90 gap-2.5 pt-0.5">
                                <Shield className="h-4 w-4 text-primary-main shrink-0 mt-0.5" />
                                <div className="flex flex-wrap gap-1">
                                    {user.roles.map((role) => {

                                        const className =
                                            role === "admin"
                                                ? "border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
                                                : role === "reviewer"
                                                    ? "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
                                                    : "border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300";

                                        return (
                                            <span key={role} className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border', className)}>
                                                {role}
                                            </span>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="border-t pt-3 mt-2 space-y-2 text-xs text-muted-foreground">
                                <div className="flex justify-between">
                                    <span>Joined:</span>
                                    <span className="font-medium text-foreground">
                                        {user.date_joined ? formatDate(user.date_joined) : '—'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Last login:</span>

                                    <span className="font-medium text-foreground">
                                        {user.last_login ? formatDate(user.last_login) : '—'}

                                    </span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button variant="outline" className="w-full text-sm font-medium" onClick={() => navigate(urls.users.settings)}>
                                    <Edit2 />
                                    Edit profile
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border border-slate-200  shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
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
        </section>
    )
}

export default UserDashboardPage