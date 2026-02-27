import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth, type UserProfile } from '@/contexts/AuthContext'
import { formatDate } from '@/utils/formatDate'
import { Calendar, Camera, LockOpen, Mail, MapPin } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { InfoAlert } from './CreateAbstractPage'
import { NavLink } from 'react-router'

function ViewAbstracts() {
    const { currentUser, getProfile } = useAuth()
    const [profile, setProfile] = useState<UserProfile>(null)

    const fetchProfile = async () => {
        const profile = await getProfile()
        setProfile(profile)
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    return (
        <div className='w-full max-w-5xl grid grid-cols-3 gap-3 p-3 mx-auto'>

            <div className='col-span-1 w-full'>
                <Card>
                    <CardContent>
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative">
                                <Avatar className="size-32 border-2 shadow">
                                    <AvatarImage src={currentUser.photo as string} alt="Profile" />
                                    <AvatarFallback className="text-2xl">JD</AvatarFallback>
                                </Avatar>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full">
                                    <Camera />
                                </Button>
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                                    <h1 className="text-2xl font-bold">{currentUser.full_name}</h1>
                                </div>

                                {profile && (
                                    <div className='flex flex-col'>
                                        <span className="text-muted-foreground">{profile.participant?.job_title}</span>
                                        <span className="text-muted-foreground">{profile.participant?.affiliation}</span>
                                    </div>
                                )}

                                <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Mail className="size-4" />
                                        {currentUser.email}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="size-4" />
                                        {currentUser.city}, {currentUser.nationality}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="size-4" />
                                        Joined {formatDate(currentUser.date_joined)}
                                    </div>
                                </div>
                            </div>
                            <Button variant="default">Edit Profile</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className='col-span-2 min-h-50 w-full flex gap-3 justify-center'>
                <div className='w-full bg-background border-2 p-3 rounded-lg shadow-lg flex flex-col gap-5'>
                    <div className='w-full py-9 pt-4 space-y-5 px-5 sm:px-9'>
                        <h2 className='text-2xl font-semibold'>Abstract submission</h2>
                        <InfoAlert
                            title="Abstract submission deadline: June 10, 2026"
                            messages={[
                                'Read our Abstract Submission Guideline here',
                                <span className='font-semibold text-slate-950'>Ver detalles</span>,
                            ]}
                        />
                        <div className='w-full border-2 bg-primary-main flex flex-col gap-2 text-primary-contrast font-semibold p-2'>
                            <div className='flex items-center gap-3'>
                                <LockOpen className='size-5 stroke-3' />
                                System is open
                            </div>
                            Deadline: 23 June 2026
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewAbstracts